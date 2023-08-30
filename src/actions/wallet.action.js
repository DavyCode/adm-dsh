import {
  GET_ALL_WALLETS_TRANSACTIONS,
  GET_ONE_WALLET_TRANSACTION,
  SET_WALLET_DATA_FETCH_AMOUNT,
  SET_TRANSACTION_STATUS_FETCH,
} from "./action-types/action.types.js";

export const getAllWalletTransactions = (allUsersTransactions = []) => {
  return {
    type: GET_ALL_WALLETS_TRANSACTIONS,
    payload: {
      allUsersTransactions,
    },
  };
};
export const getAWalletTransaction = (transactionID) => {
  return {
    type: GET_ONE_WALLET_TRANSACTION,
    payload: {
      transactionID,
    },
  };
};

export const setFetchNumber = (num = 10) => ({
  type: SET_WALLET_DATA_FETCH_AMOUNT,
  payload: { fetchLimit: num, isDropDownOpen: false },
});
export const setStatus = (status = "") => ({
  type: SET_TRANSACTION_STATUS_FETCH,
  payload: { status },
});
