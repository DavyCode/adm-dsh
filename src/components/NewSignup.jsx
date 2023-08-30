/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Redirect } from "react-router-dom";
import { Table, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import NumberDropdown from "./NumberDropdown.jsx";
import UserProfileOperation from "./UserProfileOperation.jsx";
import Loading from "./Loading.jsx";
import axiosData from "../utils/axiosData.js";
import styles from "../styles/style.less";
import { TablePagination } from "./Services.jsx";
import DisplayCard from "./DisplayCard.jsx";

import InputFilterField from "./filter/InputFilterField.jsx";

import { SingleDatePicker } from "./Datepicker.jsx";
import {
  getAllUsers,
  setLoadingFalse,
  setLoadingTrue,
  setFetchNumber,
  displayUserDetails,
  setRole,
  setBankList,
} from "../actions/users.action.js";
import {
  setFilterFetchNumber,
  setFilterState,
} from "../actions/filter.action.js";
import Filter from "./filter/Filter.jsx";

const baseURL = process.env.REACT_APP_BASE_URL;
const url = `${baseURL}/rbq-admin/user/newSignups`;
const getBanksUrl = `${baseURL}/services/banks`;

const columns = (sendOtpHandler, updateOtpHandler, getAllUsers) => [
  {
    title: "#",
    key: "_id",
    render: (text) => {
      const index = getAllUsers.findIndex((data) => data._id === text._id);
      return <span>{index + 1}</span>;
    },
  },
  {
    title: "Phone Number",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "COUNT",
    key: "otpRequestCount",
    dataIndex: "otpRequestCount",
  },
  {
    title: "Verified",
    key: "verified",
    render: (text) => <span>{text.verified ? "YES" : "NO"}</span>,
  },
  {
    title: "otp",
    key: "verifyPhoneOtp",
    render: (text) => <span>{text.verifyPhoneOtp}</span>,
  },
  {
    title: "expiry",
    key: "verifyPhoneOtp",
    render: (text) => (
      <span>{moment(text.verifyPhoneOtpTimer).format("lll")}</span>
    ),
  },
  {
    title: "created",
    key: "created",
    render: (text) => <span>{moment(text.meta.createdAt).format("lll")}</span>,
  },
  {
    title: "updated",
    key: "updated",
    render: (text) => <span>{moment(text.meta.updatedAt).format("lll")}</span>,
  },
  {
    title: "Action",
    key: "_id",
    render: (obj) => {
      return (
        <div className="flex justify-around items-center">
          <Button
            data-userid={obj._id}
            className="user-table-button mr-2"
            type="primary"
            onClick={sendOtpHandler}
          >
            SEND OTP
          </Button>
          <Button
            data-userid={obj._id}
            style={{ border: "none", outline: "none" }}
            ghost
            onClick={updateOtpHandler}
          >
            UPDATE OTP
          </Button>
        </div>
      );
    },
  },
];

const NewSignup = ({ location }) => {
  const [current, setCurrent] = useState(1);
  const [filterCurrent, setFilterCurrent] = useState(1);
  const [counter, setCounter] = useState(1);
  const [newRole] = useState("");
  const [successfulUpdate, setSuccessfulUpdate] = useState(false);
  const usersState = useSelector((state) => state.users);
  const storeFilter = useSelector((state) => state.filter);
  const displayStatus = useSelector((state) => state.wallet.displayStatus);
  const walletState = useSelector((state) => state.wallet);
  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const { allUsersTransactions } = walletState;
  const {
    allUsers,
    user,
    isLoading,
    fetchLimit,
    showUserDetails,
    totalDocumentCount,
    bankList,
  } = usersState;
  const { filterFetchLimit, filterStates: filterState } = storeFilter;

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
      dispatch(setLoadingTrue());
      dispatch(setRole());
      try {
        const start =
          filter !== true
            ? (current - 1) * fetchLimit
            : (filterCurrent - 1) * filterFetchLimit;
        const { endDate, search, startDate, phone } = filterState;
        const params = {
          ...(endDate && filter && { endDate }),
          ...(search && { search }),
          ...(phone && { phone }),
          ...(startDate && filter && { startDate }),
        };
        const filterUrl = `${url}?skip=${start}&limit=${filterFetchLimit}`;
        const data = {
          url:
            filter !== true
              ? `${url}?skip=${start}&limit=${fetchLimit}`
              : filterUrl,
          method: "GET",
          signal: controller.token,
          ...(filter && { params }),
        };
        const dataTwo = {
          url: getBanksUrl,
          method: "GET",
          signal: controller.token,
        };
        const [getUsers, getBanks] = await Promise.all([
          axiosData(data),
          axiosData(dataTwo),
        ]);
        dispatch(setLoadingFalse());
        dispatch(setBankList(getBanks.data));
        dispatch(
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
    fetchData();
    return () => {
      dispatch(displayUserDetails({ showUserDetails: false, userId: "" }));
      return controller.cancel();
    };
  }, [
    dispatch,
    current,
    fetchLimit,
    successfulUpdate,
    newRole,
    applyFilter,
    filter,
    filterCurrent,
    filterFetchLimit,
    filterState.search,
  ]);

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
    if (type === "prev") return <a>Previous</a>;
    if (type === "next") return <a>Next</a>;
    return originalElement;
  };
  const returnHandler = (bool) => {
    bool === true && setSuccessfulUpdate(bool);
    return dispatch(displayUserDetails());
  };
  const handleFilterInput = (value, option) => {
    const { name } = option.props;
    dispatch(setFilterState({ [name]: value }));
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
    return current && current > moment().endOf("day");
  };
  const clearFilter = () => {
    dispatch(setFilterState());
    return setFilter(false);
  };
  const filterSubmit = () => {
    setApplyFilter(true);
    setFilter(true);
  };

  const handleInputField = (event) => {
    const { name, value } = event.target;
    dispatch(setFilterState({ [name]: value }));
  };

  const sendOtpHandler = () => {};
  const updateOtpHandler = () => {};

  return (
    <div className="usersContainer">
      {!localStorage.getItem("token") && (
        <Redirect
          to={{
            pathname: "/",
            state: { from: location },
          }}
        />
      )}
      {showUserDetails === true ? (
        <UserProfileOperation
          user={user}
          allBanks={bankList}
          returnHandler={returnHandler}
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
          <h3 className="text-24px font-extrabold uppercase mb-4 sticky top-0">
            People/New Signups
          </h3>
          <div className="font-calibre text-17px mr-auto flex justify-between items-center relative mb-2"></div>
          <div className="relative flex items-center justify-between pr-4">
            <div className="top-0 left-0 h-40px flex items-center justify-between flex-3">
              <div className="flex justify-start items-center">
                {allUsers.length >= 1 && (
                  <div className="flex justify-start items-center mr-10px p-2">
                    <span>
                      Showing {counter}-
                      {totalDocumentCount >
                      (filter !== true ? current : filterCurrent) *
                        (filter === true ? filterFetchLimit : fetchLimit)
                        ? (filter !== true ? current : filterCurrent) *
                          (filter === true ? filterFetchLimit : fetchLimit)
                        : totalDocumentCount}{" "}
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
                  data={filterState}
                >
                  <InputFilterField
                    inputValue={filterState.phone}
                    inputName="phone"
                    handleInputField={handleInputField}
                    placeholder="Enter Mobile Number"
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
                columns={columns(sendOtpHandler, updateOtpHandler, allUsers)}
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
      )}
    </div>
  );
};

export default NewSignup;
