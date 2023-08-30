import produce from 'immer';
import {
  GET_ALL_POS,
  GET_ONE_POS,
  UPDATE_ONE_POS,
  DELETE_ONE_POS,
  SET_POS_DATA_FETCH_AMOUNT,
  SET_POS_DATA_FETCH_AMOUNT_POS_TRANX,
  SHOW_POS_DETAILS,
  GET_ALL_TRANSACTIONS_ON_POS,
  GET_SINGLE_TRANSACTIONS_ON_POS,
} from '../actions/action-types/action.types.js';

const initialState = {
  allPos: [],
  singlePos: {},
  allTransactionOnAPOS: [],
  singleTransactionOnPOS: {},
  fetchLimit: 10,
  fetchLimitTRX: 10,
  isDropDownOpen: false,
  showPOSDetails: false,

  displayStatus: {
    successful: null,
    failed: null,
  },
};

const posReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_ALL_POS:
      return produce(state, (draft) => {
        draft.allPos = payload;
        const successful = payload.filter((data) => data._id).length;
        const pending = payload.filter((data) => data._id).length;
        draft.displayStatus = {
          successful,
          pending,
        };
      });

    case GET_ALL_TRANSACTIONS_ON_POS:
      return produce(state, (draft) => {
        draft.allTransactionOnAPOS = payload;
        // const successful = payload.filter((data) => data._id).length;
        // const pending = payload.filter((data) => data._id).length;
        // draft.displayStatus = {
        //   successful,
        //   pending,
        // };
      });

    case GET_ONE_POS:
      return produce(state, (draft) => {
        const posData = draft.allPos.find((data) => data._id === payload.posID);
        draft.singlePos = posData;
      });

    case GET_SINGLE_TRANSACTIONS_ON_POS:
      return produce(state, (draft) => {
        const posTransaction = draft.allTransactionOnAPOS.find(
          (data) => data._id === payload.posId,
        );
        draft.singleTransactionOnPOS = posTransaction;
      });

    case DELETE_ONE_POS:
      return produce(state, (draft) => {
        const posData = draft.allPos.filter((data) => data._id !== payload);
        draft.allPos = posData;
      });

    case SET_POS_DATA_FETCH_AMOUNT:
      return produce(state, (draft) => {
        draft.fetchLimit = payload.fetchLimit;
        draft.isDropDownOpen = payload.isDropDownOpen;
      });

    case SET_POS_DATA_FETCH_AMOUNT_POS_TRANX:
      return produce(state, (draft) => {
        draft.fetchLimitTRX = payload.fetchLimitTRX;
        draft.isDropDownOpen = payload.isDropDownOpen;
      });

    case UPDATE_ONE_POS:
      return produce(state, (draft) => {
        const updateIndex = draft.allPos.findIndex((data) => {
          return data._id === payload._id;
        });
        draft.allPos.splice(updateIndex, 1, payload);
      });

    case SHOW_POS_DETAILS:
      return produce(state, (draft) => {
        const clickedUser = draft.allPos.find(
          (user) => user._id === payload.posId,
        );
        draft.showPOSDetails = payload.showPOSDetails;
        draft.singlePos = clickedUser || {};
        return draft;
      });
    default:
      return state;
  }
};

export default posReducer;
