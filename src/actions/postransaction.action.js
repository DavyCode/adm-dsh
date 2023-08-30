import {
  GET_ALL_POS_TRANSACTION,
  GET_ONE_POS_TRANSACTION,
  SET_POS_TRANSACTION_FETCH_AMOUNT,
} from "../actions/action-types/action.types";

export const getAllPostransaction = (allPostransaction = []) => {
  return {
    type: GET_ALL_POS_TRANSACTION,
    payload: allPostransaction,
  };
};

export const getAPostransaction = (postransactionid) => {
  return {
    type: GET_ONE_POS_TRANSACTION,
    payload: {
      postransactionid,
    },
  };
};

export const setFetchNumber = (num = 10) => ({
  type: SET_POS_TRANSACTION_FETCH_AMOUNT,
  payload: { fetchLimit: num, isDropDownOpen: false },
});