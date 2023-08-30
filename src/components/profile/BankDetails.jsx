import React, { useState } from "react";
import styles from "../../styles/style.less";
import moment from "moment";
import { Select } from "antd";
import Modal from "../Modal.jsx";
import ModalLoader from "../ModalLoader.jsx";
import axios from "axios";
import axiosData from "../../utils/axiosData.js";
import { useToasts } from "react-toast-notifications";

const { Option } = Select;
const url = process.env.REACT_APP_BASE_URL;
const BankDetails = ({ user, bankList, updated, returnHandler, fetchData }) => {
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);
  const { _id, userId, ...rest } = user;
  const { bank } = rest;
  const bankingData = rest;
  const [bankCode, setBankCode] = useState(
    (bankingData.bank && bankingData.bank.bankCode) || ""
  );
  const [bankName, setBankName] = useState(
    (bankingData.bank && bankingData.bank.bankName) || ""
  );
  const [userBankNumber, setUserBankNumber] = useState(
    (bank && bank.bankAccountNumber) || ""
  );
  const [updatedAt, setUpdatedAt] = useState("");
  const changeHandler = (event) => {
    const { value } = event.currentTarget;
    setUserBankNumber(value);
  };
  const bankChangeHandler = async (event) => {
    event.preventDefault();
    const controller = axios.CancelToken.source();
    setIsLoading(true);
    try {
      const data = {
        url: `${url}/rbq-admin/users/bank`,
        method: "PUT",
        body: {
          userId: _id,
          bankCode,
          bankAccountNumber: userBankNumber,
        },
      };
      const updateDetails = await axiosData(data);
      if (updateDetails.statusCode === 200) {
        updated(true);
        addToast(updateDetails.message, {
          appearance: "success",
          autoDismiss: true,
        });
        setIsLoading(false);
        setBankName(updateDetails.data.bank.bankName);
        fetchData(controller);
        returnHandler();
        return setUpdatedAt(updateDetails.data.meta.updatedAt);
      } else {
        if (updateDetails.response) {
          addToast(updateDetails.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
        } else {
          addToast(updateDetails.message, {
            appearance: "error",
            autoDismiss: true,
          });
        }
        setIsLoading(false);
      }
    } catch (error) {}
  };
  const handleChange = (value) => {
    setBankCode(value);
    const newBank = bankList.find((bank) => value === Object.keys(bank)[0]);
    setBankName(Object.values(newBank)[0]);
  };
  return (
    <form action="" className="bank-info" onSubmit={bankChangeHandler}>
      {isLoading === true && (
        <Modal style={{ backgroundColor: "hsla(0, 50%, 100%, 0.5)" }}>
          <ModalLoader />
        </Modal>
      )}
      <h2>Bank Information</h2>
      <div>
        <label htmlFor="bankName">Bank</label>{" "}
        <div>
          <Select value={bankName || "disabled"} onChange={handleChange}>
            <Option value="disabled" disabled>
              Select a Bank
            </Option>
            {bankList.map((bank) => (
              <Option key={Object.keys(bank)[0]} value={Object.keys(bank)[0]}>
                {Object.values(bank)[0]}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <label htmlFor="bankAccountNumber">Account Number</label>
        <div>
          <input
            type="text"
            name="bankAccountNumber"
            id="bankAccountNumber"
            value={userBankNumber}
            onChange={changeHandler}
            placeholder="Account Number"
          />
        </div>
      </div>
      <div>
        <label>Account Name</label>
        <div>
          <span>
            {bankingData.bank &&
              bankingData.bank.bankName &&
              bankingData.bank.bankAccountName}
          </span>
        </div>
      </div>
      <div>
        <label>Bank Code</label>
        <div>
          <span>{bankCode}</span>
        </div>
      </div>
      <div>
        <label>Last Updated</label>
        <div>
          <span>
            {(updatedAt && moment(updatedAt).format("lll")) ||
              moment(bankingData.meta.updatedAt).format("lll")}
          </span>
        </div>
      </div>
      <div>
        <button type="submit">Update Bank Details</button>
      </div>
    </form>
  );
};

export default BankDetails;
