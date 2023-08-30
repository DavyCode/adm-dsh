import React, { useState } from "react";
import { useToasts } from "react-toast-notifications";
import axiosData from "../../utils/axiosData.js";
import Loading from "../Loading";
import axios from "axios";
import { Descriptions, Button, Badge } from "antd";
const url = process.env.REACT_APP_ADMIN_URL;

const IssueDetails = ({ data, modalHandler, fetchData }) => {
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);
  const {
    issueCategory,
    issueReferenceId,
    message,
    status,
    _id,
    receipt,
    meta: { createdAt },
    user: { firstName, lastName },
  } = data;
  const [fieldsToUpdate, setFieldsToUpdate] = useState({
    issueId: _id,
  });

  const submitFormHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const controller = axios.CancelToken.source();
    try {
      const data = {
        body: { ...fieldsToUpdate },
        method: "PUT",
        url: `${url}/issues/attend`,
      };
      const updateResult = await axiosData(data);
      if (updateResult.statusCode === 200) {
        addToast(updateResult.message, {
          appearance: "success",
          autoDismiss: true,
        });
        fetchData(controller);
        modalHandler();
        setIsLoading(false);
      } else {
        addToast(updateResult.message, {
          appearance: "error",
          autoDismiss: true,
        });
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      addToast(error.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  return (
    <div className="message-details">
      <form action="" className="general-info" onSubmit={submitFormHandler}>
        <Descriptions
          title="Issue Management"
          layout="horizontal"
          column={1}
          bordered={true}
        >
          <Descriptions.Item label="Message">{message}</Descriptions.Item>
          <Descriptions.Item label="Issue Reference Id">
            {issueReferenceId}
          </Descriptions.Item>
          <Descriptions.Item label="Issue Category">
            {issueCategory}
          </Descriptions.Item>
          <Descriptions.Item label="Status">{status}</Descriptions.Item>
          <Descriptions.Item label="Name">{`${firstName} ${lastName}`}</Descriptions.Item>
          <Descriptions.Item label="Receipt">
            <a href={receipt} target="_blank">
              Receipt
            </a>
          </Descriptions.Item>
          {/* <div>
            <label htmlFor="message">Message:</label>
            <div>{message}</div>
          </div> */}
          {/* <div>
            <label htmlFor="issueReferenceId">Issue Reference Id</label>
            <div>{issueReferenceId}</div>
          </div> */}
          {/* <div>
            <label htmlFor="issueCategory">IssueCategory</label>
            <div>{issueCategory}</div>
          </div> */}
          {/* <div>
            <label htmlFor="status">Status</label>
            <div>{status}</div>
          </div> */}
          {/* <div>
            <label htmlFor="name">Name</label>
            <div>{`${firstName} ${lastName}`}</div>
          </div> */}
          <div>
            <div>
              <button
                onClick={() => {
                  modalHandler();
                }}
                className="mr-3"
              >
                Close
              </button>
            </div>
            <div>
              <button type="submit">Attend to Issue</button>
            </div>
          </div>
        </Descriptions>
      </form>
      {isLoading && <Loading />}
    </div>
  );
};
export default IssueDetails;
