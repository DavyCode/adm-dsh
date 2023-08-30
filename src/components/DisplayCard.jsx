import React from "react";
import { Card, Progress } from "antd";

const gridStyle = {
  width: "300px",
  textAlign: "center",
  marginRight: "5px",
  marginBottom: "10px",
  borderRadius: "4px",
  flex: 1,
  flexShrink: 0,
};

const DisplayCard = (props) => {
  const {
    successful,
    failed,
    pending,
    nullNumber,
    init,
    successTransaction,
    totalTransactions,
    failedTransaction,
    pendingTransaction,
    nullTransaction,
    refundedTransaction,
  } = props;
  return (
    <div className="flex flex-wrap p-2">
      <Card.Grid style={gridStyle} className="">
        <div>
          <p className="uppercase font-extrabold">Successful</p>
          <span>
            {successTransaction} of {totalTransactions}
          </span>
        </div>
        <Progress
          type="circle"
          percent={successful}
          strokeWidth={12}
          strokeColor="hsl(120, 100%, 50%)"
        />
      </Card.Grid>
      <Card.Grid style={gridStyle} className="">
        <div>
          <p className="uppercase font-extrabold">Failed</p>
          <span>
            {failedTransaction} of {totalTransactions}
          </span>
        </div>
        <Progress
          type="circle"
          percent={failed}
          strokeWidth={12}
          strokeColor="hsl(0, 100%, 50%)"
        />
      </Card.Grid>
      <Card.Grid style={gridStyle} className="">
        <div>
          <p className="uppercase font-extrabold">Pending</p>
          <span>
            {pendingTransaction} of {totalTransactions}
          </span>
        </div>
        <Progress
          type="circle"
          percent={pending}
          strokeWidth={12}
          strokeColor="hsla(42, 100%, 50%, 0.808)"
        />
      </Card.Grid>
      <Card.Grid style={gridStyle} className="">
        <div>
          <p className="uppercase font-extrabold">Null</p>
          <span>
            {nullTransaction} of {totalTransactions}
          </span>
        </div>
        <Progress
          type="circle"
          percent={nullNumber}
          strokeWidth={12}
          strokeColor={{
            "0%": "#108ee9",
            "100%": "#87d068",
          }}
        />
      </Card.Grid>
      <Card.Grid style={gridStyle} className="">
        <div>
          <p className="uppercase font-extrabold">Refunded</p>
          <span>
            {refundedTransaction} of {totalTransactions}
          </span>
        </div>
        <Progress
          type="circle"
          percent={init}
          strokeWidth={12}
          strokeColor="hsl(205,87,48)"
        />
      </Card.Grid>
    </div>
  );
};

export default DisplayCard;
