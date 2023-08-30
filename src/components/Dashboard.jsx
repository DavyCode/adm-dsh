import React from "react";
import {Redirect} from "react-router-dom";

const Dashboard = ({location}) => {
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
			This is the Dashboard page
		</div>
	);
};

export default Dashboard;
