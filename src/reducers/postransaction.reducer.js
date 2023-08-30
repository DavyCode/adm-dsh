import produce from "immer";
import {
  GET_ALL_POS_TRANSACTION,
  GET_ONE_POS_TRANSACTION,
  SET_POS_TRANSACTION_FETCH_AMOUNT,
} from "../actions/action-types/action.types.js";

const initialState = {
  allPostransaction: [],
  singlePostransaction: {},
  fetchLimit: 10,
  isDropDownOpen: false,
  displayStatus: {
    successful: null,
    failed: null,
  },
};

const postransactionreducer = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case GET_ALL_POS_TRANSACTION:
      return produce(state, (draft) => {
        draft.allPostransaction = payload;
        // const successful = payload.filter((data) => data.status === "OPEN")
        //   .length;
        // const pending = payload.filter((data) => data.status === "CLOSE")
        //   .length;
        // draft.displayStatus = {
        //   successful,
        //   pending,
        // };
      });

    case GET_ONE_POS_TRANSACTION:
      return produce(state, (draft) => {
        const postransactionData = draft.allPostransaction.find(
          (data) => data._id === payload.postransactionid
        );
        draft.singlePostransaction = postransactionData;
      });

    case SET_POS_TRANSACTION_FETCH_AMOUNT:
      return produce(state, (draft) => {
        draft.fetchLimit = payload.fetchLimit;
        draft.isDropDownOpen = payload.isDropDownOpen;
      });

    default:
      return state;
  }
};

export default postransactionreducer;
