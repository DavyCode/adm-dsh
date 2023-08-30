import React, {useState} from 'react';
import {MdArrowBack} from 'react-icons/md';
import {Button, Tabs} from 'antd';
import PosDetails from './PosDetails.jsx';
import AssignPOS from './AssignPos.jsx';
import SecurityTab from './SecurityTab.jsx';
import AssignTerminalAgg from './AssignTerminalAgg.jsx';
import POSTransactions from './postransaction.jsx';

const {TabPane} = Tabs;
const userRole = localStorage.getItem('role');

const PostProfileOperation = ({returnHandler, data, fetchData}) => {
  const [successfulUpdate, setSuccessfulUpdate] = useState(false);
  //const updatedDetails = (bool) => setSuccessfulUpdate(bool);

  return (
    <div>
      <div className="return-button-container">
        <Button onClick={() => returnHandler(successfulUpdate)}>
          <MdArrowBack className="inline-block" /> Return
        </Button>
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Pos Details" key="1">
          <PosDetails
            data={data}
            fetchData={fetchData}
            returnHandler={returnHandler}
          />
        </TabPane>
        <TabPane tab="Agent Details" key="2">
          <AssignPOS
            data={data}
            fetchData={fetchData}
            returnHandler={returnHandler}
          />
        </TabPane>
        <TabPane tab="Aggregator Details" key="3">
          <AssignTerminalAgg
            data={data}
            fetchData={fetchData}
            returnHandler={returnHandler}
          />
        </TabPane>
        <TabPane tab="POS Transactions" key="4">
          <POSTransactions filteredData={data} />
        </TabPane>
        {['admin', 'superAdmin'].includes(userRole) && (
          <TabPane tab="Security" key="5">
            <SecurityTab
              data={data}
              fetchData={fetchData}
              returnHandler={returnHandler}
            />
          </TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default PostProfileOperation;
