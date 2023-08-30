/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {FiEye, FiEyeOff} from 'react-icons/fi';
import {MdLock} from 'react-icons/md';
import {FaRegEnvelope} from 'react-icons/fa';
import {useToasts} from 'react-toast-notifications';
import homepageImage from '../assets/homepage2.jpeg';
import logo from '../assets/Group 1337xxhd.png';
import {LoginButton} from './Button.js';
import axiosData from '../utils/axiosData.js';
import Modal from './Modal.jsx';
import ModalLoader from './ModalLoader.jsx';

import {
  loginInput,
  loginSuccess,
  loginError,
  loginLoading,
} from '../actions/login.action.js';

const baseURL = process.env.REACT_APP_BASE_URL;
const url = `${baseURL}/users/authorize`;

function Login(props) {
  const {addToast} = useToasts();
  const history = useHistory();
  const state = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {phone, password, isLoading, error} = state;
  const displayPasswordHandler = () => {
    return setIsPasswordVisible((prevState) => !prevState);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(loginLoading(true));
    try {
      if (!phone || !password) {
        return dispatch(loginError('All fields are required'));
      }
      const result = await axiosData({
        url,
        method: 'POST',
        body: {phone, password},
      });
      if (result && result.status === 'success') {
        if (['user', 'agent', 'superAgent'].includes(result.data.role)) {
          addToast('You do not have the required credentials', {
            appearance: 'error',
            autoDismiss: 'true',
          });
          return dispatch(loginLoading(false));
        }
        dispatch(loginSuccess());
        localStorage.setItem('token', result.access_token);
        localStorage.setItem('role', result.data.role);
        history.replace('/home');
      } else {
        if (result.response) {
          addToast(result.response.data.message, {
            appearance: 'error',
            autoDismiss: true,
          });
        } else {
          addToast(result.message, {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      }
      // if (
      //   (result && result.status === "error") ||
      //   result.status === "failure"
      // ) {
      //   // addToast(result.message, { appearance: "error", autoDismiss: "true" });
      //   // dispatch(loginError(result.message));
      // } else {
      // if (result.response) {
      //   addToast(result.response.data.message || "Hyy", {
      //     appearance: "error",
      //     autoDismiss: true,
      //   });
      // } else {
      //   addToast(result.message || "yyy", {
      //     appearance: "error",
      //     autoDismiss: true,
      //   });
      // }
      // }
      dispatch(loginLoading(false));
    } catch (error) {}
  };
  return (
    <div
      className=""
      style={{
        fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
        color: '#4d3a8f',
      }}>
      {isLoading === true && (
        <Modal style={{backgroundColor: 'hsla(0, 50%, 100%, 0.5)'}}>
          <ModalLoader />
        </Modal>
      )}
      <div
        className="flex"
        style={{
          backgroundColor: '#ffffff',
        }}>
        <div className="flex-1 flex-shrink-0 relative h-screen flex flex-col justify-between pb-50px">
          <img
            src={homepageImage}
            className="absolute top-0 left-0 h-screen w-full object-cover"
            alt=""
          />
          <div
            className="absolute left-0 right-0 bg-transparent z-10 pl-4"
            style={{bottom: '5vh'}}>
            <div className="mt-20px ml-10px relative">
              <div className="mb-4">
                <img
                  src={logo}
                  alt=""
                  height="100"
                  style={{
                    height: '50px',
                    display: 'inline-block',
                  }}
                />
              </div>
              <div style={{color: 'rgb(22, 23, 69)'}} className="mb-8">
                <span style={{fontSize: '25px', fontWeight: '800'}}>
                  Welcome
                </span>
                <br />
                <span style={{fontSize: '20px', fontWeight: '400'}}>
                  Freedom of Banking at your fingertips
                </span>
                <br />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 pt-128px pl-43px">
          <form onSubmit={submitHandler}>
            <div className="mb-20px">
              <div className="text-24px tracking-tighter uppercase font-extrabold">
                Login to Fybapay ADMIN
              </div>
              <div className="text-15px">Enter your details below</div>
            </div>
            <label
              htmlFor="login-phone"
              className="mb-11px text-12px uppercase">
              Admin ID
            </label>
            <div className="mb-33px w-338px border-gray-300 border border-solid  px-3px py-3px flex items-center rounded-4px">
              <span className="inline-block w-5%">{<FaRegEnvelope />}</span>
              <input
                type="text"
                name="phone"
                id="login-phone"
                value={phone}
                onChange={(e) => dispatch(loginInput(e))}
                className="inline-block w-90% p-1 outline-none bg-white"
              />
            </div>
            <label
              htmlFor="login-password"
              className="mb-11px text-12px uppercase">
              Password
            </label>
            <div className="w-338px relative border-gray-300 border border-solid relative px-3px py-3px flex items-center rounded-4px">
              <span className="inline-block w-5%">{<MdLock />}</span>
              <input
                type={`${isPasswordVisible === true ? 'text' : 'password'}`}
                name="password"
                id="login-password"
                value={password}
                onChange={(e) => dispatch(loginInput(e))}
                className="inline-block w-90% p-1 outline-none bg-white"
              />
              <span
                className="inline-block w-5%"
                onClick={displayPasswordHandler}>
                {isPasswordVisible === true ? <FiEye /> : <FiEyeOff />}
              </span>
            </div>
            <a
              className="block text-right text-12px text-gray-600 no-underline w-338px mb-33px"
              href="#">
              Forgot your password?
            </a>
            <LoginButton
              isLoading={isLoading}
              type="submit"
              disabled={isLoading}>
              {isLoading ? 'Logging in' : 'Login'}
            </LoginButton>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
