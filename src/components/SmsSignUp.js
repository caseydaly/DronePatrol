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

import { ReactComponent as AlertsIcon } from '../assets/AlertsIcon.svg';

class SmsSignUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            alertRadius: 5,
            phoneNumber: "",
            alertLocation: this.props.location,
            minimized: false
        };
        this.renderDropdownIcon.bind(this);
        this.renderBody.bind(this);
    }

    componentDidMount(props) {

    }

    signUpHandler() {
        console.log("User signed up for SMS alerts");
    }

    radiusHandler(newValue) {
        console.log("User changed radius");
        console.log(newValue);
    }

    locationHandler(newValue) {
        console.log("User changed location");
        console.log(newValue);
    }

    phoneHandler(event) {
        console.log("User changed phone number");
        console.log(event.target.value);
    }

    onDropdownSelect(event) {
        console.log("Minimizing SMS sign up");
        console.log(event);
        this.state.minimized = !this.state.minimized;
        if (this.state.minimized) {
            this.props.onMinimize();
        } else {
            this.props.onMaximize();
        }
        //this.setState({ minimized: !this.state.minimized })
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
                        <PhoneEntry handler={this.phoneHandler.bind(this)} />
                    </div>
                    <div style={{ display: "flex" }}>
                        <LocationSelector value={this.state.alertLocation} handler={this.locationHandler.bind(this)} />
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

            <div style={{ display: "flex", margin: 0, width: "100%", flexDirection: "column", paddingBottom: 20, height: 250, marginBottom: 30 }}>
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

export default SmsSignUp;