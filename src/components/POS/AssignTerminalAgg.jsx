import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useToasts} from 'react-toast-notifications';
import axiosData from '../../utils/axiosData.js';
import Loading from '../Loading';
import axios from 'axios';
import {Popconfirm, message} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';

const url = process.env.REACT_APP_ADMIN_URL;

const AssignTerminalAgg = ({data, fetchData, returnHandler}) => {
  const {addToast} = useToasts();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const {
    assignedToAggregator,
    terminalId,
    //_id,
    // blocked,
    meta: {createdAt},
  } = data;

  const [fieldsToUpdate, setFieldsToUpdate] = useState({
    phone: '',
    terminalId: terminalId,
  });

  // const [fieldsToUpdateDetach, setFieldsToUpdateDetach] = useState({
  //   phone: '',
  //   terminalId: terminalId,
  // });

  // const [terminalID, setTerminalID] = useState({
  //   terminalId: terminalId,
  // });

  const changeHandler = (event) => {
    const {name, value} = event.currentTarget;
    setFieldsToUpdate({...fieldsToUpdate, [name]: value});
  };
  // const changeHandlerDetach = (event) => {
  //   const {name, value} = event.currentTarget;
  //   setFieldsToUpdateDetach({...fieldsToUpdateDetach, [name]: value});
  // };

  const submitFormHandler = async (event) => {
    event.preventDefault();
    const controller = axios.CancelToken.source();
    setIsLoading(true);
    try {
      const data = {
        body: {...fieldsToUpdate},
        method: 'PUT',
        url: `${url}/pos/terminal/aggregator/assign`,
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

  const AdminDetachTerminal = async (event) => {
    event.preventDefault();
    const controller = axios.CancelToken.source();
    setIsLoading(true);
    try {
      const data = {
        body: {...fieldsToUpdate},
        method: 'PUT',
        url: `${url}/pos/terminal/aggregator/detach`,
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
      {assignedToAggregator === true ? (
        <div>
          <div>
            <div
              style={{
                justifyContent: 'center',
                display: 'flex',
                margin: '15px 10px',
              }}>
              <h1 style={{fontSize: '25px'}}>Aggerator Information</h1>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '10px',
              }}>
              <label style={{textTransform: 'uppercase', fontSize: '15px'}}>
                Aggregator Name:
              </label>
              <div>
                <span style={{margin: '10px 20px'}}>
                  {`${data.aggregator.firstName} ${data.aggregator.lastName}`}
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
                Aggregator Phone Number:
              </label>
              <div>
                <span style={{margin: '10px 20px'}}>
                  {`${data.aggregator.phone}`}
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
                Aggregator Email:
              </label>
              <div>
                <span style={{margin: '10px 20px'}}>
                  {`${data.aggregator.email}`}
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
            <h2>Detach Terminal Aggregator</h2>
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
                  // onChange={changeHandler}
                  //placeholder="Terminal Id"
                  disabled
                />
              </div>
            </div>
            {/* <div>
              <label htmlFor="address">Address</label>
              <div>
                <input
                  type="text"
                  name="address"
                  id="useraddress"
                  value={fieldsToUpdate.address && fieldsToUpdate.address}
                  onChange={changeHandler}
                  placeholder="Address"
                />
              </div>
            </div> */}
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
              POS not yet assigned to Aggerator
            </h3>
          </div>
          <hr />
          <form action="" className="general-info" onSubmit={submitFormHandler}>
            <h2>Assign POS to Aggregator</h2>
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
                  id="terminalId"
                  value={fieldsToUpdate.terminalId && fieldsToUpdate.terminalId}
                  disabled
                />
              </div>
            </div>
            {/* <div>
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
            </div> */}
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

export default AssignTerminalAgg;
