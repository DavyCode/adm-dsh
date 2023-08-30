import React, { useState } from "react";
import { Descriptions, Button, Popconfirm, Popover } from "antd";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useToasts } from "react-toast-notifications";
import styles from "../../styles/style.less";
import InputFilterField from "../filter/InputFilterField";
import { setFilterState } from "../../actions/filter.action.js";
import DropdownFilter from "../filter/DropdownFilter";
import NewMessage from "./NewMessage";
import axios from "axios";
import axiosData from "../../utils/axiosData.js";
import Loading from "../Loading";
import messageTypes from "../../common/StateData/messageType.json"
import appPlatfrom from "../../common/StateData/appPlatform.json"
import messageFocus from "../../common/StateData/messageFocus.json"
const baseURL = process.env.REACT_APP_BASE_URL;
const updateUrl = `${baseURL}/rbq-admin/messages`;

const MessageDetails = ({ data, modalHandler, fetchData, buttonHandler }) => {
  const { addToast } = useToasts();
  const storeFilter = useSelector((state) => state.filter);
  const { filterStates: filterState } = storeFilter;
  const [updateLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [updateVisible, setVisible] = React.useState(false);
  const hidePop = () => {
    setVisible(() => false);
  };

  const popChange = (visible) => {
    setVisible(visible);
  };
  const {
    _id: messageID,
    actionLink,
    approveForViewing,
    includeImageUrl,
    isRead,
    messageBelongsTo,
    messageBody,
    messageCategory,
    messageReadOnWhichDevice,
    messageTitle,
    messageToken,
    messageType,
    meta: { createdAt },
    platformType,
  } = data;
  const {
    platformType: updatePlatformType,
    messageType: updateMessageType,
    messageBelongsTo: updateMessageBelongsTo,
    messageTitle: updateMessageTitle,
    messageBody: updateMessageBody,
    includeImageUrl: updateImageUrl,
    actionLink: updateActionLink,
    messageCategory: updateMessageCategory,
  } = filterState;

  const populateData = () => {
    return dispatch(
      setFilterState({
        platformType,
        messageType,
        messageBelongsTo,
        messageTitle,
        messageBody,
        includeImageUrl,
        actionLink,
        messageCategory,
      })
    );
  };

  const handleInputField = (event) => {
    const { name, value } = event.target;
    dispatch(setFilterState({ [name]: value }));
  };

  const handleFilterInput = (value, option) => {
    const { name } = option.props;
    dispatch(setFilterState({ [name]: value }));
  };
  const updateMessageData = {
    platformType: updatePlatformType,
    messageType: updateMessageType,
    messageBelongsTo: updateMessageBelongsTo,
    messageTitle: updateMessageTitle,
    messageBody: updateMessageBody,
    includeImageUrl: updateImageUrl,
    actionLink: updateActionLink,
    messageId: messageID,
    messageCategory: updateMessageCategory,
  };
  const updateMessageHandler = async (e) => {
    e.preventDefault();
    const controller = axios.CancelToken.source();
    try {
      setLoading(() => true);
      const data = {
        method: "PUT",
        body: updateMessageData,
        url: updateUrl,
      };
      const result = await axiosData(data);
      if (result.status === "success") {
        await fetchData(controller);
        buttonHandler(messageID)();
        hidePop(() => true);
        addToast("Message updated", {
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
  return (
    <div className="message-details">
      <Descriptions
        title={messageID && messageID}
        layout="horizontal"
        column={1}
        bordered={true}
      >
        <Descriptions.Item label="Message ID">
          {messageID && messageID}
        </Descriptions.Item>
        <Descriptions.Item label="Read Status">
          {isRead ? "Read" : "Unread"}
        </Descriptions.Item>
        <Descriptions.Item label="Message Type">
          {messageType && messageType}
        </Descriptions.Item>
        <Descriptions.Item label="Title">
          {messageTitle && messageTitle}
        </Descriptions.Item>
        <Descriptions.Item label="Message" className="message-body">
          {messageBody && messageBody}
        </Descriptions.Item>
        <Descriptions.Item label="Message Token">
          {messageToken && messageToken}
        </Descriptions.Item>
        <Descriptions.Item label="Message Category">
          {messageCategory && messageCategory}
        </Descriptions.Item>
        <Descriptions.Item label="Created On">
          {createdAt !== undefined && moment(createdAt).format("lll")}
        </Descriptions.Item>
        <Descriptions.Item label="User Device">
          {messageReadOnWhichDevice && messageReadOnWhichDevice}
        </Descriptions.Item>
        <Descriptions.Item label="Platform Type">
          {platformType && platformType}
        </Descriptions.Item>
        <Descriptions.Item label="Recipient">
          {messageBelongsTo && messageBelongsTo}
        </Descriptions.Item>
        <Descriptions.Item label="Include Image url" className="message-body">
          {includeImageUrl && includeImageUrl}
        </Descriptions.Item>
        <Descriptions.Item label="Approve For Viewing">
          {approveForViewing ? "Yes" : "No"}
        </Descriptions.Item>
        <Descriptions.Item label="Action Link" className="message-body">
          {actionLink && actionLink}
        </Descriptions.Item>
      </Descriptions>
      <div className="flex justify-center items-center w-full p-8">
        <Button
          onClick={() => {
            dispatch(setFilterState(clearFilter()));
            modalHandler();
          }}
          className="mr-3"
        >
          Close
        </Button>
        <NewMessage
          headerText="Update Message"
          buttonText="Update Message"
          className="inline-block"
          updateMessageHandler={updateMessageHandler}
          populateData={populateData}
          popChange={popChange}
          updateVisible={updateVisible}
          updatePlacement="top"
          updateLoading={updateLoading}
        >
          <DropdownFilter
            paymentMethods={messageTypes}
            handleFilterInput={handleFilterInput}
            defaultText="Select Message Type"
            inputValue={updateMessageType}
            dropdownName="messageType"
          />
          <DropdownFilter
            paymentMethods={messageFocus}
            handleFilterInput={handleFilterInput}
            defaultText="Select Message Category"
            inputValue={updateMessageCategory}
            dropdownName="messageCategory"
          />
          <DropdownFilter
            paymentMethods={appPlatfrom}
            handleFilterInput={handleFilterInput}
            defaultText="Select a Platform"
            inputValue={updatePlatformType}
            dropdownName="platformType"
          />
          <InputFilterField
            inputValue={updateImageUrl}
            inputName="includeImageUrl"
            handleInputField={handleInputField}
            placeholder="Include an Image URL"
          />
          <InputFilterField
            inputValue={updateActionLink}
            inputName="actionLink"
            handleInputField={handleInputField}
            placeholder="Include an Action Link"
          />
        </NewMessage>
      </div>
      {updateLoading && <Loading />}
    </div>
  );
};

export default MessageDetails;
