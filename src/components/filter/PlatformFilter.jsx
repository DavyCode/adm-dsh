import React from "react";

import { Select } from "antd";

const { Option } = Select;

const PlatformFilter = (props) => {
  const { platform } = props.data;
  const { handleFilterInput, platforms } = props;
  return (
    <Select
      value={platform}
      onChange={handleFilterInput}
      className="mb-2 w-full"
    >
      <Option value="" disabled>
        Select platform
      </Option>
      {platforms.map((item, index) => {
        return (
          <Option value={item.name} name="platform" key={index}>
            {item.name}
          </Option>
        );
      })}
    </Select>
  );
};

export default PlatformFilter;
