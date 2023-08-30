import {
  GET_ALL_USERS,
  DATA_LOADING_FALSE,
  DATA_LOADING_TRUE,
  SET_USER_DATA_FETCH_AMOUNT,
  TOGGLE_DROPDOWN_MENU,
  SHOW_USER_DETAILS,
  CLEAR_HIGHLIGHTED_USERS,
  ADD_ALL_USERS_TO_LIST,
  HIGHLIGHT_A_USER,
  REMOVE_A_USER_HIGHLIGHT,
  SET_FILTER_ROLE,
  GET_ALL_BANKS,
  FILTER_FETCH,
} from "./action-types/action.types.js";

export const getAllUsers = ({
  data = [],
  totalDocumentCount = 0,
  startPage = 0,
}) => ({
  type: GET_ALL_USERS,
  payload: { allUsers: data, totalDocumentCount, startPage },
});

export const setLoadingTrue = () => ({
  type: DATA_LOADING_TRUE,
  payload: { isLoading: true },
});
export const setLoadingFalse = () => ({
  type: DATA_LOADING_FALSE,
  payload: { isLoading: false },
});

export const setFetchNumber = (num = 10) => ({
  type: SET_USER_DATA_FETCH_AMOUNT,
  payload: { fetchLimit: num, isDropDownOpen: false },
});
export const displayUserDetails = ({
  showUserDetails = false,
  userId = "",
} = {}) => ({
  type: SHOW_USER_DETAILS,
  payload: { showUserDetails, userId },
});
export const setRole = (role = "") => ({
  type: SET_FILTER_ROLE,
  payload: { role },
});
export const setDropdown = (bool = false) => ({
  type: TOGGLE_DROPDOWN_MENU,
  payload: { isDropDownOpen: bool },
});

export const clearHighlightedUsers = (num) => ({
  type: CLEAR_HIGHLIGHTED_USERS,
  payload: { toggleAll: false, highlightedItems: [] },
});

export const addAllUsersToList = () => ({
  type: ADD_ALL_USERS_TO_LIST,
  payload: { toggleAll: true },
});

export const highlightUser = (str) => ({
  type: HIGHLIGHT_A_USER,
  payload: { highlightID: str },
});
export const removeUserHighlight = (str) => ({
  type: REMOVE_A_USER_HIGHLIGHT,
  payload: { highlightID: str, toggleAll: false },
});
export const setBankList = (data = []) => ({
  type: GET_ALL_BANKS,
  payload: { bankList: data },
});
