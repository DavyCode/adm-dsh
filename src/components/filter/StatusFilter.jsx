/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

import { Select } from "antd";

const { Option } = Select;

const StatusFilter = (props) => {
  const { status } = props.data;
  const { handleFilterInput } = props;
  const { defaultText } = props;
  return (
    <Select className="w-full mb-2" value={status} onChange={handleFilterInput}>
      <Option value="" disabled>
        {defaultText}
      </Option>
      <Option value="Successful" name="status">
        Successful
      </Option>
      <Option value="Pending" name="status">
        Pending
      </Option>
      <Option value="Init" name="status">
        Init
      </Option>
      <Option value="Null" name="status">
        Null
      </Option>
      <Option value="Failed" name="status">
        Failed
      </Option>
    </Select>
  );
};

export default StatusFilter;
