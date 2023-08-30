import {
	LOGIN_USER,
	LOGIN_SUCCESS,
	LOGIN_ERROR,
	LOGIN_LOADING_STATUS
} from "../actions/action-types/action.types.js";

const initialState = {
	phone: "",
	password: "",
	isLoading: false,
	error: "",
	isLoggedIn: false
};

const loginReducer = (state = initialState, {type, payload}) => {
	switch (type) {
		case LOGIN_USER:
			return {...state, ...payload};
		case LOGIN_SUCCESS:
			return {...state, ...payload};
		case LOGIN_ERROR:
			return {...state, ...payload};
		case LOGIN_LOADING_STATUS:
			return {...state, ...payload};
		default:
			return state;
	}
};

export default loginReducer;
