import {FILTER_FETCH, SET_FILTER_STATE} from './action-types/action.types.js';
import moment from 'moment';

const now = moment();
const defaultState = {
  role: '',
  agentApproved: '',
  active: '',
  isBVN_verified: '',
  verified: '',
  serviceType: '',
  status: '',
  search: '',
  commissionWalletId: '',
  chargesApply: '',
  platform: '',
  userId: '',
  transactionId: '',
  amount: '',
  client_paymentReference: '',
  serviceId: '',
  serviceName: '',
  paymentMethod: '',
  transactionReference: '',
  client_transactionReference: '',
  isTransactionRefunded: '',
  isRefundedTransaction: '',
  filterStartDate: now,
  filterEndDate: now,
  filterMessageReadDate: now,
  filterPaidAtDate: now,
  endDate: moment().format('YYYY-MM-DD'),
  startDate: moment().format('YYYY-MM-DD'),
  isReadAt: moment().format('YYYY-MM-DD'),
  paidAt: moment().format('YYYY-MM-DD'),
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
  releaseDate: now,
  versionId: '',
  versionNumber: '',
  redirectUrl: '',
};

export const setFilterFetchNumber = (num = 10) => ({
  type: FILTER_FETCH,
  payload: {filterFetchLimit: num},
});
export const setFilterState = (state = defaultState) => {
  return {
    type: SET_FILTER_STATE,
    payload: state,
  };
};
