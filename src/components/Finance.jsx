import React from "react";
import {Redirect} from "react-router-dom";

const Finance = ({location}) => {
	return (
		<div>
			{!localStorage.getItem("token") && (
				<Redirect
					to={{
						pathname: "/",
						state: {from: location}
					}}
				/>
			)}
			This is the profit and loss account
		</div>
	);
};

export default Finance;
