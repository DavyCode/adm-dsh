import React, {useState} from 'react';
import {Descriptions, Button} from 'antd';
import moment from 'moment';
//import formatAmount from "../utils/formatAmount.js";
import currencyFormat from '../utils/currencyFomat.js';
const CommissionDetails = ({data, modalHandler}) => {
  const {
    _id: commissionID,
    commission,
    postCommissionBalance,
    preCommissionBalance,
    meta: {createdAt},
  } = data;
  const [firstName] = useState((data.user && data.user.firstName) || '');
  const [lastName] = useState((data.user && data.user.lastName) || '');
  return (
    <div
      className="transaction-details"
      // data-status={status}
    >
      <Descriptions
        title={commissionID && commissionID}
        layout="horizontal"
        column={1}
        bordered={true}>
        <Descriptions.Item label="Name">
          {data.user &&
            (firstName || lastName) &&
            `${firstName && firstName.toUpperCase()} ${
              lastName && lastName.toUpperCase()
            }`}
        </Descriptions.Item>

        <Descriptions.Item label="Transaction Date">
          {createdAt !== undefined && moment(createdAt).format('lll')}
        </Descriptions.Item>
        <Descriptions.Item label="Commission">
          {commission !== undefined && currencyFormat(commission || 0)}
        </Descriptions.Item>
        <Descriptions.Item label="Pre-Commission Balance">
          {preCommissionBalance !== undefined &&
            currencyFormat(preCommissionBalance || 0)}
        </Descriptions.Item>
        <Descriptions.Item label="New Commission Balance">
          {postCommissionBalance !== undefined &&
            currencyFormat(postCommissionBalance || 0)}
        </Descriptions.Item>
      </Descriptions>
      <Button onClick={modalHandler} type="primary">
        Close
      </Button>
    </div>
  );
};

export default CommissionDetails;
