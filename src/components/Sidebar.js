import React from 'react';
import MapGL from 'react-map-gl';
import Divider from '@material-ui/core/Divider';
import SmsSignUp from "./SmsSignUp";
import AddSighting from "./AddSighting";
import SidebarMainContainer from './SidebarMainContainer';
import Button from './Button';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as BinocularsIcon } from '../assets/BinocularsIcon.svg';
import { ReactComponent as NavigateRightArrowIcon } from '../assets/NavigateRightArrowIcon.svg';



class Sidebar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            smsContainerCollapsed: false,
            viewport: this.props.viewport,
            containerStyle: styles.container,
            spots: this.props.spots
        };
    }

    componentDidMount(props) {
        
    }

    handleViewportChange(location) {
        console.log("handling viewport change");
        const zoomFactor = 9;
        this.props.onChange(location, zoomFactor);
    }

    startReportSighting() {
        console.log("startReportSighting - Sidebar");
        this.props.reportSightingHandler();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.spots.length === 0) // Check if the old spots was empty
        {
            this.setState({ spots: this.props.spots });
        }
    }

    render() {

        return (

            <div style={{ ...this.state.containerStyle, opacity: this.props.opacity }}>
                <SidebarMainContainer onChange={this.handleViewportChange.bind(this)} spots={this.state.spots} />
                <Divider />
                <SmsSignUp spots={this.state.spots} location={this.props.location} startCollapsed={true} />
                <Divider />
                <div style={{marginTop: 20}}>
                    <Button
                        startIcon={<SvgIcon component={BinocularsIcon} viewBox='0 0 30 30' />}
                        endIcon={<SvgIcon component={NavigateRightArrowIcon} viewBox='0 0 30 30' />}
                        text="Report a Shark Sighting"
                        onClick={this.startReportSighting.bind(this)}
                    />
                </div>
            </div>
        );
    }
};

const styles = {
    container: {
        position: "fixed",
        width: "33%",
        height: "92%",
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



export default Sidebar;