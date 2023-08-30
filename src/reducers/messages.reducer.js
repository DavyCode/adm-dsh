import produce from "immer";
import {
  GET_ALL_MESSAGES,
  GET_ONE_MESSAGE,
  DELETE_ONE_MESSAGE,
  SET_MESSAGES_DATA_FETCH_AMOUNT,
  SET_TRANSACTION_STATUS_FETCH,
  UPDATE_ONE_MESSAGE,
} from "../actions/action-types/action.types.js";

const initialState = {
  allMessages: [],
  singleMessage: {},
  fetchLimit: 10,
  isDropDownOpen: false,
};

const messageReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_ALL_MESSAGES:
      return produce(state, (draft) => {
        draft.allMessages = payload;
      });

    case GET_ONE_MESSAGE:
      return produce(state, (draft) => {
        const messageData = draft.allMessages.find(
          (data) => data._id === payload
        );
        console.log("===messageData==", messageData);
        draft.singleMessage = messageData;
      });
    case DELETE_ONE_MESSAGE:
      return produce(state, (draft) => {
        const messageData = draft.allMessages.filter(
          (data) => data._id !== payload
        );
        draft.allMessages = messageData;
      });
    case SET_MESSAGES_DATA_FETCH_AMOUNT:
      return produce(state, (draft) => {
        draft.fetchLimit = payload.fetchLimit;
        draft.isDropDownOpen = payload.isDropDownOpen;
      });
    case SET_TRANSACTION_STATUS_FETCH:
      return produce(state, (draft) => {
        draft.status = payload.status;
      });
    case UPDATE_ONE_MESSAGE:
      return produce(state, (draft) => {
        const updateIndex = draft.allMessages.findIndex((data) => {
          return data._id === payload._id;
        });
        draft.allMessages.splice(updateIndex, 1, payload);
      });

    default:
      return state;
  }
};

export default messageReducer;
