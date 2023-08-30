/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import {Table, Button, Input} from 'antd';
import {useSelector, useDispatch} from 'react-redux';
import NumberDropdown from './NumberDropdown.jsx';
import Loading from './Loading.jsx';
import Modal from './Modal.jsx';
import SwitchDetails from './SwitchDetails.jsx';
// import RoleFilter from './filter/RoleFilter.jsx';
import axios from 'axios';
import axiosData from '../utils/axiosData.js';
// import styles from '../styles/style.less';
import {TablePagination} from './Services.jsx';
import {getAllLogs} from '../actions/switch.action.js';
import moment from 'moment';
import DisplayCard from './DisplayCard.jsx';
import searchDebounce from '../utils/debounce';
// import StatusFilter from "./filter/StatusFilter.jsx";
import Filter from './filter/Filter.jsx';
import {SingleDatePicker} from './Datepicker.jsx';
import {
  setFilterFetchNumber,
  setFilterState,
} from '../actions/filter.action.js';
import TransactionTypeFilter from './filter/TransactionTypeFilter.jsx';
import PlatformFilter from './filter/PlatformFilter.jsx';
import plaform from '../common/StateData/platform.json';
import currencyFormat from '../utils/currencyFomat';
const adminURL = process.env.REACT_APP_ADMIN_URL;
//const url_two = process.env.REACT_APP_BASE_URL;

const columns = (clickHandler, getAllSwitches) => [
  {
    title: '#',
    key: 'userId',
    render: (text) => {
      const index = getAllSwitches.findIndex((data) => data._id === text._id);
      return <span>{index + 1}</span>;
    },
  },
  {
    title: 'Name',
    key: 'lastName',
    render: (text) => (
      <span>{text.user && `${text.user.firstName} ${text.user.lastName}`}</span>
    ),
  },
  {
    title: 'Platform',
    dataIndex: 'platform',
    key: 'platform',
  },
  {
    title: 'Service',
    dataIndex: 'serviceType',
    key: 'serviceType',
  },
  {
    title: 'Charge',
    key: 'charges',
    render: (obj) => <span>{currencyFormat(obj.charges)}</span>,
  },
  // {
  //   title: "Charge",
  //   dataIndex: "charges",
  //   key: "charges",
  // },
  {
    title: 'Switch Date',
    key: 'createdAt',
    render: (obj) => <span>{moment(obj.meta.createdAt).format('lll')}</span>,
  },
  {
    title: 'Action',
    key: '_id',
    render: (obj) => {
      return (
        <Button
          data-userid={obj._id}
          className="user-table-button"
          type="primary"
          onClick={clickHandler}>
          view
        </Button>
      );
    },
  },
];

const SwitchLogs = ({location}) => {
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(1);
  const [filterCurrent, setFilterCurrent] = useState(1);
  const [singleLogData, setSingleLogData] = useState({});
  const [counter, setCounter] = useState(1);
  const [platforms, setPlatforms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLimit, setFetchLimit] = useState(10);
  const [totalDocumentCount, setTotalDocumentCount] = useState(0);
  const [successfulUpdate, setSuccessfulUpdate] = useState(false);
  const storeFilter = useSelector((state) => state.filter);
  const {filterFetchLimit, filterStates: filterState} = storeFilter;
  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const switchData = useSelector((state) => state.switchLogs);
  const displayStatus = useSelector((state) => state.wallet.displayStatus);
  const walletState = useSelector((state) => state.wallet);
  const {allUsersTransactions} = walletState;
  const {logs} = switchData;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFilterState());
    return () => dispatch(setFilterState());
  }, []);

  useEffect(() => {
    setApplyFilter(false);
    const controller = axios.CancelToken.source();
    const fetchData = async () => {
      setSuccessfulUpdate(false);
      setIsLoading(true);
      try {
        const start =
          filter !== true
            ? (current - 1) * fetchLimit
            : (filterCurrent - 1) * filterFetchLimit;
        const {platform, search, serviceType, endDate, startDate} = filterState;
        const params = {
          ...(endDate && filter && {endDate}),
          ...(search && {search}),
          ...(serviceType && {serviceType}),
          ...(platform && {platform}),
          ...(startDate && filter && {startDate}),
        };
        const filterUrl = `${adminURL}/switch-service/logs?skip=${start}&limit=${filterFetchLimit}`;
        const data = {
          url:
            filter !== true
              ? `${adminURL}/switch-service/logs?skip=${start}&limit=${fetchLimit}`
              : filterUrl,
          method: 'GET',
          ...(filter && {params}),
          signal: controller.token,
        };
        // const dataTwo = {
        //   method: "GET",
        //   url: `${url_two}/services/platforms`,
        //   signal: controller.token,
        // };
        const [
          getLogs,
          //getPlatforms
        ] = await Promise.all([
          axiosData(data),
          //  axiosData(dataTwo),
        ]);
        // setPlatforms(getPlatforms.data);
        setIsLoading(false);
        setTotalDocumentCount(getLogs.totalDocumentCount);
        dispatch(getAllLogs(getLogs.data));
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      return controller.cancel();
    };
  }, [
    dispatch,
    current,
    fetchLimit,
    applyFilter,
    filter,
    filterCurrent,
    filterFetchLimit,
    filterState.search,
  ]);

  const detailsHandler = (e) => {
    e.preventDefault();
    const userId = e.currentTarget.dataset.userid;
    const obj = logs.find((data) => data._id === userId);
    setSingleLogData(obj);
    return setShowModal(true);
  };
  const returnHandler = (bool) => {
    bool === true && setSuccessfulUpdate(bool);
    return setShowModal(false);
  };
  // const dateHandler = (date, dateString) => {
  //   //return dispatch(setRole(value));
  // };

  //const closeModal = () => setShowModal(false);

  const numberHandler = (value) => {
    if (filter) {
      setFilterCurrent(1);
      return dispatch(setFilterFetchNumber(value));
    }
    setCurrent(1);
    // return dispatch(setFetchNumber(value));
  };
  const changeHandler = (page, pageSize) => {
    if (page !== 1) setCounter((page - 1) * pageSize + 1);
    if (page === 1) setCounter(1);
    filter === true ? setFilterCurrent(page) : setCurrent(page);
  };

  const itemRender = (current, type, originalElement) => {
    if (type === 'prev') return <a>Previous</a>;
    if (type === 'next') return <a>Next</a>;
    return originalElement;
  };

  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  const handleFilterInput = (value, option) => {
    const {name} = option.props;
    dispatch(setFilterState({[name]: value}));
  };
  const startDateHandler = (date, dateString) => {
    dispatch(setFilterState({filterStartDate: date, startDate: dateString}));
  };
  const endDateHandler = (date, dateString) => {
    dispatch(setFilterState({filterEndDate: date, endDate: dateString}));
  };
  const clearFilter = () => {
    dispatch(setFilterState());
    return setFilter(false);
  };
  const filterSubmit = () => {
    setApplyFilter(true);
    setFilter(true);
  };
  const searchHandler = (e) => {
    e.persist();
    return searchDebounce(
      e.target.value,
      filterState,
      setFilterState,
      dispatch,
    );
  };

  return (
    <div className="usersContainer">
      {!localStorage.getItem('token') && (
        <Redirect
          to={{
            pathname: '/',
            state: {from: location},
          }}
        />
      )}
      {showModal === true && (
        <Modal>
          <SwitchDetails modalHandler={returnHandler} data={singleLogData} />
        </Modal>
      )}
      <React.Fragment>
        <h3 className="text-24px font-extrabold uppercase mb-4">switch logs</h3>
        <DisplayCard
          totalTransactions={allUsersTransactions.length}
          successTransaction={displayStatus.successful}
          failedTransaction={displayStatus.failed}
          pendingTransaction={displayStatus.pending}
          nullTransaction={displayStatus.nullStatus}
          refundedTransaction={displayStatus.unknown}
          successful={Math.round(
            (displayStatus.successful / allUsersTransactions.length) * 100,
          )}
          failed={Math.round(
            (displayStatus.failed / allUsersTransactions.length) * 100,
          )}
          pending={Math.round(
            (displayStatus.pending / allUsersTransactions.length) * 100,
          )}
          nullNumber={Math.round(
            (displayStatus.nullStatus / allUsersTransactions.length) * 100,
          )}
          init={Math.round(
            (displayStatus.unknown / allUsersTransactions.length) * 100,
          )}
        />
        <div className="font-calibre text-17px mr-auto flex justify-between items-center relative mb-2"></div>
        <div className="relative flex items-center justify-between pr-4">
          <div className="top-0 left-0 h-40px flex items-center justify-between flex-3">
            <div className="flex justify-start items-center">
              {logs.length >= 1 && (
                <div className="flex justify-start items-center mr-43px p-2">
                  <span>
                    Showing {counter}-
                    {totalDocumentCount >
                    (filter !== true ? current : filterCurrent) *
                      (filter === true ? filterFetchLimit : fetchLimit)
                      ? (filter !== true ? current : filterCurrent) *
                        (filter === true ? filterFetchLimit : fetchLimit)
                      : totalDocumentCount}{' '}
                    of {totalDocumentCount}
                  </span>
                </div>
              )}
              <NumberDropdown numberHandler={numberHandler} />
            </div>
            <div className="flex">
              <Filter
                endDateHandler={endDateHandler}
                startDateHandler={startDateHandler}
                disabledDate={disabledDate}
                handleFilterInput={handleFilterInput}
                filterSubmitHandler={filterSubmit}
                clearFilterHandler={clearFilter}
                data={filterState}>
                <PlatformFilter
                  data={filterState}
                  handleFilterInput={handleFilterInput}
                  platforms={plaform}
                />
                <TransactionTypeFilter
                  defaultText="Service Type"
                  data={filterState}
                  handleFilterInput={handleFilterInput}
                />
                <div className="flex justify-around">
                  <SingleDatePicker
                    onChange={startDateHandler}
                    disabledDate={disabledDate}
                    date={moment(
                      filterState.filterStartDate,
                      filterState.endDate,
                    )}
                  />
                  <span className="mx-2 font-extrabold">-</span>
                  <SingleDatePicker
                    onChange={endDateHandler}
                    disabledDate={disabledDate}
                    date={moment(
                      filterState.filterEndDate,
                      filterState.endDate,
                    )}
                  />
                </div>
              </Filter>
              <Input onChange={searchHandler} placeholder="input search text" />
            </div>
          </div>
        </div>
        {isLoading === true ? (
          <Loading />
        ) : (
          <div className="usersTable">
            <Table
              dataSource={logs}
              columns={columns(detailsHandler, logs)}
              rowKey="_id"
              pagination={false}
            />
            <TablePagination
              pageSize={filter === true ? filterFetchLimit : fetchLimit}
              total={totalDocumentCount}
              onChange={changeHandler}
              current={filter === true ? filterCurrent : current}
              itemRender={itemRender}
            />
          </div>
        )}
      </React.Fragment>
    </div>
  );
};

export default SwitchLogs;
