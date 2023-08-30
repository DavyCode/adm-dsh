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
import searchDebounce from '../utils/debounce';
import Filter from './filter/Filter.jsx';
import InputFilterField from './filter/InputFilterField.jsx';
import DropdownFilter from './filter/DropdownFilter.jsx';
import BooleanFilter from './filter/BooleanFilter.jsx';
import {SingleDatePicker} from './Datepicker.jsx';
import currencyFormat from '../utils/currencyFomat';

import {
  getAllWalletTransactions,
  getAWalletTransaction,
  setFetchNumber,
} from '../actions/wallet.action.js';
import {
  setFilterFetchNumber,
  setFilterState,
} from '../actions/filter.action.js';
import TransactionTypeFilter from './filter/TransactionTypeFilter.jsx';
import plaform from '../common/StateData/platform.json';
import paymentMethod from '../common/StateData/paymentMethod.json';

const adminURL = process.env.REACT_APP_ADMIN_URL;
//const baseURL = process.env.REACT_APP_BASE_URL;
const url = `${adminURL}/transactions`;
//const urlTwo = `${baseURL}/services/paymentMethods`;
//const urlThree = `${baseURL}/services/platforms`;

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
    title: 'Transaction Id',
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
      const time = moment(obj.initiatedAt).format('lll');
      return <span>{time}</span>;
    },
  },
  {
    title: '',
    key: 'button',
    render: (obj) => {
      return (
        <div>
          <Button
            data-transactionid={obj.transactionId}
            type="primary"
            onClick={clickHandler}
            className="wallet-table-button">
            view
          </Button>
        </div>
      );
    },
  },
];

const TablePagination = ({total, onChange, current, pageSize}) => (
  <Pagination
    total={total}
    onChange={onChange}
    current={current}
    pageSize={pageSize}
    showSizeChanger={false}
  />
);
const Wallet = ({location}) => {
  const [showModal, setShowModal] = useState(false);
  const [filterCurrent, setFilterCurrent] = useState(1);
  const [showRefunds, setShowRefunds] = useState(false);
  const [current, setCurrent] = useState(1);
  const [counter, setCounter] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalDocumentCount, setTotalDocumentCount] = useState(0);
  const walletState = useSelector((state) => state.wallet);
  const displayStatus = useSelector((state) => state.wallet.displayStatus);
  const storeFilter = useSelector((state) => state.filter);
  const {filterFetchLimit, filterStates: filterState} = storeFilter;
  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const {allUsersTransactions, singleTransaction, fetchLimit} = walletState;
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
          // amount,
          // serviceId,
          // paymentMethod,
          transactionReference,
          // client_transactionReference,
          // isTransactionRefunded,
          // isRefundedTransaction,
          // userId,
          // client_paymentReference,
          // platform,
          transactionId,
          // serviceName,
          // search,
          status,
          // serviceType,
          endDate,
          startDate,
        } = filterState;
        const params = {
          ...(endDate && filter && {endDate}),
          // ...(search && {search}),
          // ...(serviceType && {serviceType}),
          // ...(amount && {amount}),
          // ...(serviceId && {serviceId}),
          // ...(paymentMethod && {paymentMethod}),
          ...(transactionReference && {transactionReference}),
          // ...(client_transactionReference && {
          //   client_transactionReference,
          // }),
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
        const filterUrl = `${url}?skip=${start}&limit=${filterFetchLimit}&transactionType=Wallet`;
        const data = {
          url:
            filter !== true
              ? `${url}?skip=${start}&limit=${fetchLimit}&transactionType=Wallet`
              : filterUrl,
          method: 'GET',
          ...(filter && {params}),
          signal: controller.token,
        };
        // const dataTwo = {
        //   url: urlTwo,
        //   method: "GET",
        //   signal: controller.token,
        // };
        // const dataThree = {
        //   url: urlThree,
        //   method: "GET",
        //   signal: controller.token,
        // };
        const [
          walletTransactions,
          //paymentMethods,
          //platforms,
        ] = await Promise.all([
          axiosData(data),
          //axiosData(dataTwo),
          //axiosData(dataThree),
        ]);

        //setApprovedPaymentMethod(paymentMethods.data);
        //setPlatforms(platforms.data);
        setTotalDocumentCount(walletTransactions.totalDocumentCount);
        const allData = walletTransactions.data.map((transaction, index) => ({
          ...transaction,
          serialNumber: counter + 1,
        }));
        dispatch(getAllWalletTransactions(allData));
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
    applyFilter,
    filter,
    filterCurrent,
    filterFetchLimit,
    filterState.search,
  ]);
  const closeModal = () => setShowModal(false);
  const buttonHandler = (event) => {
    const transactionID = event.currentTarget.dataset.transactionid;
    dispatch(getAWalletTransaction(transactionID));
    setShowModal(true);
  };
  const refundsHandler = (event) => {
    const transactionID = event.currentTarget.dataset.transactionid;
    dispatch(getAWalletTransaction(transactionID));
    setShowRefunds(true);
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
      className="walletContainer"
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
      <div className="relative flex items-center pr-4 justify-between mb-2">
        <div className="top-0 left-0 h-40px flex items-center">
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
            {/* <InputFilterField
              inputValue={filterState.userId}
              inputName="userId"
              handleInputField={handleInputField}
              placeholder="Enter User ID"
            /> */}
            {/* <InputFilterField
              inputValue={filterState.amount}
              inputName="amount"
              handleInputField={handleInputField}
              placeholder="Enter an amount"
            /> */}
            {/* <InputFilterField
              inputValue={filterState.serviceId}
              inputName="serviceId"
              handleInputField={handleInputField}
              placeholder="Enter a service ID"
            />
            <InputFilterField
              inputValue={filterState.serviceName}
              inputName="serviceName"
              handleInputField={handleInputField}
              placeholder="Enter a service Name"
            /> */}
            <InputFilterField
              inputValue={filterState.transactionReference}
              inputName="transactionReference"
              handleInputField={handleInputField}
              placeholder="Transaction Reference"
            />
            {/* <InputFilterField
              inputValue={filterState.client_transactionReference}
              inputName="client_transactionReference"
              handleInputField={handleInputField}
              placeholder="Client transaction reference"
            />
            <InputFilterField
              inputValue={filterState.client_paymentReference}
              inputName="client_paymentReference"
              handleInputField={handleInputField}
              placeholder="Client payment reference"
            /> */}
            <InputFilterField
              inputValue={filterState.transactionId}
              inputName="transactionId"
              handleInputField={handleInputField}
              placeholder="Transaction ID"
            />
            {/* <DropdownFilter
              paymentMethods={paymentMethod}
              handleFilterInput={handleFilterInput}
              defaultText="Select a payment method"
              inputValue={filterState.paymentMethod}
              dropdownName="paymentMethod"
            /> */}
            {/* <DropdownFilter
              paymentMethods={plaform}
              handleFilterInput={handleFilterInput}
              defaultText="Select a Platform"
              inputValue={filterState.platform}
              dropdownName="platform"
            /> */}
            {/* <BooleanFilter
              inputValue={filterState.isTransactionRefunded}
              handleFilterInput={handleFilterInput}
              defaultText="Failed Transaction Refund Status"
              inputName="isTransactionRefunded"
            />
            <BooleanFilter
              inputValue={filterState.isRefundedTransaction}
              handleFilterInput={handleFilterInput}
              defaultText="Select refunded transactions?"
              inputName="isRefundedTransaction"
            /> */}
            <StatusFilter
              data={filterState}
              handleFilterInput={handleFilterInput}
              defaultText="Wallet Transaction Status"
            />
            {/* <TransactionTypeFilter
              defaultText="Service Type"
              data={filterState}
              handleFilterInput={handleFilterInput}
            /> */}
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
      <div className="relative flex items-center pr-4 justify-between mb-2"></div>
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
            columns={columns(buttonHandler, refundsHandler)}
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

export default Wallet;
