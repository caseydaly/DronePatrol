import React from 'react';
import MapGL from 'react-map-gl';
import Divider from '@material-ui/core/Divider';
import SmsSignUp from "./SmsSignUp";
import AddSighting from "./AddSighting";
import SidebarMainContainer from './SidebarMainContainer';
import ReportSightingButton from './ReportSightingButton';



class Sidebar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
            endDate: new Date(),
            smsContainerCollapsed: false,
            viewport: this.props.viewport,
            containerStyle: styles.container
        };
    }

    componentDidMount(props) {

    }

    handleStartChange = (date) => {
        this.setState({ startDate: date });
    };

    handleEndChange = (date) => {
        this.setState({ endDate: date });
    };

    // handleSmsMinimize() {
    //     this.setState({containerStyle: {...styles.container, height: "68%"}});
    // }

    // handleSmsMaximize() {
    //     this.setState({containerStyle: styles.container});
    // }

    handleViewportChange(location) {
        console.log("handling viewport change");
        this.props.onChange(location);
    }

    render() {

        return (

            <div style={{ ...this.state.containerStyle, opacity: this.props.opacity }}>
                <SidebarMainContainer onChange={this.handleViewportChange.bind(this)} />
                <Divider />
                <SmsSignUp location={this.props.location} startCollapsed={true} />
                <Divider />
                <ReportSightingButton />
            </div>
        );
    }
};

const styles = {
    container: {
        position: "fixed",
        width: "33%",
        height: "86%",
        backgroundColor: "white",
        marginLeft: "2%",
        marginTop: "2%",
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