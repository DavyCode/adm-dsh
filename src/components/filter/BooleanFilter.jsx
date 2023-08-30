import React from "react";

import { Select } from "antd";

const { Option } = Select;

const BooleanFilter = (props) => {
  const { inputValue, handleFilterInput, defaultText, inputName } = props;
  return (
    <Select
      value={inputValue}
      onChange={handleFilterInput}
      className="mb-2 w-full"
    >
      <Option value="" disabled>
        {defaultText}
      </Option>
      <Option value="true" name={inputName}>
        Yes
      </Option>
      <Option value="false" name={inputName}>
        No
      </Option>
    </Select>
  );
};

export default BooleanFilter;
