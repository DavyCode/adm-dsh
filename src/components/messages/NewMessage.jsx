import React, { useState } from "react";
import { Button, Popover } from "antd";
import styles from "../../styles/style.less";
import { Input } from "antd";
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilterFetchNumber,
  setFilterState,
} from "../../actions/filter.action.js";
import axios from "axios";
import axiosData from "../../utils/axiosData.js";
import Loading from "../Loading";

const baseURL = process.env.REACT_APP_BASE_URL;
const broadcastUrl = `${baseURL}/rbq-admin/messages/broadcast`;
const directUrl = `${baseURL}/rbq-admin/messages/direct`;

const NewMessage = (props) => {
  const storeFilter = useSelector((state) => state.filter);
  const { filterFetchLimit, filterStates: filterState } = storeFilter;
  const dispatch = useDispatch();
  const [userId, setUserId] = useState("");
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);
  const {
    submitMessageHandler,
    clearFieldsHandler,
    headerText,
    buttonText,
    className,
    userData,
    fetchData,
    updateTitle,
    updateBody,
    updateMessageHandler,
    populateData,
    popChange,
    updateVisible,
    updatePlacement,
    updateLoading,
  } = props;
  const [visible, setVisible] = React.useState(false);
  const hide = () => {
    setVisible(() => false);
  };

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };
  const onChange = (event) => {
    const { name, value } = event.target;
    dispatch(setFilterState({ [name]: value }));
  };

  const clearFilter = () => {
    return {
      platformType: "",
      messageType: "",
      messageBelongsTo: "",
      messageTitle: "",
      messageBody: "",
      includeImageUrl: "",
      actionLink: "",
    };
  };
  const {
    platformType,
    messageType,
    messageBelongsTo,
    messageTitle,
    messageBody,
    includeImageUrl,
    actionLink,
  } = filterState;

  const broadcastMessageData = {
    platformType,
    messageType,
    messageTitle,
    messageBody,
  };
  const directMessageData = {
    platformType,
    messageType,
    messageBelongsTo,
    messageTitle,
    messageBody,
    includeImageUrl,
    actionLink,
  };
  const directMessageHandler = async (e) => {
    e.preventDefault();
    directMessageData.messageBelongsTo = userData;
    try {
      setLoading(() => true);
      const data = {
        method: "POST",
        body: directMessageData,
        url: directUrl,
      };
      const result = await axiosData(data);
      if (result.status === "success") {
        dispatch(setFilterState(clearFilter()));
        hide();
        addToast("Message sent successfully", {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        if (result.response) {
          addToast(result.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
        } else {
          addToast(result.message, {
            appearance: "error",
            autoDismiss: true,
          });
        }
      }

      setLoading(false);
    } catch (error) {}
  };
  const broadcastMessageHandler = async (e) => {
    e.preventDefault();
    const controller = axios.CancelToken.source();
    try {
      setLoading(() => true);
      const data = {
        method: "POST",
        body: broadcastMessageData,
        url: broadcastUrl,
      };
      const result = await axiosData(data);
      if (result.status === "success") {
        dispatch(setFilterState(clearFilter()));
        hide();
        await fetchData(controller);
        addToast("Broadcast message sent successfully", {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        if (result.response) {
          addToast(result.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
        } else {
          addToast(result.message, {
            appearance: "error",
            autoDismiss: true,
          });
        }
      }
      setLoading(false);
    } catch (error) {}
  };
  const content = (
    <div className="min-h-40vh text-center" style={{ width: 350 }}>
      <h3
        className="uppercase mb-4 font-extrabold text-base"
        style={{ color: "#161745" }}
      >
        {headerText}
      </h3>
      <div>
        {props.children}
        <Input
          placeholder="Message Subject"
          allowClear
          onChange={onChange}
          className="mb-2"
          name="messageTitle"
          value={updateTitle || messageTitle}
        />

        <textarea
          placeholder="Enter Message"
          onChange={onChange}
          className="mb-2 inline-block w-full border border-gray-500 border-solid rounded-md px-4 py-1 resize-none max-w-screen-sm"
          rows={4}
          name="messageBody"
          value={updateBody || messageBody}
        />
      </div>
      <div className="flex justify-center items-center">
        <Button
          className="text-white mr-4 flex-1"
          style={{ backgroundColor: "#161745", color: "#ffffff" }}
          onClick={
            updateMessageHandler
              ? updateMessageHandler
              : buttonText === "Broadcast Message"
              ? broadcastMessageHandler
              : directMessageHandler
          }
          disabled={updateLoading || loading}
        >
          Submit
        </Button>
        <Button
          className="flex-1"
          style={{ border: "#161745 1px solid", color: "#161745" }}
          onClick={() => dispatch(setFilterState(clearFilter()))}
          disabled={updateLoading || loading}
        >
          Clear
        </Button>
      </div>
    </div>
  );
  return (
    <div className={className}>
      <Popover
        content={content}
        trigger="click"
        placement={updatePlacement ?? "left"}
        // overlayClassName="filter-container"
        visible={updateVisible || visible}
        onVisibleChange={popChange || handleVisibleChange}
      >
        <Button
          className={`text-white mr-4`}
          style={{ backgroundColor: "#161745", color: "#ffffff" }}
          onClick={(e) => {
            if (populateData) {
              return populateData();
            }
            return setUserId(e.target.dataset.userid);
          }}
          data-userid={userData}
        >
          {buttonText}
        </Button>
      </Popover>
      {loading && <Loading />}
    </div>
  );
};

export default NewMessage;
