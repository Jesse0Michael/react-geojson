import React, { Component } from "react";
import "./map.css";
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = 'pk.eyJ1IjoiamVzc2UwbWljaGFlbCIsImEiOiJjazk5NDR0MDAweDB3M2Z0YW9ia2x4cjgxIn0._3heS1yvmszc0MIOphnH5g';

class Map extends Component {
    constructor(p) {
        super(p);
        this.state = {
            geojson: null,
            lng: -112.0000,
            lat: 33.5000,
        };
    }

    setGeoJSON = (geo) => {
        this.setState({ geojson: geo });
    };

    componentDidMount() {
        var map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            center: [this.state.lng, this.state.lat], // starting position [lng, lat]
            zoom: 9 // starting zoom
        });

        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
            });
        });
    }


    render() {
        return (
            <div>
                <div className='sidebar'>
                    <div>Longitude: {this.state.lng} Latitude: {this.state.lat} </div>
                </div>
                <div id="map" className="mapContainer"></div>
            </div>
        );
    }
}

export default Map;
