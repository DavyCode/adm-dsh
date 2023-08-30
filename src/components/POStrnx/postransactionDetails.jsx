import React from 'react';
import moment from 'moment';
import {Descriptions, Button, Badge, Input} from 'antd';
import currencyFormat from '../../utils/currencyFomat';
const PosTransactionDetails = ({data, modalHandler}) => {
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
    //totalChargable,
    transactionId,
    transactionType,
    transactionReference,
    terminalId,
    stampDuty,
    recipientName,
    postWalletBalance,
    preWalletBalance,
    recipientAccount,
    user: {firstName, lastName},
    _id,
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
        <Descriptions.Item label="Amount">{`${currencyFormat(
          amount,
        )}`}</Descriptions.Item>
        <Descriptions.Item label="Charges">{`${currencyFormat(
          charges,
        )}`}</Descriptions.Item>
        <Descriptions.Item label="Client TransactionReference">
          {`${client_transactionReference}`}
        </Descriptions.Item>
        <Descriptions.Item label="Commission">
          {`${currencyFormat(commission)}`}
        </Descriptions.Item>
        <Descriptions.Item label="Stamp Duty">
          {`${currencyFormat(stampDuty)}`}
        </Descriptions.Item>
        <Descriptions.Item label="Old balance">
          {`${currencyFormat(preWalletBalance)}`}
        </Descriptions.Item>
        <Descriptions.Item label="New balance">
          {`${currencyFormat(postWalletBalance)}`}
        </Descriptions.Item>
        <Descriptions.Item label="Refunded Transaction">
          {isRefundedTransaction === true ? 'YES' : 'NO'}
        </Descriptions.Item>
        <Descriptions.Item label="Transaction Refunded">
          {isTransactionRefunded === true ? 'YES' : 'NO'}
        </Descriptions.Item>
        <Descriptions.Item label="Message">{message}</Descriptions.Item>
        <Descriptions.Item label="Paid At">
          {moment(paidAt).format('lll')}
        </Descriptions.Item>
        <Descriptions.Item label="Date">
          {createdAt !== undefined && moment(createdAt).format('lll')}
        </Descriptions.Item>
        <Descriptions.Item label="Recipient Name">
          {recipientName}
        </Descriptions.Item>
        <Descriptions.Item label="Recipient Account">
          {recipientAccount}
        </Descriptions.Item>
        <Descriptions.Item label="Platform">{platform}</Descriptions.Item>
        <Descriptions.Item label="Service ID">{serviceId}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Badge
            text={status !== undefined && status}
            status={
              status === 'Successful'
                ? 'success'
                : status === 'Pending'
                ? 'processing'
                : status === 'Failed'
                ? 'error'
                : status === 'Null'
                ? 'warning'
                : 'default'
            }
          />
        </Descriptions.Item>

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
        <Descriptions.Item label="Agent Name">
          {`${firstName} ${lastName}`}
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

export default PosTransactionDetails;
