import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import IconButton from '@material-ui/core/IconButton';
import { ReactComponent as NavigateBackIcon } from '../assets/NavigateBackIcon.svg';
import ReportSightingGraphic from '../assets/ReportSightingGraphic.svg';
import LocationSelector from './LocationSelector';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import Button from './Button';
import {ReactComponent as CurrentLocationIcon} from '../assets/CurrentLocationIcon.svg';

export default class ReportLocation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLocation: null
        }
    }

    onNavBackSelect() {
        this.props.onNavBack();
    }

    selectLocationHandler(location) {
        this.setState({ selectedLocation: location });
    }

    zoomOnCurrentLocation() {
        console.log("Report location zoom");
        this.props.zoomOnCurrentLocation();
    }

    render() {
        return (
            <div style={styles.container}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <IconButton
                        edge="end"
                        onClick={this.onNavBackSelect.bind(this)}
                        style={{ marginLeft: -15, color: "#0075DF" }}
                    >
                        <NavigateBeforeIcon
                            fontSize="large"
                        />
                    </IconButton>
                    <h2 style={{ color: "#0075DF", fontWeight: 800 }}>Report a Shark Sighting</h2>
                </div>
                <div style={{ display: "flex" }}>
                    <h4 style={{ margin: 0, fontWeight: 350 }}>Click anywhere on the map to report a shark sighting.</h4>
                </div>
                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <img src={ReportSightingGraphic} width={200} height={200} />
                </div>
                <div>
                    <h4 style={{ margin: 0, fontWeight: 450, marginBottom: 10 }}>Change location</h4>
                    <LocationSelector spots={this.props.spots} handler={this.selectLocationHandler.bind(this)} />
                </div>
                <div>
                    <Button
                        startIcon={<SvgIcon component={CurrentLocationIcon} viewBox='0 0 30 30' />}
                        text="Current Location"
                        onClick={this.zoomOnCurrentLocation.bind(this)}
                    />
                </div>
            </div>
        );
    }

}

const styles = {
    container: {
        position: "fixed",
        width: "33%",
        backgroundColor: "white",
        marginLeft: "1%",
        marginTop: "1%",
        padding: "1.5%",
        borderRadius: 25,
        cursor: 'default',
        zIndex: 10
    },
    iconColorPrimary: {
        color: ""
    }

}