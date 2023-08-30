import {
  GET_ALL_POS_NOTIFICATION,
  GET_ONE_POS_NOTIFICATION,
  SET_POS_NOTIFICATION_FETCH_AMOUNT,
} from "./action-types/action.types";

export const getAllPosNotification = (allPosNotification = []) => {
  return {
    type: GET_ALL_POS_NOTIFICATION,
    payload: allPosNotification,
  };
};

export const getAPosNotification = (posNotificationID) => {
  return {
    type: GET_ONE_POS_NOTIFICATION,
    payload: {
      posNotificationID,
    },
  };
};

export const setFetchNumber = (num = 10) => ({
  type: SET_POS_NOTIFICATION_FETCH_AMOUNT,
  payload: {
    fetchLimit: num,
    isDropDownOpen: false,
  },
});
