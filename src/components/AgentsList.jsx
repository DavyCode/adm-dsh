/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React from "react";
import {FiMoreVertical} from "react-icons/fi";

const FarmerList = props => {
	const {
		addFarmToList,
		id,
		listArr,
		groupId,
		name,
		warehouseId,
		subscription,
		date
	} = props;
	return (
		<div>
			<a
				href="#"
				className={`${listArr.includes(id) === true &&
					"bg-gray-300"} p-2 rounded-md mb-3px w-full`}
				data-listid={id}
				onClick={addFarmToList}>
				<span className="w-15px h-15px bg-gray-100 border border-solid border-gray-600 rounded-sm inline-block">
					<span
						className={`${
							listArr.includes(id) === true
								? "opacity-100"
								: "opacity-0"
						}`}></span>
				</span>
				<span>{id}</span>
				<span>{groupId}</span>
				<span>{name}</span>
				<span>{warehouseId}</span>
				<span>{subscription}</span>
				<span>{date}</span>
				<FiMoreVertical className="text-right ml-10px" />
			</a>
		</div>
	);
};

export default FarmerList;
