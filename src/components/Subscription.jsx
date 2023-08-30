import React from "react";
import {Redirect} from "react-router-dom";

const Subcription = ({location}) => {
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
			I have Subscribed
		</div>
	);
};

export default Subcription;
