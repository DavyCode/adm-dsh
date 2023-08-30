/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React from "react";
import {Button, Row, Col} from "antd";
import styles from "../styles/style.less";

const UsersList = props => {
	const {
		addFarmToList,
		serialNumber,
		userId,
		listArr,
		email,
		name,
		phoneNumber,
		role,
		showUserDetails
	} = props;
	return (
		<Row
			data-listid={userId}
			className="usersListContainer"
			type="flex"
			justify="center"
			align="middle">
			<Col span={1}>
				<span
					className="w-15px h-15px bg-gray-100 border border-solid border-gray-600 rounded-sm inline-block"
					onClick={addFarmToList}>
					<span
						className={`${
							listArr.includes(userId) === true
								? "opacity-100"
								: "opacity-0"
						}`}></span>
				</span>
			</Col>
			<Col span={1}>
				<span>{serialNumber}</span>
			</Col>
			<Col span={6}>
				<span>{name}</span>
			</Col>
			<Col span={6}>
				<span>{email}</span>
			</Col>
			<Col span={3}>
				<span>{phoneNumber}</span>
			</Col>
			<Col span={3}>
				<span>{role}</span>
			</Col>
			<Col span={4}>
				<Button onClick={showUserDetails}>more details</Button>
			</Col>
		</Row>
	);
};

export default UsersList;
