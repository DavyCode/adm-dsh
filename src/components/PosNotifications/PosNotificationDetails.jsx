import React from 'react';
import moment from 'moment';
import {Descriptions, Button, Input} from 'antd';
//import formatAmount from '../../utils/formatAmount.js';
import currencyFormat from '../../utils/currencyFomat';
const PosNotificationDetails = ({data, modalHandler}) => {
  const {
    amount,
    terminalId,
    _id,
    currency,
    customerName,
    paymentDate,
    retrievalReferenceNumber,
    reverse,
    settle,
    statusDescription,
    transaction,
    type,
    statusCode,
    notificationBody,

    meta: {createdAt},
  } = data;
  return (
    // console.log('notificationBody===', notificationBody),
    <div className="transaction-details">
      <Descriptions
        title={`${_id}`}
        layout="horizontal"
        column={1}
        bordered={true}>
        <Descriptions.Item label="Amount">
          {`${currencyFormat(amount || 0)}`}
        </Descriptions.Item>

        <Descriptions.Item label="Currency">{currency}</Descriptions.Item>
        <Descriptions.Item label="Terminal ID">{terminalId}</Descriptions.Item>
        <Descriptions.Item label="Transaction">{transaction}</Descriptions.Item>
        <Descriptions.Item label="Retrieval Reference Number">
          {retrievalReferenceNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Reverse">
          {reverse === true ? 'YES' : 'NO'}
        </Descriptions.Item>
        <Descriptions.Item label="Settle">
          {settle === true ? 'YES' : 'NO'}
        </Descriptions.Item>
        <Descriptions.Item label="Status Description">
          {statusDescription}
        </Descriptions.Item>
        <Descriptions.Item label="Type">{type}</Descriptions.Item>
        <Descriptions.Item label="Status Code">{statusCode}</Descriptions.Item>
        <Descriptions.Item label="Customer Name">
          {customerName}
        </Descriptions.Item>
        <Descriptions.Item label="Request Date">
          {createdAt !== undefined && moment(createdAt).format('lll')}
        </Descriptions.Item>
        <Descriptions.Item label="Payment Date">
          {createdAt !== undefined && moment(paymentDate).format('lll')}
        </Descriptions.Item>
        <Descriptions.Item label="Notification Body">
          <Input.TextArea value={notificationBody}></Input.TextArea>
        </Descriptions.Item>
      </Descriptions>
      <Button onClick={modalHandler} type="primary">
        Close
      </Button>
    </div>
  );
};

export default PosNotificationDetails;
