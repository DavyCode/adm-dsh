import { GET_ALL_SWITCH_LOGS } from "./action-types/action.types.js";

export const getAllLogs = (logs = []) => {
  return {
    type: GET_ALL_SWITCH_LOGS,
    payload: { logs }
  };
};
