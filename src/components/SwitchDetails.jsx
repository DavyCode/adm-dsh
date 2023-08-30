import React, {useState} from 'react';
import {Descriptions, Button} from 'antd';
import moment from 'moment';
// import styles from "../styles/style.less";
// import formatAmount from "../utils/formatAmount.js";
import currencyFormat from '../utils/currencyFomat';
const SwitchDetails = ({data, modalHandler}) => {
  const [firstName] = useState((data.user && data.user.firstName) || '');
  const [lastName] = useState((data.user && data.user.lastName) || '');
  const {
    _id: switchID,
    platform,
    logMessage,
    meta: {createdAt},
    status,
    serviceType,
    charges,
    prePlatform,
    preCharges,
  } = data;
  return (
    <div className="transaction-details" data-status={status}>
      <Descriptions
        title={switchID && switchID}
        layout="horizontal"
        column={1}
        bordered={true}>
        <Descriptions.Item label="Switch ID">
          {switchID && switchID}
        </Descriptions.Item>
        <Descriptions.Item label="Admin Name">
          {`${firstName.toUpperCase()} ${lastName.toUpperCase()}`}
        </Descriptions.Item>
        <Descriptions.Item label="Type">
          {serviceType !== undefined && serviceType}
        </Descriptions.Item>
        <Descriptions.Item label="Old platform">
          {prePlatform && prePlatform}
        </Descriptions.Item>
        <Descriptions.Item label="Current Platform">
          {platform}
        </Descriptions.Item>
        <Descriptions.Item label="Old Charge">
          {preCharges && `${currencyFormat(preCharges || 0)}`}
        </Descriptions.Item>
        <Descriptions.Item label="Current Charge">
          {charges !== undefined && currencyFormat(charges || 0)}
        </Descriptions.Item>
        <Descriptions.Item label="Switch Date">
          {createdAt !== undefined && moment(createdAt).format('lll')}
        </Descriptions.Item>
        <Descriptions.Item label="Log Message">
          {logMessage && logMessage}
        </Descriptions.Item>
      </Descriptions>
      <Button onClick={modalHandler} type="primary">
        Close
      </Button>
    </div>
  );
};

export default SwitchDetails;
