import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useToasts} from 'react-toast-notifications';
import axiosData from '../../utils/axiosData.js';
import Loading from '../Loading';
import axios from 'axios';
import {Popconfirm, message, Button} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';

const url = process.env.REACT_APP_ADMIN_URL;

const SecurityTab = ({data, fetchData, returnHandler}) => {
  const {addToast} = useToasts();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const {
    assignedToAgent,
    terminalId,
    _id,
    blocked,
    meta: {createdAt},
  } = data;

  const [fieldsToUpdate, setFieldsToUpdate] = useState({
    phone: '',
    terminalId: '',
  });
  const [terminalID, setTerminalID] = useState({
    terminalId: terminalId,
  });

  const confirmDelete = async (e) => {
    setIsLoading(() => true);
    const controller = axios.CancelToken.source();
    try {
      const data = {
        url: `${url}/pos/terminal`,
        method: 'DELETE',
        body: {terminalId: terminalId},
      };
      const posData = await axiosData(data);
      if (posData.status === 'success') {
        addToast(`${posData.message}`, {
          appearance: 'success',
          autoDismiss: 'true',
        });
        returnHandler();
        await fetchData(controller);
        return;
      } else {
        if (posData.response) {
          addToast(posData.response.data.message, {
            appearance: 'error',
            autoDismiss: true,
          });
        } else {
          addToast(posData.message, {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      }
      setIsLoading(false);
    } catch (error) {}
  };

  const AdminblockTerminal = async (event) => {
    event.preventDefault();
    const controller = axios.CancelToken.source();
    setIsLoading(true);
    try {
      const data = {
        body: {...terminalID},
        method: 'PUT',
        url: `${url}/pos/terminal/block`,
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
      }
      setIsLoading(false);
    } catch (ex) {
      setIsLoading(false);
    }
  };
  const AdminUnblockTerminal = async (event) => {
    event.preventDefault();
    const controller = axios.CancelToken.source();
    setIsLoading(true);
    try {
      const data = {
        body: {...terminalID},
        method: 'PUT',
        url: `${url}/pos/terminal/unblock`,
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
      }
      setIsLoading(false);
    } catch (ex) {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2
        style={{
          textTransform: 'uppercase',
          fontSize: '22px',
          fontweight: 600,
          textalign: 'center',
          marginBottom: '1em',
          textAlign: 'center',
        }}>
        Security Information
      </h2>
      <div>
        <div>
          <div>
            {blocked === true ? (
              <>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    marginTop: '55px',
                  }}>
                  <h2
                    style={{
                      textTransform: 'uppercase',
                      fontSize: '16px',
                      fontweight: 600,
                    }}>
                    Unblock Agent
                  </h2>
                  <Popconfirm
                    icon={
                      <ExclamationCircleOutlined
                        style={{paddingRight: '5px', color: 'red'}}
                      />
                    }
                    title={<span className="ml-4">Are you Sure?</span>}
                    okText="Yes"
                    cancelText="No"
                    onConfirm={AdminUnblockTerminal}
                    onCancel={(e) => {
                      message.error('Cancelled');
                    }}>
                    <button
                      type="submit"
                      style={{
                        margintop: '2em',
                        fontSize: '16px',
                        padding: '8px',
                        borderRadius: '3px',
                        backgroundColor: '#4d3a8f',
                        color: ' #ffffff',
                      }}
                      //  onClick={AdminblockTerminal}
                    >
                      Admin Unblock Terminal
                    </button>
                  </Popconfirm>
                  {/* <button
                    type="submit"
                    style={{
                      margintop: '2em',
                      fontSize: '16px',
                      padding: '8px',
                      borderRadius: '3px',
                      backgroundColor: '#4d3a8f',
                      color: ' #ffffff',
                    }}
                    onClick={AdminUnblockTerminal}>
                    Admin Unblock Terminal
                  </button> */}
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    marginTop: '55px',
                  }}>
                  <h2
                    style={{
                      textTransform: 'uppercase',
                      fontSize: '16px',
                      fontweight: 600,
                    }}>
                    Block this agent
                  </h2>
                  <Popconfirm
                    icon={
                      <ExclamationCircleOutlined
                        style={{paddingRight: '5px', color: 'red'}}
                      />
                    }
                    title={<span className="ml-4">Are you Sure?</span>}
                    okText="Yes"
                    cancelText="No"
                    onConfirm={AdminblockTerminal}
                    onCancel={(e) => {
                      message.error('Cancelled');
                    }}>
                    <button
                      type="submit"
                      style={{
                        margintop: '2em',
                        fontSize: '16px',
                        padding: '8px',
                        borderRadius: '3px',
                        backgroundColor: '#4d3a8f',
                        color: ' #ffffff',
                      }}
                      //  onClick={AdminblockTerminal}
                    >
                      Admin Block Terminal
                    </button>
                  </Popconfirm>
                  {/* <button
                    type="submit"
                    style={{
                      margintop: "2em",
                      fontSize: "16px",
                      padding: "8px",
                      borderRadius: "3px",
                      backgroundColor: "#4d3a8f",
                      color: " #ffffff",
                    }}
                    onClick={AdminblockTerminal}
                  >
                    Admin Block Terminal
                  </button> */}
                </div>
              </>
            )}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            marginTop: '55px',
          }}>
          <h2
            style={{
              textTransform: 'uppercase',
              fontSize: '16px',
              fontweight: 600,
            }}>
            Delete Terminal
          </h2>
          <Popconfirm
            icon={
              <ExclamationCircleOutlined
                style={{paddingRight: '5px', color: 'red'}}
              />
            }
            title={<span className="ml-4">Are you Sure?</span>}
            okText="Yes"
            cancelText="No"
            onConfirm={confirmDelete}
            onCancel={(e) => {
              message.error('Cancelled');
            }}>
            <Button type="danger">Delete Terminal</Button>
          </Popconfirm>
        </div>
      </div>
      {isLoading && <Loading />}
    </div>
  );
};

export default SecurityTab;
