import React from "react";
import ReactDOM from "react-dom";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import { HashRouter, Switch, Route } from 'react-router-dom';
import AlertTemplate from "react-alert-template-basic";
import "./index.css";
import Map from "./components/Map";
import WebsocketMap from "./components/WebsocketMap";

const options = {
	position: positions.BOTTOM_CENTER,
	timeout: 5000,
	offset: "30px",
	transition: transitions.FADE,
};

const Root = () => (
	<AlertProvider template={AlertTemplate} {...options}>
		<Map />
	</AlertProvider>
);

const Websocket = () => (
	<AlertProvider template={AlertTemplate} {...options}>
		<WebsocketMap />
	</AlertProvider>
);

const Main = () => {
	return (
		<Switch>
			<Route exact path='/' component={Root}></Route>
			<Route exact path='/websocket' component={Websocket}></Route>
		</Switch>
	);
}

ReactDOM.render(
	<HashRouter>
		<Main />
	</HashRouter>,
	document.getElementById('root')
);
