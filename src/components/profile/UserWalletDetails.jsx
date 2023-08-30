import React, {useState} from 'react';
import styles from '../../styles/style.less';
import {Button} from 'antd';
import Modal from '../Modal.jsx';
import ModalLoader from '../ModalLoader.jsx';
import axios from 'axios';
import axiosData from '../../utils/axiosData.js';
import moment from 'moment';
import {useToasts} from 'react-toast-notifications';
import currencyFormat from '../../utils/currencyFomat';
const url = process.env.REACT_APP_ADMIN_URL;
const UserWalletDetails = ({user, updated, returnHandler, fetchData}) => {
  const {addToast} = useToasts();
  const {_id, wallet} = user;
  const [walletData, setWalletData] = useState({...wallet});
  const [amount, setAmount] = useState(walletData.limit);
  const [updatedAt, setUpdatedAt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const updateWalletLimit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const controller = axios.CancelToken.source();
    const data = {
      url: `${url}/wallet/limit`,
      method: 'PUT',
      body: {userId: _id, amount},
    };
    try {
      const walletUpdate = await axiosData(data);
      if (walletUpdate.statusCode === 200) {
        updated(true);
        setIsLoading(false);
        setUpdatedAt(walletUpdate.data.meta.updatedAt);
        setWalletData({...walletData, limit: walletUpdate.data.limit});
        setAmount(walletUpdate.data.limit);
        fetchData(controller);
        addToast(walletUpdate.message, {
          appearance: 'success',
          autoDismiss: true,
        });
        returnHandler();
      } else {
        if (walletUpdate.response) {
          addToast(walletUpdate.response.data.message, {
            appearance: 'error',
            autoDismiss: true,
          });
        } else {
          addToast(walletUpdate.message, {
            appearance: 'error',
            autoDismiss: true,
          });
        }
        setIsLoading(false);
      }
    } catch (error) {}
  };
  const changeHandler = (event) => {
    const {value} = event.currentTarget;
    setAmount(value);
  };

  return (
    <div action="" className="wallet-info">
      {isLoading === true && (
        <Modal style={{backgroundColor: 'hsla(0, 50%, 100%, 0.5)'}}>
          <ModalLoader />
        </Modal>
      )}
      <h2>Wallet Information</h2>
      <div>
        <label>Wallet Balance</label>
        <div>
          <span>
            {wallet &&
              (wallet.balance
                ? currencyFormat(wallet.balance || 0)
                : currencyFormat(0))}
          </span>
        </div>
      </div>
      <div>
        <label>Wallet Bank</label>
        <div>
          <span>{wallet && wallet.bankName && wallet.bankName}</span>
        </div>
      </div>
      <div>
        <label>Wallet Account Name</label>
        <div>
          <span>{wallet && wallet.accountName && wallet.accountName}</span>
        </div>
      </div>
      <div>
        <label>Wallet Account Number</label>
        <div>
          <span>{wallet && wallet.accountNumber && wallet.accountNumber}</span>
        </div>
      </div>
      <div>
        <label>last updated</label>
        <div>
          <span>
            {wallet &&
              ((updatedAt && moment(updatedAt).format('lll')) ||
                moment(wallet.meta.updatedAt).format('lll'))}
          </span>
        </div>
      </div>
      <div>
        <label htmlFor="walletLimit">Wallet Limit</label>
        <div className="user-wallet-limit">
          <input
            type="text"
            name="walletLimit"
            id="walletLimit"
            value={amount}
            onChange={changeHandler}
            placeholder="Wallet Limit"
          />
          <Button onClick={updateWalletLimit}>Update Limit</Button>
        </div>
      </div>
    </div>
  );
};

export default UserWalletDetails;
