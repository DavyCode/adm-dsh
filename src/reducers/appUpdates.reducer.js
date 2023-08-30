import produce from "immer";
import {
  GET_ALL_APPUPDATES,
  GET_ONE_UPDATE,
  GET_ONE_MESSAGE,
  DELETE_ONE_MESSAGE,
  SET_APP_UPDATE_DATA_FETCH_AMOUNT,
  SET_TRANSACTION_STATUS_FETCH,
} from "../actions/action-types/action.types.js";

const initialState = {
  allUpdates: [],
  singleUpdate: {},
  fetchLimit: 10,
  isDropDownOpen: false,
};

const appUpdateReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_ALL_APPUPDATES:
      return produce(state, (draft) => {
        draft.allUpdates = payload;
      });
    case GET_ONE_UPDATE:
      return produce(state, (draft) => {
        const updateData = draft.allUpdates.find(
          (data) => data._id === payload,
        );
        draft.singleUpdate = updateData;
      });
    // case DELETE_ONE_MESSAGE:
    //   return produce(state, (draft) => {
    //     const messageData = draft.allMessages.filter(
    //       (data) => data._id !== payload,
    //     );
    //     draft.allMessages = messageData;
    //   });
    case SET_APP_UPDATE_DATA_FETCH_AMOUNT:
      return produce(state, (draft) => {
        draft.fetchLimit = payload.fetchLimit;
        draft.isDropDownOpen = payload.isDropDownOpen;
      });
    // case SET_TRANSACTION_STATUS_FETCH:
    //   return produce(state, (draft) => {
    //     draft.status = payload.status;
    //   });

    default:
      return state;
  }
};

export default appUpdateReducer;
