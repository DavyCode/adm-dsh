import produce from "immer";
import {
  GET_ALL_PAYMENT_NOTIFICATION,
  GET_ONE_PAYMENT_NOTIFICATION,
  SET_PAYMENT_NOTIFICATION_FETCH_AMOUNT,
} from "../actions/action-types/action.types.js";

const initialState = {
  allPaymentNotification: [],
  singlePaymentNotification: {},
  fetchLimit: 10,
  isDropDownOpen: false,
  displayStatus: {
    successful: null,
    failed: null,
  },
};

const paymentNotificiationReducer = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case GET_ALL_PAYMENT_NOTIFICATION:
      return produce(state, (draft) => {
        draft.allPaymentNotification = payload;
        // const successful = payload.filter((data) => data.status === "OPEN")
        //   .length;
        // const pending = payload.filter((data) => data.status === "CLOSE")
        //   .length;
        // draft.displayStatus = {
        //   successful,
        //   pending,
        // };
      });

    case GET_ONE_PAYMENT_NOTIFICATION:
      return produce(state, (draft) => {
        const paymentNoteData = draft.allPaymentNotification.find(
          (data) => data._id === payload.paymentNoteID
        );
        draft.singlePaymentNotification = paymentNoteData;
      });

    case SET_PAYMENT_NOTIFICATION_FETCH_AMOUNT:
      return produce(state, (draft) => {
        draft.fetchLimit = payload.fetchLimit;
        draft.isDropDownOpen = payload.isDropDownOpen;
      });

    default:
      return state;
  }
};

export default paymentNotificiationReducer;
