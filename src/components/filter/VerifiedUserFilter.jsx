import React from "react";
import { Select } from "antd";

const { Option } = Select;

const VerifiedUserFilter = (props) => {
  const { verified } = props.data;
  const { handleFilterInput } = props;
  return (
    <Select
      value={verified}
      onChange={handleFilterInput}
      className="mb-2 w-full"
    >
      <Option value="" disabled>
        User Verified Status
      </Option>
      <Option value="true" name="verified">
        Verified
      </Option>
      <Option value="false" name="verified">
        Unverfied
      </Option>
    </Select>
  );
};

export default VerifiedUserFilter;
