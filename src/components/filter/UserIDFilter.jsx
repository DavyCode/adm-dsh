import React from "react";
import { Input } from "antd";

const UserIDFilter = (props) => {
  const { userId } = props.data;
  const { handleInputField } = props;
  return (
    <Input
      value={userId}
      onChange={handleInputField}
      name="userId"
      className="w-full mb-2"
      placeholder="Enter User ID"
    />
  );
};

export default UserIDFilter;
