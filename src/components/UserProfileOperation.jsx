import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import styles from "../styles/style.less";
import { Button, Tabs } from "antd";
import BasicAccountInformation from "./profile/BasicAccount.jsx";
import BankDetails from "./profile/BankDetails.jsx";
import UserWalletDetails from "./profile/UserWalletDetails";
import CommissionWallet from "./profile/CommissionWallet.jsx";
import Security from "./profile/Security";

const { TabPane } = Tabs;
const userRole = localStorage.getItem("role");
const UserProfileOperation = (props) => {
  const { returnHandler, user, allBanks, fetchData } = props;
  const { wallet, bank, commissionWallet } = user;
  const [successfulUpdate, setSuccessfulUpdate] = useState(false);
  const updatedDetails = (bool) => setSuccessfulUpdate(bool);
  return (
    <div>
      <div className="return-button-container">
        <Button onClick={() => returnHandler(successfulUpdate)}>
          <MdArrowBack className="inline-block" /> Return
        </Button>
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="General" key="1">
          <BasicAccountInformation
            user={user}
            updated={updatedDetails}
            returnHandler={returnHandler}
            fetchData={fetchData}
          />
        </TabPane>
        <TabPane tab="Bank Details" key="2">
          <BankDetails
            user={user}
            bankList={allBanks}
            updated={updatedDetails}
            returnHandler={returnHandler}
            fetchData={fetchData}
          />
        </TabPane>
        <TabPane tab="Wallet" key="3">
          {wallet ? (
            <UserWalletDetails
              user={user}
              updated={updatedDetails}
              returnHandler={returnHandler}
              fetchData={fetchData}
            />
          ) : (
            <div>No Commission Wallet Information Found</div>
          )}
        </TabPane>
        <TabPane tab="Commission Wallet" key="4">
          {commissionWallet && (
            <CommissionWallet user={user} returnHandler={returnHandler} />
          )}
        </TabPane>
        {["admin", "superAdmin"].includes(userRole) && (
          <TabPane tab="Security" key="5">
            <Security
              user={user}
              updated={updatedDetails}
              returnHandler={returnHandler}
              fetchData={fetchData}
            />
          </TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default UserProfileOperation;
