import React, { useState } from "react";
import styles from "../styles/style.less";
import { Card } from "antd";
import Loading from "./Loading.jsx";
import axiosData from "../utils/axiosData.js";
import axios from "axios";
import { useToasts } from "react-toast-notifications";

const BaseURL = process.env.REACT_APP_ADMIN_URL;
const url = `${BaseURL}/wallet/refund`;
const Refund = ({ data, modalHandler, setRefunded }) => {
  const { addToast } = useToasts();
  const [transactionInput, setTransactionInput] = useState({
    transactionReference: "",
    narration: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const changeHandler = (e) => {
    const { name, value } = e.currentTarget;
    setTransactionInput({ ...transactionInput, [name]: value });
  };
  const refundHandler = async () => {
    try {
      setIsLoading(true);
      const body = {
        transactionReference: transactionInput.transactionReference,
        narration: transactionInput.narration,
      };

      const refundsData = {
        method: "POST",
        body,
        url,
      };
      const refundUser = await axiosData(refundsData);
      if (refundUser.statusCode === 200) {
        addToast("Refund Successful", {
          appearance: "success",
          autoDismiss: true,
        });
        setTransactionInput({
          transactionReference: "",
          narration: "",
        });
      } else {
        if (refundUser.response) {
          addToast(refundUser.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
        } else {
          addToast(refundUser.message, {
            appearance: "error",
            autoDismiss: true,
          });
        }
        // addToast(refundUser.message, {
        //   appearance: "error",
        //   autoDismiss: true,
        // });
      }
      setIsLoading(false);
    } catch (error) {
      // addToast(error.message, {
      //   appearance: "error",
      //   autoDismiss: true,
      // });
      // setIsLoading(false);
      // console.log(error);
    }
  };
  return (
    <div className="refunds-container">
      <Card title="Refunds">
        <div>
          <label htmlFor="transactionReference">Transaction Reference</label>
          <div>
            <input
              type="text"
              name="transactionReference"
              id="transactionReference"
              value={transactionInput.transactionReference}
              onChange={changeHandler}
            />
          </div>
        </div>
        <div>
          <label>Narration</label>
          <div>
            <input
              type="text"
              name="narration"
              id="narration"
              value={transactionInput.narration}
              onChange={changeHandler}
            />
          </div>
        </div>
        <div>
          <button type="button" onClick={refundHandler}>
            Refund User
          </button>
        </div>
      </Card>
      {isLoading && <Loading />}
    </div>
  );
};

export default Refund;
