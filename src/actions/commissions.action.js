import {
  SAVE_ALL_FETCHED_COMMISSIONS_DATA,
  GET_A_COMMISSION_HISTORY,
  SET_COMMISSION_DATA_FETCH_AMOUNT
} from "./action-types/action.types.js";

export const saveAllCommissionsFetched = (data = []) => {
  return {
    type: SAVE_ALL_FETCHED_COMMISSIONS_DATA,
    payload: {
      allCommissionsData: data
    }
  };
};
export const getACommissionHistory = (str = "") => {
  return {
    type: GET_A_COMMISSION_HISTORY,
    payload: {
      commissionsID: str
    }
  };
};
export const setFetchNumber = (num = 10) => {
  return {
    type: SET_COMMISSION_DATA_FETCH_AMOUNT,
    payload: { fetchLimit: num, isDropDownOpen: false }
  };
};
