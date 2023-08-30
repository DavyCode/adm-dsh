import React from 'react';
import moment from 'moment';
import {Descriptions, Button, Input} from 'antd';
import currencyFormat from '../../utils/currencyFomat.js';
const POSTransactionDetails = ({data, modalHandler}) => {
  const {
    amount,
    charges,
    client_transactionReference,
    commission,
    isRefundedTransaction,
    isTransactionRefunded,
    message,
    paidAt,
    platform,
    serviceId,
    status,
    transactionId,
    transactionType,
    transactionReference,
    _id,
    stampDuty,
    recipientAccount,
    recipientName,
    postWalletBalance,
    preWalletBalance,
    terminalId,
    meta: {createdAt},
    responseBody,
  } = data;
  return (
    <div className="transaction-details">
      <Descriptions
        title={`${_id}`}
        layout="horizontal"
        column={1}
        bordered={true}>
        <Descriptions.Item label="Amount">
          {`${currencyFormat(amount || 0)}`}
        </Descriptions.Item>
        <Descriptions.Item label="Charges">
          {`${currencyFormat(charges || 0)}`}
        </Descriptions.Item>
        <Descriptions.Item label="Stampy Duty">
          {`${currencyFormat(stampDuty || 0)}`}
        </Descriptions.Item>
        <Descriptions.Item label="Client TransactionReference">
          {`${client_transactionReference}`}
        </Descriptions.Item>
        <Descriptions.Item label="Commission">{`${currencyFormat(
          commission || 0,
        )}`}</Descriptions.Item>
        <Descriptions.Item label="Old Balance">
          {`${currencyFormat(preWalletBalance || 0)}`}
        </Descriptions.Item>
        <Descriptions.Item label="New Balance">
          {`${currencyFormat(postWalletBalance || 0)}`}
        </Descriptions.Item>
        <Descriptions.Item label="Refunded Transaction">
          {isRefundedTransaction === true ? 'YES' : 'NO'}
        </Descriptions.Item>
        <Descriptions.Item label="Transaction Refunded">
          {isTransactionRefunded === true ? 'YES' : 'NO'}
        </Descriptions.Item>
        <Descriptions.Item label="Recipient Account">
          {recipientAccount}
        </Descriptions.Item>
        <Descriptions.Item label="Recipient Name">
          {recipientName}
        </Descriptions.Item>
        <Descriptions.Item label="Message">{message}</Descriptions.Item>
        <Descriptions.Item label="Paid At">
          {moment(paidAt).format('lll')}
        </Descriptions.Item>
        <Descriptions.Item label="Platform">{platform}</Descriptions.Item>
        <Descriptions.Item label="Service ID">{serviceId}</Descriptions.Item>
        <Descriptions.Item label="Status">{status}</Descriptions.Item>
        <Descriptions.Item label="Terminal Id">{terminalId}</Descriptions.Item>
        <Descriptions.Item label="Transaction Id">
          {transactionId}
        </Descriptions.Item>
        <Descriptions.Item label="Transaction Type">
          {transactionType}
        </Descriptions.Item>
        <Descriptions.Item label="Transaction Reference">
          {transactionReference}
        </Descriptions.Item>
        <Descriptions.Item label="Request Date">
          {createdAt !== undefined && moment(createdAt).format('lll')}
        </Descriptions.Item>
        <Descriptions.Item label="Response Body">
          <Input.TextArea value={responseBody}></Input.TextArea>
        </Descriptions.Item>
      </Descriptions>
      <Button onClick={modalHandler} type="primary">
        Close
      </Button>
    </div>
  );
};

export default POSTransactionDetails;
