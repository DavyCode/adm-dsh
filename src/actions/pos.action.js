import {
  GET_ALL_POS,
  GET_ONE_POS,
  UPDATE_ONE_POS,
  DELETE_ONE_POS,
  SET_POS_DATA_FETCH_AMOUNT,
  SHOW_POS_DETAILS,
  GET_ALL_TRANSACTIONS_ON_POS,
  GET_SINGLE_TRANSACTIONS_ON_POS,
  SET_POS_DATA_FETCH_AMOUNT_POS_TRANX,
} from './action-types/action.types';

export const getAllPosRequest = (allPos = []) => {
  return {
    type: GET_ALL_POS,
    payload: allPos,
  };
};
export const getAllTransactionOnPOS = (allTransactionOnAPOS = []) => {
  return {
    type: GET_ALL_TRANSACTIONS_ON_POS,
    payload: allTransactionOnAPOS,
  };
};

export const getATransactionOnPOS = (posId) => {
  return {
    type: GET_SINGLE_TRANSACTIONS_ON_POS,
    payload: {
      posId,
    },
  };
};

export const getAPos = (posID) => {
  return {
    type: GET_ONE_POS,
    payload: {
      posID,
    },
  };
};

export const updateAPos = (data = {}) => {
  return {
    type: UPDATE_ONE_POS,
    payload: data,
  };
};

// export const deleteAPos = (id = "") => {
//   return {
//     type: DELETE_ONE_POS,
//     payload: id,
//   };
// };
export const displayPOSDetails = ({
  showPOSDetails = false,
  posId = '',
} = {}) => ({
  type: SHOW_POS_DETAILS,
  payload: {showPOSDetails, posId},
});

export const setFetchNumber = (num = 10) => ({
  type: SET_POS_DATA_FETCH_AMOUNT,
  payload: {fetchLimit: num, isDropDownOpen: false},
});

export const setFetchNumberPOSTranx = (num = 10) => ({
  type: SET_POS_DATA_FETCH_AMOUNT_POS_TRANX,
  payload: {fetchLimitTRX: num, isDropDownOpen: false},
});
