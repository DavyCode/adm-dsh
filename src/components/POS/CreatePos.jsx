import React, { useState } from "react";
import { Button, Popover } from "antd";
import { Input, Select } from "antd";
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import axiosData from "../../utils/axiosData.js";
import Loading from "../Loading";
import {
  stateValues,
  lgaValues,
} from "../../common/StateData/stateAndLgaValues";
const baseURL = process.env.REACT_APP_ADMIN_URL;
const posTerminalUrl = `${baseURL}/pos/terminal`;

const CreatePos = (props) => {
  const storeFilter = useSelector((state) => state.filter);
  const { Option } = Select;

  const dispatch = useDispatch();
  const [userId, setUserId] = useState("");
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);
  const [fieldsToUpdate, setFieldsToUpdate] = useState({
    address: "",
    lga: "",
    partner: "",
    serialNumber: "",
    state: "",
    terminalId: "",
    aggregatorPhone: "",
    agentPhone: "",
  });

  const {
    headerText,
    buttonText,
    className,
    userData,
    populateData,
    popChange,
    updateVisible,
    updatePlacement,
    fetchData,
    updateLoading,
  } = props;
  const [visible, setVisible] = React.useState(false);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };
  // Handle User Input
  const changeHandler = (event) => {
    const { name, value } = event.currentTarget;
    setFieldsToUpdate({ ...fieldsToUpdate, [name]: value });
  };
  // Handling user select
  const handleSelectChange = (value) => {
    setFieldsToUpdate({ ...fieldsToUpdate, state: value });
  };
  // Handling user Select
  const handleChangeLga = (value) => {
    setFieldsToUpdate({ ...fieldsToUpdate, lga: value });
  };
  // const clearFilter = () => {
  //   console.log("Hitting me");
  //   return {
  //     fieldsToUpdate.address:''
  //     // address: "",
  //     // lga: "",
  //     // partner: "",
  //     // serialNumber: "",
  //     // state: "",
  //     // terminalId: "",
  //     // aggregatorPhone: "",
  //     // agentPhone: "",
  //   };
  // };

  const createPos = async (e) => {
    e.preventDefault();
    const controller = axios.CancelToken.source();
    try {
      setLoading(() => true);
      const data = {
        method: "POST",
        body: { ...fieldsToUpdate },
        url: posTerminalUrl,
      };

      const updatedresult = await axiosData(data);
      if (updatedresult.status === 200) {
        addToast(updatedresult.message, {
          appearance: "success",
          autoDismiss: true,
        });
        await fetchData(controller);
        setLoading(false);
      } else {
        if (updatedresult.response) {
          addToast(updatedresult.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
        } else {
          addToast(updatedresult.message, {
            appearance: "error",
            autoDismiss: true,
          });
        }
        setLoading(false);
      }
    } catch (error) {}
  };

  const createPos2 = async (e) => {
    e.preventDefault();
    const controller = axios.CancelToken.source();
    try {
      setLoading(() => true);
      const data = {
        method: "POST",
        body: {
          address: fieldsToUpdate.address,
          lga: fieldsToUpdate.lga,
          partner: fieldsToUpdate.partner,
          serialNumber: fieldsToUpdate.serialNumber,
          state: fieldsToUpdate.state,
          terminalId: fieldsToUpdate.terminalId,
        },
        url: posTerminalUrl,
      };

      const updatedresult = await axiosData(data);
      if (updatedresult.status === 200) {
        addToast(updatedresult.message, {
          appearance: "success",
          autoDismiss: true,
        });
        await fetchData(controller);
        setLoading(false);
      } else {
        if (updatedresult.response) {
          addToast(updatedresult.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
        } else {
          addToast(updatedresult.message, {
            appearance: "error",
            autoDismiss: true,
          });
        }
        setLoading(false);
      }
    } catch (error) {}
  };

  const content = (
    <div className="min-h-40vh text-center" style={{ width: 350 }}>
      <form
        action=""
        onSubmit={
          fieldsToUpdate.agentPhone === "" ||
          fieldsToUpdate.aggregatorPhone === ""
            ? createPos2
            : createPos
        }
      >
        <h3
          className="uppercase mb-4 font-extrabold text-base"
          style={{ color: "#161745" }}
        >
          {headerText}
        </h3>
        <div>
          <Select
            style={{ width: "100%" }}
            placeholder="Select State"
            onChange={handleSelectChange}
          >
            <Option value="disabled" disabled>
              Select State
            </Option>
            {stateValues.map((item, index) => (
              <Option key={index} value={item.value}>
                {item.value}
              </Option>
            ))}
          </Select>
          <Select
            style={{ width: "100%" }}
            placeholder="Select local government"
            onChange={handleChangeLga}
          >
            <Option value="disabled" disabled>
              Select Local government
            </Option>
            {lgaValues[fieldsToUpdate.state]
              ? lgaValues[fieldsToUpdate.state].map((item, index) => {
                  return (
                    <Option key={index} value={item.name}>
                      {item.name}
                    </Option>
                  );
                })
              : ""}
          </Select>
          <Input
            placeholder="Address"
            allowClear
            onChange={changeHandler}
            className="mb-2"
            name="address"
          />
          <Input
            placeholder="Serial Number"
            allowClear
            onChange={changeHandler}
            className="mb-2"
            name="serialNumber"
          />
          <Input
            placeholder="Terminal Id"
            allowClear
            onChange={changeHandler}
            className="mb-2"
            name="terminalId"
            maxLength={10}
          />
          <Input
            placeholder="Partner"
            allowClear
            onChange={changeHandler}
            className="mb-2"
            name="partner"
          />
          <Input
            placeholder="Agent Phone"
            allowClear
            onChange={changeHandler}
            className="mb-2"
            name="agentPhone"
            maxLength={11}
          />
          <Input
            placeholder="Aggregator Phone"
            allowClear
            onChange={changeHandler}
            className="mb-2"
            name="aggregatorPhone"
            maxLength={11}
          />
        </div>
        <div className="flex justify-center items-center">
          <button
            className="text-white mr-4 flex-1"
            style={{ backgroundColor: "#161745", color: "#ffffff" }}
          >
            Submit
          </button>
        </div>
      </form>
      {/* <button
        // className="flex-1"
        style={{ border: "#161745 1px solid", color: "#161745" }}
        onClick={() => clearFilter()}
      >
        Clear
      </button> */}
    </div>
  );
  return (
    <div className={className}>
      <Popover
        content={content}
        trigger="click"
        placement={updatePlacement ?? "left"}
        // overlayClassName="filter-container"
        visible={updateVisible || visible}
        onVisibleChange={popChange || handleVisibleChange}
      >
        <Button
          className={`text-white mr-4`}
          style={{ backgroundColor: "#161745", color: "#ffffff" }}
          onClick={(e) => {
            if (populateData) {
              return populateData();
            }
            return setUserId(e.target.dataset.userid);
          }}
          data-userid={userData}
        >
          {buttonText}
        </Button>
      </Popover>
      {loading && <Loading />}
    </div>
  );
};

export default CreatePos;
