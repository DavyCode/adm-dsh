import React from 'react';
import moment from 'moment';
import {Descriptions, Button, Input} from 'antd';
// import formatAmount from '../../utils/formatAmount.js';
import currencyFormat from '../../utils/currencyFomat';
const PaymentNotificationDetails = ({data, modalHandler}) => {
  const {
    amountPaid,
    paidOn,
    paymentDescription,
    paymentMethod,
    paymentReference,
    paymentStatus,
    // totalPayable,
    //transactionHash,
    transactionReference,
    notificationBody,
    _id,
    meta: {createdAt},
  } = data;
  return (
    <div className="transaction-details">
      <Descriptions
        title={`${_id}`}
        layout="horizontal"
        column={1}
        bordered={true}>
        <Descriptions.Item label="Amount Paid">
          {`${currencyFormat(amountPaid)}`}
        </Descriptions.Item>
        <Descriptions.Item label="Paid On">{`${moment(paidOn).format(
          'lll',
        )}`}</Descriptions.Item>
        <Descriptions.Item label="Payment Description">
          {paymentDescription}
        </Descriptions.Item>
        <Descriptions.Item label="Payment Method">
          {`${paymentMethod}`}
        </Descriptions.Item>
        <Descriptions.Item label="Payment Reference">
          {paymentReference}
        </Descriptions.Item>
        <Descriptions.Item label="Payment Status">
          {paymentStatus}
        </Descriptions.Item>
        {/* <Descriptions.Item label="Total Payable">
          {`#${formatAmount(totalPayable)}`}
        </Descriptions.Item> */}
        {/* <Descriptions.Item label="Transaction Hash">
          {transactionHash}
        </Descriptions.Item> */}
        <Descriptions.Item label="Transaction Reference">
          {transactionReference}
        </Descriptions.Item>
        <Descriptions.Item label="Date">
          {createdAt !== undefined && moment(createdAt).format('lll')}
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

export default PaymentNotificationDetails;
