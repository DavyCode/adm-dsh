/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import {Select} from "antd";

const {Option} = Select;

const NumberDropdown = props => {
	const {numberHandler} = props;
	return (
		<Select defaultValue={10} style={{width: 100}} onChange={numberHandler}>
			<Option value={10}>10</Option>
			<Option value={20}>20</Option>
			<Option value={25}>25</Option>
			<Option value={50}>50</Option>
		</Select>
	);
};

export default NumberDropdown;
