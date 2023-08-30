import React from "react";

import { Select } from "antd";

const { Option } = Select;

const AgentApproval = (props) => {
  const { agentApproved } = props.data;
  const { handleFilterInput } = props;
  return (
    <Select
      value={agentApproved}
      onChange={handleFilterInput}
      className="w-full mb-2"
    >
      <Option value="" disabled>
        Agent Approval Status
      </Option>
      <Option value="true" name="agentApproved">
        True
      </Option>
      <Option value="false" name="agentApproved">
        False
      </Option>
    </Select>
  );
};

export default AgentApproval;
