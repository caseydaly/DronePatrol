import React from 'react';
import MapGL, { HTMLOverlay } from 'react-map-gl';
import Sidebar from './Sidebar';
import CustomMapController from './CustomMapController';
const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2FzZXlkYWx5IiwiYSI6ImNrZzJkOG12bjAyZXkydGx2MWJycWYxb2oifQ.S2DCiH_NWnS79eifFsoeWQ';

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
            }
        };
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

    render() {

        if (this.state.loading) {
            return null;
        }

        const mapController = new CustomMapController();

        return (

            <div style={styles.homeScreenContainer}>
                <MapGL
                    {...this.state.viewport}
                    width="100vw"
                    height="100vh"
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    onViewportChange={viewport => this.setState({ viewport })}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                    controller={mapController}
                >
                    <HTMLOverlay
                        redraw={() => <Sidebar />} 
                    />
                </MapGL>
            </div>
        );
    }
};

const styles = {
    homeScreenContainer: {
        height: "100vh",
        width: "80%"
    }

}

