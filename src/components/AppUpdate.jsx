/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import axios from "axios";
import axiosData from "../utils/axiosData.js";
import { Table, Button, Pagination, Input } from "antd";
import Modal from "./Modal.jsx";
import NumberDropdown from "./NumberDropdown.jsx";
import styles from "../styles/style.less";
import Loading from "./Loading.jsx";
import DisplayCard from "./DisplayCard.jsx";
import searchDebounce from "../utils/debounce";
import Filter from "./filter/Filter.jsx";
import InputFilterField from "./filter/InputFilterField.jsx";
import DropdownFilter from "./filter/DropdownFilter.jsx";
import { SingleDatePicker } from "./Datepicker.jsx";

import {
  getAllAppUpdates,
  setFetchNumber,
  getAnUpdate,
} from "../actions/appupdate.action";
import {
  setFilterFetchNumber,
  setFilterState,
} from "../actions/filter.action.js";
import UpdateDetails from "./profile/UpdateDetails.js";
import PopoverComponent from "./Popover.js";
import appType from "../common/StateData/appType.json"
import appPlatform  from "../common/StateData/appPlatform.json"
const adminURL = process.env.REACT_APP_ADMIN_URL;
//const baseURL = process.env.REACT_APP_BASE_URL;
const url = `${adminURL}/appVersion`;
//const enumsUrl = `${baseURL}/appVersion/enum`;

const columns = ({
  updateHandler,
  clickHandler,
  handleFilterInput,
  platformType,
  versionId,
  versionNumber,
  handleInputField,
  releaseDateHandler,
  disabledDate,
  releaseDate,
  releaseAt,
  appTypeArr,
  appType,
  redirectUrl,
}) => [
  {
    title: "#",
    key: "serialNumber",
    render: (text) => <span>{text.serialNumber}</span>,
  },
  {
    title: "App Type",
    key: "appType",
    render: (text) => <span>{text.appType}</span>,
  },
  {
    title: "Viewing Allowed",
    key: "viewingAllowed",
    render: (text) => (
      <span className=" w-full overflow-x-hidden message-body">
        {text?.viewingAllowed ? "YES" : "NO"}
      </span>
    ),
  },
  {
    title: "Platform Type",
    dataIndex: "platformType",
    key: "platformType",
  },
  {
    title: "Redirect Url",
    key: "redirectUrl",
    render: (text) => (
      <span className="max-w-50px overflow-x-hidden">{text.redirectUrl}</span>
    ),
  },
  {
    title: "Version ID",
    key: "versionId",
    render: (obj) => <span>{obj.versionId}</span>,
  },
  {
    title: "Version Number",
    key: "versionNumber",
    render: (obj) => <span>{obj.versionNumber}</span>,
  },
  {
    title: "Release Date",
    key: "releaseDate",
    render: (obj) => <span>{moment(obj.releaseDate).format("lll")}</span>,
  },
  {
    title: "",
    key: "button",
    render: (obj) => (
      <div className="flex justify-center items-center">
        <PopoverComponent
          buttonText="update"
          headerText="Update App Version"
          placement="top"
          submitHandler={updateHandler}
          dataId={obj._id}
        >
          <DropdownFilter
            paymentMethods={appTypeArr}
            handleFilterInput={handleFilterInput}
            defaultText="Select App Type"
            inputValue={appType}
            dropdownName="appType"
          />
          <DropdownFilter
            paymentMethods={appPlatform}
            handleFilterInput={handleFilterInput}
            defaultText="Select a Platform"
            inputValue={platformType}
            dropdownName="platformType"
          />
          <InputFilterField
            inputValue={versionId}
            inputName="versionId"
            handleInputField={handleInputField}
            placeholder="Version ID"
          />
          <InputFilterField
            inputValue={versionNumber}
            inputName="versionNumber"
            handleInputField={handleInputField}
            placeholder="Version Number"
          />
          <InputFilterField
            inputValue={redirectUrl}
            inputName="redirectUrl"
            handleInputField={handleInputField}
            placeholder="Redirect Url"
          />
          <div className="border border-gray-400 rounded-md p-2 w-full mb-2 text-center">
            <div className="mb-2">Release Date:</div>
            <SingleDatePicker
              onChange={releaseDateHandler}
              disabledDate={disabledDate}
              date={moment(releaseDate, releaseAt)}
            />
          </div>
        </PopoverComponent>
        <Button
          data-appid={obj._id}
          type="primary"
          onClick={clickHandler}
          className="wallet-table-button"
        >
          view
        </Button>
      </div>
    ),
  },
];

const TablePagination = ({ total, onChange, current, pageSize }) => (
  <Pagination
    total={total}
    onChange={onChange}
    current={current}
    pageSize={pageSize}
    showSizeChanger={false}
  />
);
const Messages = ({ location }) => {
  const [showModal, setShowModal] = useState(false);
  const [filterCurrent, setFilterCurrent] = useState(1);
  const [current, setCurrent] = useState(1);
  const [counter, setCounter] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalDocumentCount, setTotalDocumentCount] = useState(0);
  const appUpdateState = useSelector((state) => state.appUpdate);
  const displayStatus = useSelector((state) => state.wallet.displayStatus);
  const storeFilter = useSelector((state) => state.filter);
  const { filterFetchLimit, filterStates: filterState } = storeFilter;
  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
 // const [apptype, setApptype] = useState([]);
 // const [appPlatform, setAppPlatform] = useState([]);
  const { allUpdates, singleUpdate, fetchLimit } = appUpdateState;
  const dispatch = useDispatch();

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
        platformType,
        appType,
        releaseDate,
        releaseAt,
        versionId,
        versionNumber,
        search,
      } = filterState;
      const params = {
        ...(releaseAt && filter && { releaseAt }),
        ...(search && { search }),
        ...(platformType && { platformType }),
        ...(appType && { appType }),
        ...(versionId && { versionId }),
        ...(versionNumber && { versionNumber }),
        ...(platformType && { platformType }),
      };
      const filterUrl = `${url}?skip=${start}&limit=${filterFetchLimit}`;
      const data = {
        url:
          filter !== true
            ? `${url}?skip=${start}&limit=${fetchLimit}`
            : filterUrl,
        method: "GET",
        ...(filter && { params }),
        signal: controller.token,
      };
      // const dataTwo = {
      //   url: enumsUrl,
      //   method: "GET",
      //   signal: controller.token,
      // };
      const [updateData,
       // enumList
      ] = await Promise.all([
        axiosData(data),
       // axiosData(dataTwo),
      ]);

   //   setAppPlatform(() => enumList?.data?.appPlatforms);
    //  setApptype(() => enumList?.data?.appType);
      setTotalDocumentCount(updateData ? updateData.totalDocumentCount : 0);
      const allData =
        updateData &&
        updateData.data.map((transaction, index) => ({
          ...transaction,
          serialNumber: start + index + 1,
        }));
      dispatch(getAllAppUpdates(allData));
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
  const buttonHandler = (event) => {
    const appId = event?.currentTarget?.dataset?.appid;
    dispatch(getAnUpdate(appId));
    return setShowModal(true);
  };
  const updateHandler = (event) => {
    const appId = event?.currentTarget?.dataset?.appid;
    console.log("appId :>> ", appId);
    // dispatch(getAnUpdate(appId));
    // return setShowModal(true);
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
    if (type === "prev") return <a>Previous</a>;
    if (type === "next") return <a>Next</a>;
    return originalElement;
  };
  const disabledDate = (current) => {
    return current && current > moment().endOf("day");
  };

  const handleFilterInput = (value, option) => {
    const { name } = option.props;
    dispatch(setFilterState({ [name]: value }));
  };
  const releaseDateHandler = (date, dateString) => {
    dispatch(setFilterState({ releaseDate: date, releaseAt: dateString }));
  };
  const startDateHandler = (date, dateString) => {
    dispatch(setFilterState({ filterStartDate: date, startDate: dateString }));
  };
  const endDateHandler = (date, dateString) => {
    dispatch(setFilterState({ filterEndDate: date, endDate: dateString }));
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
    const { name, value } = event.target;
    dispatch(setFilterState({ [name]: value }));
  };

  return (
    <div
      className="walletContainer"
      style={{ overflow: showModal === true && "hidden" }}
    >
      {!localStorage.getItem("token") && (
        <Redirect
          to={{
            pathname: "/",
            state: { from: location },
          }}
        />
      )}
      <DisplayCard
        totalTransactions={allUpdates.length}
        successTransaction={displayStatus.successful}
        failedTransaction={displayStatus.failed}
        pendingTransaction={displayStatus.pending}
        nullTransaction={displayStatus.nullStatus}
        refundedTransaction={displayStatus.unknown}
        successful={Math.round(
          (displayStatus.successful / allUpdates.length) * 100,
        )}
        failed={Math.round((displayStatus.failed / allUpdates.length) * 100)}
        pending={Math.round((displayStatus.pending / allUpdates.length) * 100)}
        nullNumber={Math.round(
          (displayStatus.nullStatus / allUpdates.length) * 100,
        )}
        init={Math.round((displayStatus.unknown / allUpdates.length) * 100)}
      />
      <div className="relative flex items-center pr-4 justify-between mb-2">
        <div className="top-0 left-0 h-40px flex items-center">
          <NumberDropdown numberHandler={numberHandler} />
          {allUpdates.length >= 1 && (
            <div className="flex justify-start items-center mr-43px p-2">
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
        </div>
        <div className="flex">
          <PopoverComponent
            headerText="Create New App Version"
            buttonText="Create App Version"
            fetchData={fetchData}
          >
            <DropdownFilter
              paymentMethods={appType}
              handleFilterInput={handleFilterInput}
              defaultText="Select App Type"
              inputValue={filterState.appType}
              dropdownName="appType"
            />
            <DropdownFilter
              paymentMethods={appPlatform}
              handleFilterInput={handleFilterInput}
              defaultText="Select a Platform"
              inputValue={filterState.platformType}
              dropdownName="platformType"
            />
            <InputFilterField
              inputValue={filterState.versionId}
              inputName="versionId"
              handleInputField={handleInputField}
              placeholder="Version ID"
            />
            <InputFilterField
              inputValue={filterState.versionNumber}
              inputName="versionNumber"
              handleInputField={handleInputField}
              placeholder="Version Number"
            />
            <InputFilterField
              inputValue={filterState.redirectUrl}
              inputName="redirectUrl"
              handleInputField={handleInputField}
              placeholder="Redirect Url"
            />
            <div className="border border-gray-400 rounded-md p-2 w-full mb-2 text-center">
              <div className="mb-2">Release Date:</div>
              <SingleDatePicker
                onChange={releaseDateHandler}
                disabledDate={disabledDate}
                date={moment(filterState.releaseDate, filterState.releaseAt)}
              />
            </div>
          </PopoverComponent>
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
              inputValue={filterState.versionNumber}
              inputName="versionNumber"
              handleInputField={handleInputField}
              placeholder="Enter Version Number"
            />
            <InputFilterField
              inputValue={filterState.versionId}
              inputName="versionId"
              handleInputField={handleInputField}
              placeholder="Version ID"
            />
            <DropdownFilter
              paymentMethods={appType}
              handleFilterInput={handleFilterInput}
              defaultText="Select an App Type"
              inputValue={filterState.appType}
              dropdownName="appType"
            />
            <DropdownFilter
              paymentMethods={appPlatform}
              handleFilterInput={handleFilterInput}
              defaultText="Select a Platform"
              inputValue={filterState.platformType}
              dropdownName="platformType"
            />
            <div className="border border-gray-400 rounded-md p-2 w-full mb-2 text-center">
              <div className="mb-2">Release Date:</div>
              <SingleDatePicker
                onChange={releaseDateHandler}
                disabledDate={disabledDate}
                date={moment(filterState.releaseDate, filterState.releaseAt)}
              />
            </div>
          </Filter>
          <Input onChange={searchHandler} placeholder="input search text" />
        </div>
      </div>
      <div className="relative flex items-center pr-4 justify-between mb-2"></div>
      {showModal === true && (
        <Modal>
          <UpdateDetails modalHandler={closeModal} data={singleUpdate} />
        </Modal>
      )}

      <div className="display-table">
        <Table
          dataSource={allUpdates}
          columns={columns({
            clickHandler: buttonHandler,
            updateHandler,
            handleFilterInput,
            platformType: filterState.platformType,
            handleInputField,
            releaseDateHandler,
            disabledDate,
            releaseDate: filterState.releaseDate,
            releaseAt: filterState.releaseAt,
            appTypeArr: appType,
            appType: filterState.appType,
            versionNumber: filterState.versionNumber,
            versionId: filterState.versionId,
            redirectUrl: filterState.redirectUrl,
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

export default Messages;
