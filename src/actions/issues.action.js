import {
  GET_ALL_ISSUES,
  GET_ONE_ISSUE,
  SET_ISSUE_FETCH_AMOUNT,
} from "../actions/action-types/action.types";

export const getAllIssues = (allIssues = []) => {
  return {
    type: GET_ALL_ISSUES,
    payload: allIssues,
  };
};

export const getAIssue = (issueID) => {
  return {
    type: GET_ONE_ISSUE,
    payload: {
      issueID,
    },
  };
};

export const setFetchNumber = (num = 10) => ({
  type: SET_ISSUE_FETCH_AMOUNT,
  payload: { fetchLimit: num, isDropDownOpen: false },
});
