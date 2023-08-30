import React from "react";
import {Card, Col, Row} from "antd";

export const StatisticCard = props => {
	return (
		<React.Fragment>
			<Col span={props.cardsize}>
				<Card {...props} bordered={false}>
					{props.children}
				</Card>
			</Col>
		</React.Fragment>
	);
};

const StatisticsDisplay = props => {
	return (
		<div
			style={{
				background: "#ECECEC",
				padding: "10px",
				marginBottom: "1em",
				display: "flex",
				justifyContent: "center",
				flexWrap: "nowrap",
				width: "100%",
				height: "100px"
			}}>
			<Row gutter={16}>{props.children}</Row>
		</div>
	);
};

export default StatisticsDisplay;
