import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import { v4 as uuid } from "uuid";
import mapboxgl from "mapbox-gl";
import { center } from "@turf/turf";
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

	const setGeoJSON = (data) => {
		var c;
		try {
			c = center(data)
		} catch {
			var trip = tryParseTrips(data)
			try {
				c = center(trip)
				data = trip
			} catch {
				setError("JSON is not valid geometry");
				return
			}
		}

		const id = uuid();
		state.map.addSource(id, {
			type: "geojson",
			data: data,
		});
		state.map.addLayer({
			id,
			type: "line",
			source: id,
			layout: {},
			paint: {
				"line-color": "#088",
				"line-opacity": 0.8,
				"line-width": 3,
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
		state.map.flyTo({
			center: c.geometry.coordinates,
			zoom: 11,
			essential: true
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

function tryParseTrips(data) {
	console.log(data)
	if (Array.isArray(data.data)) {
		var features = data.data.map(d => tryParseTrip(d))
		console.log(features)
		return { type: "FeatureCollection", features: features }
	} else {
		return tryParseTrip(data)
	}
}

function tryParseTrip(data) {
	var entities = data.entities.map(x => ({ entityID: x.entityID, entityType: x.type }))
	var properties = { id: data.id, entities, bounds: data.bounds, distance: data.distance, duration: data.duration, violations: data.violations }
	var coordinates = data.path.map(x => ([x.lng, x.lat]))
	var geometry = { type: "LineString", coordinates }
	return { type: "Feature", properties, geometry }
}

export default Map;
