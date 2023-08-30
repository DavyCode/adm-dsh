import React from "react";

import { Select } from "antd";

const { Option } = Select;
const TransactionTypeFilter = (props) => {
  const { serviceType } = props.data;
  const { handleFilterInput } = props;
  const { defaultText } = props;
  return (
    <Select
      className="w-full mb-2"
      value={serviceType}
      onChange={handleFilterInput}
    >
      <Option value="" disabled>
        {defaultText}
      </Option>
      <Option value="WITHDRAW" name="serviceType">
        WITHDRAW
      </Option>
      <Option value="TRANSFER" name="serviceType">
        TRANSFER
      </Option>
      <Option value="FUND" name="serviceType">
        FUND
      </Option>
      <Option value="ELECTRICITY" name="serviceType">
        ELECTRICITY
      </Option>
      <Option value="CABLETV" name="serviceType">
        CABLETV
      </Option>
      <Option value="DATA" name="serviceType">
        DATA
      </Option>
      <Option value="AIRTIME" name="serviceType">
        AIRTIME
      </Option>
    </Select>
  );
};

export default TransactionTypeFilter;
