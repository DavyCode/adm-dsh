import React, {useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import axiosData from '../../utils/axiosData.js';
import {Table, Button, Pagination, Input, message} from 'antd';
import NumberDropdown from '../NumberDropdown.jsx';
import Loading from '../Loading.jsx';
import DisplayCard from '../DisplayCard.jsx';
import searchDebounce from '../../utils/debounce';
import Filter from '../filter/Filter.jsx';
import InputFilterField from '../filter/InputFilterField.jsx';
import {SingleDatePicker} from '../Datepicker.jsx';
import {
  getAllTransactionOnPOS,
  getATransactionOnPOS,
  setFetchNumber,
  setFetchNumberPOSTranx,
} from '../../actions/pos.action';
import Modal from '../Modal.jsx';
import {
  setFilterFetchNumber,
  setFilterState,
} from '../../actions/filter.action.js';
import {useToasts} from 'react-toast-notifications';
import POSTransactionDetails from './posTransactionDetails.jsx';
import currencyFormat from '../../utils/currencyFomat.js';
const adminURL = process.env.REACT_APP_ADMIN_URL;
const url = `${adminURL}/transactions`;

const columns = ({clickHandler}) => [
  {
    title: '#',
    key: 'serialNumber',
    render: (text) => <span>{text.serialNumbers}</span>,
  },
  {
    title: 'Platform',
    key: 'platform',
    render: (text) => <span>{text.platform}</span>,
  },
  {
    title: 'Terminal Id',
    key: 'terminalId',
    render: (text) => (
      <span className=" w-full overflow-x-hidden message-body">
        {text.terminalId}
      </span>
    ),
  },
  {
    title: 'Category',
    key: 'serviceId',
    render: (text) => (
      <span className=" w-full overflow-x-hidden message-body">
        {text.serviceId}
      </span>
    ),
  },
  {
    title: 'Amount',
    key: 'amount',
    render: (text) => (
      <span className="max-w-50px overflow-x-hidden">
        {`${currencyFormat(text.amount || 0)}`}
      </span>
    ),
  },
  {
    title: 'Payment Method',
    key: 'paymentMethod',
    render: (text) => (
      <span className=" w-full overflow-x-hidden message-body">
        {text.paymentMethod}
      </span>
    ),
  },
  {
    title: 'Date',
    key: 'initiatedAt',
    render: (obj) => <span>{moment(obj.paidAt).format('lll')}</span>,
  },
  {
    title: 'Action',
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

const POSTransactions = ({location, filteredData}) => {
  const [showModal, setShowModal] = useState(false);
  const [filterCurrent, setFilterCurrent] = useState(1);
  const [successfulUpdate, setSuccessfulUpdate] = useState(false);
  const [current, setCurrent] = useState(1);
  const [counter, setCounter] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [viewLoading] = useState(false);
  const [totalDocumentCount, setTotalDocumentCount] = useState(0);
  const posState = useSelector((state) => state.allPos);
  const displayStatus = useSelector((state) => state.allPos.displayStatus);
  const storeFilter = useSelector((state) => state.filter);
  const {filterFetchLimit, filterStates: filterState} = storeFilter;
  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const {
    allTransactionOnAPOS,
    singleTransactionOnPOS,
    fetchLimitTRX,
  } = posState;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFilterState());
    return () => {
      setApplyFilter(false);
      dispatch(setFilterState());
    };
  }, []);

  const fetchData = async (controller) => {
    setSuccessfulUpdate(false);
    setIsLoading(() => true);
    try {
      const start =
        filter !== true
          ? (current - 1) * fetchLimitTRX
          : (filterCurrent - 1) * filterFetchLimit;
      const {
        // address,
        //name,
        //phone,
        // serialNumber,
        transactionId,
        transactionReference,
        //dailyPosTransactionAmount,
        paidAt,
        //dailyPosTransactionDate,
        // partner,
        // aggregatorUserId,
        // posTerminal_Id,
        // date,
        endDate,
        startDate,
      } = filterState;
      const params = {
        ...(endDate && filter && {endDate}),
        // ...(date && {date}),
        // ...(address && {address}),
        //...(name && {name}),
        // ...(phone && {phone}),
        //...(serialNumber && {serialNumber}),
        ...(transactionId && {transactionId}),
        ...(transactionReference && {transactionReference}),
        // ...(transactionLimit && {
        //   transactionLimit,
        // }),
        //  ...(dailyPosTransactionAmount && {dailyPosTransactionAmount}),
        ...(paidAt && {paidAt}),
        // ...(partner && {partner}),
        // ...(aggregatorUserId && {aggregatorUserId}),
        // ...(posTerminal_Id && {posTerminal_Id}),
        ...(startDate && filter && {startDate}),
      };
      const filterUrl = `${url}?skip=${start}&limit=${filterFetchLimit}&transactionType=POS&terminalId=${filteredData.terminalId}`;
      const data = {
        url:
          filter !== true
            ? `${url}?skip=${start}&limit=${fetchLimitTRX}&transactionType=POS&terminalId=${filteredData.terminalId}`
            : filterUrl,
        method: 'GET',
        ...(filter && {params}),
        signal: controller.token,
      };
      const posTransactionData = await axiosData(data);
      setTotalDocumentCount(
        posTransactionData ? posTransactionData.totalDocumentCount : 0,
      );

      const allData =
        posTransactionData &&
        posTransactionData.data.map((pos, index) => ({
          ...pos,
          serialNumbers: start + index + 1,
        }));

      dispatch(getAllTransactionOnPOS(allData));
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
    successfulUpdate,
    fetchLimitTRX,
    applyFilter,
    filter,
    filterCurrent,
    filterFetchLimit,
    filterState.search,
  ]);

  const closeModal = () => setShowModal(false);

  const buttonHandler = (id) => {
    return (event) => {
      if (id) return dispatch(getATransactionOnPOS(id));
      const posId = event?.currentTarget?.dataset.postransactionid;
      dispatch(getATransactionOnPOS(posId));
      setShowModal(true);
    };
  };
  const numberHandler = (value) => {
    if (filter) {
      setFilterCurrent(1);
      return dispatch(setFilterFetchNumber(value));
    }
    setCurrent(1);
    return dispatch(setFetchNumberPOSTranx(value));
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

  // const DateHandler = (date, dateString) => {
  //   dispatch(setFilterState({filterDate: date, date: dateString}));
  // };

  const postTrnxDateHandler = (date, dateString) => {
    dispatch(
      setFilterState({
        filterPaidAtDate: date,
        paidAt: dateString,
      }),
    );
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
      // style={{ overflow: showModal === true && "hidden" }}
    >
      {!localStorage.getItem('token') && (
        <Redirect
          to={{
            pathname: '/',
            state: {from: location},
          }}
        />
      )}

      <>
        <DisplayCard
          totalTransactions={allTransactionOnAPOS.length}
          successTransaction={displayStatus.successful}
          failedTransaction={displayStatus.failed}
          pendingTransaction={displayStatus.pending}
          nullTransaction={displayStatus.nullStatus}
          refundedTransaction={displayStatus.unknown}
          successful={Math.round(
            (displayStatus.successful / allTransactionOnAPOS.length) * 100,
          )}
          failed={Math.round(
            (displayStatus.failed / allTransactionOnAPOS.length) * 100,
          )}
          pending={Math.round(
            (displayStatus.pending / allTransactionOnAPOS.length) * 100,
          )}
          nullNumber={Math.round(
            (displayStatus.nullStatus / allTransactionOnAPOS.length) * 100,
          )}
          init={Math.round(
            (displayStatus.unknown / allTransactionOnAPOS.length) * 100,
          )}
        />
        <div className="relative flex items-center pr-4 justify-between mb-2">
          <div className="top-0 left-0 h-40px flex items-center">
            <NumberDropdown numberHandler={numberHandler} />
            {allTransactionOnAPOS.length >= 1 && (
              <div className="flex justify-start items-center mr-43px p-2">
                <span>
                  Showing {counter}-
                  {totalDocumentCount >
                  (filter !== true ? current : filterCurrent) *
                    (filter === true ? filterFetchLimit : fetchLimitTRX)
                    ? (filter !== true ? current : filterCurrent) *
                      (filter === true ? filterFetchLimit : fetchLimitTRX)
                    : totalDocumentCount}
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
                inputValue={filterState.address}
                inputName="address"
                handleInputField={handleInputField}
                placeholder="Address"
              /> */}
              {/* <InputFilterField
                inputValue={filterState.name}
                inputName="name"
                handleInputField={handleInputField}
                placeholder="Name"
              /> */}
              {/* <InputFilterField
                inputValue={filterState.phone}
                inputName="phone"
                handleInputField={handleInputField}
                placeholder="Phone"
              /> */}
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
                placeholder="Transaction Id"
              />
              {/* <InputFilterField
                inputValue={filterState.transactionLimit}
                inputName="transactionLimit"
                handleInputField={handleInputField}
                placeholder="Transaction Limit"
              /> */}
              {/* <InputFilterField
                inputValue={filterState.dailyPosTransactionAmount}
                inputName="dailyPosTransactionAmount"
                handleInputField={handleInputField}
                placeholder="Daily Pos Transaction Amount"
              /> */}
              <div className="border border-gray-400 rounded-md p-2 w-full mb-2 text-center">
                <div className="mb-2">Transaction Date</div>
                <SingleDatePicker
                  onChange={postTrnxDateHandler}
                  disabledDate={disabledDate}
                  date={moment(
                    filterState.filterPaidAtDate,
                    filterState.paidAt,
                  )}
                />
              </div>
              {/* <InputFilterField
                inputValue={filterState.partner}
                inputName="partner"
                handleInputField={handleInputField}
                placeholder="Partner"
              /> */}
              {/* <InputFilterField
                inputValue={filterState.aggregatorUserId}
                inputName="aggregatorUserId"
                handleInputField={handleInputField}
                placeholder="Aggregator User Id"
              /> */}
              {/* <InputFilterField
                inputValue={filterState.posTerminal_Id}
                inputName="posTerminal_Id"
                handleInputField={handleInputField}
                placeholder="Pos Terminal _Id"
              /> */}

              {/* <div className="border border-gray-400 rounded-md p-2 w-full mb-2 text-center">
                <div className="mb-2">Date:</div>
                <SingleDatePicker
                  onChange={DateHandler}
                  disabledDate={disabledDate}
                  date={moment(filterState.filterDate, filterState.date)}
                />
              </div> */}
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
                  date={moment(filterState.filterEndDate, filterState.endDate)}
                />
              </div>
            </Filter>
            <Input onChange={searchHandler} placeholder="input search text" />
          </div>
        </div>
        {showModal === true && (
          <Modal>
            <POSTransactionDetails
              modalHandler={closeModal}
              data={singleTransactionOnPOS}
              fetchData={fetchData}
              buttonHandler={buttonHandler}
            />
          </Modal>
        )}
        <div className="display-table">
          <Table
            dataSource={allTransactionOnAPOS}
            columns={columns({
              clickHandler: buttonHandler,
              //  deletePop,
              //    confirmDelete,
              viewLoading,
            })}
            rowKey="_id"
            pagination={false}
          />

          <TablePagination
            pageSize={filter === true ? filterFetchLimit : fetchLimitTRX}
            total={totalDocumentCount}
            onChange={changeHandler}
            current={filter === true ? filterCurrent : current}
            itemRender={itemRender}
          />
        </div>
      </>
      {isLoading && <Loading />}
    </div>
  );
};

export default POSTransactions;
