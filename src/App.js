import React from "react";
import Login from "./components/Login.jsx";
import Container from "./components/Container.jsx";
import {HashRouter as Router, Route, Switch} from "react-router-dom";

const App = () => {
	return (
		<Router>
			<Switch>
				<Route exact path="/" component={Login} />
				<Route path="/home" component={Container} />
			</Switch>
		</Router>
	);
};

export default App;
