import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import mapboxgl from "mapbox-gl";
import { center } from "@turf/turf";
import "./map.css";
import "./shake.css";
import { WebsocketForm } from "../WebsocketForm";
import { WebsocketOutput } from "../WebsocketOutput";

mapboxgl.accessToken = "pk.eyJ1IjoiamVzc2UwbWljaGFlbCIsImEiOiJjazk5NDR0MDAweDB3M2Z0YW9ia2x4cjgxIn0._3heS1yvmszc0MIOphnH5g";

const WebsocketMap = () => {
	const [state, setState] = useState({
		map: null,
		lng: - 112.0,
		lat: 33.5,
	});
	const [outputText, setOutput] = useState([]);

	useEffect(() => {
		var map = new mapboxgl.Map({
			container: "map", // container id
			style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
			center: [-112.0, 33.5], // starting position [lng, lat]
			zoom: 9, // starting zoom
		});
		map.on("move", () => {
			setState({
				map: map,
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

	const setGeoJSON = (id, data) => {
		var c;
		try {
			c = center(data)
		} catch {
			setError("invalid geojson data");
			return
		}
		state.map.flyTo({
			center: c.geometry.coordinates,
			zoom: 11,
			essential: true
		})

		var existing = state.map.getSource(id)
		if (existing) {
			existing.setData(data)
			return
		}
		state.map.addSource(id, {
			type: "geojson",
			data: data,
		});
		state.map.addLayer({
			id,
			type: "circle",
			source: id,
			layout: {},
			paint: {
				"circle-stroke-color": "#088",
				"circle-color": "#066",
				"circle-stroke-opacity": 0.8,
				"circle-opacity": 0.6,
				"circle-stroke-width": 3,
				"circle-radius": 5,
			},
		});
		var popup = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false,
			maxWidth: '480px'
		});
		state.map.on('mouseenter', id, function (e) {
			// Change the cursor style as a UI indicator.
			state.map.getCanvas().style.cursor = 'pointer';

			var coordinates = center(e.features[0]).geometry.coordinates;
			var description = e.features[0].properties;
			var output = '';
			for (let [key, value] of Object.entries(description)) {
				output += `${key}: ${value}<br />`;
			}

			// Ensure that if the map is zoomed out such that multiple
			// copies of the feature are visible, the popup appears
			// over the copy being pointed to.
			while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			}

			popup.setLngLat(coordinates)
				.setHTML(output)
				.addTo(state.map);
		});

		state.map.on('mouseleave', id, function () {
			state.map.getCanvas().style.cursor = '';
			popup.remove();
		});
	};

	const alert = useAlert();
	const setError = (err) => {
		alert.error(err);
		var d = document.getElementById("map");
		d.classList.add("shake");
		setTimeout(() => {
			d.classList.remove("shake");
		}, 1000);
	};

	const connect = (values) => {
		console.debug("connecting to", values.url);
		try {
			var webSocket = new WebSocket(values.url);
			webSocket.onopen = e => {
				setOutput([...outputText, `opened connection to websocket server: ${values.url}`])
			}
			webSocket.onclose = e => {
				setOutput([...outputText, "websocket connection closed"])
			}
			webSocket.onmessage = e => {
				var json;
				try {
					json = JSON.parse(e.data);
				} catch {
					setError("cannot parse geoJSON from realtime message");
					return;
				}
				var geo = tryParseRealtime(json)
				setGeoJSON(json.deviceID, geo)
				setOutput([...outputText, e.data])
			}
			webSocket.onerror = e => {
				console.log(e)
				setError(`websocket error: ${e}`);
			};
		} catch {
			setError(`failed to connect to websocket server: ${values.url}`);
		}
	}

	return (
		<div>
			<WebsocketForm callback={connect} />
			<div className="sidebar">
				<div>
					Longitude: {state.lng} Latitude: {state.lat}{" "}
				</div>
			</div>
			<div id="map" className="mapContainer"></div>
			<WebsocketOutput output={outputText} />
		</div>
	);
};

function tryParseRealtime(data) {
	console.log(data)
	var properties = { deviceID: data.deviceID, accountID: data.accountID, altitude: data.altitude, heading: data.heading, latitude: data.latitude, longitude: data.longitude, velocity: data.velocity, timestamp: data.timestamp }
	var coordinates = ([data.longitude, data.latitude])
	var geometry = { type: "Point", coordinates }
	return { type: "Feature", properties, geometry }
}

export default WebsocketMap;
