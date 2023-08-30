import React from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { MdSubscriptions } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { GiMoneyStack } from "react-icons/gi";
import { IoIosLock } from "react-icons/io";
import styles from "../styles/style.less";
import {
  DashboardOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  LaptopOutlined,
  UnorderedListOutlined,
  MessageOutlined,
} from "@ant-design/icons";

import { Layout, Menu } from "antd";
const { SubMenu } = Menu;
const { Sider } = Layout;

const Navbar = (props) => {
  const { url } = useRouteMatch();
  const userRole = localStorage.getItem("role");
  return (
    <Sider
      trigger={null}
      collapsible
      className="navContainer"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
      }}
    >
      <div className="logo">
        <span>Fybapay</span>
        <img
          src={require("../assets/fybapay_favicon_673x673.png")}
          alt="brand-logo"
        />
      </div>
      <Menu mode="inline" className="navContainer">
        <Menu.Item>
          <NavLink exact to={`${url}`}>
            <span className="flex items-center text-white">
              <DashboardOutlined />
              Dashboard
            </span>
          </NavLink>
        </Menu.Item>
        <SubMenu
          key="people"
          title={
            <span className="flex items-center">
              <UsergroupAddOutlined />
              People
            </span>
          }
        >
          <Menu.Item key="users">
            <NavLink exact to={`${url}/users`}>
              <span className="flex items-center text-white">
                <UserOutlined /> Users
              </span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="agents">
            <NavLink exact to={`${url}/agents`}>
              <span className="flex items-center text-white">
                <UserOutlined />
                Agents
              </span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="aggregator">
            <NavLink exact to={`${url}/aggregator`}>
              <span className="flex items-center text-white">
                <UserOutlined />
                Aggregator
              </span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="newsignup">
            <NavLink exact to={`${url}/newsignup`}>
              <span className="flex items-center text-white">
                <UserOutlined />
                New Sign up
              </span>
            </NavLink>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="transactions"
          title={
            <span className="flex items-center">
              <LaptopOutlined />
              Transactions
            </span>
          }
        >
          <Menu.Item key="services">
            <NavLink exact to={`${url}/services`}>
              <span className="flex items-center text-white">
                <GoGraph className="mr-2" />
                Services
              </span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="wallet">
            <NavLink exact to={`${url}/wallet`}>
              <span className="flex items-center text-white">
                <GoGraph className="mr-2" />
                Wallet
              </span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="commissions">
            <NavLink exact to={`${url}/commissions`}>
              <span className="flex items-center text-white">
                <GoGraph className="mr-2" />
                Commissions
              </span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="postransactions">
            <NavLink exact to={`${url}/postransactions`}>
              <span className="flex items-center text-white">
                <GoGraph className="mr-2" />
              POS Transactions
              </span>
            </NavLink>
          </Menu.Item>
        </SubMenu>
        <Menu.Item>
          <NavLink exact to={`${url}/subscriptions`}>
            <span className="flex items-center text-white">
              <MdSubscriptions className="mr-2" />
              Subscriptions
            </span>
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink exact to={`${url}/messages`}>
            <span className="flex items-center text-white">
              <MessageOutlined className="mr-2" />
              Messages
            </span>
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink exact to={`${url}/finance`}>
            <span className="flex items-center text-white">
              <GiMoneyStack className="mr-2" />
              Finance
            </span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="paymentnotification">
          <NavLink exact to={`${url}/paymentnotification`}>
            <span className="flex items-center text-white">
              <FaRegCircle className="mr-2" />
              Wallet Noficiation
            </span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="pos">
          <NavLink exact to={`${url}/pos`}>
            <span className="flex items-center text-white">
              <FaRegCircle className="mr-2" />
              POS Terminals
            </span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="posnotifications">
          <NavLink exact to={`${url}/posnotifications`}>
            <span className="flex items-center text-white">
              <FaRegCircle className="mr-2" />
              POS Notifications
            </span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="issuesmgt">
          <NavLink exact to={`${url}/issuesmgt`}>
            <span className="flex items-center text-white">
              <FaRegCircle className="mr-2" />
              Issues Management
            </span>
          </NavLink>
        </Menu.Item>
        {["admin", "superAdmin"].includes(userRole) && (
          <SubMenu
            key="admin"
            title={
              <span className="flex items-center">
                <IoIosLock className="mr-2" />
                Admin
              </span>
            }
          >
            <Menu.Item key="agentsrequest">
              <NavLink exact to={`${url}/agentsrequest`}>
                <span className="flex items-center text-white">
                  <UserOutlined />
                  Agents Request
                </span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="adminServices">
              <NavLink exact to={`${url}/adminservices`}>
                <span className="flex items-center text-white">
                  <FaRegCircle className="mr-2" />
                  Services
                </span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="refunds">
              <NavLink exact to={`${url}/refunds`}>
                <span className="flex items-center text-white">
                  <FaRegCircle className="mr-2" />
                  Refunds
                </span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="appupdates">
              <NavLink exact to={`${url}/appupdates`}>
                <span className="flex items-center text-white">
                  <FaRegCircle className="mr-2" />
                  App Updates
                </span>
              </NavLink>
            </Menu.Item>

            <Menu.Item key="switchlogs">
              <NavLink exact to={`${url}/switchlogs`}>
                <span className="flex items-center text-white">
                  <FaRegCircle className="mr-2" />
                  Switch Logs
                </span>
              </NavLink>
            </Menu.Item>
          </SubMenu>
        )}
      </Menu>
    </Sider>
  );
};

export default Navbar;
