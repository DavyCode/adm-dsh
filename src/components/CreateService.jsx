import React, { useState } from "react";
import { Button, Modal } from "antd";
import axios from "axios";
import axiosData from "../utils/axiosData.js";
import styles from "../styles/style.less";
import { useToasts } from "react-toast-notifications";

const url = process.env.REACT_APP_ADMIN_URL;
const CreateServiceForm = ({
  visible,
  onCancel,
  confirmLoading,
  submitHandler,
  handleChange,
  inputValue,
}) => {
  return (
    <Modal
      className="platform-modal"
      visible={visible}
      title="Create a new Service"
      okText="Create"
      cancelText="Close"
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      onOk={submitHandler}
    >
      <form>
        <div className="update-service">
          <label htmlFor="service">Service</label>
          <input
            type="text"
            name="service"
            id="service"
            placeholder="Enter Service"
            value={inputValue.service}
            onChange={handleChange}
          />
        </div>
      </form>
    </Modal>
  );
};

const CreateServicePage = ({ onUpdate }) => {
  const [visible, setVisible] = useState(false);
  const [successfulCreate, setSuccessfulCreate] = useState(false);
  const { addToast } = useToasts();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [inputValue, setInputValue] = useState({
    service: "",
    notify: {
      serviceError: "",
      otherErrors: "",
    },
  });
  const handleChange = (event) => {
    const { name, value } = event.currentTarget;
    setInputValue({
      ...inputValue,
      [name]: value,
      notify: {
        serviceError: "",
        otherErrors: "",
      },
    });
  };
  const submitHandler = async (event) => {
    event.preventDefault();
    setConfirmLoading(true);
    const controller = axios.CancelToken.source();
    const data = {
      url: `${url}/switch-service`,
      body: { serviceType: inputValue.service.toUpperCase() },
      signal: controller.token,
      method: "POST",
    };
    try {
      const serviceCreate = await axiosData(data);
      if (serviceCreate.statusCode === 201) {
        setConfirmLoading(false);
        setSuccessfulCreate(true);
        setInputValue({
          ...inputValue,
          notify: {
            serviceError: "",
            otherErrors: "",
          },
        });
        addToast(serviceCreate.message, {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        setConfirmLoading(false);
        if (serviceCreate.response) {
          addToast(serviceCreate.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
        } else {
          addToast(serviceCreate.message, {
            appearance: "error",
            autoDismiss: true,
          });
        }
        // addToast(serviceCreate.message, {
        //   appearance: "error",
        //   autoDismiss: true,
        // });
        setInputValue({
          ...inputValue,
          notify: {
            ...inputValue.notify,
            otherErrors: serviceCreate.message,
          },
        });
      }
    } catch (error) {
      // setInputValue({
      //   ...inputValue,
      //   notify: {
      //     ...inputValue.notify,
      //     otherErrors: error.message,
      //   },
      // });
    }
  };

  return (
    <div>
      <Button
        type="primary"
        className="create-service-button mr-3 outline-none border-none"
        onClick={() => {
          setInputValue({
            ...inputValue,
            service: "",
          });
          setSuccessfulCreate(false);
          setVisible(true);
        }}
      >
        New Service
      </Button>
      <CreateServiceForm
        visible={visible}
        confirmLoading={confirmLoading}
        submitHandler={submitHandler}
        handleChange={handleChange}
        inputValue={inputValue}
        onCancel={() => {
          setInputValue({
            ...inputValue,
            service: "",
          });
          setVisible(false);
          setConfirmLoading(false);

          return successfulCreate && onUpdate(true);
        }}
      />
    </div>
  );
};

export default CreateServicePage;
