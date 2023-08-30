import produce from "immer";
import {
  GET_NEW_AGENTS,
  ONE_NEW_AGENTS,
  SET_NEWAGENTS_DATA_FETCH_AMOUNT,
} from "../actions/action-types/action.types.js";

const initialState = {
  allNewAgents: [],
  singleAgent: {},
  fetchLimit: 10,
  isDropDownOpen: false,
  displayStatus: {
    successful: null,
    failed: null,
  },
};

const newAgentReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_NEW_AGENTS:
      return produce(state, (draft) => {
        const allData = payload.allNewAgents.map((newAgent, index) => ({
          ...newAgent,
          serialNumber: index + 1,
        }));
        draft.allNewAgents = allData;
        const successful = allData.filter((data) => data.agentApproved === true)
          .length;
        const pending = allData.filter((data) => data.agentApproved === false)
          .length;
        draft.displayStatus = {
          successful,
          pending,
        };
      });

    case ONE_NEW_AGENTS:
      return produce(state, (draft) => {
        const newAgentData = draft.allNewAgents.find(
          (data) => data._id === payload.agentID
        );
        draft.singleAgent = newAgentData;
      });

    case SET_NEWAGENTS_DATA_FETCH_AMOUNT:
      return produce(state, (draft) => {
        draft.fetchLimit = payload.fetchLimit;
        draft.isDropDownOpen = payload.isDropDownOpen;
      });
    default:
      return state;
  }
};

export default newAgentReducer;
