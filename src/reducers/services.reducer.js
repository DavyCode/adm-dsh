import produce from "immer";
import {
  GET_ALL_SERVICES_TRANSACTIONS,
  GET_ONE_SERVICE_TRANSACTION,
  SET_SERVICE_DATA_FETCH_AMOUNT,
  SET_TRANSACTION_STATUS_FETCH,
} from "../actions/action-types/action.types.js";

const initialState = {
  allUsersTransactions: [],
  singleTransaction: {},
  fetchLimit: 10,
  isDropDownOpen: false,
  status: "",
  displayStatus: {
    successful: null,
    pending: null,
    failed: null,
    init: null,
    nullStatus: null,
  },
};

const serviceReducers = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_ALL_SERVICES_TRANSACTIONS:
      return produce(state, (draft) => {
        const allData = payload.allUsersTransactions.map(
          (transaction, index) => ({
            ...transaction,
            serialNumber: index + 1,
          })
        );
        draft.allUsersTransactions = allData;
        const successful = allData.filter(
          (data) => data.status === "Successful"
        ).length;
        const pending = allData.filter((data) => data.status === "Pending")
          .length;
        const failed = allData.filter((data) => data.status === "Failed")
          .length;
        const init = allData.filter((data) => data.status === "Init").length;
        const nullStatus = allData.filter((data) => data.status === "Null")
          .length;
        draft.displayStatus = {
          successful,
          pending,
          failed,
          init,
          nullStatus,
        };
      });
    case GET_ONE_SERVICE_TRANSACTION:
      return produce(state, (draft) => {
        const transactionData = draft.allUsersTransactions.find(
          (data) => data.transactionId === payload.transactionID
        );
        draft.singleTransaction = transactionData;
      });
    case SET_SERVICE_DATA_FETCH_AMOUNT:
      return produce(state, (draft) => {
        draft.fetchLimit = payload.fetchLimit;
        draft.isDropDownOpen = payload.isDropDownOpen;
      });
    case SET_TRANSACTION_STATUS_FETCH:
      return produce(state, (draft) => {
        draft.status = payload.status;
      });

    default:
      return state;
  }
};

export default serviceReducers;
