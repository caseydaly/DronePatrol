import React from 'react';
import MapGL, { HTMLOverlay, Marker, Popup, NavigationControl } from 'react-map-gl';
import Sidebar from './Sidebar';
import CustomMapController from './CustomMapController';
import SharkIconFilledWhite from '../assets/SharkIconFilledWhite.svg';
import SharkIconFilledRed from '../assets/SharkIconFilledRed.svg';
import SightingPopup from './SightingPopup';
import ReportLocation from './ReportLocation';
import ReportFinish from './ReportFinish';
import Dialog from './Dialog';
import Success from './Success';
import NoSightings from './NoSightings';
import DialogManager from './DialogManager';
import { Requests } from '../utils/requests';
import SmsSignUpSuccess from './SmsSignUpSuccess';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2FzZXlkYWx5IiwiYSI6ImNrZzJkOG12bjAyZXkydGx2MWJycWYxb2oifQ.S2DCiH_NWnS79eifFsoeWQ';

const navStyle = {
    position: 'absolute',
    top: 72,
    right: 0,
    padding: '10px'
};

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
            currentSidebar: null,
            reportLatitude: null,
            reportLongitude: null,
            dialogs: [],
            sightings: []
        };
        this._renderIcon.bind(this);
        this._iconClick.bind(this);
    }

    async getData(url) {
        var data = fetch(url)
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }

    componentDidMount() {
        if (this.state.userCurrentLon === null || this.state.userCurrentLat === null) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;

                    this.setState({
                        viewport: { latitude: latitude, longitude: longitude, zoom: 5, bearing: 0, pitch: 0 },
                        userCurrentLat: latitude,
                        userCurrentLon: longitude
                    });
                }
            );
        }

        if (this.state.spots.length < 1) {
            fetch(process.env.REACT_APP_SURF_SPOTS_URL + "/api/spots")
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        spots: data,
                        currentSidebar:
                            <Sidebar
                                spots={data}
                                opacity={this.getOpacity()}
                                onChange={this.handleSightingSearch.bind(this)}
                                reportSightingHandler={this.reportSightingLocationHandler.bind(this)}
                                onSignUp={this.handleSmsSignUp.bind(this)}
                            />,
                        loading: false
                    });
                });
        }

        if (this.state.sightings.length < 1) {
            const start = Math.round(new Date(new Date().setDate(new Date().getDate() - 7)).getTime() / 1000).toString();
            const end = Math.round((new Date().getTime()) / 1000).toString();
            fetch(process.env.REACT_APP_API_URL + "/api/sighting?start=" + start.toString() + "&end=" + end.toString())
                .then(response => response.json())
                .then(data => {
                    if (!data || data.length < 3) {
                        const newIndex = this.state.dialogs.length;
                        this.state.dialogs.push(
                            <NoSightings onClick={() => {
                                this.state.dialogs.splice(newIndex, 1);
                                fetch(process.env.REACT_APP_API_URL + "/api/samplesighting")
                                    .then(response => response.json())
                                    .then(data => {
                                        this.setState({ sightings: data });
                                    });
                            }} />
                        );
                    }
                    this.setState({ sightings: data });
                });
        }
    }

    _iconClick(sighting) {
        this.setState({ popup: sighting });
    }

    _renderIcon(sighting, i) {
        const { date, dist_to_shore, img, lat, lon, size, type } = sighting;
        return (
            <Marker
                key={i}
                longitude={lon}
                latitude={lat}
                offsetLeft={-30}
                captureClick={true}
                captureDoubleClick={true}
            >
                <img style={{cursor: "pointer"}} src={SharkIconFilledWhite} onClick={this._iconClick.bind(this, sighting)} />
            </Marker>
        );
    }

    handleSmsSignUp() {
        this.state.dialogs.push(<SmsSignUpSuccess />);
        this.setState({});
    }

    onClose() {
        this.setState({ popup: null })
    }

    getOpacity() {
        return this.state.popup == null ? 1 : 0.4;
    }

    handleSightingSearch(location, zoomFactor, startDate, endDate) {
        var start = Math.round(startDate.getTime() / 1000)
        var end = Math.round(endDate.getTime() / 1000)
        fetch(process.env.REACT_APP_API_URL + "/api/sighting?start=" + start.toString() + "&end=" + end.toString())
            .then(response => response.json())
            .then(data => {
                this.setState({ sightings: data });
            });
        if (location) {
            this.changeSearchArea(location, zoomFactor);
        }
    }

    changeSearchArea(location, zoomFactor) {
        this.setState({ viewport: { latitude: location.lat, longitude: location.lon, zoom: zoomFactor, bearing: 0, pitch: 0 } });
    }

    reportSightingLocationHandler() {
        this.setState({
            currentSidebar:
                <ReportLocation
                    onSelectLocation={this.changeSearchArea.bind(this)}
                    zoomOnCurrentLocation={this.zoomOnCurrentLocation.bind(this)}
                    onNavBack={this.navigateMainSidebar.bind(this)}
                    spots={this.state.spots}
                />,
            showSightings: false,
            addSightingMarker: null
        });
    }

    navigateMainSidebar() {
        this.setState({
            currentSidebar:
                <Sidebar
                    spots={this.state.spots}
                    opacity={this.getOpacity()}
                    onChange={this.handleSightingSearch.bind(this)}
                    reportSightingHandler={this.reportSightingLocationHandler.bind(this)}
                    onSignUp={this.handleSmsSignUp.bind(this)}
                />,
            addSightingMarker: null,
            showSightings: true
        });
    }

    async getClosestSpot(lat, lon) {
        const url = process.env.REACT_APP_SURF_SPOTS_URL + "/api/closest?lat=" + lat + "&lon=" + lon;
        return await Requests.getData(url);
    }

    async zoomOnCurrentLocation() {
        const closestSpot = await this.getClosestSpot(this.state.userCurrentLat, this.state.userCurrentLon);
        this.setState({
            viewport: { latitude: closestSpot.lat, longitude: closestSpot.lon, zoom: 9, bearing: 0, pitch: 0 }
        });
    }

    async onSubmit(image, date) {
        const body = {
            "img": image,
            "lat": this.state.reportLatitude,
            "lon": this.state.reportLongitude,
            "date": date
        };
        await Requests.postData(process.env.REACT_APP_API_URL + '/api/sighting', body)
            .then(data => {
            });

        this.state.dialogs.push(<Success />);
        this.setState({
            currentSidebar:
                <Sidebar
                    spots={this.state.spots}
                    opacity={this.getOpacity()}
                    onChange={this.handleSightingSearch.bind(this)}
                    reportSightingHandler={this.reportSightingLocationHandler.bind(this)}
                    onSignUp={this.handleSmsSignUp.bind(this)}
                />,
            addSightingMarker: null,
            showSightings: true,
            viewport: {
                latitude: this.state.userCurrentLat,
                longitude: this.state.userCurrentLon,
                zoom: 5,
                bearing: 0,
                pitch: 0
            }
        });
    }

    handleReportSightingClick(event) {
        var newViewport;
        //if user is already zoomed in a lot, don't zoom them back out on a click
        if (this.state.viewport.zoom >= 12) {
            newViewport = this.state.viewport;
        } else { //else, zoom user in so they can see if their reported sighting was in an accurate location
            newViewport = { latitude: event.lngLat[1], longitude: event.lngLat[0], zoom: 12, bearing: 0, pitch: 0 }
        }
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
            currentSidebar: <ReportFinish onNavBack={this.navigateMainSidebar.bind(this)} onNavLocation={this.reportSightingLocationHandler.bind(this)} onSubmit={this.onSubmit.bind(this)} />,
            showSightings: false,
            reportLatitude: event.lngLat[1],
            reportLongitude: event.lngLat[0],
            viewport: newViewport
        });
    }

    removeDialog(index) {
        this.state.dialogs.splice(index, 1);
        this.setState({});
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
                        onClick={this.state.currentSidebar &&
                            this.state.currentSidebar.type == ReportLocation ||
                            this.state.currentSidebar.type == ReportFinish ?
                            this.handleReportSightingClick.bind(this) : undefined}
                    >
                        {this.state.showSightings && this.state.sightings && this.state.sightings.map(this._renderIcon.bind(this))}
                        {this.state.addSightingMarker}
                        <div style={navStyle}>
                            <NavigationControl />
                        </div>
                    </MapGL>
                </div>

                {this.state.currentSidebar}

                {this.state.popup &&
                    <SightingPopup sighting={this.state.popup} handleClose={this.onClose.bind(this)} />
                }

                <DialogManager removeDialog={this.removeDialog.bind(this)}>
                    {this.state.dialogs.map((dialog) => dialog)}
                </DialogManager>

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

