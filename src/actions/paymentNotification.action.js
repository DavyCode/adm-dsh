import {
  GET_ALL_PAYMENT_NOTIFICATION,
  GET_ONE_PAYMENT_NOTIFICATION,
  SET_PAYMENT_NOTIFICATION_FETCH_AMOUNT,
} from "../actions/action-types/action.types";

export const getAllPayementNotification = (allPaymentNotification = []) => {
  return {
    type: GET_ALL_PAYMENT_NOTIFICATION,
    payload: allPaymentNotification,
  };
};

export const getAPaymentNotification = (paymentNoteID) => {
  return {
    type: GET_ONE_PAYMENT_NOTIFICATION,
    payload: {
      paymentNoteID,
    },
  };
};

export const setFetchNumber = (num = 10) => ({
  type: SET_PAYMENT_NOTIFICATION_FETCH_AMOUNT,
  payload: { fetchLimit: num, isDropDownOpen: false },
});
