import React from 'react';
import {Descriptions, Button, Badge, Input} from 'antd';
import moment from 'moment';
import styles from '../styles/style.less';
//import formatAmount from '../utils/formatAmount.js';
import currencyFormat from '../utils/currencyFomat';
const TransactionDetails = ({data, modalHandler}) => {
  const {
    transactionReference,
    status,
    user: {firstName, lastName},
    recipientName,
    serviceType,
    amount,
    postWalletBalance,
    charges,
    commission,
    message,
    narration,
    preWalletBalance,
    isRefundedTransaction,
    isTransactionRefunded,
    transactionId,
    serviceId,
    paidAt,
    transactionType,
    recipientAccount,
    platform,
    stampDuty,
    meta,
    responseBody,
  } = data;
  return (
    <div className="transaction-details" data-status={status}>
      <Descriptions
        title={transactionReference || data.transactionReferance}
        layout="horizontal"
        column={1}
        bordered={true}>
        <Descriptions.Item label="Transaction Reference">
          {(transactionReference || data.transactionReferance) &&
            (transactionReference || data.transactionReferance)}
        </Descriptions.Item>
        <Descriptions.Item label="Name">
          {data.user !== undefined &&
            `${firstName.toUpperCase()} ${lastName.toUpperCase()}`}
        </Descriptions.Item>
        <Descriptions.Item label="Type">
          {serviceType !== undefined && serviceType}
        </Descriptions.Item>
        <Descriptions.Item label="Amount">
          {`${amount !== undefined && currencyFormat(amount || 0)}`}
        </Descriptions.Item>
        <Descriptions.Item label="Stamp Duty">
          {`${stampDuty !== undefined && currencyFormat(stampDuty || 0)}`}
        </Descriptions.Item>
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
        <Descriptions.Item label="Recipient Account">
          {recipientAccount !== undefined && recipientAccount}
        </Descriptions.Item>
        <Descriptions.Item label="Recipient">
          {recipientName !== undefined && recipientName.toUpperCase()}
        </Descriptions.Item>
        <Descriptions.Item label="Old Balance">
          {preWalletBalance !== undefined &&
            `${currencyFormat(preWalletBalance)}`}
        </Descriptions.Item>
        <Descriptions.Item label="New Balance">
          {postWalletBalance !== undefined &&
            `${currencyFormat(postWalletBalance)}`}
        </Descriptions.Item>
        <Descriptions.Item label="Date">
          {moment(meta.createdAt).format('lll')}
        </Descriptions.Item>
        <Descriptions.Item label="Paid at">
          {moment(paidAt).format('lll')}
        </Descriptions.Item>
        <Descriptions.Item label="Charges">
          {`${charges !== undefined && currencyFormat(charges)}`}
        </Descriptions.Item>
        <Descriptions.Item label="Commission">
          {`${commission !== undefined && currencyFormat(commission)}`}
        </Descriptions.Item>
        <Descriptions.Item label="Narration">
          {message !== undefined && message}
          <br />
          {narration !== undefined && narration}
        </Descriptions.Item>
        <Descriptions.Item label="Commission">
          {`${commission !== undefined && currencyFormat(commission)}`}
        </Descriptions.Item>
        <Descriptions.Item label="Refunded Transaction">
          {isRefundedTransaction === true ? 'YES' : 'NO'}
        </Descriptions.Item>
        <Descriptions.Item label="Transaction Refunded">
          {isTransactionRefunded === true ? 'YES' : 'NO'}
        </Descriptions.Item>
        <Descriptions.Item label="Transaction Id">
          {transactionId}
        </Descriptions.Item>
        <Descriptions.Item label="Service Id">{serviceId}</Descriptions.Item>

        <Descriptions.Item label="Transaction Type">
          {transactionType}
        </Descriptions.Item>
        <Descriptions.Item label="Commission">{platform}</Descriptions.Item>
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

export default TransactionDetails;
