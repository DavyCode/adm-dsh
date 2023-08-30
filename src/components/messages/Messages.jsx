/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import axios from "axios";
import axiosData from "../../utils/axiosData.js";
import {
  Switch,
  Table,
  Button,
  Pagination,
  Input,
  Popconfirm,
  message,
} from "antd";
import Modal from "../Modal.jsx";
import NumberDropdown from "../NumberDropdown.jsx";
import styles from "../../styles/style.less";
import Loading from "../Loading.jsx";
import DisplayCard from "../DisplayCard.jsx";
import searchDebounce from "../../utils/debounce";
import Filter from "../filter/Filter.jsx";
import InputFilterField from "../filter/InputFilterField.jsx";
import DropdownFilter from "../filter/DropdownFilter.jsx";
import BooleanFilter from "../filter/BooleanFilter.jsx";
import { SingleDatePicker } from "../Datepicker.jsx";
import {
  CloseOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import {
  setFetchNumber,
  getAllMessages,
  getAMessage,
  deleteAMessage,
  updateAMessage,
} from "../../actions/messages.action";
import {
  setFilterFetchNumber,
  setFilterState,
} from "../../actions/filter.action.js";
import MessageDetails from "./MessageDetails.js";
import NewMessage from "./NewMessage.jsx";
import { useToasts } from "react-toast-notifications";
import messageTypes from "../../common/StateData/messageType.json"
import appPlatfrom from "../../common/StateData/appPlatform.json"
import messageFocus from "../../common/StateData/messageFocus.json"
import appType from "../../common/StateData/appType.json"
const adminURL = process.env.REACT_APP_ADMIN_URL;
//const baseURL = process.env.REACT_APP_BASE_URL;
const url = `${adminURL}/messages`;
const urlViewing = `${adminURL}/messages/viewing/approve`;
//const urlTwo = `${baseURL}/services/paymentMethods`;
//const urlThree = `${baseURL}/services/platforms`;

const columns = ({
  clickHandler,
  deletePop,
  confirmDelete,
  updateViewingHandler,
  viewLoading,
}) => [
  {
    title: "#",
    key: "serialNumber",
    render: (text) => <span>{text.serialNumber}</span>,
  },
  {
    title: "Title",
    key: "messageTitle",
    render: (text) => <span>{text.messageTitle}</span>,
  },
  {
    title: "Message Body",
    key: "messageBody",
    render: (text) => (
      <span className=" w-full overflow-x-hidden message-body">
        {text.messageBody}
      </span>
    ),
  },
  {
    title: "Type",
    dataIndex: "messageType",
    key: "messageType",
  },
  {
    title: "Read Status",
    key: "isRead",
    render: (text) => (
      <span className="max-w-50px overflow-x-hidden">
        {text.isRead ? "Read" : "Unread"}
      </span>
    ),
  },
  {
    title: "Platform",
    key: "platformType",
    dataIndex: "platformType",
  },
  {
    title: "Approved For Viewing",
    key: "approveForViewing",
    render: (text) => (
      <Switch
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
        checked={text.approveForViewing}
        loading={viewLoading}
        onClick={updateViewingHandler}
        data-messageid={text._id}
      />
    ),
  },
  {
    title: "Date",
    key: "initiatedAt",
    render: (obj) => <span>{moment(obj.meta.createdAt).format("lll")}</span>,
  },
  {
    title: "",
    key: "button",
    render: (obj) => {
      const cancel = (e) => {
        message.error("Cancelled");
      };
      return (
        <div className="flex justify-center items-center">
          <Popconfirm
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            title={<span className="ml-4">Are you Sure?</span>}
            onConfirm={confirmDelete}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <a
              data-messageid={obj._id}
              href="#"
              className="flex justify-center items-center mr-2"
              onClick={deletePop}
            >
              Delete
            </a>
          </Popconfirm>
          <Button
            data-messageid={obj._id}
            type="primary"
            onClick={(e) => clickHandler()(e)}
            className="wallet-table-button"
          >
            view
          </Button>
        </div>
      );
    },
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
  const { addToast } = useToasts();

  const [showModal, setShowModal] = useState(false);
  const [filterCurrent, setFilterCurrent] = useState(1);
  const [current, setCurrent] = useState(1);
  const [counter, setCounter] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [totalDocumentCount, setTotalDocumentCount] = useState(0);
  const messageState = useSelector((state) => state.messages);
  const displayStatus = useSelector((state) => state.wallet.displayStatus);
  const storeFilter = useSelector((state) => state.filter);
  const { filterFetchLimit, filterStates: filterState } = storeFilter;
  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const [deleteMessageId, setDeleteMessageId] = useState("");
  const { allMessages, singleMessage, fetchLimit } = messageState;
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
        messageReadOnWhichDevice,
        isRead,
        platformType,
        isReadAt,
        messageToken,
        messageType,
        messageCategory,
        messageBelongsTo,
        messageTitle,
        search,
        endDate,
        startDate,
      } = filterState;
      const params = {
        ...(endDate && filter && { endDate }),
        ...(search && { search }),
        ...(messageReadOnWhichDevice && { messageReadOnWhichDevice }),
        ...(isRead && { isRead }),
        ...(platformType && { platformType }),
        ...(isReadAt && { isReadAt }),
        ...(messageToken && { messageToken }),
        ...(messageType && {
          messageType,
        }),
        ...(messageTitle && { messageTitle }),
        ...(messageCategory && { messageCategory }),
        ...(messageBelongsTo && { messageBelongsTo }),
        ...(startDate && filter && { startDate }),
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
      const messagesData = await axiosData(data);
      setTotalDocumentCount(messagesData ? messagesData.totalDocumentCount : 0);
      const allData =
        messagesData &&
        messagesData.data.map((transaction, index) => ({
          ...transaction,
          serialNumber: start + index + 1,
        }));
      dispatch(getAllMessages(allData));
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
    console.log("=====id messages==", id);
    return (event) => {
      if (id) return dispatch(getAMessage(id));
      const messageId = event?.currentTarget?.dataset?.messageid;
      dispatch(getAMessage(messageId));
      return setShowModal(true);
    };
  };

  const updateViewingHandler = async (checked, event) => {
    setViewLoading(() => true);
    const controller = axios.CancelToken.source();
    try {
      const messageId = event.currentTarget.dataset.messageid;
      const data = {
        method: "PUT",
        url: urlViewing,
        body: { messageId },
      };
      const updateView = await axiosData(data);
      if (updateView.status === "success") {
        await fetchData(controller);
        addToast(updateView.message, {
          appearance: "success",
          autoDismiss: true,
        });
        setIsLoading(false);
        setViewLoading(false);
        dispatch(updateAMessage(updateView.data));
        dispatch(deleteAMessage(deleteMessageId));
      } else {
        if (updateView.response) {
          addToast(updateView.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
          // setViewLoading(false);
          //dispatch(updateAMessage(updateView.data));
        } else {
          addToast(updateView.message, {
            appearance: "error",
            autoDismiss: true,
          });
          // setViewLoading(false);
          // dispatch(updateAMessage(updateView.data));
        }
      }
      // setIsLoading(false);
      setViewLoading(false);
      // dispatch(updateAMessage(updateView.data));
      // dispatch(deleteAMessage(deleteMessageId));
      //dispatch(updateAMessage(updateView.data));
    } catch (error) {}
  };

  const confirmDelete = async (e) => {
    setIsLoading(() => true);
    const controller = axios.CancelToken.source();
    try {
      const data = {
        url,
        method: "DELETE",
        body: { messageId: deleteMessageId },
      };
      const messageData = await axiosData(data);
      if (messageData.status === "success") {
        await fetchData(controller);
        addToast(messageData.message, {
          appearance: "success",
          autoDismiss: true,
        });
        return setIsLoading(false);

        //dispatch(deleteAMessage(deleteMessageId));
      } else {
        if (messageData.response) {
          addToast(messageData.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
        } else {
          addToast(messageData.message, {
            appearance: "error",
            autoDismiss: true,
          });
        }
      }
      return setIsLoading(false);
    } catch (error) {}
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
  const messageDateHandler = (date, dateString) => {
    dispatch(
      setFilterState({ filterMessageReadDate: date, isReadAt: dateString })
    );
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

  const deletePop = (e) => {
    setDeleteMessageId(e.target.dataset.messageid);
  };

  const searchHandler = (e) => {
    e.persist();
    return searchDebounce(
      e.target.value,
      filterState,
      setFilterState,
      dispatch
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
        totalTransactions={allMessages.length}
        successTransaction={displayStatus.successful}
        failedTransaction={displayStatus.failed}
        pendingTransaction={displayStatus.pending}
        nullTransaction={displayStatus.nullStatus}
        refundedTransaction={displayStatus.unknown}
        successful={Math.round(
          (displayStatus.successful / allMessages.length) * 100
        )}
        failed={Math.round((displayStatus.failed / allMessages.length) * 100)}
        pending={Math.round((displayStatus.pending / allMessages.length) * 100)}
        nullNumber={Math.round(
          (displayStatus.nullStatus / allMessages.length) * 100
        )}
        init={Math.round((displayStatus.unknown / allMessages.length) * 100)}
      />
      <div className="relative flex items-center pr-4 justify-between mb-2">
        <div className="top-0 left-0 h-40px flex items-center">
          <NumberDropdown numberHandler={numberHandler} />
          {allMessages.length >= 1 && (
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
          <NewMessage
            headerText="Broadcast Message"
            buttonText="Broadcast Message"
            fetchData={fetchData}
          >
            <DropdownFilter
              paymentMethods={messageTypes}
              handleFilterInput={handleFilterInput}
              defaultText="Select Message Type"
              inputValue={filterState.messageType}
              dropdownName="messageType"
            />
            <DropdownFilter
              paymentMethods={appPlatfrom}
              handleFilterInput={handleFilterInput}
              defaultText="Select a Platform"
              inputValue={filterState.platformType}
              dropdownName="platformType"
            />
          </NewMessage>
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
              inputValue={filterState.messageBelongsTo}
              inputName="messageBelongsTo"
              handleInputField={handleInputField}
              placeholder="Message Belongs To?"
            />
            <InputFilterField
              inputValue={filterState.messageTitle}
              inputName="messageTitle"
              handleInputField={handleInputField}
              placeholder="Message Title"
            />
            <InputFilterField
              inputValue={filterState.messageToken}
              inputName="messageToken"
              handleInputField={handleInputField}
              placeholder="Message Token"
            />
            <DropdownFilter
              paymentMethods={appType}
              handleFilterInput={handleFilterInput}
              defaultText="Select a Message-Read Device"
              inputValue={filterState.messageReadOnWhichDevice}
              dropdownName="messageReadOnWhichDevice"
            />
            <DropdownFilter
              paymentMethods={messageTypes}
              handleFilterInput={handleFilterInput}
              defaultText="Select Message Type"
              inputValue={filterState.messageType}
              dropdownName="messageType"
            />
            <DropdownFilter
              paymentMethods={appPlatfrom}
              handleFilterInput={handleFilterInput}
              defaultText="Select a Platform"
              inputValue={filterState.platformType}
              dropdownName="platformType"
            />
            <DropdownFilter
              paymentMethods={messageFocus}
              handleFilterInput={handleFilterInput}
              defaultText="Select a Message Category"
              inputValue={filterState.messageCategory}
              dropdownName="messageCategory"
            />
            <BooleanFilter
              inputValue={filterState.isRead}
              handleFilterInput={handleFilterInput}
              defaultText="Message Read Status"
              inputName="isRead"
            />
            <div className="border border-gray-400 rounded-md p-2 w-full mb-2 text-center">
              <div className="mb-2">Message Read Date:</div>
              <SingleDatePicker
                onChange={messageDateHandler}
                disabledDate={disabledDate}
                date={moment(
                  filterState.filterMessageReadDate,
                  filterState.isReadAt
                )}
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
          <Input onChange={searchHandler} placeholder="input search text" />
        </div>
      </div>
      <div className="relative flex items-center pr-4 justify-between mb-2"></div>
      {showModal === true && (
        <Modal>
          <MessageDetails
            modalHandler={closeModal}
            data={singleMessage}
            fetchData={fetchData}
            buttonHandler={buttonHandler}
          />
        </Modal>
      )}

      <div className="display-table">
        <Table
          dataSource={allMessages}
          columns={columns({
            clickHandler: buttonHandler,
            deletePop,
            confirmDelete,
            updateViewingHandler,
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

export default Messages;
