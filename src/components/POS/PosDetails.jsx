import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useToasts } from "react-toast-notifications";
import axiosData from "../../utils/axiosData.js";
import Loading from "../Loading";
import {
  stateValues,
  lgaValues,
} from "../../common/StateData/stateAndLgaValues";
import { Select } from "antd";
import axios from "axios";

const url = process.env.REACT_APP_ADMIN_URL;

const PosDetails = ({ data, modalHandler, fetchData, returnHandler }) => {
  const { addToast } = useToasts();
  const { Option } = Select;

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const {
    address,
    assignedToAgent,
    assignedToAggregator,
    dailyPosTransactionAmount,
    lga,
    partner,
    serialNumber,
    state,
    terminalId,
    transactionLimit,
    blocked,
    _id,
    meta: { createdAt },
  } = data;

  const [fieldsToUpdate, setFieldsToUpdate] = useState({
    address: address,
    lga: lga,
    partner: partner,
    serialNumber: serialNumber,
    state: state,
    terminalId: terminalId,
    transactionLimit: transactionLimit,
  });

  const changeHandler = (event) => {
    const { name, value } = event.currentTarget;
    setFieldsToUpdate({ ...fieldsToUpdate, [name]: value });
  };

  const handleSelectChange = (value) => {
    setFieldsToUpdate({ ...fieldsToUpdate, state: value });
  };

  const handleChangeLga = (value) => {
    setFieldsToUpdate({ ...fieldsToUpdate, lga: value });
  };
  const submitFormHandler = async (event) => {
    event.preventDefault();
    const controller = axios.CancelToken.source();
    setIsLoading(true);
    try {
      const data = {
        body: { ...fieldsToUpdate },
        method: "PUT",
        url: `${url}/pos/terminal`,
      };
      const updateResult = await axiosData(data);
      if (updateResult.statusCode === 200) {
        addToast(updateResult.message, {
          appearance: "success",
          autoDismiss: true,
        });
        fetchData(controller);
        setIsLoading(false);
        returnHandler();
      } else {
        addToast(updateResult.message, {
          appearance: "error",
          autoDismiss: true,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error from Pos details", error);
      setIsLoading(false);
      addToast(error.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  return (
    <div>
      <form action="" className="general-info" onSubmit={submitFormHandler}>
        <h2>Pos Information</h2>
        <div>
          <label htmlFor="state">State</label>
          <Select
            style={{ width: "100%" }}
            placeholder="Select State"
            onChange={handleSelectChange}
            defaultValue={fieldsToUpdate.state}
          >
            <Option value="disabled" disabled>
              Select State
            </Option>
            {stateValues.map((item, index) => (
              <Option key={index} value={item.value}>
                {item.value}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="lga">Local Government</label>
          <div>
            <Select
              style={{ width: "100%" }}
              placeholder="Select local government"
              onChange={handleChangeLga}
              defaultValue={fieldsToUpdate.lga}
            >
              <Option value="disabled" disabled>
                Select Local government
              </Option>
              {lgaValues[fieldsToUpdate.state]
                ? lgaValues[fieldsToUpdate.state].map((item, index) => {
                    return (
                      <Option key={index} value={item.name}>
                        {item.name}
                      </Option>
                    );
                  })
                : ""}
            </Select>
          </div>
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <div>
            <input
              type="text"
              name="address"
              id="address"
              value={fieldsToUpdate.address && fieldsToUpdate.address}
              onChange={changeHandler}
              placeholder="address"
            />
          </div>
        </div>
        <div>
          <label htmlFor="serialNumber">Serial Number</label>
          <div>
            <input
              type="text"
              name="serialNumber"
              id="serialNumber"
              value={fieldsToUpdate.serialNumber && fieldsToUpdate.serialNumber}
              onChange={changeHandler}
              placeholder="serialNumber"
            />
          </div>
        </div>
        <div>
          <label htmlFor="terminalId">Terminal Id</label>
          <div>
            <input
              type="text"
              name="terminalId"
              id="terminalId"
              value={fieldsToUpdate.terminalId && fieldsToUpdate.terminalId}
              onChange={changeHandler}
              placeholder="terminalId"
            />
          </div>
        </div>
        <div>
          <label htmlFor="partner">Partner</label>
          <div>
            <input
              type="text"
              name="partner"
              id="partner"
              value={fieldsToUpdate.partner && fieldsToUpdate.partner}
              onChange={changeHandler}
              placeholder="partner"
            />
          </div>
        </div>
        <div>
          <label htmlFor="transactionLimit">Transaction Limit</label>
          <div>
            <input
              type="text"
              name="transactionLimit"
              id="transactionLimit"
              value={
                fieldsToUpdate.transactionLimit &&
                fieldsToUpdate.transactionLimit
              }
              onChange={changeHandler}
              placeholder="transactionLimit"
            />
          </div>
        </div>
        <div>
          <label>Assigned To Agent</label>
          <div>
            <span style={{ margin: "10px 20px" }}>
              {assignedToAgent === true ? "Yes" : "No"}
            </span>
          </div>
        </div>
        <div>
          <label>Assigned To Aggregator</label>
          <div>
            <span style={{ margin: "10px 20px" }}>
              {assignedToAggregator === true ? "Yes" : "No"}
            </span>
          </div>
        </div>
        <div>
          <label>Terminal Blocked</label>
          <div>
            <span style={{ margin: "10px 20px" }}>
              {blocked === true ? "Yes" : "No"}
            </span>
          </div>
        </div>
        <div>
          <label>Daily Pos TransactionAmount</label>
          <div>
            <span style={{ margin: "10px 20px" }}>
              {dailyPosTransactionAmount}
            </span>
          </div>
        </div>
        <div>
          <label>Date</label>
          <div>
            <span style={{ margin: "10px 20px" }}>
              {moment(createdAt).format("lll")}
            </span>
          </div>
        </div>
        <div>
          <button type="submit">Save changes</button>
        </div>
      </form>
      {isLoading && <Loading />}
    </div>
  );
};

export default PosDetails;
