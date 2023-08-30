import React from "react";

import { Select } from "antd";

const { Option } = Select;

const LockFilter = (props) => {
  const { lock } = props.data;
  const { handleFilterInput } = props;
  return (
    <Select value={lock} onChange={handleFilterInput} className="w-full mb-2">
      <Option value="" disabled>
        Choose Lock Status
      </Option>
      <Option value="true" name="lock">
        Locked
      </Option>
      <Option value="false" name="lock">
        Unlocked
      </Option>
    </Select>
  );
};

export default LockFilter;
