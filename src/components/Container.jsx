import React from "react";
import { Route, useRouteMatch } from "react-router-dom";
import Layout from "./Layout.jsx";
import Dashboard from "./Dashboard.jsx";
import Agents from "./Agents.jsx";
import Aggregator from "./Aggregator.jsx";
import Services from "./Services.jsx";
import Subscription from "./Subscription.jsx";
import AdminServices from "./AdminServices.jsx";
import Refund from "./Refund.jsx";
import AppUpdate from "./AppUpdate.jsx";
import POS from "../components/POS/POS.jsx";
import SwitchLogs from "./SwitchLogs.jsx";
import Warehouse from "./Warehouse.jsx";
import Wallet from "./Wallet.jsx";
import Commissions from "./Commissions.jsx";
import Finance from "./Finance.jsx";
import Users from "./Users.jsx";
import NewSignup from "./NewSignup.jsx";
import Messages from "./messages/Messages";
import AgentsRequest from "./AgentsRequest/AgentsRequest.jsx";
import IssueMgt from "./Issues/IssueManagement.jsx";
import PaymentNotification from "./PaymentNote/PaymentNotification";
import PosNotifications from "./PosNotifications/PosNotification.jsx";
import POSTransactions from "./POStrnx/postransaction.jsx";
const Container = () => {
  const { path } = useRouteMatch();
  return (
    <Layout>
      <div className="p-2">
        <Route exact path={`${path}`} component={Dashboard} />
        <Route exact path={`${path}/agents`} component={Agents} />
        <Route exact path={`${path}/aggregator`} component={Aggregator} />
        <Route exact path={`${path}/newsignup`} component={NewSignup} />
        <Route exact path={`${path}/services`} component={Services} />
        <Route exact path={`${path}/wallet`} component={Wallet} />
        <Route exact path={`${path}/commissions`} component={Commissions} />
        <Route exact path={`${path}/postransactions`} component={POSTransactions} />
        <Route exact path={`${path}/subscriptions`} component={Subscription} />
        <Route exact path={`${path}/warehouse`} component={Warehouse} />
        <Route exact path={`${path}/finance`} component={Finance} />
        <Route exact path={`${path}/users`} component={Users} />
        <Route exact path={`${path}/adminservices`} component={AdminServices} />
        <Route exact path={`${path}/refunds`} component={Refund} />
        <Route exact path={`${path}/appupdates`} component={AppUpdate} />
        <Route exact path={`${path}/pos`} component={POS} />
        <Route
          exact
          path={`${path}/posnotifications`}
          component={PosNotifications}
        />
        <Route exact path={`${path}/switchlogs`} component={SwitchLogs} />
        <Route exact path={`${path}/messages`} component={Messages} />
        <Route exact path={`${path}/agentsrequest`} component={AgentsRequest} />
        <Route exact path={`${path}/issuesmgt`} component={IssueMgt} />
        <Route
          exact
          path={`${path}/paymentnotification`}
          component={PaymentNotification}
        />
      </div>
    </Layout>
  );
};

export default Container;
