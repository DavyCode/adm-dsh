import axios from "axios";
import {
	LOGIN_USER,
	LOGIN_SUCCESS,
	LOGIN_ERROR,
	LOGIN_LOADING_STATUS
} from "./action-types/action.types";

const url = process.env.REACT_APP_LOGIN_WEB_URL;
//const url_two = "http://localhost:4000/api/v1/auth/login";

const initialLoginData = {
	phone: "",
	password: ""
};
const config = {
	headers: {
		Accept: "application/json, text/plain, */*",
		"Content-Type": "application/json"
	}
};

export const loginFetch = (loginData = initialLoginData) => {
	return axios.post(url, loginData, config).then(res => res);
};

export const loginInput = event => {
	const {name, value} = event.currentTarget;
	return {
		type: LOGIN_USER,
		payload: {
			[name]: value,
			error: ""
		}
	};
};

export const loginSuccess = () => {
	return {
		type: LOGIN_SUCCESS,
		payload: {
			isLoading: false,
			isLoggedIn: true,
			error: ""
		}
	};
};
export const loginError = (error = "Incorrect username or password") => {
	return {
		type: LOGIN_ERROR,
		payload: {
			isLoading: false,
			isLoggedIn: false,
			error
		}
	};
};
export const loginLoading = (bool = false) => {
	return {
		type: LOGIN_LOADING_STATUS,
		payload: {
			isLoading: bool,
			error: ""
		}
	};
};
