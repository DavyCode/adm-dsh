import React from "react";
import { Descriptions, Button, Badge } from "antd";
import moment from "moment";
import formatAmount from "../../utils/formatAmount.js";

const NewAgentDetails = ({
  data,
  modalHandler,
  approveUser,
  disApproveUser,
}) => {
  const {
    agentApproved,
    businessAddress,
    businessCity,
    businessLga,
    businessName,
    businessState,
    user: { firstName, lastName, phone, profileImage, gender, email },
    meta: { createdAt },
    _id,
    idCard,
  } = data;
  return (
    <div className="transaction-details">
      <Descriptions
        title={`${firstName} ${lastName}`}
        layout="horizontal"
        column={1}
        bordered={true}
      >
        <Descriptions.Item label="Business Name">
          {businessName}
        </Descriptions.Item>
        <Descriptions.Item label="Business Address">
          {`${businessAddress.toUpperCase()}`}
        </Descriptions.Item>
        <Descriptions.Item label="Business City">
          {businessCity}
        </Descriptions.Item>
        <Descriptions.Item label="Business Lga">
          {`${businessLga} ${businessState}`}
        </Descriptions.Item>
        <Descriptions.Item label="Approval Status">
          <Badge
            text={agentApproved === true ? "Approved" : "Not approved"}
            status={
              agentApproved === true ? "success" : agentApproved === "danger"
            }
          />
        </Descriptions.Item>
        <Descriptions.Item label="Phone Number">{phone}</Descriptions.Item>
        <Descriptions.Item label="Gender">{gender}</Descriptions.Item>
        <Descriptions.Item label="Email">{email}</Descriptions.Item>
        <Descriptions.Item label="Request Date">
          {createdAt !== undefined && moment(createdAt).format("lll")}
        </Descriptions.Item>
        <Descriptions.Item label="Identification Card">
          <a href={idCard} target="_blank">
            Id card
          </a>
        </Descriptions.Item>

        {/* <label>ID Card</label>
        <a href={idCard} target="_blank">
          Id card
        </a> */}
      </Descriptions>

      <Button onClick={() => approveUser(_id)} type="primary">
        Approve Agent
      </Button>
      <Button type="primary" onClick={() => disApproveUser(_id)}>
        Disapprove Agent
      </Button>
      <Button onClick={modalHandler} type="primary">
        Close
      </Button>
    </div>
  );
};

export default NewAgentDetails;
