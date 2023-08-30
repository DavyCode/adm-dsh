/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

import { Select } from "antd";

const { Option } = Select;

const RoleFilter = (props) => {
  const { role } = props.data;
  const { handleFilterInput } = props;
  return (
    <Select value={role} onChange={handleFilterInput} className="mb-2 w-full">
      <Option value="" disabled>
        Select Role
      </Option>
      <Option value="superAdmin" name="role">
        Super Admin
      </Option>
      <Option value="superAgent" name="role">
        Super Agent
      </Option>
      <Option value="admin" name="role">
        Admin
      </Option>
      <Option value="agent" name="role">
        Agent
      </Option>
      <Option value="support" name="role">
        Support
      </Option>
      <Option value="user" name="role">
        User
      </Option>
    </Select>
  );
};

export default RoleFilter;
