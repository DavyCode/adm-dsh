import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Redirect} from 'react-router-dom';
import moment from 'moment';
import {useToasts} from 'react-toast-notifications';
import axiosData from '../../utils/axiosData.js';
import Loading from '../Loading';
import {Table, Button, Pagination, Input, Popconfirm, message} from 'antd';
import Modal from '../Modal.jsx';
import NumberDropdown from '../NumberDropdown.jsx';
import DisplayCard from '../DisplayCard.jsx';
import searchDebounce from '../../utils/debounce';
import Filter from '../filter/Filter.jsx';
import InputFilterField from '../filter/InputFilterField.jsx';
import DropdownFilter from '../filter/DropdownFilter.jsx';
import BooleanFilter from '../filter/BooleanFilter.jsx';
import {SingleDatePicker} from '../Datepicker.jsx';
import paymentStatus from '../../common/StateData/paymentStatus.json';
import {
  getAllPayementNotification,
  getAPaymentNotification,
  setFetchNumber,
} from '../../actions/paymentNotification.action';
import axios from 'axios';
import {
  setFilterFetchNumber,
  setFilterState,
} from '../../actions/filter.action.js';
import PaymentNotificationDetails from './paymentNoteDetails';
// import formatAmount from '../../utils/formatAmount.js';
import currencyFormat from '../../utils/currencyFomat';
const adminURL = process.env.REACT_APP_ADMIN_URL;
const url = `${adminURL}/wallets/notifications`;
const columns = ({clickHandler, viewLoading}) => [
  {
    title: '#',
    key: 'serialNumber',
    render: (text) => <span>{text.serialNumber}</span>,
  },
  {
    title: 'Amount Paid',
    key: 'amountPaid',
    render: (text) => <span>{`${currencyFormat(text.amountPaid || 0)}`}</span>,
  },
  {
    title: 'Paid on',
    key: 'paidOn',
    render: (text) => (
      <span className=" w-full overflow-x-hidden message-body">
        {text.paidOn}
      </span>
    ),
  },
  // {
  //   title: 'Total Payable',
  //   key: 'totalPayable',
  //   render: (text) => (
  //     <span className=" w-full overflow-x-hidden message-body">
  //       {`#${formatAmount(text.totalPayable || 0)}`}
  //     </span>
  //   ),
  // },
  {
    title: 'Payment Description',
    key: 'status',
    render: (text) => (
      <span className="max-w-50px overflow-x-hidden">
        {text.paymentDescription}
      </span>
    ),
  },
  {
    title: 'Payment Method',
    key: 'paymentMethod',
    render: (text) => (
      <span className="max-w-50px overflow-x-hidden">{text.paymentMethod}</span>
    ),
  },
  {
    title: 'Payment Status',
    key: 'paymentStatus',
    render: (text) => (
      <span className="max-w-50px overflow-x-hidden">{text.paymentStatus}</span>
    ),
  },
  {
    title: 'Date',
    key: 'initiatedAt',
    render: (obj) => <span>{moment(obj.paidOn).format('lll')}</span>,
  },
  {
    title: '',
    key: 'button',
    render: (obj) => {
      const cancel = (e) => {
        message.error('Cancelled');
      };
      return (
        <div className="flex justify-center items-center">
          <Button
            data-paymentnoteid={obj._id}
            type="primary"
            onClick={(e) => clickHandler()(e)}
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
const PaymentNotification = ({location}) => {
  const [showModal, setShowModal] = useState(false);
  const [filterCurrent, setFilterCurrent] = useState(1);
  const [current, setCurrent] = useState(1);
  const [counter, setCounter] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [totalDocumentCount, setTotalDocumentCount] = useState(0);
  const paymentNotificationState = useSelector(
    (state) => state.paymentNotification,
  );
  const displayStatus = useSelector((state) => state.allIssues.displayStatus);
  const storeFilter = useSelector((state) => state.filter);
  const {filterFetchLimit, filterStates: filterState} = storeFilter;
  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const {
    allPaymentNotification,
    singlePaymentNotification,
    fetchLimit,
  } = paymentNotificationState;
  const dispatch = useDispatch();
  const {addToast} = useToasts();

  useEffect(() => {
    dispatch(setFilterState());
    return () => {
      setApplyFilter(false);
      dispatch(setFilterState());
    };
  }, []);

  const fetchData = async (controller) => {
    setIsLoading(() => true);
    try {
      const start =
        filter !== true
          ? (current - 1) * fetchLimit
          : (filterCurrent - 1) * filterFetchLimit;
      const {
        amountPaid,
        paidOn,
        paymentDescription,
        paymentReference,
        paymentStatus,
        transactionReference,
        date,
        endDate,
        startDate,
        // paymentMethod,
      } = filterState;
      const params = {
        ...(endDate && filter && {endDate}),
        ...(amountPaid && {amountPaid}),
        ...(paidOn && {paidOn}),
        ...(date && {date}),
        // ...(paymentMethod && {paymentMethod}),
        ...(paymentDescription && {paymentDescription}),
        ...(paymentReference && {paymentReference}),
        ...(paymentStatus && {paymentStatus}),
        ...(transactionReference && {transactionReference}),
        ...(startDate && filter && {startDate}),
      };
      const filterUrl = `${url}?skip=${start}&limit=${filterFetchLimit}`;
      const data = {
        url:
          filter !== true
            ? `${url}?skip=${start}&limit=${fetchLimit}`
            : filterUrl,
        method: 'GET',
        ...(filter && {params}),
        signal: controller.token,
      };

      const issueData = await axiosData(data);
      setTotalDocumentCount(issueData ? issueData.totalDocumentCount : 0);
      const allData =
        issueData &&
        issueData.data.map((issue, index) => ({
          ...issue,
          serialNumber: start + index + 1,
        }));
      dispatch(getAllPayementNotification(allData));
      return setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (axios.isCancel(error)) return;
      return console.log(error);
    }
  };

  useEffect(() => {
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

  const buttonHandler = (id) => {
    return (event) => {
      if (id) return dispatch(getAPaymentNotification(id));
      const paymentNoteId = event?.currentTarget?.dataset.paymentnoteid;
      dispatch(getAPaymentNotification(paymentNoteId));
      setShowModal(true);
    };
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

  const DateHandler = (date, dateString) => {
    dispatch(setFilterState({filterDate: date, date: dateString}));
  };
  const paidOnDateHandler = (date, dateString) => {
    dispatch(setFilterState({filterPaidOn: date, paidOn: dateString}));
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
    setApplyFilter((state) => !state);
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
        totalTransactions={allPaymentNotification.length}
        successTransaction={displayStatus.successful}
        failedTransaction={displayStatus.failed}
        pendingTransaction={displayStatus.pending}
        nullTransaction={displayStatus.nullStatus}
        refundedTransaction={displayStatus.unknown}
        successful={Math.round(
          (displayStatus.successful / allPaymentNotification.length) * 100,
        )}
        failed={Math.round(
          (displayStatus.failed / allPaymentNotification.length) * 100,
        )}
        pending={Math.round(
          (displayStatus.pending / allPaymentNotification.length) * 100,
        )}
        nullNumber={Math.round(
          (displayStatus.nullStatus / allPaymentNotification.length) * 100,
        )}
        init={Math.round(
          (displayStatus.unknown / allPaymentNotification.length) * 100,
        )}
      />
      <div className="relative flex items-center pr-4 justify-between mb-2">
        <div className="top-0 left-0 h-40px flex items-center">
          <NumberDropdown numberHandler={numberHandler} />
          {allPaymentNotification.length >= 1 && (
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
            paidOnDateHandler={paidOnDateHandler}
            handleFilterInput={handleFilterInput}
            DateHandler={DateHandler}
            data={filterState}>
            {/* <InputFilterField
              inputValue={filterState.amountPaid}
              inputName="amountPaid"
              handleInputField={handleInputField}
              placeholder="Amount Paid"
            /> */}
            <div className="border border-gray-400 rounded-md p-2 w-full mb-2 text-center">
              <div className="mb-2">Paid on:</div>
              <SingleDatePicker
                onChange={paidOnDateHandler}
                disabledDate={disabledDate}
                date={moment(filterState.filterPaidOn, filterState.paidOn)}
              />
            </div>
            {/* <InputFilterField
              inputValue={filterState.paymentDescription}
              inputName="paymentDescription"
              handleInputField={handleInputField}
              placeholder="Payment Description"
            /> */}
            <InputFilterField
              inputValue={filterState.paymentReference}
              inputName="paymentReference"
              handleInputField={handleInputField}
              placeholder="Payment Reference"
            />
            <DropdownFilter
              paymentMethods={paymentStatus}
              handleFilterInput={handleFilterInput}
              defaultText="Payment Status"
              inputValue={filterState.paymentStatus}
              dropdownName="paymentStatus"
            />
            {/* <InputFilterField
              inputValue={filterState.totalPayable}
              inputName="totalPayable"
              handleInputField={handleInputField}
              placeholder="Total Payable"
            /> */}
            {/* <InputFilterField
              inputValue={filterState.transactionHash}
              inputName="transactionHash"
              handleInputField={handleInputField}
              placeholder="Transaction Hash"
            /> */}
            <InputFilterField
              inputValue={filterState.transactionReference}
              inputName="transactionReference"
              handleInputField={handleInputField}
              placeholder="Transaction Reference"
            />
            {/* <DropdownFilter
              paymentMethods={['ACCOUNT_TRANSFER', 'AIRTIME_TRANSFER']}
              handleFilterInput={handleFilterInput}
              defaultText="Issue Category"
              inputValue={filterState.paymentMethod}
              dropdownName="issueCategory"
            /> */}
            <div className="border border-gray-400 rounded-md p-2 w-full mb-2 text-center">
              <div className="mb-2">Date:</div>
              <SingleDatePicker
                onChange={DateHandler}
                disabledDate={disabledDate}
                date={moment(filterState.filterDate, filterState.date)}
              />
            </div>
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
          <PaymentNotificationDetails
            modalHandler={closeModal}
            data={singlePaymentNotification}
            fetchData={fetchData}
            buttonHandler={buttonHandler}
          />
        </Modal>
      )}

      <div className="display-table">
        <Table
          dataSource={allPaymentNotification}
          columns={columns({
            clickHandler: buttonHandler,
            viewLoading,
          })}
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
      {isLoading && <Loading />}
    </div>
  );
};
export default PaymentNotification;
