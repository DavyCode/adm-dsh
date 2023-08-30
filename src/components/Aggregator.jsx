/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {Redirect} from 'react-router-dom';
import {Table, Button, Input} from 'antd';
import {useSelector, useDispatch} from 'react-redux';
import NumberDropdown from './NumberDropdown.jsx';
import UserProfileOperation from './UserProfileOperation.jsx';
import Loading from './Loading.jsx';
import axios from 'axios';
import axiosData from '../utils/axiosData.js';
import styles from '../styles/style.less';
import {TablePagination} from './Services.jsx';
import searchDebounce from '../utils/debounce';
import {SingleDatePicker} from './Datepicker.jsx';
import Filter from './filter/Filter.jsx';
import InputFilterField from './filter/InputFilterField.jsx';
import {
  getAllUsers,
  setLoadingFalse,
  setLoadingTrue,
  setFetchNumber,
  displayUserDetails,
  setRole,
  setBankList,
} from '../actions/users.action.js';
import {
  setFilterFetchNumber,
  setFilterState,
} from '../actions/filter.action.js';
import DisplayCard from './DisplayCard.jsx';
import BVNVerifiedFilter from './filter/BVNVerifiedFilter.jsx';
import VerifiedUserFilter from './filter/VerifiedUserFilter.jsx';
import AgentApproval from './filter/AgentApproval.jsx';
import LockFilter from './filter/LockFilter.jsx';
import ActiveUserFilter from './filter/ActiveUserFilter.jsx';

const baseURL = process.env.REACT_APP_BASE_URL;
const url = `${baseURL}/rbq-admin/users`;
const getBanksUrl = `${baseURL}/services/banks`;

const columns = (clickHandler, getAllUsers, counter) => [
  {
    title: '#',
    key: 'userId',
    render: (text) => <span>{counter}</span>,
  },
  {
    title: 'Name',
    key: 'lastName',
    render: (text) => <span>{`${text.firstName} ${text.lastName}`}</span>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Phone Number',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: 'Action',
    key: '_id',
    render: (obj) => {
      return (
        <Button
          data-userid={obj.userId}
          className="user-table-button"
          type="primary"
          onClick={clickHandler}>
          edit
        </Button>
      );
    },
  },
];

const Aggregators = ({location}) => {
  const [current, setCurrent] = useState(1);
  const [filterCurrent, setFilterCurrent] = useState(1);
  const [counter, setCounter] = useState(1);
  const [successfulUpdate, setSuccessfulUpdate] = useState(false);
  const usersState = useSelector((state) => state.users);
  const storeFilter = useSelector((state) => state.filter);
  const displayStatus = useSelector((state) => state.wallet.displayStatus);
  const walletState = useSelector((state) => state.wallet);
  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const {allUsersTransactions} = walletState;
  const {
    allUsers,
    user,
    isLoading,
    fetchLimit,
    showUserDetails,
    totalDocumentCount,
    bankList,
  } = usersState;
  const {filterFetchLimit, filterStates: filterState} = storeFilter;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFilterState());
    return () => dispatch(setFilterState());
  }, []);

  const fetchData = async (controller) => {
    setSuccessfulUpdate(false);
    dispatch(setLoadingTrue());
    dispatch(setRole());
    try {
      const start =
        filter !== true
          ? (current - 1) * fetchLimit
          : (filterCurrent - 1) * filterFetchLimit;
      const {
        active,
        agentApproved,
        isBVN_verified,
        verified,
        search,
        endDate,
        startDate,
        lock,
        aggregatorId,
        email,
        phone,
      } = filterState;
      const params = {
        ...(isBVN_verified && {isBVN_verified}),
        ...(active && {active}),
        ...(verified && {verified}),
        ...(endDate && filter && {endDate}),
        ...(search && {search}),
        ...(startDate && filter && {startDate}),
        ...(lock && {lock}),
        ...(agentApproved && {agentApproved}),
        ...(email && {email}),
        ...(phone && {phone}),
        ...(aggregatorId && {aggregatorId}),
      };
      const filterUrl = `${url}?skip=${start}&limit=${filterFetchLimit}&role=superAgent`;
      const data = {
        url:
          filter !== true
            ? `${url}?skip=${start}&limit=${fetchLimit}&role=superAgent`
            : filterUrl,
        method: 'GET',
        signal: controller.token,
        params,
      };
      const dataTwo = {
        url: getBanksUrl,
        method: 'GET',
        signal: controller.token,
      };
      const [getUsers, getBanks] = await Promise.all([
        axiosData(data),
        axiosData(dataTwo),
      ]);
      dispatch(setLoadingFalse());
      dispatch(setBankList(getBanks.data));
      return dispatch(
        getAllUsers({
          data: getUsers.data,
          totalDocumentCount: getUsers.totalDocumentCount,
          startPage: start,
        }),
      );
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.log(error);
      dispatch(setLoadingFalse());
    }
  };
  useEffect(() => {
    setApplyFilter(false);
    const controller = axios.CancelToken.source();
    fetchData(controller);
    return () => {
      dispatch(displayUserDetails({showUserDetails: false, userId: ''}));
      return controller.cancel();
    };
  }, [
    dispatch,
    current,
    fetchLimit,
    successfulUpdate,
    applyFilter,
    filter,
    filterCurrent,
    filterFetchLimit,
    filterState.search,
  ]);
  // useEffect(() => {
  //   setApplyFilter(false);
  //   const controller = axios.CancelToken.source();
  //   const fetchData = async () => {
  //     setSuccessfulUpdate(false);
  //     dispatch(setLoadingTrue());
  //     dispatch(setRole());
  //     try {
  //       const start =
  //         filter !== true
  //           ? (current - 1) * fetchLimit
  //           : (filterCurrent - 1) * filterFetchLimit;
  //       const {
  //         active,
  //         agentApproved,
  //         isBVN_verified,
  //         verified,
  //         search,
  //         endDate,
  //         startDate,
  //         lock,
  //       } = filterState;
  //       const params = {
  //         ...(endDate && filter && { endDate }),
  //         ...(search && { search }),
  //         ...(startDate && filter && { startDate }),
  //         ...(active && { active }),
  //         ...(agentApproved && { agentApproved }),
  //         ...(isBVN_verified && { isBVN_verified }),
  //         ...(verified && { verified }),
  //         ...(lock && { lock }),
  //       };
  //       const filterUrl = `${url}?skip=${start}&limit=${filterFetchLimit}&role=superAgent`;
  //       const data = {
  //         url:
  //           filter !== true
  //             ? `${url}?skip=${start}&limit=${fetchLimit}&role=superAgent`
  //             : filterUrl,
  //         method: "GET",
  //         signal: controller.token,
  //         ...(filter && { params }),
  //       };
  //       const dataTwo = {
  //         url: getBanksUrl,
  //         method: "GET",
  //         signal: controller.token,
  //       };
  //       const [getUsers, getBanks] = await Promise.all([
  //         axiosData(data),
  //         axiosData(dataTwo),
  //       ]);
  //       dispatch(setLoadingFalse());
  //       dispatch(setBankList(getBanks.data));
  //       return dispatch(
  //         getAllUsers({
  //           data: getUsers.data,
  //           totalDocumentCount: getUsers.totalDocumentCount,
  //           startPage: start,
  //         }),
  //       );
  //     } catch (error) {
  //       if (axios.isCancel(error)) return;
  //       console.log(error);
  //       dispatch(setLoadingFalse());
  //     }
  //   };
  //   fetchData();
  //   return () => {
  //     dispatch(displayUserDetails({ showUserDetails: false, userId: "" }));
  //     return controller.cancel();
  //   };
  // }, [
  //   dispatch,
  //   current,
  //   fetchLimit,
  //   successfulUpdate,
  //   applyFilter,
  //   filter,
  //   filterCurrent,
  //   filterFetchLimit,
  //   filterState.search,
  // ]);

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
  const detailsHandler = (e) => {
    e.preventDefault();
    const userId = e.currentTarget.dataset.userid;
    return dispatch(displayUserDetails({showUserDetails: true, userId}));
  };
  const returnHandler = (bool) => {
    bool === true && setSuccessfulUpdate(bool);
    return dispatch(displayUserDetails());
  };

  const handleFilterInput = (value, option) => {
    const {name} = option.props;
    dispatch(setFilterState({[name]: value}));
  };
  const startDateHandler = (date, dateString) => {
    dispatch(
      setFilterState({
        filterStartDate: date,
        startDate: dateString,
      }),
    );
  };
  const endDateHandler = (date, dateString) => {
    dispatch(
      setFilterState({
        filterEndDate: date,
        endDate: dateString,
      }),
    );
  };
  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };
  const clearFilter = () => {
    dispatch(setFilterState());
    return setFilter(false);
  };
  const filterSubmit = () => {
    setApplyFilter(true);
    setFilter(true);
  };
  // const searchHandler = (e) => {
  //   e.persist();
  //   return searchDebounce(
  //     e.target.value,
  //     filterState,
  //     setFilterState,
  //     dispatch,
  //   );
  // };
  const handleInputField = (event) => {
    const {name, value} = event.target;
    dispatch(setFilterState({[name]: value}));
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
      {showUserDetails === true ? (
        <UserProfileOperation
          user={user}
          allBanks={bankList}
          returnHandler={returnHandler}
          fetchData={fetchData}
        />
      ) : (
        <React.Fragment>
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
          <h3 className="text-24px font-extrabold uppercase mb-4">
            People/Aggregators
          </h3>
          <div className="font-calibre text-17px mr-auto flex justify-between items-center relative mb-2"></div>
          <div className="relative flex items-center justify-between pr-4">
            <div className="top-0 left-0 h-40px flex items-center justify-between flex-3">
              <div className="flex justify-start items-center">
                {allUsers.length >= 1 && (
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
                  <InputFilterField
                    inputValue={filterState.email}
                    inputName="email"
                    handleInputField={handleInputField}
                    placeholder="Enter Email"
                  />
                  <InputFilterField
                    inputValue={filterState.aggregatorId}
                    inputName="aggregatorId"
                    handleInputField={handleInputField}
                    placeholder="Aggregator ID"
                  />
                  <InputFilterField
                    inputValue={filterState.phone}
                    inputName="phone"
                    handleInputField={handleInputField}
                    placeholder="Agent phone"
                  />
                  <VerifiedUserFilter
                    data={filterState}
                    handleFilterInput={handleFilterInput}
                  />
                  <ActiveUserFilter
                    data={filterState}
                    handleFilterInput={handleFilterInput}
                  />
                  <LockFilter
                    data={filterState}
                    handleFilterInput={handleFilterInput}
                  />
                  <BVNVerifiedFilter
                    data={filterState}
                    handleFilterInput={handleFilterInput}
                  />
                  <AgentApproval
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
              </div>
            </div>
          </div>
          {isLoading === true ? (
            <Loading />
          ) : (
            <div className="usersTable">
              <Table
                dataSource={allUsers}
                columns={columns(detailsHandler, allUsers, counter)}
                rowKey="userId"
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
      )}
    </div>
  );
};

export default Aggregators;
