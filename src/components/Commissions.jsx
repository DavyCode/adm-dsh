/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import axiosData from '../utils/axiosData.js';
import {Table, Button, Pagination, Input} from 'antd';
import Modal from './Modal.jsx';
import NumberDropdown from './NumberDropdown.jsx';
import CommissionDetails from './CommissionsDetail.jsx';
import styles from '../styles/style.less';
import Loading from './Loading.jsx';
import DisplayCard from './DisplayCard.jsx';
import Filter from './filter/Filter.jsx';
import searchDebounce from '../utils/debounce';
import {SingleDatePicker} from './Datepicker.jsx';
import currencyFormat from '../utils/currencyFomat';
import {
  saveAllCommissionsFetched,
  getACommissionHistory,
  setFetchNumber,
} from '../actions/commissions.action.js';
import {
  setFilterFetchNumber,
  setFilterState,
} from '../actions/filter.action.js';
import TransactionTypeFilter from './filter/TransactionTypeFilter.jsx';
import InputFilterField from './filter/InputFilterField.jsx';
import UserIDFilter from './filter/UserIDFilter.jsx';

const adminURL = process.env.REACT_APP_ADMIN_URL;
const url = `${adminURL}/commissions/history`;

const columns = (clickHandler) => [
  {
    title: '#',
    key: 'serialNumber',
    dataIndex: 'serialNumber',
  },
  {
    title: 'First Name',
    key: 'firstName',
    render: (text) => (
      <span>{text.user && text.user.firstName && text.user.firstName}</span>
    ),
  },
  {
    title: 'Last Name',
    key: 'lastName',
    render: (text) => (
      <span>{text.user && text.user.lastName && text.user.lastName}</span>
    ),
  },
  {
    title: 'Service Name',
    key: 'serviceName',
    render: (text) => (
      <span>
        {text.transaction &&
          text.transaction.serviceName &&
          text.transaction.serviceName}
      </span>
    ),
  },
  {
    title: 'Service Type',
    key: 'serviceType',
    render: (text) => (
      <span>
        {text.transaction &&
          text.transaction.serviceType &&
          text.transaction.serviceType}
      </span>
    ),
  },
  {
    title: 'Commission',
    key: 'commission',
    render: (text) => <span>{currencyFormat(text.commission || 0)}</span>,
  },
  {
    title: 'Pre Commission Balance',
    key: 'preCommissionBalance',
    render: (text) => (
      <span>{currencyFormat(text.preCommissionBalance || 0)}</span>
    ),
  },
  {
    title: 'Post Commission Balance',
    key: 'postCommissionBalance',
    render: (text) => (
      <span>{currencyFormat(text.postCommissionBalance || 0)}</span>
    ),
  },
  // {
  //   title: 'Commission',
  //   dataIndex: 'commission',
  //   key: 'commission',
  // },
  // {
  //   title: 'Pre Commission Balance',
  //   dataIndex: 'preCommissionBalance',
  //   key: 'preCommissionBalance',
  // },
  // {
  //   title: 'Post Commission Balance',
  //   dataIndex: 'postCommissionBalance',
  //   key: 'postCommissionBalance',
  // },
  {
    title: 'Transaction Date',
    key: 'initiatedAt',
    render: (obj) => {
      const time =
        obj.meta.createdAt &&
        moment(obj.meta.createdAt || new Date()).format('lll');
      return <span>{time}</span>;
    },
  },
  {
    title: '',
    key: 'button',
    render: (obj) => {
      return (
        <Button
          data-transactionid={obj._id}
          type="primary"
          onClick={clickHandler}
          className="commissions-table-button">
          view
        </Button>
      );
    },
  },
];

export const TablePagination = ({total, onChange, current, pageSize}) => (
  <Pagination
    total={total}
    onChange={onChange}
    current={current}
    pageSize={pageSize}
    showSizeChanger={false}
  />
);
const Commissions = ({location}) => {
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(1);
  const [counter, setCounter] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalDocumentCount, setTotalDocumentCount] = useState(0);
  const [filterCurrent, setFilterCurrent] = useState(1);
  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const commissionsState = useSelector((state) => state.commissions);
  const displayStatus = useSelector((state) => state.wallet.displayStatus);
  const walletState = useSelector((state) => state.wallet);
  const storeFilter = useSelector((state) => state.filter);
  const {filterFetchLimit, filterStates: filterState} = storeFilter;
  const {allUsersTransactions} = walletState;
  const {allCommissionsData, commissionDataObj, fetchLimit} = commissionsState;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFilterState());
    return () => dispatch(setFilterState());
  }, []);

  useEffect(() => {
    setApplyFilter(false);
    const controller = axios.CancelToken.source();
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const start =
          filter !== true
            ? (current - 1) * fetchLimit
            : (filterCurrent - 1) * filterFetchLimit;
        const {
          commissionWalletId,
          userId,
          serviceType,
          endDate,
          startDate,
          search,
        } = filterState;
        const params = {
          ...(endDate && filter && {endDate}),
          ...(search && {search}),
          ...(commissionWalletId && {commissionWalletId}),
          ...(userId && {userId}),
          ...(serviceType && {serviceType}),
          ...(startDate && filter && {startDate}),
        };
        const filterUrl = `${url}?skip=${start}&limit=${filterFetchLimit}`;
        const data = {
          url:
            filter !== true
              ? `${url}?skip=${start}&limit=${fetchLimit}`
              : filterUrl,
          method: 'GET',
          signal: controller.token,
          ...(filter && {params}),
        };
        const commissionsTransactions = await axiosData(data);
        setTotalDocumentCount(commissionsTransactions.totalDocumentCount);
        dispatch(saveAllCommissionsFetched(commissionsTransactions.data));
        setIsLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchData();
    return () => controller.cancel();
  }, [
    dispatch,
    current,
    fetchLimit,
    filterFetchLimit,
    filterCurrent,
    filter,
    applyFilter,
    filterState.search,
  ]);

  const closeModal = () => setShowModal(false);
  const buttonHandler = (event) => {
    const transactionID = event.currentTarget.dataset.transactionid;
    dispatch(getACommissionHistory(transactionID));
    setShowModal(true);
  };

  const numberHandler = (value) => {
    if (filter) {
      setFilterCurrent(1);
      return dispatch(setFilterFetchNumber(value));
    }
    setCurrent(1);
    return dispatch(setFetchNumber(value));
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
  const handleInputField = (event) => {
    const {name, value} = event.target;
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
    <div
      className="serviceContainer"
      style={{overflow: showModal === true && 'hidden'}}>
      {!localStorage.getItem('token') && (
        <Redirect
          to={{
            pathname: '/',
            state: {from: location},
          }}
        />
      )}
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
      <div className="relative flex items-center justify-between pr-4">
        <div className="top-0 left-0 h-40px flex items-center flex-3">
          <NumberDropdown numberHandler={numberHandler} />
          {allCommissionsData.length >= 1 && (
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
        </div>
        <div className="flex items-center">
          <Filter
            endDateHandler={endDateHandler}
            startDateHandler={startDateHandler}
            disabledDate={disabledDate}
            handleFilterInput={handleFilterInput}
            filterSubmitHandler={filterSubmit}
            clearFilterHandler={clearFilter}
            data={filterState}>
            <InputFilterField
              inputValue={filterState.userId}
              inputName="userId"
              handleInputField={handleInputField}
              placeholder="Enter User ID"
            />
            <div className="flex justify-around">
              <SingleDatePicker
                onChange={startDateHandler}
                disabledDate={disabledDate}
                date={moment(filterState.filterStartDate, filterState.endDate)}
              />
              <span className="mx-2 font-extrabold">-</span>
              <SingleDatePicker
                onChange={endDateHandler}
                disabledDate={disabledDate}
                date={moment(filterState.filterEndDate, filterState.endDate)}
              />
            </div>
          </Filter>
          <Input onChange={searchHandler} placeholder="input search text" />
        </div>
      </div>
      {showModal === true && (
        <Modal>
          <CommissionDetails
            modalHandler={closeModal}
            data={commissionDataObj}
          />
        </Modal>
      )}
      {isLoading === true ? (
        <Loading />
      ) : (
        <div className="display-table">
          <Table
            dataSource={allCommissionsData}
            columns={columns(buttonHandler)}
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
    </div>
  );
};

export default Commissions;
