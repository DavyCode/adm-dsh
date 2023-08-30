import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Redirect} from 'react-router-dom';
import moment from 'moment';
import {useToasts} from 'react-toast-notifications';
import axiosData from '../../utils/axiosData.js';
import Loading from '../Loading';
import {Table, Button, Pagination, message, Badge} from 'antd';
import Modal from '../Modal.jsx';
import NumberDropdown from '../NumberDropdown.jsx';
import DisplayCard from '../DisplayCard.jsx';
import searchDebounce from '../../utils/debounce';
import Filter from '../filter/Filter.jsx';
import InputFilterField from '../filter/InputFilterField.jsx';
import currencyFormat from '../../utils/currencyFomat';
import {SingleDatePicker} from '../Datepicker.jsx';
import {
  getAllPostransaction,
  getAPostransaction,
  setFetchNumber,
} from '../../actions/postransaction.action';
import axios from 'axios';
import {
  setFilterFetchNumber,
  setFilterState,
} from '../../actions/filter.action.js';
import PosTransactionDetails from './postransactionDetails';
const adminURL = process.env.REACT_APP_ADMIN_URL;
const url = `${adminURL}/transactions`;
const columns = ({clickHandler, viewLoading}) => [
  {
    title: '#',
    key: 'serialNumber',
    render: (text) => <span>{text.serialNumber}</span>,
  },
  {
    title: 'Amount',
    key: 'amountPaid',
    render: (text) => <span>{`${currencyFormat(text.amount || 0)}`}</span>,
  },
  {
    title: 'Terminal ID',
    key: 'terminalId',
    render: (text) => (
      <span className="max-w-50px overflow-x-hidden">{text.terminalId}</span>
    ),
  },
  {
    title: 'Transaction ID',
    key: 'transactionId',
    render: (text) => (
      <span className="max-w-50px overflow-x-hidden">{text.transactionId}</span>
    ),
  },
  {
    title: 'Agent Name',
    key: 'agentName',
    render: (text) => (
      <span className="max-w-50px overflow-x-hidden">{`${text.user.firstName} ${text.user.lastName}`}</span>
    ),
  },
  {
    title: 'Status',
    key: 'status',
    render: (text) => {
      let badgeColor = '';
      if (text.status === 'Successful') badgeColor = 'success';
      if (text.status === 'Pending') badgeColor = 'processing';
      if (text.status === 'Failed') badgeColor = 'error';
      if (text.status === 'Null') badgeColor = 'warning';
      if (text.status === 'Init') badgeColor = 'default';
      return (
        <span data-status={text.status}>
          <Badge status={badgeColor} text={text.status} />
        </span>
      );
    },
  },
  {
    title: 'Date',
    key: 'initiatedAt',
    render: (text) => <span>{moment(text.paidAt).format('lll')}</span>,
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
            data-postransactionid={obj._id}
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
const POSTransactions = ({location}) => {
  const [showModal, setShowModal] = useState(false);
  const [filterCurrent, setFilterCurrent] = useState(1);
  const [current, setCurrent] = useState(1);
  const [counter, setCounter] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [totalDocumentCount, setTotalDocumentCount] = useState(0);
  const postransactionstate = useSelector((state) => state.posTransaction);
  const {
    allPostransaction,
    singlePostransaction,
    fetchLimit,
  } = postransactionstate;
  const displayStatus = useSelector((state) => state.allIssues.displayStatus);
  const storeFilter = useSelector((state) => state.filter);
  const {filterFetchLimit, filterStates: filterState} = storeFilter;
  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
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
        paidAt,
        transactionId,
        terminalId,
        transactionReference,
        date,
        endDate,
        startDate,
      } = filterState;
      const params = {
        ...(endDate && filter && {endDate}),
        ...(paidAt && filter && {paidAt}),
        ...(date && filter && {date}),
        ...(transactionId && {transactionId}),
        ...(terminalId && {terminalId}),
        ...(transactionReference && {transactionReference}),
        ...(startDate && filter && {startDate}),
      };
      const filterUrl = `${url}?skip=${start}&limit=${filterFetchLimit}`;
      const data = {
        url:
          filter !== true
            ? `${url}?skip=${start}&limit=${fetchLimit}&transactionType=POS`
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
      dispatch(getAllPostransaction(allData));
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
      if (id) return dispatch(getAPostransaction(id));
      const postransactionId = event?.currentTarget?.dataset.postransactionid;
      dispatch(getAPostransaction(postransactionId));
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

  const dateHandler = (date, dateString) => {
    console.log('date', date);
    console.log('dateString', dateString);
    dispatch(setFilterState({filterDate: date, date: dateString}));
  };
  const paidAtDateHandler = (date, dateString) => {
    dispatch(setFilterState({filterPaidAt: date, paidAt: dateString}));
  };
  const startDateHandler = (date, dateString) => {
    console.log('data start date filter', date);
    console.log('===dateString======', dateString);
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
        totalTransactions={allPostransaction.length}
        successTransaction={displayStatus.successful}
        failedTransaction={displayStatus.failed}
        pendingTransaction={displayStatus.pending}
        nullTransaction={displayStatus.nullStatus}
        refundedTransaction={displayStatus.unknown}
        successful={Math.round(
          (displayStatus.successful / allPostransaction.length) * 100,
        )}
        failed={Math.round(
          (displayStatus.failed / allPostransaction.length) * 100,
        )}
        pending={Math.round(
          (displayStatus.pending / allPostransaction.length) * 100,
        )}
        nullNumber={Math.round(
          (displayStatus.nullStatus / allPostransaction.length) * 100,
        )}
        init={Math.round(
          (displayStatus.unknown / allPostransaction.length) * 100,
        )}
      />
      <div className="relative flex items-center pr-4 justify-between mb-2">
        <div className="top-0 left-0 h-40px flex items-center">
          <NumberDropdown numberHandler={numberHandler} />
          {allPostransaction.length >= 1 && (
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
            dateHandler={dateHandler}
            paidAtDateHandler={paidAtDateHandler}
            disabledDate={disabledDate}
            handleFilterInput={handleFilterInput}
            filterSubmitHandler={filterSubmit}
            clearFilterHandler={clearFilter}
            data={filterState}>
            {/* <InputFilterField
              inputValue={filterState.amountPaid}
              inputName="amountPaid"
              handleInputField={handleInputField}
              placeholder="Amount Paid"
            /> */}
            <div className="border border-gray-400 rounded-md p-2 w-full mb-2 text-center">
              <div className="mb-2">Paid At:</div>
              <SingleDatePicker
                onChange={paidAtDateHandler}
                //disabledDate={disabledDate}
                date={moment(filterState.filterPaidAt, filterState.paidAt)}
              />
            </div>
            <InputFilterField
              inputValue={filterState.transactionId}
              inputName="transactionId"
              handleInputField={handleInputField}
              placeholder="Transaction Id"
            />
            <InputFilterField
              inputValue={filterState.terminalId}
              inputName="terminalId"
              handleInputField={handleInputField}
              placeholder="Terminal Id"
            />
            <InputFilterField
              inputValue={filterState.transactionReference}
              inputName="transactionReference"
              handleInputField={handleInputField}
              placeholder="Transaction Reference"
            />
            <div className="border border-gray-400 rounded-md p-2 w-full mb-2 text-center">
              <div className="mb-2">Date:</div>
              <SingleDatePicker
                onChange={dateHandler}
                //disabledDate={disabledDate}
                date={moment(filterState.filterDate, filterState.date)}
              />
            </div>
            <div className="flex justify-around">
              <SingleDatePicker
                onChange={startDateHandler}
                disabledDate={disabledDate}
                date={moment(
                  filterState.filterStartDate,
                  filterState.startDate,
                )}
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
          <PosTransactionDetails
            modalHandler={closeModal}
            data={singlePostransaction}
            fetchData={fetchData}
            buttonHandler={buttonHandler}
          />
        </Modal>
      )}

      <div className="display-table">
        <Table
          dataSource={allPostransaction}
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
export default POSTransactions;
