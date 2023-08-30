import {
  SAVE_ALL_FETCHED_COMMISSIONS_DATA,
  GET_A_COMMISSION_HISTORY,
  SET_COMMISSION_DATA_FETCH_AMOUNT
} from "../actions/action-types/action.types.js";
import produce from "immer";

const initialState = {
  allCommissionsData: [],
  commissionDataObj: {},
  fetchLimit: 10
};

const commissionsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SAVE_ALL_FETCHED_COMMISSIONS_DATA:
      return produce(state, draft => {
        const fetchedData = payload.allCommissionsData.map((data, index) => {
          data.serialNumber = index + 1;
          return data;
        });
        draft.allCommissionsData = fetchedData;
      });
    case GET_A_COMMISSION_HISTORY:
      return produce(state, draft => {
        const obj = draft.allCommissionsData.find(
          data => data._id === payload.commissionsID
        );
        draft.commissionDataObj = obj;
      });
    case SET_COMMISSION_DATA_FETCH_AMOUNT:
      return produce(state, draft => {
        draft.fetchLimit = payload.fetchLimit;
        draft.isDropDownOpen = payload.isDropDownOpen;
      });

    default:
      return state;
  }
};

export default commissionsReducer;
