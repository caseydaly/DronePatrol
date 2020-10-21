import React from 'react';
import MapGL, { HTMLOverlay, Marker, Popup } from 'react-map-gl';
import Sidebar from './Sidebar';
import CustomMapController from './CustomMapController';
import SharkIconFilledWhite from '../assets/SharkIconFilledWhite.svg';
import SharkIconFilledRed from '../assets/SharkIconFilledRed.svg';
import SightingPopup from './SightingPopup';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2FzZXlkYWx5IiwiYSI6ImNrZzJkOG12bjAyZXkydGx2MWJycWYxb2oifQ.S2DCiH_NWnS79eifFsoeWQ';

const sightings = [
    {
        lat: 37.609219,
        long: -122.503051,
        location: "Linda Mar"
    },
    {
        lat: 38.351003,
        long: -123.070669,
        location: "Salmon Creek"
    }
];

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            viewport: {
                latitude: 37.8,
                longitude: -122.4,
                zoom: 5,
                bearing: 0,
                pitch: 0
            },
            closestBeach: "Salmon Creek",
            popup: null
        };
        this._renderIcon.bind(this);
        this._iconClick.bind(this);
    }

    componentDidMount(props) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;

                this.setState({
                    viewport: { latitude: latitude, longitude: longitude, zoom: 5, bearing: 0, pitch: 0 },
                    loading: false
                });
            },
            () => {
                this.setState({ loading: false });
            }
        );
    }

    _iconClick(lat, long, location) {
        console.log("clicked icon");
        this.setState({ popup: { lat: lat, long: long, location: location } });
    }

    _renderIcon(sighting, i) {
        const { lat, long, location } = sighting;
        return (
            <Marker
                key={i}
                longitude={long}
                latitude={lat}
                offsetLeft={-30}
                captureClick={true}
                captureDoubleClick={true}
            >
                <img src={SharkIconFilledWhite} onClick={this._iconClick.bind(this, lat, long, location)} />
            </Marker>
        );
    }

    onClose() {
        this.setState({ popup: null })
    }

    getOpacity() {
        return this.state.popup == null ? 1 : 0.4;
    }

    render() {

        if (this.state.loading) {
            return null;
        }

        const mapController = new CustomMapController();
        return (

            <div style={{ width: "100%", height: "100%" }}>
                <div style={{ position: "fixed", opacity: this.getOpacity()}}>
                    <MapGL
                        {...this.state.viewport}
                        style={{position: "fixed", opacity: this.getOpacity()}}
                        width="100vw"
                        height="100vh"
                        mapStyle="mapbox://styles/mapbox/streets-v11"
                        onViewportChange={viewport => this.setState({ viewport })}
                        mapboxApiAccessToken={MAPBOX_TOKEN}
                        controller={mapController}
                    >
                        {sightings.map(this._renderIcon.bind(this))}
                    </MapGL>
                </div>

                <Sidebar opacity={this.getOpacity()} />

                {this.state.popup &&
                    <SightingPopup location={this.state.popup.location} lat={this.state.popup.lat} long={this.state.popup.long} handleClose={this.onClose.bind(this)}/>
                }

            </div>

        );
    }
};

const styles = {
    container: {
        position: "fixed"
    },
    popupOpen: {
        position: "fixed",
        opacity: 0.4
    }
}

