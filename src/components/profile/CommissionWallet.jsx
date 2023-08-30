import React from 'react';
import currencyFormat from '../../utils/currencyFomat';
const CommissionWallet = ({user}) => {
  const {commissionWallet} = user;
  return (
    <div className="wallet-info">
      <h2>Commission Wallet Information</h2>
      <div>
        <label>Commission Wallet Balance</label>
        <div className="commission-wallet-balance">
          <span>
            {commissionWallet &&
              currencyFormat(commissionWallet.balance || 0) &&
              currencyFormat(commissionWallet.balance || 0)}
          </span>
        </div>
      </div>
      <div>
        <label>Overall Earnings</label>
        <div>
          <span>
            {commissionWallet &&
              currencyFormat(commissionWallet.overallEarnings || 0) &&
              currencyFormat(commissionWallet.overallEarnings || 0)}
          </span>
        </div>
      </div>
      <div>
        <label>Wallet Id</label>
        <div>
          <span>
            {commissionWallet &&
              commissionWallet.wallet &&
              commissionWallet.wallet}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommissionWallet;
