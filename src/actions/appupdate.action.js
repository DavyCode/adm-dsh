import {
  GET_ALL_APPUPDATES,
  GET_ONE_UPDATE,
  DELETE_ONE_MESSAGE,
  SET_APP_UPDATE_DATA_FETCH_AMOUNT,
  SET_TRANSACTION_STATUS_FETCH,
} from "./action-types/action.types.js";

export const getAllAppUpdates = (allUpdates = []) => {
  return {
    type: GET_ALL_APPUPDATES,
    payload: allUpdates,
  };
};
export const getAnUpdate = (id = "") => {
  return {
    type: GET_ONE_UPDATE,
    payload: id,
  };
};
// export const deleteAMessage = (id = "") => {
//   return {
//     type: DELETE_ONE_MESSAGE,
//     payload: id,
//   };
// };

export const setFetchNumber = (num = 10) => ({
  type: SET_APP_UPDATE_DATA_FETCH_AMOUNT,
  payload: { fetchLimit: num, isDropDownOpen: false },
});
// export const setStatus = (status = "") => ({
//   type: SET_TRANSACTION_STATUS_FETCH,
//   payload: { status },
// });
