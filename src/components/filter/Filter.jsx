import React from "react";
import { Button, Popover } from "antd";
import styles from "../../styles/style.less";

const Filter = (props) => {
  const { filterSubmitHandler, clearFilterHandler } = props;

  const [visible, setVisible] = React.useState(false);

  const hide = () => {
    setVisible(() => false);
  };

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };
  const content = (
    <div className="px-2 flex flex-col justify-around w-281px">
      <p
        className="uppercase text-center mb-2 text-white py-2"
        style={{ backgroundColor: "#4d3a8f" }}
      >
        Search Filters
      </p>
      <Button
        className="uppercase mb-2"
        type="link"
        onClick={clearFilterHandler}
      >
        Clear Filters
      </Button>
      <div className="w-full mb-2 flex flex-col justify-between items-center">
        {props.children}
      </div>
      <Button
        className="uppercase text-white mb-4"
        style={{ backgroundColor: "#161745" }}
        onClick={() => {
          filterSubmitHandler();
          hide();
        }}
      >
        Apply Filters
      </Button>
    </div>
  );
  return (
    <div>
      <Popover
        content={content}
        trigger="click"
        placement="left"
        overlayClassName="filter-container"
        visible={visible}
        onVisibleChange={handleVisibleChange}
      >
        <Button
          className="text-white mr-4"
          style={{ backgroundColor: "#161745", color: "#ffffff" }}
        >
          Set Filters
        </Button>
      </Popover>
    </div>
  );
};

export default Filter;
