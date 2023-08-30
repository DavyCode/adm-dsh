import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import axios from "axios";
import axiosData from "../../utils/axiosData.js";
import { Table, Button, Pagination, Badge, Input } from "antd";
import Modal from "../Modal.jsx";
import NumberDropdown from "../NumberDropdown.jsx";
import Loading from "../Loading.jsx";
import DisplayCard from "../DisplayCard.jsx";
import Filter from "../filter/Filter.jsx";
import searchDebounce from "../../utils/debounce";
import InputFilterField from "../filter/InputFilterField.jsx";
import { SingleDatePicker } from "../Datepicker.jsx";
import {
  getAllNewAgents,
  getOneAgent,
  setFetchNumber,
} from "../../actions/newAgents.action.js";
import { useToasts } from "react-toast-notifications";
import {
  setFilterFetchNumber,
  setFilterState,
} from "../../actions/filter.action.js";
import AgentReqestDetails from "./AgentReqestDetails.jsx";

const adminURL = process.env.REACT_APP_ADMIN_URL;
const url = `${adminURL}/agents/requests`;
const approveURL = `${adminURL}/agents/approve`;
const disApproveURL = `${adminURL}/agents/disapprove`;
const columns = (clickHandler) => [
  {
    title: "#",
    key: "serialNumber",
    render: (text) => <span>{text.serialNumber}</span>,
  },
  {
    title: "Bussiness Name",
    key: "businessName",
    render: (text) => <span>{text.businessName}</span>,
  },
  {
    title: "Agent Name",
    key: "agentName",
    render: (text) => (
      <span>{text.user && `${text.user.firstName} ${text.user.lastName}`}</span>
    ),
  },
  {
    title: "Business Address:",
    key: "businessAddress:",
    render: (text) => (
      <span>{`${text.businessAddress} ${text.businessAddress}`}</span>
    ),
  },
  {
    title: "Status",
    key: "status",
    render: (obj) => {
      let badgeColor = "";
      if (obj.agentApproved === true) badgeColor = "success";
      if (obj.agentApproved === false) badgeColor = "error";
      return (
        <span data-status={obj.agentApproved}>
          <Badge
            status={badgeColor}
            text={obj.agentApproved === true ? "Approved" : "No Approved"}
          />
        </span>
      );
    },
  },
  {
    title: "Date",
    key: "initiatedAt",
    render: (obj) => {
      const time = moment(obj.meta.createdAt).format("lll");
      return <span>{time}</span>;
    },
  },
  {
    title: "",
    key: "button",
    render: (obj) => {
      return (
        <Button
          data-agentid={obj._id}
          type="primary"
          onClick={clickHandler}
          className="services-table-button"
        >
          view
        </Button>
      );
    },
  },
];

export const TablePagination = ({ total, onChange, current, pageSize }) => (
  <Pagination
    total={total}
    onChange={onChange}
    current={current}
    pageSize={pageSize}
    showSizeChanger={false}
  />
);
const AgentsRequest = ({ location }) => {
  const [showModal, setShowModal] = useState(false);
  const [filterCurrent, setFilterCurrent] = useState(1);
  const [current, setCurrent] = useState(1);
  const [counter, setCounter] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalDocumentCount, setTotalDocumentCount] = useState(0);
  const newAgentState = useSelector((state) => state.allNewAgent);
  const displayStatus = useSelector((state) => state.allNewAgent.displayStatus);
  const { allNewAgents, singleAgent, fetchLimit } = newAgentState;
  const storeFilter = useSelector((state) => state.filter);
  const { filterFetchLimit, filterStates: filterState } = storeFilter;
  const [filter, setFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const dispatch = useDispatch();
  const { addToast } = useToasts();
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
          businessName,
          agentName,
          businessLga,
          businessCity,
          endDate,
          startDate,
        } = filterState;
        const params = {
          ...(endDate && filter && { endDate }),
          ...(businessName && { businessName }),
          ...(agentName && { agentName }),
          ...(businessLga && { businessLga }),
          ...(businessCity && { businessCity }),
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

        const [newAgents] = await Promise.all([axiosData(data)]);
        setTotalDocumentCount(newAgents.totalDocumentCount);
        dispatch(getAllNewAgents(newAgents.data));
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
    const agentID = event.currentTarget.dataset.agentid;
    dispatch(getOneAgent(agentID));
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
    setApplyFilter(true);
    setFilter(true);
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

  // Writing the function to approve user
  const approveUser = async (_id) => {
    setIsLoading(true);
        const controller = axios.CancelToken.source();

    try {
      const agentRequestId = _id;
      const data = {
        method: "PUT",
        url: approveURL,
        body: { agentRequestId },
      };
      const response = await axiosData(data);
      if (response.statusCode === 200) {
         addToast(response.message, {
          appearance: "success",
          autoDismiss: true,
         });
        closeModal()
         fetchData(controller);
         setIsLoading(false);
      } else {
         if (response.response) {
          addToast(response.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
        } else {
          addToast(response.message, {
            appearance: "error",
            autoDismiss: true,
          });
        }
      }
       setIsLoading(false);
    } catch (error) {
    }
  };
  //Writing the function to disapprove user
  const disApproveUser = async (_id) => {
    setIsLoading(true);
     const controller = axios.CancelToken.source();
    try {
      const agentRequestId = _id;
      const data = {
        method: "PUT",
        url: disApproveURL,
        body: { agentRequestId },
      };
      const response = await axiosData(data);
      if (response.statusCode === 200) {
         addToast(response.message, {
          appearance: "success",
          autoDismiss: true,
         });
        closeModal()
        fetchData(controller);
         setIsLoading(false);
      } else {
         if (response.response) {
          addToast(response.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
        } else {
          addToast(response.message, {
            appearance: "error",
            autoDismiss: true,
          });
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="serviceContainer"
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
        totalTransactions={allNewAgents.length}
        successTransaction={displayStatus.successful}
        failedTransaction={displayStatus.failed}
        pendingTransaction={displayStatus.pending}
        nullTransaction={displayStatus.nullStatus}
        refundedTransaction={displayStatus.unknown}
        successful={Math.round(
          (displayStatus.successful / allNewAgents.length) * 100
        )}
        failed={Math.round((displayStatus.failed / allNewAgents.length) * 100)}
        pending={Math.round(
          (displayStatus.pending / allNewAgents.length) * 100
        )}
        nullNumber={Math.round(
          (displayStatus.nullStatus / allNewAgents.length) * 100
        )}
        init={Math.round((displayStatus.init / allNewAgents.length) * 100)}
      />
      <div className="relative flex items-center justify-between pr-4">
        <div className="top-0 left-0 h-40px flex items-center flex-3">
          <NumberDropdown numberHandler={numberHandler} />
          {allNewAgents.length >= 1 && (
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
              inputValue={filterState.businessName}
              inputName="businessName"
              handleInputField={handleInputField}
              placeholder="Enter Business Name"
            />
            <InputFilterField
              inputValue={filterState.agentName}
              inputName="agentName"
              handleInputField={handleInputField}
              placeholder="Enter Agent Name"
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
      {showModal === true && (
        <Modal>
          <AgentReqestDetails
            modalHandler={closeModal}
            data={singleAgent}
            approveUser={approveUser}
            disApproveUser={disApproveUser}
          />
        </Modal>
      )}
      {isLoading === true ? (
        <Loading />
      ) : (
        <div className="display-table">
          <Table
            dataSource={allNewAgents}
            columns={columns(buttonHandler)}
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

export default AgentsRequest;
