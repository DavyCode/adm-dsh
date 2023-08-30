import produce from "immer";

import {
  GET_ALL_POS_NOTIFICATION,
  GET_ONE_POS_NOTIFICATION,
  SET_POS_NOTIFICATION_FETCH_AMOUNT,
} from "../actions/action-types/action.types";

const initialState = {
  allPosNotification: [],
  singlePosNotification: {},
  fetchLimit: 10,
  isDropDownOpen: false,
  displayStatus: {
    successful: null,
    failed: null,
  },
};

const posNotificationReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_ALL_POS_NOTIFICATION:
      return produce(state, (draft) => {
        draft.allPosNotification = payload;
      });

    case GET_ONE_POS_NOTIFICATION:
      return produce(state, (draft) => {
        const posNoteData = draft.allPosNotification.find(
          (data) => data._id === payload.posNotificationID
        );
        draft.singlePosNotification = posNoteData;
      });

    case SET_POS_NOTIFICATION_FETCH_AMOUNT:
      return produce(state, (draft) => {
        draft.fetchLimit = payload.fetchLimit;
        draft.isDropDownOpen = payload.isDropDownOpen;
      });
    default:
      return state;
  }
};

export default posNotificationReducer;
