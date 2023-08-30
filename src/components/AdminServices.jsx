/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Table, Input} from 'antd';
import moment from 'moment';
import Loading from './Loading.jsx';
import NumberDropdown from './NumberDropdown.jsx';
import axiosData from '../utils/axiosData.js';
import axios from 'axios';
import {
  getAllServices,
  setFetchNumber,
} from '../actions/adminServices.action.js';
import CreateServiceForm from './CreateService.jsx';
import UpdateServices from './UpdateService.jsx';
// import styles from '../styles/style.less';
import DisplayCard from './DisplayCard.jsx';
import {Redirect} from 'react-router-dom';
import {TablePagination} from './Services.jsx';
import searchDebounce from '../utils/debounce';
import Filter from './filter/Filter.jsx';
//import DropdownFilter from './filter/DropdownFilter.jsx';
import DropdownFilter2 from './filter/DropdownFilter2.jsx';
import BooleanFilter from './filter/BooleanFilter.jsx';
import {SingleDatePicker} from './Datepicker.jsx';
import {
  setFilterFetchNumber,
  setFilterState,
} from '../actions/filter.action.js';
//import plaform from '../common/StateData/platform.json';
//import ServiceTypes from '../common/StateData/serviceTypes.json';
//import formatAmount from '../utils/formatAmount.js';
import currencyFormat from '../utils/currencyFomat';
const adminURL = process.env.REACT_APP_ADMIN_URL;
const url = `${adminURL}/switch-service`;
const url_two = process.env.REACT_APP_BASE_URL;

const AdminServices = ({location}) => {
  const [totalDocumentCount, setTotalDocumentCount] = useState(0);
  const [filterCurrent, setFilterCurrent] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [platformData, setPlatformData] = useState([]);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const {servicesData, fetchLimit} = useSelector(
    (state) => state.adminServices,
  );
  const displayStatus = useSelector((state) => state.wallet.displayStatus);
  const walletState = useSelector((state) => state.wallet);
  const {allUsersTransactions} = walletState;
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const [current, setCurrent] = useState(1);
  const [counter, setCounter] = useState(1);
  const storeFilter = useSelector((state) => state.filter);
  const {filterFetchLimit, filterStates: filterState} = storeFilter;
  const [allServices, setAllServices] = useState([]);

  useEffect(() => {
    dispatch(setFilterState());
    return () => dispatch(setFilterState());
  }, []);

  const fetchData = async (controller) => {
    setIsLoading(true);
    const start =
      filter !== true
        ? (current - 1) * fetchLimit
        : (filterCurrent - 1) * filterFetchLimit;
    const {
      platform,
      chargesApply,
      serviceType,
      endDate,
      startDate,
      search,
    } = filterState;
    const params = {
      ...(endDate && filter && {endDate}),
      ...(search && {search}),
      ...(startDate && filter && {startDate}),
      ...(platform && {platform}),
      ...(chargesApply && {chargesApply}),
      ...(serviceType && {serviceType}),
    };
    const filterUrl = `${url}?skip=${start}&limit=${filterFetchLimit}`;
    const data = {
      url:
        filter !== true
          ? `${url}?skip=${start}&limit=${fetchLimit}`
          : filterUrl,
      method: 'GET',
      signal: controller.token,
      params,
    };
    const dataTwo = {
      method: 'GET',
      url: `${url_two}/services/platforms`,
      signal: controller.token,
    };
    const dataThree = {
      method: 'GET',
      url: `${url_two}/services/types`,
      signal: controller.token,
    };
    try {
      const [switchData, platformData, servicesData] = await Promise.all([
        axiosData(data),
        axiosData(dataTwo),
        axiosData(dataThree),
      ]);
      setTotalDocumentCount(switchData.totalDocumentCount);
      setPlatformData(platformData.data);
      setAllServices(servicesData.data);
      const modifiedData = switchData.data.map((data, index) => {
        return {...data, serialNumber: counter + index};
      });
      dispatch(getAllServices(modifiedData));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      // if (axios.isCancel(error)) return;
      console.log(error);
    }
  };

  useEffect(() => {
    setApplyFilter(false);
    setIsLoading(true);
    setIsSuccessful(false);
    const controller = axios.CancelToken.source();
    fetchData(controller);
    // return () => controller.cancel();
  }, [
    dispatch,
    filterFetchLimit,
    filterCurrent,
    isSuccessful,
    filterState.search,
    filter,
    current,
    fetchLimit,
    counter,
    applyFilter,
  ]);

  const itemRender = (current, type, originalElement) => {
    if (type === 'prev') return <a>Previous</a>;
    if (type === 'next') return <a>Next</a>;
    return originalElement;
  };

  const updateHandler = (data) =>
    servicesData.find((service) => service._id === data);

  const columns = [
    {
      title: 'S/N',
      key: 'serialNumber',
      render: (text) => {
        return <span>{text.serialNumber}</span>;
      },
    },
    {
      title: 'Service',
      key: 'serviceType',
      render: (text) => {
        return <span>{text.serviceType}</span>;
      },
    },
    {
      title: 'Platform',
      key: 'platform',
      render: (text) => {
        return <span>{text.platform}</span>;
      },
    },
    {
      title: 'Charges',
      key: 'charges',
      render: (text) => {
        return <span>{`${currencyFormat(text.charges || 0)}`}</span>;
      },
    },
    {
      title: 'Date Created',
      key: 'dateCreated',
      render: (text) => {
        return <span>{moment(text.meta.createdAt).format('lll')}</span>;
      },
    },
    {
      title: 'Date Updated',
      key: 'dateUpdated',
      render: (text) => {
        return <span>{moment(text.meta.updatedAt).format('lll')}</span>;
      },
    },
    {
      key: 'buttons',
      render: (text) => (
        <UpdateServices
          documentID={text._id}
          clickHandler={updateHandler(text._id)}
          platformData={platformData}
          onUpdate={(bool) => setIsSuccessful(bool)}
          fetchData={fetchData}
        />
      ),
    },
  ];

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
    <div className="adminservices-table">
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
      <div className="relative flex items-center p-2 justify-between ">
        <div className="top-0 left-0 h-40px flex items-center">
          <NumberDropdown numberHandler={numberHandler} />
          {servicesData.length >= 1 && (
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
        <div className="flex">
          <CreateServiceForm onUpdate={(bool) => setIsSuccessful(bool)} />

          <Filter
            endDateHandler={endDateHandler}
            startDateHandler={startDateHandler}
            disabledDate={disabledDate}
            handleFilterInput={handleFilterInput}
            filterSubmitHandler={filterSubmit}
            clearFilterHandler={clearFilter}
            data={filterState}>
            <DropdownFilter2
              paymentMethods={platformData}
              handleFilterInput={handleFilterInput}
              defaultText="Select a Platform"
              inputValue={filterState.platform}
              dropdownName="platform"
            />
            <DropdownFilter2
              paymentMethods={allServices}
              handleFilterInput={handleFilterInput}
              defaultText="Select a Service Type"
              inputValue={filterState.serviceType}
              dropdownName="serviceType"
            />
            <BooleanFilter
              inputValue={filterState.chargesApply}
              handleFilterInput={handleFilterInput}
              defaultText="Charges Applied?"
              inputName="chargesApply"
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
      {isLoading === true ? (
        <Loading />
      ) : (
        <div className="display-table">
          <Table
            columns={columns}
            dataSource={servicesData}
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
export default AdminServices;
