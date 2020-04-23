import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import { v4 as uuid } from "uuid";
import mapboxgl from "mapbox-gl";
import "./map.css";
import "./shake.css";
import DropZone from "../../components/Dropzone";

mapboxgl.accessToken = "pk.eyJ1IjoiamVzc2UwbWljaGFlbCIsImEiOiJjazk5NDR0MDAweDB3M2Z0YW9ia2x4cjgxIn0._3heS1yvmszc0MIOphnH5g";

const Map = () => {
	const [state, setState] = useState({
		map: null,
		lng: -112.0,
		lat: 33.5,
	});

	useEffect(() => {
		var map = new mapboxgl.Map({
			container: "map", // container id
			style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
			center: [-112.0, 33.5], // starting position [lng, lat]
			zoom: 9, // starting zoom
		});
		map.on("move", () => {
			setState({
				lng: map.getCenter().lng.toFixed(4),
				lat: map.getCenter().lat.toFixed(4),
			});
		});
		setState({
			map: map,
			lng: map.getCenter().lng.toFixed(4),
			lat: map.getCenter().lat.toFixed(4),
		});
	}, []);

	const setGeoJSON = (data) => {
		const id = uuid();
		state.map.addSource(id, {
			type: "geojson",
			data,
		});
		state.map.addLayer({
			id,
			type: "fill",
			source: id,
			layout: {},
			paint: {
				"fill-color": "#088",
				"fill-opacity": 0.8,
			},
		});
	};

	const alert = useAlert();
	const setError = (err) => {
		alert.error(err, { className: "aaa" });
		var d = document.getElementById("map");
		d.classList.add("shake");
		setTimeout(() => {
			d.classList.remove("shake");
		}, 1000);
	};

	return (
		<div>
			<div className="sidebar">
				<div>
					Longitude: {state.lng} Latitude: {state.lat}{" "}
				</div>
			</div>
			<div id="map" className="mapContainer"></div>
			<DropZone onLoad={setGeoJSON} onError={setError} />
		</div>
	);
};

export default Map;
