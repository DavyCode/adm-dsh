import { GET_ALL_SWITCH_LOGS } from "../actions/action-types/action.types.js";
import produce from "immer";

const initialState = { logs: [] };

const switchReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_ALL_SWITCH_LOGS:
      return produce(state, draft => {
        draft.logs = payload.logs;
      });

    default:
      return state;
  }
};

export default switchReducer;
