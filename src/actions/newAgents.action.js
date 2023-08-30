import {
  GET_NEW_AGENTS,
  ONE_NEW_AGENTS,
  SET_NEWAGENTS_DATA_FETCH_AMOUNT,
} from "./action-types/action.types.js";

export const getAllNewAgents = (allNewAgents = []) => {
  return {
    type: GET_NEW_AGENTS,
    payload: {
      allNewAgents,
    },
  };
};

export const getOneAgent = (agentID) => {
  return {
    type: ONE_NEW_AGENTS,
    payload: {
      agentID,
    },
  };
};

export const setFetchNumber = (num = 10) => ({
  type: SET_NEWAGENTS_DATA_FETCH_AMOUNT,
  payload: { fetchLimit: num, isDropDownOpen: false },
});
