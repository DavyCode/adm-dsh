import React from "react";

import { Select } from "antd";

const { Option } = Select;

const ActiveUserFilter = (props) => {
  const { active } = props.data;
  const { handleFilterInput } = props;
  return (
    <Select value={active} onChange={handleFilterInput} className="w-full mb-2">
      <Option value="" disabled>
        Choose Active Status
      </Option>
      <Option value="true" name="active">
        Active
      </Option>
      <Option value="false" name="active">
        Inactive
      </Option>
    </Select>
  );
};

export default ActiveUserFilter;
