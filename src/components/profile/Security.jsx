import React, { useState } from "react";
import { Select, Button, Popconfirm } from "antd";
import styles from "../../styles/style.less";
import axios from "axios";
import axiosData from "../../utils/axiosData.js";
import Modal from "../Modal.jsx";
import ModalLoader from "../ModalLoader.jsx";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { useToasts } from "react-toast-notifications";

const { Option } = Select;
const adminURL = process.env.REACT_APP_ADMIN_URL;
const url = `${adminURL}/users/lock`;
const url_two = `${adminURL}/users/unlock`;
const url_three = `${adminURL}/users/role`;
const url_four = `${adminURL}/aggregator/role/assign`;
const Security = ({ user, updated, returnHandler, fetchData }) => {
  const { addToast } = useToasts();
  const { _id, lock, ...rest } = user;
  const [isLocked, setIsLocked] = useState(lock);
  const [isLoading, setIsLoading] = useState(false);
  const [securityData, setSecurityData] = useState({ ...rest });
  const lockHandler = async () => {
    setIsLoading(true);
    const controller = axios.CancelToken.source();
    try {
      const data = {
        url,
        method: "PUT",
        body: {
          userId: _id,
        },
      };
      const lockUser = await axiosData(data);

      if (lockUser.statusCode === 200) {
        updated(true);
        setIsLoading(false);
        setIsLocked(lockUser.data.lock);
        fetchData(controller);
        returnHandler();
        return addToast(
          `${lockUser.data.firstName} ${lockUser.data.lastName} account locked successfully`,
          {
            appearance: "success",
            autoDismiss: true,
          }
        );
      } else {
        if (lockUser.response) {
          addToast(lockUser.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
        } else {
          addToast(lockUser.message, {
            appearance: "error",
            autoDismiss: true,
          });
        }
      }
      setIsLoading(false);
    } catch (error) {}
  };
  const unlockHandler = async () => {
    setIsLoading(true);
    const controller = axios.CancelToken.source();
    try {
      const data = {
        url: url_two,
        method: "PUT",
        body: {
          userId: _id,
        },
      };
      const unlockUser = await axiosData(data);
      if (unlockUser.statusCode === 200) {
        updated(true);
        returnHandler();
        setIsLoading(false);
        setIsLocked(unlockUser.data.lock);
        fetchData(controller);
        return addToast(
          `${unlockUser.data.firstName} ${unlockUser.data.lastName} account unlocked successfully`,
          {
            appearance: "success",
            autoDismiss: true,
          }
        );
      } else {
        setIsLoading(false);
        return addToast(unlockUser.message, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
      return addToast(error.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  const roleFilterHandler = (value) => {
    setSecurityData({
      ...securityData,
      role: value,
    });
  };

  const assignRoleHandler = async () => {
    try {
      setIsLoading(true);
      const controller = axios.CancelToken.source();
      const data = {
        method: "PUT",
        url: url_three,
        body: { userId: _id, role: securityData.role },
      };
      const newRole = await axiosData(data);
      if (newRole.statusCode === 200) {
        updated(true);
        setIsLoading(false);
        returnHandler();
        fetchData(controller);
        return addToast(`Role updated successfully`, {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        setIsLoading(false);
        return addToast(newRole.message, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
      return addToast(error.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const assignAggregatorsHandler = async () => {
    try {
      setIsLoading(true);
      const controller = axios.CancelToken.source();
      const data = {
        method: "PUT",
        url: url_four,
        body: { userId: _id },
      };
      const newRole = await axiosData(data);
      if (newRole.statusCode === 200) {
        updated(true);
        setIsLoading(false);
        returnHandler();
        fetchData(controller);
        return addToast(`Role updated successfully`, {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        setIsLoading(false);
        return addToast(newRole.message, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
      return addToast(error.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  return (
    <form action="" className="security-info">
      {isLoading === true && (
        <Modal style={{ backgroundColor: "hsla(0, 50%, 100%, 0.5)" }}>
          <ModalLoader />
        </Modal>
      )}
      <h2>Security Information</h2>

      <div>
        <label htmlFor="">Role</label>
        <Select
          defaultValue={user.role || "disabled"}
          style={{ width: 120 }}
          onChange={roleFilterHandler}
        >
          <Option value="disabled" disabled>
            Select Role
          </Option>
          <Option value="superAdmin">Super Admin</Option>
          <Option value="superAgent">Super Agent</Option>
          <Option value="admin">Admin</Option>
          <Option value="agent">Agent</Option>
          <Option value="support">Support</Option>
          <Option value="user">User</Option>
        </Select>
        <Button onClick={assignRoleHandler}>Assign Role</Button>
      </div>

      <div>
        <label htmlFor="">Aggregator</label>
        <Button onClick={assignAggregatorsHandler}>Make user Aggregator</Button>
      </div>

      <div>
        <label htmlFor="">User Profile</label>{" "}
        <Popconfirm
          icon={<AiOutlineQuestionCircle style={{ color: "red" }} />}
          title="Confirm lock on account？"
          okText={`${isLocked === true ? "Unlock" : "Lock"}`}
          onConfirm={isLocked === true ? unlockHandler : lockHandler}
        >
          <Button type="danger">
            {`${isLocked === true ? "Unlock" : "Lock"} ${
              securityData.firstName && securityData.firstName
            } ${securityData.lastName && securityData.lastName}${
              (securityData.firstName || securityData.lastName) && "'s"
            } Account`}
          </Button>
        </Popconfirm>
      </div>
    </form>
  );
};

export default Security;
