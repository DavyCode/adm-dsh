import produce from 'immer';
import {
  FILTER_FETCH,
  SET_FILTER_STATE,
} from '../actions/action-types/action.types.js';
import moment from 'moment';
const now = moment();

const initialState = {
  filterFetchLimit: 10,
  isDropDownOpen: false,
  filterStates: {
    role: '',
    agentApproved: '',
    active: '',
    isBVN_verified: '',
    verified: '',
    serviceType: '',
    commissionWalletId: '',
    chargesApply: '',
    platform: '',
    userId: '',
    transactionId: '',
    amount: '',
    serviceId: '',
    serviceName: '',
    paymentMethod: '',
    transactionReference: '',
    client_paymentReference: '',
    client_transactionReference: '',
    isTransactionRefunded: '',
    isRefundedTransaction: '',
    status: '',
    search: '',
    filterStartDate: now,
    filterEndDate: now,
    filterMessageReadDate: now,
    endDate: moment().format('YYYY-MM-DD'),
    startDate: moment().format('YYYY-MM-DD'),
    isReadAt: moment().format('YYYY-MM-DD'),
    lock: '',
    state: '',
    agentId: '',
    email: '',
    lga: '',
    businessState: '',
    businessLga: '',
    businessCity: '',
    gender: '',
    phone: '',
    messageReadOnWhichDevice: '',
    isRead: '',
    platformType: '',
    messageToken: '',
    messageType: '',
    messageCategory: '',
    messageBelongsTo: '',
    messageTitle: '',
    includeImageUrl: '',
    actionLink: '',
    appType: '',
    releaseAt: moment().format('YYYY-MM-DD'),
    releaseDate: now,
    versionId: '',
    versionNumber: '',
  },
};

const filterReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FILTER_FETCH:
      return produce(state, (draft) => {
        draft.filterFetchLimit = payload.filterFetchLimit;
        draft.isDropDownOpen = payload.isDropDownOpen;
        return draft;
      });
    case SET_FILTER_STATE:
      return produce(state, (draft) => {
        draft.filterStates = {...draft.filterStates, ...payload};
        return draft;
      });

    default:
      return state;
  }
};

export default filterReducer;
