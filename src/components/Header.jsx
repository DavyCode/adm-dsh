import React, { useState } from "react";
import styles from "../styles/style.less";
import { useHistory } from "react-router-dom";
import { Avatar, Layout, Menu, Dropdown, Button, message, Tooltip } from "antd";
import { UserOutlined, SettingOutlined } from "@ant-design/icons";
import { FiLogOut } from "react-icons/fi";
import Loading from "./Loading.jsx";

const { Header } = Layout;

const AppHeader = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const handleButtonClick = (e) => {
    e.persist();
    message.info("Click on left button.");
  };

  const handleMenuClick = (e) => {
    message.info("Click on menu item.");
  };

  const handleLogout = (e) => {
    localStorage.clear();
    history.push("/");
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <UserOutlined />
        1st menu item
      </Menu.Item>
      <Menu.Item key="2">
        <SettingOutlined />
        <button type="button" style={{ outline: "none", border: "none" }}>
          Account settings
        </button>
      </Menu.Item>
      <Menu.Item key="3" className="flex items-center">
        <button
          type="button"
          style={{ outline: "none", border: "none" }}
          onClick={handleLogout}
        >
          <FiLogOut className="inline-block mr-10px" />
          Logout
        </button>
      </Menu.Item>
    </Menu>
  );
  return (
    <Header className="header headerContainer text-right">
      {loading && <Loading />}
      <Dropdown overlay={menu} trigger={["click"]}>
        <Avatar shape="square" size={35} icon={<UserOutlined />} />
      </Dropdown>
    </Header>
  );
};

export default AppHeader;
