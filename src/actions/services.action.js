import {
  GET_ALL_SERVICES_TRANSACTIONS,
  GET_ONE_SERVICE_TRANSACTION,
  SET_SERVICE_DATA_FETCH_AMOUNT,
  SET_TRANSACTION_STATUS_FETCH,
} from "./action-types/action.types.js";

export const getAllServiceTransactions = (allUsersTransactions = []) => {
  return {
    type: GET_ALL_SERVICES_TRANSACTIONS,
    payload: {
      allUsersTransactions,
    },
  };
};
export const getAServiceTransaction = (transactionID) => {
  return {
    type: GET_ONE_SERVICE_TRANSACTION,
    payload: {
      transactionID,
    },
  };
};

export const setFetchNumber = (num = 10) => ({
  type: SET_SERVICE_DATA_FETCH_AMOUNT,
  payload: { fetchLimit: num, isDropDownOpen: false },
});

export const setStatus = (status = "") => ({
  type: SET_TRANSACTION_STATUS_FETCH,
  payload: { status },
});
