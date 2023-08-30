import React from "react";

import { DatePicker } from "antd";

export const SingleDatePicker = ({ onChange, disabledDate, date }) => {
  const dateFormat = "YYYY-MM-DD";
  return (
    <DatePicker
      format={dateFormat}
      disabledDate={disabledDate}
      onChange={onChange}
      value={date}
      className="mb-2"
    />
  );
};
