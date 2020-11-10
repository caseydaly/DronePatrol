import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import IconButton from '@material-ui/core/IconButton';
import NavigateBackIcon from '../assets/NavigateBackIcon.svg';
import ReportSightingGraphic from '../assets/ReportSightingGraphic.svg';
import LocationSelector from './LocationSelector';
import ReportSightingButton from './ReportSightingButton';

export default class ReportLocation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    onNavBackSelect() {
        this.props.onNavBack();
    }

    render() {
        return (
            <div style={styles.container}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <IconButton
                        edge="end"
                        onClick={this.onNavBackSelect.bind(this)}
                    >
                        <SvgIcon component={NavigateBackIcon} viewBox='0 0 30 30' />
                    </IconButton>
                    <h3>Report a Shark Sighting</h3>
                </div>
                <div>
                    <h4>Click anywhere on the map to report a shark sighting.</h4>
                </div>
                <div>
                    <SvgIcon component={ReportSightingGraphic} viewBox='0 0 100 100' />
                </div>
                <div>
                    <h4>Change location</h4>
                    <LocationSelector />
                </div>
                <div>
                    <ReportSightingButton />
                </div>
            </div>
        );
    }

}

const styles = {
    container: {
        position: "fixed",
        width: "33%",
        height: "50%",
        backgroundColor: "white",
        marginLeft: "1%",
        marginTop: "1%",
        paddingRight: "1.65%",
        paddingLeft: "1.65%",
        paddingTop: "0.5%",
        borderRadius: 25,
        overflowY: "auto",
        cursor: 'default',
        zIndex: 10
    }
}