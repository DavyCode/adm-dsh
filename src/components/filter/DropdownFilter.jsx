/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

import { Select } from "antd";

const { Option } = Select;

const DropdownFilter = (props) => {
  const {
    dropdownName,
    inputValue,
    paymentMethods,
    defaultText,
    handleFilterInput,
  } = props;
  return (
    <Select
      className="w-full mb-2"
      value={inputValue}
      onChange={handleFilterInput}  
    >  
      <Option value="" disabled>
        {defaultText}
      </Option>
      {paymentMethods.map((data, index) => {
        return (
          <Option value={data.name} name={dropdownName} key={index}>
            {data.name}
          </Option>
        );
      })}
    </Select>
  );
};

export default DropdownFilter;
