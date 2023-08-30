import React, { useState } from "react";
import { Select } from "antd";
import moment from "moment";
import { SingleDatePicker } from "../Datepicker.jsx";
import axiosData from "../../utils/axiosData.js";
import { useToasts } from "react-toast-notifications";
import Modal from "../Modal.jsx";
import ModalLoader from "../ModalLoader.jsx";
import axios from "axios";
import {
  stateValues,
  lgaValues,
} from "../../common/StateData/stateAndLgaValues";
const { Option } = Select;
const url = process.env.REACT_APP_BASE_URL;
const BasicAccountInformation = ({
  user,
  updated,
  returnHandler,
  fetchData,
}) => {
  const { addToast } = useToasts();
  const { userId, ...remainingData } = user;
  const now = moment();
  const [isLoading, setIsLoading] = useState(false);
  const [fieldsToUpdate, setFieldsToUpdate] = useState({
    username: remainingData.username,
    dateOfBirth: remainingData.dateOfBirth,
    gender: remainingData.gender,
    firstName: remainingData.firstName,
    lastName: remainingData.lastName,
    email: remainingData.email,
    address: remainingData.address,
    street: remainingData.street,
    lga: remainingData.lga,
    state: remainingData.state,
    userId:remainingData._id
  });
  const dateHandler = (dateObj, actualDate) => {
    setFieldsToUpdate({ ...fieldsToUpdate, dateOfBirth: actualDate });
  };
  const changeHandler = (event) => {
    const { name, value } = event.currentTarget;
    setFieldsToUpdate({ ...fieldsToUpdate, [name]: value });
  };
  const handleSelectChange = (value) => {
    setFieldsToUpdate({ ...fieldsToUpdate, gender: value });
  };

  const handleStateChange = (value) => {
    setFieldsToUpdate({ ...fieldsToUpdate, state: value });
  };

  const handleChangeLga = (value) => {
    setFieldsToUpdate({ ...fieldsToUpdate, lga: value });
  };

  const submitFormHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const controller = axios.CancelToken.source();
    try {
      const data = {
        body: { ...fieldsToUpdate },
        method: "PUT",
        url: `${url}/rbq-admin/users/profile`,
      };
      const updateResult = await axiosData(data);
      if (updateResult.statusCode === 200) {
        updated(true);
        addToast(updateResult.message, {
          appearance: "success",
          autoDismiss: true,
        });
        fetchData(controller);
        setIsLoading(false);
        returnHandler();
      } else {
        if (updateResult.response) {
          addToast(updateResult.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
        } else {
          addToast(updateResult.message, {
            appearance: "error",
            autoDismiss: true,
          });
        }
        setIsLoading(false);
      }
    } catch (error) {}
  };

  return (
    <form action="" className="general-info" onSubmit={submitFormHandler}>
      {isLoading === true && (
        <Modal style={{ backgroundColor: "hsla(0, 50%, 100%, 0.5)" }}>
          <ModalLoader />
        </Modal>
      )}
      <h2>General User Information</h2>
      <div>
        <label htmlFor="firstName">First Name</label>{" "}
        <div>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={fieldsToUpdate.firstName && fieldsToUpdate.firstName}
            onChange={changeHandler}
            placeholder="First Name"
          />
        </div>
      </div>
      <div>
        <label htmlFor="lastName">Last Name</label>
        <div>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={fieldsToUpdate.lastName && fieldsToUpdate.lastName}
            onChange={changeHandler}
            placeholder="Last Name"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <div>
          <input
            type="email"
            name="email"
            id="email"
            value={fieldsToUpdate.email && fieldsToUpdate.email}
            onChange={changeHandler}
            placeholder="Email"
          />
        </div>
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <div>
          <input
            type="text"
            name="username"
            id="username"
            value={fieldsToUpdate.username && fieldsToUpdate.username}
            onChange={changeHandler}
            placeholder="Username"
          />
        </div>
      </div>
      <div>
        <label htmlFor="dateOfBirth">Date of Birth</label>
        <div style={{ display: "inline-block", alignItems: "center" }}>
          <SingleDatePicker
            date={moment(fieldsToUpdate.dateOfBirth) || moment(now)}
            onChange={dateHandler}
          />
          <br />
          <span
            style={{
              marginLeft: "1em",
              paddingTop: "0.5em",
              fontStyle: "italic",
              color: "#041473",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            {moment(fieldsToUpdate.dateOfBirth).format("Do, MMMM YYYY")}
          </span>
        </div>
      </div>
      <div>
        <label htmlFor="phone">Phone Number</label>
        <div>
          <input
            type="text"
            name="phone"
            id="phone"
            value={remainingData.phone}
            onChange={changeHandler}
            placeholder="Phone Number"
            disabled
          />
        </div>
      </div>
      <div>
        <label>Gender</label>
        <div>
          <Select
            defaultValue={remainingData.gender || "disabled"}
            onChange={handleSelectChange}
          >
            <Option value="disabled" disabled>
              Select Gender
            </Option>
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
          </Select>
          <span></span>
        </div>
      </div>
      <div>
        <label htmlFor="address">Address</label>
        <div>
          <input
            type="text"
            name="address"
            id="address"
            value={fieldsToUpdate.address && fieldsToUpdate.address}
            onChange={changeHandler}
            placeholder="Address"
          />
        </div>
      </div>
      <div>
        <label htmlFor="street">Street</label>
        <div>
          <input
            type="text"
            name="street"
            id="street"
            value={fieldsToUpdate.street && fieldsToUpdate.street}
            onChange={changeHandler}
            placeholder="Street"
          />
        </div>
      </div>
      <div>
        <label htmlFor="state">State of Residence</label>
        <Select
            style={{ width: "100%" }}
            placeholder="Select State"
            onChange={handleStateChange}
            defaultValue={fieldsToUpdate.state}
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
        {/* <div>
          <input
            type="text"
            name="state"
            id="state"
            value={fieldsToUpdate.state && fieldsToUpdate.state}
            onChange={changeHandler}
            placeholder="State"
          />
        </div> */}
      </div>
      <div>
        <label htmlFor="lga">LGA of Residence</label>
        <div>
            <Select
              style={{ width: "100%" }}
              placeholder="Select local government"
              onChange={handleChangeLga}
              defaultValue={fieldsToUpdate.lga}
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
          </div>
        {/* <div>
          <input
            type="text"
            name="lga"
            id="lga"
            value={fieldsToUpdate.lga && fieldsToUpdate.lga}
            onChange={changeHandler}
            placeholder="LGA"
          />
        </div> */}
      </div>
      
      <div>
        <label htmlFor="business-name">Business Name</label>
        <div>
          <input
            type="text"
            name="business-name"
            id="business-name"
            value={remainingData.businessName && remainingData.businessName}
            onChange={changeHandler}
            placeholder="Business Name"
            disabled
          />
        </div>
      </div>
      <div>
        <label htmlFor="business-address">Business Address</label>
        <div>
          <input
            type="text"
            name="business-address"
            id="business-address"
            value={
              remainingData.businessAddress && remainingData.businessAddress
            }
            onChange={changeHandler}
            placeholder="Business Address"
            disabled
          />
        </div>
      </div>
      <div>
        <label htmlFor="business-city">Business City</label>
        <div>
          <input
            type="text"
            name="business-city"
            id="business-city"
            value={remainingData.businessCity && remainingData.businessCity}
            onChange={changeHandler}
            placeholder="Business City"
            disabled
          />
        </div>
      </div>
      <div>
        <label htmlFor="business-lga">Business LGA</label>
        <div>
          <input
            type="text"
            name="business-lga"
            id="business-lga"
            value={remainingData.businessLga && remainingData.businessLga}
            onChange={changeHandler}
            placeholder="Business LGA"
            disabled
          />
        </div>
      </div>
      <div>
        <label>Agent ID</label>
        <div>
          <span>{remainingData.agentId && remainingData.agentId}</span>
        </div>
      </div>
      <div>
        <label>Agent Onboarding Date</label>
        <div>
          <span>
            {remainingData.agentOnboardingDate &&
              moment(remainingData.agentOnboardingDate).format("lll")}
          </span>
        </div>
      </div>
      <div>
        <label style={{ fontStyle: "italic" }}>Active User?</label>
        <div>
          <span style={{ fontStyle: "italic" }}>
            {remainingData.active ? remainingData.active : "false"}
          </span>
        </div>
      </div>
      <div>
        <label style={{ fontStyle: "italic" }}>Verified BVN?</label>
        <div>
          <span style={{ fontStyle: "italic" }}>
            {remainingData.isBVN_verified
              ? remainingData.isBVN_verified
              : "false"}
          </span>
        </div>
      </div>
      <div>
        <label>Date Joined</label>
        <div>
          <span>{moment(remainingData.meta.createdAt).format("lll")}</span>
        </div>
      </div>
      <div>
        <label>Last Updated</label>
        <div>
          <span>{moment(remainingData.meta.updatedAt).format("lll")}</span>
        </div>
      </div>
      <div>
        <button type="submit">Save changes</button>
      </div>
    </form>
  );
};

export default BasicAccountInformation;
