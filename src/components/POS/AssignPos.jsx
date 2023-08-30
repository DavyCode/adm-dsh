import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useToasts} from 'react-toast-notifications';
import axiosData from '../../utils/axiosData.js';
import Loading from '../Loading';
import axios from 'axios';
import {Popconfirm, message, Select} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {stateValues, lgaValues} from '../../common/StateData/stateAndLgaValues';
const url = process.env.REACT_APP_ADMIN_URL;

const AssignPOS = ({data, fetchData, returnHandler}) => {
  const {addToast} = useToasts();
  const {Option} = Select;

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const {assignedToAgent, terminalId, firstName, lastName} = data;

  const [fieldsToUpdate, setFieldsToUpdate] = useState({
    phone: '',
    terminalId: terminalId,
    address: '',
    state: '',
    lga: '',
  });
  // const [terminalID, setTerminalID] = useState({
  //   terminalId: terminalId,
  // });

  const changeHandler = (event) => {
    const {name, value} = event.currentTarget;
    setFieldsToUpdate({...fieldsToUpdate, [name]: value});
  };

  const handleSelectChange = (value) => {
    setFieldsToUpdate({...fieldsToUpdate, state: value});
  };

  const handleChangeLga = (value) => {
    setFieldsToUpdate({...fieldsToUpdate, lga: value});
  };
  const submitFormHandler = async (event) => {
    event.preventDefault();
    const controller = axios.CancelToken.source();
    setIsLoading(true);
    try {
      const data = {
        body: {...fieldsToUpdate},
        method: 'PUT',
        url: `${url}/pos/terminal/agent/assign`,
      };
      const updateResult = await axiosData(data);
      // console.log("==updateResult==", updateResult);
      if (updateResult.statusCode === 200) {
        addToast(updateResult.message, {
          appearance: 'success',
          autoDismiss: true,
        });
        fetchData(controller);
        setIsLoading(false);
        returnHandler();
      } else {
        if (updateResult.response) {
          addToast(updateResult.response.data.message, {
            appearance: 'error',
            autoDismiss: true,
          });
        } else {
          addToast(updateResult.message, {
            appearance: 'error',
            autoDismiss: true,
          });
        }
        setIsLoading(false);
      }
    } catch (ex) {}
  };

  const AdminDetachTerminal = async (event) => {
    event.preventDefault();
    const controller = axios.CancelToken.source();
    setIsLoading(true);
    let newValue = {
      phone: fieldsToUpdate.phone,
      terminalId: fieldsToUpdate.terminalId,
    };
    try {
      const data = {
        body: newValue,
        method: 'PUT',
        url: `${url}/pos/terminal/agent/detach`,
      };
      const updateResult = await axiosData(data);
      if (updateResult.statusCode === 200) {
        addToast(updateResult.message, {
          appearance: 'success',
          autoDismiss: true,
        });
        fetchData(controller);
        setIsLoading(false);
        returnHandler();
      } else {
        if (updateResult.response) {
          addToast(updateResult.response.data.message, {
            appearance: 'error',
            autoDismiss: true,
          });
        } else {
          addToast(updateResult.message, {
            appearance: 'error',
            autoDismiss: true,
          });
        }
        setIsLoading(false);
      }
    } catch (ex) {}
  };
  return (
    <div>
      {assignedToAgent === true ? (
        <div>
          <div>
            <div
              style={{
                justifyContent: 'center',
                display: 'flex',
                margin: '15px 10px',
              }}>
              <h1 style={{fontSize: '25px'}}>Agent Information</h1>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '10px',
              }}>
              <label style={{textTransform: 'uppercase', fontSize: '15px'}}>
                Agent Name:
              </label>
              <div>
                <span style={{margin: '10px 20px'}}>
                  {`${data.user.firstName} ${data.user.lastName}`}
                </span>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '10px',
              }}>
              <label style={{textTransform: 'uppercase', fontSize: '15px'}}>
                Agent Phone Number:
              </label>
              <div>
                <span style={{margin: '10px 20px'}}>
                  {`${data.user.phone}`}
                </span>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '10px',
              }}>
              <label style={{textTransform: 'uppercase', fontSize: '15px'}}>
                Agent Email:
              </label>
              <div>
                <span style={{margin: '10px 20px'}}>
                  {`${data.user.email}`}
                </span>
              </div>
            </div>
          </div>
          <hr />
          <form
            action=""
            className="general-info"
            //  onSubmit={AdminDeleteTerminal}
          >
            <h2>Detach Terminal from Agent</h2>
            <div>
              <label htmlFor="Phone Number">Phone Number</label>
              <div>
                <input
                  type="text"
                  name="phone"
                  id="phonenumber"
                  value={fieldsToUpdate.phone && fieldsToUpdate.phone}
                  onChange={changeHandler}
                  placeholder="Phone Number"
                  maxLength={11}
                />
              </div>
            </div>
            <div>
              <label htmlFor="terminalId">Terminal Id</label>
              <div>
                <input
                  type="text"
                  name="terminalId"
                  id="terminal"
                  value={fieldsToUpdate.terminalId && fieldsToUpdate.terminalId}
                  onChange={changeHandler}
                  //placeholder="Terminal Id"
                  // maxLength={8}
                  disabled
                />
              </div>
            </div>
            <div>
              <Popconfirm
                icon={<ExclamationCircleOutlined style={{color: 'red'}} />}
                title={<span className="ml-4">Are you Sure?</span>}
                onConfirm={AdminDetachTerminal}
                onCancel={(e) => message.error('Cancelled')}
                okText="Yes"
                cancelText="No">
                <a
                  //data-messageid={obj._id}
                  href="#"
                  className="flex justify-center items-center mr-2"
                  // onClick={AdminDeleteTerminal}
                >
                  <button type="submit">Detach Terminal</button>
                  {/* Delete */}
                </a>
              </Popconfirm>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '20px 0px',
            }}>
            <h3 style={{textTransform: 'uppercase', fontSize: '20px'}}>
              POS not yet assigned to Agent
            </h3>
          </div>
          <hr />
          <form action="" className="general-info" onSubmit={submitFormHandler}>
            <h2>ASSIGN POS TO AGENT</h2>
            <div>
              <label htmlFor="Phone Number">Phone Number</label>
              <div>
                <input
                  type="text"
                  name="phone"
                  id="phonenumber"
                  value={fieldsToUpdate.phone && fieldsToUpdate.phone}
                  onChange={changeHandler}
                  placeholder="Phone Number"
                  maxLength={11}
                />
              </div>
            </div>
            <div>
              <label htmlFor="terminalId">Terminal Id</label>
              <div>
                <input
                  type="text"
                  name="terminalId"
                  id="terminal"
                  value={fieldsToUpdate.terminalId && fieldsToUpdate.terminalId}
                  onChange={changeHandler}
                  // placeholder="Terminal Id"
                  //maxLength={8}
                  disabled
                />
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
              <label htmlFor="state">State</label>
              <Select
                style={{width: '100%'}}
                placeholder="Select state"
                onChange={handleSelectChange}
                // defaultValue={fieldsToUpdate.state}
              >
                {stateValues.map((item, index) => (
                  <Option key={index} value={item.value}>
                    {item.value}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <label htmlFor="lga">Local Government</label>
              <div>
                <Select
                  style={{width: '100%'}}
                  placeholder="Select local government"
                  onChange={handleChangeLga}
                  //defaultValue={fieldsToUpdate.lga}
                >
                  {lgaValues[fieldsToUpdate.state]
                    ? lgaValues[fieldsToUpdate.state].map((item, index) => {
                        return (
                          <Option key={index} value={item.name}>
                            {item.name}
                          </Option>
                        );
                      })
                    : ''}
                </Select>
              </div>
            </div>
            <div>
              <button type="submit">Assign Terminal</button>
            </div>
          </form>
        </div>
      )}

      {isLoading && <Loading />}
    </div>
  );
};

export default AssignPOS;
