import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as SmsAlertsIcon } from '../assets/SmsAlertsIcon.svg';
import { ReactComponent as DropdownIcon } from '../assets/DropdownIcon.svg';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, makeStyles } from '@material-ui/core';
import PhoneEntry from './PhoneEntry';
import LocationSelector from './LocationSelector';

import { ReactComponent as AlertsIcon } from '../assets/AlertsIcon.svg';

class SmsSignUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        };
    }

    componentDidMount(props) {

    }


    render() {

        return (

            <div style={{ display: "flex", margin: 0, width: "100%", flexDirection: "column", paddingBottom: 20, height: 250 }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <div>
                        <SvgIcon
                            component={AlertsIcon}
                            viewBox='0 0 45 45'
                            style={{fontSize: 45}} />
                    </div>
                    <p style={{ width: "66%" }}> Sign up to get SMS alerts about shark sightings in your area </p>
                    <div style={{ display: "flex", alignSelf: "flex-start" }}>
                        <IconButton
                            edge="end"
                        >
                            <SvgIcon component={DropdownIcon} viewBox='0 0 30 30' />
                        </IconButton>
                    </div>
                </div>
                <div style={{display: "flex"}}>
                    <PhoneEntry />
                </div>
                <div style={{display: "flex"}}>
                    <LocationSelector/>
                </div>

            </div>
        );
    }
};

export default SmsSignUp;