import React, {useState} from 'react';
import {Button, Modal, Select} from 'antd';
import {DefaultToastContainer, useToasts} from 'react-toast-notifications';
import axios from 'axios';
import axiosData from '../utils/axiosData.js';
import styles from '../styles/style.less';

const {Option} = Select;
const url = process.env.REACT_APP_ADMIN_URL;

export const ToastContainer = (props) => (
  <DefaultToastContainer
    className="toast-container"
    css={{
      zIndex: 2000,
      top: '10px',
      right: '20px',
      position: 'fixed',
    }}
    {...props}
  />
);

const UpdateForm = ({
  visible,
  onCancel,
  confirmLoading,
  onSubmit,
  handleChange,
  handleSelectChange,
  inputValue,
  serviceData,
  platformData,
}) => {
  return (
    <Modal
      className="platform-modal"
      visible={visible}
      title="Update Switch Service"
      okText="Update"
      cancelText="Close"
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      onOk={onSubmit}>
      <form>
        <div className="update-service">
          <label htmlFor="service-type">Service</label>
          <input
            type="text"
            name="serviceType"
            id="service-type"
            placeholder="Enter Service"
            value={inputValue.serviceType ? inputValue.serviceType : ''}
            disabled
          />
        </div>
        <div className="update-service">
          <label htmlFor="charge">Charges</label>
          <input
            type="text"
            name="charge"
            id="charge"
            placeholder="Enter a valid charge"
            value={inputValue.charge ? inputValue.charge : ''}
            onChange={handleChange}
          />
        </div>
        <div className="update-service">
          <span>Platforms</span>
          <Select
            defaultValue={serviceData.platform}
            style={{width: '100%'}}
            id="platform"
            onChange={handleSelectChange}>
            {platformData.map((item, key) => (
              <Option value={item} key={key}>
                {item}
              </Option>
            ))}
          </Select>
        </div>
      </form>
    </Modal>
  );
};

const UpdateServices = ({
  documentID,
  clickHandler,
  onUpdate,
  platformData,
  fetchData,
}) => {
  const {addToast} = useToasts();
  const [visible, setVisible] = useState(false);
  const [successfulUpdate, setSuccessfulUpdate] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [inputValue, setInputValue] = useState({
    serviceType: clickHandler.serviceType,
    charge: clickHandler.charges,
    platform: clickHandler.platform,
    notify: {
      chargeError: '',
      platformError: '',
      serviceTypeError: '',
      otherErrors: '',
    },
  });

  const submitHandler = async (event) => {
    try {
      event.preventDefault();
      setConfirmLoading(true);
      let charge = inputValue.charge && inputValue.charge.toString().trim();
      let platform = inputValue.platform && inputValue.platform.trim();
      let serviceType = inputValue.serviceType && inputValue.serviceType.trim();
      if (!charge || isNaN(charge)) {
        setConfirmLoading(false);
        addToast('Charge is required or Charge value is not valid number', {
          appearance: 'error',
          autoDismiss: true,
        });
        setInputValue({
          ...inputValue,
          notify: {
            ...inputValue.notify,
            chargeError:
              'Charge is required or Charge value is not valid number',
          },
        });
      }
      if (!platform) {
        setConfirmLoading(false);
        addToast('Platform field cannot be blank', {
          appearance: 'error',
          autoDismiss: true,
        });
        setInputValue({
          ...inputValue,
          notify: {
            ...inputValue.notify,
            platformError: 'Platform field cannot be blank',
          },
        });
      }
      if (!serviceType) {
        setConfirmLoading(false);
        addToast('Service Type is required', {
          appearance: 'error',
          autoDismiss: true,
        });
        setInputValue({
          ...inputValue,
          notify: {
            ...inputValue.notify,
            serviceTypeError: 'Service Type is required',
          },
        });
      }
      const {
        serviceTypeError,
        platformError,
        chargeError,
        otherErrors,
      } = inputValue.notify;
      if (!serviceTypeError && !platformError && !chargeError && !otherErrors) {
        const data = {
          url: `${url}/switch-service`,
          method: 'PUT',
          body: {charge, serviceType, platform},
        };
        const controller = axios.CancelToken.source();
        const sendData = await axiosData(data);
        if (sendData.statusCode === 200) {
          setConfirmLoading(false);
          setSuccessfulUpdate(true);
          setInputValue({
            ...inputValue,
            notify: {
              chargeError: '',
              platformError: '',
              serviceTypeError: '',
              otherErrors: '',
            },
          });
          setVisible(false);
          fetchData(controller);
          return addToast(sendData.message, {
            appearance: 'success',
            autoDismiss: true,
          });
        }
      }
    } catch (error) {
      return addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  const handleChange = (event) => {
    setConfirmLoading(false);
    const {name, value} = event.currentTarget;
    setInputValue({
      ...inputValue,
      [name]: value,
      notify: {
        chargeError: '',
        platformError: '',
        serviceTypeError: '',
        otherErrors: '',
      },
    });
  };
  const handleSelectChange = (value) => {
    setConfirmLoading(false);
    setInputValue({
      ...inputValue,
      platform: value,
      notify: {
        chargeError: '',
        platformError: '',
        serviceTypeError: '',
        otherErrors: '',
      },
    });
  };
  return (
    <div>
      <Button
        onClick={() => {
          setInputValue({
            ...inputValue,
            serviceType: clickHandler.serviceType,
            charge: clickHandler.charges,
            platform: clickHandler.platform,
          });
          setVisible(true);
          setSuccessfulUpdate(false);
          return clickHandler;
        }}
        style={{
          marginLeft: '10px',
          border: '#4d3a8f solid 1px',
          color: '#4d3a8f',
          height: '24px',
        }}
        data-id={documentID}>
        Update
      </Button>
      <UpdateForm
        visible={visible}
        serviceData={clickHandler}
        onSubmit={submitHandler}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        inputValue={inputValue}
        confirmLoading={confirmLoading}
        platformData={platformData}
        onCancel={() => {
          setInputValue({
            ...inputValue,
            serviceType: '',
            charge: '',
            platform: '',
          });
          setVisible(false);
          setConfirmLoading(false);
          return successfulUpdate && onUpdate(true);
        }}
      />
    </div>
  );
};

export default UpdateServices;
