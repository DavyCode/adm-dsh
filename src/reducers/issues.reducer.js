import produce from "immer";
import {
  GET_ALL_ISSUES,
  GET_ONE_ISSUE,
  SET_ISSUE_FETCH_AMOUNT,
} from "../actions/action-types/action.types.js";

const initialState = {
  allIssue: [],
  singleIssue: {},
  fetchLimit: 10,
  isDropDownOpen: false,
  displayStatus: {
    successful: null,
    failed: null,
  },
};

const issuesReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_ALL_ISSUES:
      return produce(state, (draft) => {
        draft.allIssue = payload;
        const successful = payload.filter((data) => data.status === "OPEN")
          .length;
        const pending = payload.filter((data) => data.status === "CLOSE")
          .length;
        draft.displayStatus = {
          successful,
          pending,
        };
      });

    case GET_ONE_ISSUE:
      return produce(state, (draft) => {
        const issueData = draft.allIssue.find(
          (data) => data._id === payload.issueID
        );
        draft.singleIssue = issueData;
      });

    case SET_ISSUE_FETCH_AMOUNT:
      return produce(state, (draft) => {
        draft.fetchLimit = payload.fetchLimit;
        draft.isDropDownOpen = payload.isDropDownOpen;
      });

    default:
      return state;
  }
};

export default issuesReducer;
