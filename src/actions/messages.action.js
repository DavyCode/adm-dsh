import {
  GET_ALL_MESSAGES,
  GET_ONE_MESSAGE,
  UPDATE_ONE_MESSAGE,
  DELETE_ONE_MESSAGE,
  SET_MESSAGES_DATA_FETCH_AMOUNT,
  SET_TRANSACTION_STATUS_FETCH,
} from "./action-types/action.types.js";

export const getAllMessages = (allMessages = []) => {
  return {
    type: GET_ALL_MESSAGES,
    payload: allMessages,
  };
};
export const getAMessage = (id = "") => {
  return {
    type: GET_ONE_MESSAGE,
    payload: id,
  };
};
export const updateAMessage = (data = {}) => {
  return {
    type: UPDATE_ONE_MESSAGE,
    payload: data,
  };
};
export const deleteAMessage = (id = "") => {
  return {
    type: DELETE_ONE_MESSAGE,
    payload: id,
  };
};

export const setFetchNumber = (num = 10) => ({
  type: SET_MESSAGES_DATA_FETCH_AMOUNT,
  payload: { fetchLimit: num, isDropDownOpen: false },
});

export const setStatus = (status = "") => ({
  type: SET_TRANSACTION_STATUS_FETCH,
  payload: { status },
});
