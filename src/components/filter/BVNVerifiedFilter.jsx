import React from "react";
import { Select } from "antd";

const { Option } = Select;

const BVNVerifiedFilter = (props) => {
  const { isBVN_verified } = props.data;
  const { handleFilterInput } = props;
  return (
    <Select
      value={isBVN_verified}
      onChange={handleFilterInput}
      className="mb-2 w-full"
    >
      <Option value="" disabled>
        BVN Verification Status
      </Option>
      <Option value="true" name="isBVN_verified">
        Verified
      </Option>
      <Option value="false" name="isBVN_verified">
        Unverfied
      </Option>
    </Select>
  );
};

export default BVNVerifiedFilter;
