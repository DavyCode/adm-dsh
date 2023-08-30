import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import moment from 'moment';
import loginReducer from '../reducers/login.reducer.js';
import usersReducer from '../reducers/users.reducer.js';
import walletReducers from '../reducers/wallet.reducer.js';
import serviceReducers from '../reducers/services.reducer.js';
import adminReducer from '../reducers/adminServices.reducer.js';
import commissionsReducer from '../reducers/commissions.reducer.js';
import switchReducer from '../reducers/switch.reducer.js';
import filterReducer from '../reducers/filter.reducer.js';
import messageReducer from '../reducers/messages.reducer';
import appUpdateReducer from '../reducers/appUpdates.reducer';
import newAgentReducer from '../reducers/newAgents.reducer';
import posReducer from '../reducers/pos.reducer';
import issueReducer from '../reducers/issues.reducer';
import PaymentNotificationReducer from '../reducers/paymentNotification.reducer';
import PosNotificationReducer from '../reducers/posNotification.reducer';
import PosTransactionReducer from '../reducers/postransaction.reducer';
const now = moment();
const initialState = {
  filter: {
    filterFetchLimit: 10,
    filterStates: {
      role: '',
      agentApproved: '',
      active: '',
      isBVN_verified: '',
      verified: '',
      serviceType: '',
      commissionWalletId: '',
      userId: '',
      transactionId: '',
      customerName: '',
      amount: '',
      serviceId: '',
      serviceName: '',
      paymentMethod: '',
      transactionReference: '',
      client_transactionReference: '',
      isTransactionRefunded: '',
      isRefundedTransaction: '',
      chargesApply: '',
      platform: '',
      status: '',
      search: '',
      filterStartDate: now,
      filterEndDate: now,
      endDate: moment().format('YYYY-MM-DD'),
      startDate: moment().format('YYYY-MM-DD'),
      lock: '',
      state: '',
      agentId: '',
      aggregatorId: '',
      email: '',
      lga: '',
      businessState: '',
      businessLga: '',
      businessCity: '',
      gender: '',
      phone: '',
      firstName: '',
      lastName: '',
      businessName: '',
      agentName: '',
      status: '',
      issueCategory: '',
      issueReferenceId: '',
      filterDate: now,
      date: moment().format('YYYY-MM-DD'),
      amountPaid: '',
      filterPaidOn: now,
      filterPaidAt: now,
      paidAt: moment().format('YYYY-MM-DD'),
      paidOn: moment().format('YYYY-MM-DD'),
      paymentDescription: '',
      paymentReference: '',
      paymentStatus: '',
      totalPayable: '',
      transactionHash: '',
      transactionReference: '',
      address: '',
      name: '',
      phone: '',
      serialNumber: '',
      terminalId: '',
      transactionLimit: '',
      dailyPosTransactionAmount: '',
      dailyPosTransactionDate: moment().format('YYYY-MM-DD'),
      partner: '',
      aggregatorUserId: '',
      posTerminal_Id: '',
      filteredPostTransactionDate: now,
    },
  },
  login: {
    phone: '',
    password: '',
    isLoading: false,
    error: '',
    isLoggedIn: false,
  },
  users: {
    allUsers: [],
    totalDocumentCount: 0,
    startPage: 0,
    user: {},
    isLoading: true,
    fetchLimit: 10,
    isDropDownOpen: false,
    toggleAll: false,
    highlightedItems: [],
    showUserDetails: false,
    role: '',
    bankList: [],
  },
  wallet: {
    allUsersTransactions: [],
    singleTransaction: {},
    fetchLimit: 10,
    isDropDownOpen: false,
    displayStatus: {
      successful: null,
      pending: null,
      failed: null,
      init: null,
      nullStatus: null,
      unknown: null,
    },
  },
  services: {
    allUsersTransactions: [],
    singleTransaction: {},
    fetchLimit: 10,
    isDropDownOpen: false,
    displayStatus: {
      successful: null,
      pending: null,
      failed: null,
      init: null,
      nullStatus: null,
    },
    adminServices: {servicesData: [], fetchLimit: 10},
    commissions: {
      allCommissionsData: [],
      commissionDataObj: {},
      fetchLimit: 10,
    },
    switchLogs: {logs: []},
    appUpdate: {
      allUpdates: [],
      singleUpdate: {},
      fetchLimit: 10,
      isDropDownOpen: false,
    },
  },
  newAgents: {
    allNewAgents: [],
    singleAgent: {},
    fetchLimit: 10,
  },
};
const allReducers = combineReducers({
  filter: filterReducer,
  login: loginReducer,
  users: usersReducer,
  wallet: walletReducers,
  services: serviceReducers,
  adminServices: adminReducer,
  commissions: commissionsReducer,
  switchLogs: switchReducer,
  messages: messageReducer,
  appUpdate: appUpdateReducer,
  allNewAgent: newAgentReducer,
  allPos: posReducer,
  allIssues: issueReducer,
  paymentNotification: PaymentNotificationReducer,
  posNotification: PosNotificationReducer,
  posTransaction: PosTransactionReducer,
});
const store = createStore(
  allReducers,
  initialState,
  composeWithDevTools(compose(applyMiddleware(thunk))),
);
export default store;
