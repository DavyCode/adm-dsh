import produce from "immer";
import {
  GET_ALL_USERS,
  DATA_LOADING_FALSE,
  DATA_LOADING_TRUE,
  SET_USER_DATA_FETCH_AMOUNT,
  TOGGLE_DROPDOWN_MENU,
  CLEAR_HIGHLIGHTED_USERS,
  ADD_ALL_USERS_TO_LIST,
  HIGHLIGHT_A_USER,
  REMOVE_A_USER_HIGHLIGHT,
  SHOW_USER_DETAILS,
  SET_FILTER_ROLE,
  GET_ALL_BANKS,
} from "../actions/action-types/action.types.js";

const initialState = {
  allUsers: [],
  totalDocumentCount: 0,
  startPage: 0,
  user: {},
  isLoading: true,
  fetchLimit: 10,
  isDropDownOpen: false,
  toggleAll: false,
  highlightedItems: [],
  pageCount: 1,
  showUserDetails: false,
  role: "",
  bankList: [],
};

const usersReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_ALL_USERS:
      return produce(state, (draft) => {
        draft.allUsers = payload.allUsers;
        draft.totalDocumentCount = payload.totalDocumentCount;
        draft.startPage = payload.startPage;
        return draft;
      });
    case DATA_LOADING_TRUE:
      return produce(state, (draft) => {
        draft.isLoading = payload.isLoading;
        return draft;
      });
    case DATA_LOADING_FALSE:
      return produce(state, (draft) => {
        draft.isLoading = payload.isLoading;
        return draft;
      });
    case SET_USER_DATA_FETCH_AMOUNT:
      return produce(state, (draft) => {
        draft.fetchLimit = payload.fetchLimit;
        draft.isDropDownOpen = payload.isDropDownOpen;
        return draft;
      });
    case TOGGLE_DROPDOWN_MENU:
      return produce(state, (draft) => {
        draft.isDropDownOpen = payload.isDropDownOpen;
        return draft;
      });
    case CLEAR_HIGHLIGHTED_USERS:
      return produce(state, (draft) => {
        draft.highlightedItems = payload.highlightedItems;
        draft.toggleAll = payload.toggleAll;
        return draft;
      });
    case ADD_ALL_USERS_TO_LIST:
      return produce(state, (draft) => {
        const newData = draft.allUsers.map((user) => user.userId);
        draft.highlightedItems = newData;
        draft.toggleAll = payload.toggleAll;
        return draft;
      });

    case HIGHLIGHT_A_USER:
      return produce(state, (draft) => {
        draft.highlightedItems.push(payload.highlightID);
        return draft;
      });
    case REMOVE_A_USER_HIGHLIGHT:
      return produce(state, (draft) => {
        draft.highlightedItems.splice(
          draft.highlightedItems.indexOf(payload.highlightID),
          1
        );
        draft.toggleAll = payload.toggleAll;
        return draft;
      });

    case SHOW_USER_DETAILS:
      return produce(state, (draft) => {
        const clickedUser = draft.allUsers.find(
          (user) => user.userId === payload.userId
        );
        draft.showUserDetails = payload.showUserDetails;
        draft.user = clickedUser || {};

        return draft;
      });
    case SET_FILTER_ROLE:
      return produce(state, (draft) => {
        draft.role = payload.role;
        return draft;
      });
    case GET_ALL_BANKS:
      return produce(state, (draft) => {
        draft.bankList = payload.bankList;
        return draft;
      });

    default:
      return state;
  }
};

export default usersReducer;
