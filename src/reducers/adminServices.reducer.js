import produce from "immer";
import {
  GET_ALL_ADMIN_SERVICES,
  SET_ADMIN_SERVICE_DATA_FETCH_AMOUNT,
} from "../actions/action-types/action.types.js";

const initialState = { servicesData: [], fetchLimit: 10 };

const adminReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_ALL_ADMIN_SERVICES:
      return produce(state, (draft) => {
        draft.servicesData = payload.servicesData;
      });
    case SET_ADMIN_SERVICE_DATA_FETCH_AMOUNT:
      return produce(state, (draft) => {
        draft.fetchLimit = payload.fetchLimit;
      });

    default:
      return state;
  }
};

export default adminReducer;
