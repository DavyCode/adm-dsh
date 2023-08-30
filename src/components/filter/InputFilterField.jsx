import React from "react";
import { Input } from "antd";

const InputFilterField = ({
  handleInputField,
  inputValue,
  inputName,
  placeholder,
}) => {
  return (
    <Input
      value={inputValue}
      onChange={handleInputField}
      name={inputName}
      className="w-full mb-2"
      placeholder={placeholder}
    />
  );
};

export default InputFilterField;
