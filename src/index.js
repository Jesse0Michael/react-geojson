import React from "react";
import ReactDOM from "react-dom";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import "./index.css";
import Map from "./components/Map";

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

ReactDOM.render(<Root />, document.getElementById("root"));
