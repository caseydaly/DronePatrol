import React from 'react';
import MapGL from 'react-map-gl';
import Divider from '@material-ui/core/Divider';
import SmsSignUp from "./SmsSignUp";
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
            containerStyle: styles.containerStyleBase,
            flexContainerStyle: styles.flexContainerBase,
            spots: this.props.spots,
            dividerStyle: {
                marginTop: 5,
                marginBottom: 5
            }
        };
    }

    componentDidMount(props) {

    }

    handleSightingSearch(location, startDate, endDate) {
        const zoomFactor = 9;
        this.props.onChange(location, zoomFactor, startDate, endDate);
    }

    startReportSighting() {
        this.props.reportSightingHandler();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.spots.length === 0) // Check if the old spots was empty
        {
            this.setState({ spots: this.props.spots });
        }
    }

    handleSmsExpand() {
        this.setState({
            dividerStyle: {
                marginTop: 20,
                marginBottom: 20
            }
        });
    }

    handleSmsCollapse() {
        this.setState({
            dividerStyle: {
                marginTop: 5,
                marginBottom: 5
            }
        });
    }

    getContainerStyle() {
        return {
            ...this.state.containerStyle,
            opacity: this.props.opacity,
            overflowY: this.smsContainerCollapsed ? undefined : "auto"
        };
    }

    getFlexContainerStyle() {
        return {
            ...this.state.flexContainerStyle,
            height: this.smsContainerCollapsed ? "95%" : "100%"
        }
    }



    render() {

        return (

            <div style={styles.containerStyleBase}>
                <div style={styles.flexContainerBase}>
                    <div >
                        <SidebarMainContainer onChange={this.handleSightingSearch.bind(this)} spots={this.state.spots} />
                    </div>
                    <div style={{ marginTop: 10, marginBottom: 10 }}>
                        <Divider />
                    </div>
                    <div >
                        <SmsSignUp
                            spots={this.state.spots}
                            startCollapsed={true}
                            onMinimize={this.handleSmsCollapse.bind(this)}
                            onMaximize={this.handleSmsExpand.bind(this)}
                            onSignUp={this.props.onSignUp}
                        />
                    </div>
                    <div style={{ marginTop: 10, marginBottom: 10 }}>
                        <Divider />
                    </div>
                    <div >
                        <Button
                            startIcon={<SvgIcon component={BinocularsIcon} viewBox='0 0 30 30' />}
                            endIcon={<SvgIcon component={NavigateRightArrowIcon} viewBox='0 0 30 30' />}
                            text="Report a Shark Sighting"
                            onClick={this.startReportSighting.bind(this)}
                        />
                    </div>
                </div>
            </div>
        );
    }
};

const styles = {
    containerStyleBase: {
        position: "fixed",
        width: "33%",
        height: "92%",
        backgroundColor: "white",
        marginLeft: "1%",
        marginTop: "1%",
        paddingRight: "1.65%",
        paddingLeft: "1.65%",
        paddingTop: "2%",
        borderRadius: 25,
        cursor: 'default',
        zIndex: 10,
        overflowY: "auto"
    },
    flexContainerBase: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "95%"
    },
    dividerStyle: {
        marginTop: 10,
        marginBottom: 10
    }
}



export default Sidebar;