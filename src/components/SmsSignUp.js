import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as SmsAlertsIcon } from '../assets/SmsAlertsIcon.svg';
import { ReactComponent as CloseDropdownIcon } from '../assets/CloseDropdownIcon.svg';
import { ReactComponent as OpenDropdownIcon } from '../assets/OpenDropdownIcon.svg';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, makeStyles } from '@material-ui/core';
import PhoneEntry from './PhoneEntry';
import LocationSelector from './LocationSelector';
import AlertRadius from './AlertRadius';
import SignUpButton from './SignUpButton';
import { Requests } from '../utils/requests';
import { ReactComponent as AlertsIcon } from '../assets/AlertsIcon.svg';

class SmsSignUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            alertRadius: 5,
            phoneNumber: null,
            alertLocation: null,
            minimized: this.props.startCollapsed,
            containerStyle: this.props.startCollapsed ? styles.smsSignUpContainerClosed : styles.smsSignUpContainerOpen,
            spots: this.props.spots,
            invalidPhoneEntry: false,
            invalidLocationEntry: false,
            invalidPhoneHelperText: undefined,
            invalidLocationHelperText: undefined
        };
        this.renderDropdownIcon.bind(this);
        this.renderBody.bind(this);
    }

    componentDidMount(props) {

    }

    async signUpHandler() {
        var body = {
            "phone": this.state.phoneNumber.replace(/\D/g, ""),
            "location": this.state.alertLocation,
            "radius": this.state.alertRadius
        }

        if (body["phone"].length < 10) {
            this.setState({ invalidPhoneEntry: true, invalidPhoneHelperText: "Invalid phone number" });
            return;
        } else if (body["location"] === null || body["location"] === "") {
            this.setState({ invalidLocationEntry: true, invalidLocationHelperText: "Select a valid location from the suggestions" });
            return;
        }

        const localUrl = 'http://0.0.0.0:5001/api/signup'

        await Requests.postData(localUrl, body)
            .then(data => {
                console.log(data);
            });

        this.setState({
            alertRadius: 5,
            phoneNumber: null,
            alertLocation: null,
            minimized: true,
            invalidPhoneEntry: false,
            invalidLocationEntry: false,
            invalidLocationHelperText: undefined,
            invalidPhoneHelperText: undefined
        });

        this.props.onSignUp();
    }

    radiusHandler(newValue) {
        this.state.alertRadius = newValue;
    }

    locationHandler(newValue) {
        this.setState({alertLocation: newValue.name, invalidLocationEntry: false, invalidLocationHelperText: undefined});
    }

    phoneHandler(newValue) {
        const temp = newValue.replace(/\D/g, "");
        if (temp.length === 10 && this.state.invalidPhoneEntry) {
            this.setState({phoneNumber: newValue, invalidPhoneEntry: false, invalidPhoneHelperText: undefined});
        } else {
            this.state.phoneNumber = newValue;
        }
    }

    onDropdownSelect(event) {
        this.state.minimized = !this.state.minimized;
        this.state.containerStyle = this.state.minimized ? styles.smsSignUpContainerClosed : styles.smsSignUpContainerOpen;
        if (this.state.minimized) {
            this.props.onMinimize();
        } else {
            this.props.onMaximize();
        }
        this.setState({});
    }

    //when we receive new props with the surf spots, we have to rerender manually 
    componentDidUpdate(prevProps) {
        if (prevProps.spots.length === 0) // Check if the old spots was empty
        {
            this.setState({ spots: this.props.spots });
        }
    }

    renderDropdownIcon() {
        if (this.state.minimized) {
            return (
                <IconButton
                    edge="end"
                    onClick={this.onDropdownSelect.bind(this)}
                >
                    <SvgIcon component={OpenDropdownIcon} viewBox='0 0 30 30' />
                </IconButton>
            );
        } else {
            return (
                <IconButton
                    edge="end"
                    onClick={this.onDropdownSelect.bind(this)}
                >
                    <SvgIcon component={CloseDropdownIcon} viewBox='0 0 30 30' />
                </IconButton>
            );
        }
    }

    renderBody() {
        if (!this.state.minimized) {
            return (
                <div>
                    <div style={{ display: "flex" }}>
                        <PhoneEntry errorMessage={this.state.invalidPhoneHelperText} error={this.state.invalidPhoneEntry} onChange={this.phoneHandler.bind(this)} />
                    </div>
                    <div style={{ display: "flex" }}>
                        <LocationSelector errorMessage={this.state.invalidLocationHelperText} error={this.state.invalidLocationEntry} spots={this.state.spots} value={this.state.alertLocation} handler={this.locationHandler.bind(this)} />
                    </div>
                    <div style={{ display: "flex", marginTop: 10 }}>
                        <AlertRadius default={this.state.alertRadius} handler={this.radiusHandler.bind(this)} />
                    </div>
                    <div style={{ display: "flex", marginTop: 10 }}>
                        <SignUpButton handler={this.signUpHandler.bind(this)} />
                    </div>
                </div>
            );
        }
    }


    render() {

        return (

            <div style={this.state.containerStyle}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <div>
                        <SvgIcon
                            component={AlertsIcon}
                            viewBox='0 0 45 45'
                            style={{ fontSize: 45 }} />
                    </div>
                    <p style={{ width: "66%" }}> Sign up to get SMS alerts about shark sightings in your area </p>
                    <div style={{ display: "flex", alignSelf: "flex-start" }}>
                        {this.renderDropdownIcon()}
                    </div>
                </div>
                {this.renderBody()}
            </div>
        );
    }
};

const styles = {
    smsSignUpContainerClosed: {
        display: "flex",
        width: "100%",
        flexDirection: "column",
    },
    smsSignUpContainerOpen: {
        display: "flex",
        width: "100%",
        flexDirection: "column"
    }
}

export default SmsSignUp;