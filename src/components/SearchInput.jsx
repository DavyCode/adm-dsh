import React from "react";
import { Input } from "antd";
import styles from "../styles/style.less";

const { Search } = Input;

const SearchInput = () => {
  return (
    <div className="flex items-center">
      <Search
        placeholder="input search text"
        enterButton="Search"
        size="middle"
        onSearch={(value) => console.log(value)}
        className="search-field"
      />
    </div>
  );
};

export default SearchInput;
