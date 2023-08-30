/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import axiosData from '../utils/axiosData.js';
import {Table, Button, Pagination, Badge, Input} from 'antd';
import Modal from './Modal.jsx';
import NumberDropdown from './NumberDropdown.jsx';
import TransactionDetails from './TransactionDetails.jsx';
import styles from '../styles/style.less';
import Loading from './Loading.jsx';
import StatusFilter from './filter/StatusFilter.jsx';
import DisplayCard from './DisplayCard.jsx';
import Filter from './filter/Filter.jsx';
import searchDebounce from '../utils/debounce';
import InputFilterField from './filter/InputFilterField.jsx';
import DropdownFilter from './filter/DropdownFilter.jsx';
import BooleanFilter from './filter/BooleanFilter.jsx';
import {SingleDatePicker} from './Datepicker.jsx';
import currencyFormat from '../utils/currencyFomat';
import {
  getAllServiceTransactions,
  getAServiceTransaction,
  setFetchNumber,
} from '../actions/services.action.js';
import {
  setFilterFetchNumber,
  setFilterState,
} from '../actions/filter.action.js';
import TransactionTypeFilter from './filter/TransactionTypeFilter.jsx';
import plaform from '../common/StateData/platform.json';
import paymentMethod from '../common/StateData/paymentMethod.json';
const adminURL = process.env.REACT_APP_ADMIN_URL;
const baseURL = process.env.REACT_APP_BASE_URL;
const url = `${adminURL}/transactions`;
const urlTwo = `${baseURL}/services/paymentMethods`;
const urlThree = `${baseURL}/services/platforms`;

const columns = (clickHandler) => [
  {
    title: '#',
    key: 'serialNumber',
    render: (text) => <span>{text.serialNumber}</span>,
  },
  {
    title: 'Transaction Reference',
    key: 'transactionReference',
    render: (text) => <span>{text.transactionReference}</span>,
  },
  {
    title: 'Transaction ID',
    key: 'transactionId',
    render: (text) => <span>{text.transactionId}</span>,
  },
  {
    title: 'Name',
    key: 'senderName',
    render: (text) => (
      <span>{text.user && `${text.user.firstName} ${text.user.lastName}`}</span>
    ),
  },
  {
    title: 'Amount',
    key: 'Amount',
    render: (text) => <span>{currencyFormat(text.amount || 0)}</span>,
  },

  // {
  //   title: 'Amount',
  //   dataIndex: 'amount',
  //   key: 'amount',
  // },
  {
    title: 'Type',
    dataIndex: 'serviceType',
    key: 'transactionType',
  },
  {
    title: 'Status',
    key: 'status',
    render: (obj) => {
      let badgeColor = '';
      if (obj.status === 'Successful') badgeColor = 'success';
      if (obj.status === 'Pending') badgeColor = 'processing';
      if (obj.status === 'Failed') badgeColor = 'error';
      if (obj.status === 'Null') badgeColor = 'warning';
      if (obj.status === 'Init') badgeColor = 'default';
      return (
        <span data-status={obj.status}>
          <Badge status={badgeColor} text={obj.status} />
        </span>
      );
    },
  },
  {
    title: 'Date',
    key: 'initiatedAt',
    render: (obj) => {
      const time = moment(obj.meta.createdAt).format('lll');
      return <span>{time}</span>;
    },
  },
  {
    title: '',
    key: 'button',
    render: (obj) => {
      return (
        <Button
          data-transactionid={obj.transactionId}
          type="primary"
          onClick={clickHandler}
          className="services-table-button">
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
const Services = ({location}) => {
  const [showModal, setShowModal] = useState(false);
  const [filterCurrent, setFilterCurrent] = useState(1);
  const [current, setCurrent] = useState(1);
  const [counter, setCounter] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalDocumentCount, setTotalDocumentCount] = useState(0);
  const serviceState = useSelector((state) => state.services);
  const displayStatus = useSelector((state) => state.services.displayStatus);
  const {allUsersTransactions, singleTransaction, fetchLimit} = serviceState;
  const storeFilter = useSelector((state) => state.filter);
  const {filterFetchLimit, filterStates: filterState} = storeFilter;
  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const [approvedPaymentMethod, setApprovedPaymentMethod] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFilterState());
    return () => {
      setApplyFilter(false);
      dispatch(setFilterState());
    };
  }, []);

  const fetchData = async (controller) => {
    try {
      setIsLoading(true);
      const start =
        filter !== true
          ? (current - 1) * fetchLimit
          : (filterCurrent - 1) * filterFetchLimit;
      const {
        transactionReference,
        transactionId,
        //search,
        status,
        serviceType,
        endDate,
        startDate,
      } = filterState;
      const params = {
        ...(endDate && filter && {endDate}),
        ...(serviceType && {serviceType}),
        ...(transactionReference && {transactionReference}),
        // ...(client_transactionReference && {client_transactionReference}),
        // ...(isTransactionRefunded && {isTransactionRefunded}),
        // ...(isRefundedTransaction && {isRefundedTransaction}),
        // ...(userId && {userId}),
        // ...(client_paymentReference && {client_paymentReference}),
        // ...(serviceName && {serviceName}),
        // ...(platform && {platform}),
        ...(transactionId && {transactionId}),
        ...(status && {status}),
        ...(startDate && filter && {startDate}),
      };
      const filterUrl = `${url}?skip=${start}&limit=${filterFetchLimit}&transactionType=Services`;
      const data = {
        url:
          filter !== true
            ? `${url}?skip=${start}&limit=${fetchLimit}&transactionType=Services`
            : filterUrl,
        method: 'GET',
        signal: controller.token,
        ...(filter && {params}),
      };
      const dataTwo = {
        url: urlTwo,
        method: 'GET',
        signal: controller.token,
      };
      const dataThree = {
        url: urlThree,
        method: 'GET',
        signal: controller.token,
      };
      const [
        serviceTransactions,
        //paymentMethods,
        // platforms,
      ] = await Promise.all([
        axiosData(data),
        axiosData(dataTwo),
        // axiosData(dataThree),
      ]);

      //setApprovedPaymentMethod(paymentMethods.data);
      // setPlatforms(platforms.data);
      setTotalDocumentCount(serviceTransactions.totalDocumentCount);
      dispatch(getAllServiceTransactions(serviceTransactions.data));
      setIsLoading(false);
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setApplyFilter(false);
    const controller = axios.CancelToken.source();

    fetchData(controller);
    return () => {
      controller.cancel();
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

  const closeModal = () => setShowModal(false);
  const buttonHandler = (event) => {
    const transactionID = event.currentTarget.dataset.transactionid;
    dispatch(getAServiceTransaction(transactionID));
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
  const handleInputField = (event) => {
    const {name, value} = event.target;
    dispatch(setFilterState({[name]: value}));
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
          (displayStatus.init / allUsersTransactions.length) * 100,
        )}
      />
      <div className="relative flex items-center justify-between pr-4">
        <div className="top-0 left-0 h-40px flex items-center flex-3">
          <NumberDropdown numberHandler={numberHandler} />
          {allUsersTransactions.length >= 1 && (
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
          <Filter
            endDateHandler={endDateHandler}
            startDateHandler={startDateHandler}
            disabledDate={disabledDate}
            handleFilterInput={handleFilterInput}
            filterSubmitHandler={filterSubmit}
            clearFilterHandler={clearFilter}
            data={filterState}>
            <InputFilterField
              inputValue={filterState.transactionReference}
              inputName="transactionReference"
              handleInputField={handleInputField}
              placeholder="Transaction Reference"
            />
            <InputFilterField
              inputValue={filterState.transactionId}
              inputName="transactionId"
              handleInputField={handleInputField}
              placeholder="Transaction ID"
            />
            <StatusFilter
              defaultText="Service Transaction Status"
              data={filterState}
              handleFilterInput={handleFilterInput}
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
          {/* <Input onChange={searchHandler} placeholder="input search text" /> */}
        </div>
      </div>
      {showModal === true && (
        <Modal>
          <TransactionDetails
            modalHandler={closeModal}
            data={singleTransaction}
          />
        </Modal>
      )}
      {isLoading === true ? (
        <Loading />
      ) : (
        <div className="display-table">
          <Table
            dataSource={allUsersTransactions}
            columns={columns(buttonHandler)}
            rowKey="transactionId"
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

export default Services;
