import React from 'react';
import MapGL, { HTMLOverlay, Marker, Popup } from 'react-map-gl';
import Sidebar from './Sidebar';
import CustomMapController from './CustomMapController';
import SharkIconFilledWhite from '../assets/SharkIconFilledWhite.svg';
import SharkIconFilledRed from '../assets/SharkIconFilledRed.svg';
import SightingPopup from './SightingPopup';
import ReportLocation from './ReportLocation';
import ReportFinish from './ReportFinish';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2FzZXlkYWx5IiwiYSI6ImNrZzJkOG12bjAyZXkydGx2MWJycWYxb2oifQ.S2DCiH_NWnS79eifFsoeWQ';

const sightings = [
    {
        lat: 37.609219,
        long: -122.503051,
        location: "Linda Mar",
        type: "Greate White Shark",
        size: 13,
        distanceToShore: 30
    },
    {
        lat: 38.351003,
        long: -123.070669,
        location: "Salmon Creek",
        type: "Great White Shark",
        size: 10,
        distanceToShore: 113
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
            popup: null,
            spots: [],
            userCurrentLat: null,
            userCurrentLon: null,
            showSightings: true,
            addSightingMarker: null,
            currentSidebar: null
        };
        this._renderIcon.bind(this);
        this._iconClick.bind(this);
    }

    async getSpots() {
        const response = await fetch("http://ec2-50-18-14-124.us-west-1.compute.amazonaws.com/api/spots");
        const spots = await response.json();
        this.state.spots = spots;

    }

    async componentDidMount(props) {
        if (this.state.loading) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
    
                    this.setState({
                        viewport: { latitude: latitude, longitude: longitude, zoom: 5, bearing: 0, pitch: 0 },
                        loading: false,
                        userCurrentLat: latitude,
                        userCurrentLon: longitude
                    });
                },
                () => {
                    this.state.loading = false
                }
            );
            this.getSpots();
            this.setState({currentSidebar: <Sidebar spots={this.state.spots} opacity={this.getOpacity()} onChange={this.changeSearchArea.bind(this)} reportSightingHandler={this.reportSightingLocationHandler.bind(this)} /> })
        }

    }

    _iconClick(sighting) {
        console.log("clicked icon");
        this.setState({ popup: sighting });
    }

    _renderIcon(sighting, i) {
        const { lat, long, location, type, size, distanceToShore } = sighting;
        return (
            <Marker
                key={i}
                longitude={long}
                latitude={lat}
                offsetLeft={-30}
                captureClick={true}
                captureDoubleClick={true}
            >
                <img src={SharkIconFilledWhite} onClick={this._iconClick.bind(this, sighting)} />
            </Marker>
        );
    }

    onClose() {
        this.setState({ popup: null })
    }

    getOpacity() {
        return this.state.popup == null ? 1 : 0.4;
    }

    changeSearchArea(location, zoomFactor) {
        this.setState({ viewport: { latitude: location.lat, longitude: location.lon, zoom: zoomFactor, bearing: 0, pitch: 0 } });
    }

    reportSightingLocationHandler() {
        console.log("reportSightingLocationHandler - Home")
        this.setState({
            currentSidebar:
                <ReportLocation
                    onChangeLocation={this.changeSearchArea.bind(this)}
                    zoomOnCurrentLocation={this.zoomOnCurrentLocation.bind(this)}
                    onNavBack={this.finalizeReportSighting.bind(this)}
                    spots={this.state.spots}
                />,
            showSightings: false
        });
    }

    finalizeReportSighting() {
        this.setState({ reportSightingLocation: false, reportSightingFinish: false, showSightings: true });
    }

    async zoomOnCurrentLocation() {
        console.log("zooming in home");
        const closestSpotResponse = await fetch("http://ec2-50-18-14-124.us-west-1.compute.amazonaws.com/api/closest?lat=" + this.state.userCurrentLat + "&lon=" + this.state.userCurrentLon);
        const closestSpot = await closestSpotResponse.json();
        this.setState({
            viewport: { latitude: closestSpot.lat, longitude: closestSpot.lon, zoom: 9, bearing: 0, pitch: 0 }
        });
    }

    handleReportSightingClick(event) {
        console.log("reporting a click!");
        this.setState({
            addSightingMarker:
                <Marker
                    key={"report"}
                    longitude={event.lngLat[0]}
                    latitude={event.lngLat[1]}
                    offsetLeft={-30}
                    captureClick={true}
                >
                    <img src={SharkIconFilledRed} />
                </Marker>,
            currentSidebar: <ReportFinish />,
            showSightings: false
        });
    }

    render() {

        if (this.state.loading) {
            return null;
        }

        return (

            <div style={{ width: "100%", height: "100%" }}>
                <div style={{ position: "fixed", opacity: this.getOpacity() }}>
                    <MapGL
                        {...this.state.viewport}
                        style={{ position: "fixed", opacity: this.getOpacity() }}
                        width="100vw"
                        height="100vh"
                        mapStyle="mapbox://styles/mapbox/streets-v11"
                        onViewportChange={viewport => this.setState({ viewport })}
                        mapboxApiAccessToken={MAPBOX_TOKEN}
                        onClick={this.state.currentSidebar && this.state.currentSidebar.type == ReportLocation ? this.handleReportSightingClick.bind(this) : undefined}
                    >
                        {this.state.showSightings && sightings.map(this._renderIcon.bind(this))}
                        {this.state.addSightingMarker}
                    </MapGL>
                </div>

                {this.state.currentSidebar}

                {this.state.popup &&
                    <SightingPopup sighting={this.state.popup} handleClose={this.onClose.bind(this)} />
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

