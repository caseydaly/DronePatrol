import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as SmsAlertsIcon } from '../assets/SmsAlertsIcon.svg';
import { ReactComponent as CollapseIcon } from '../assets/CollapseIcon.svg';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core';




class SmsSignUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        };
    }

    componentDidMount(props) {

    }


    render() {

        const { classes } = this.props;

        return (

            <div style={{ display: "flex" }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{backgroundColor: "#0075df", opacity:"0.15", height: 30, width: 30}}>
                        <SvgIcon component={SmsAlertsIcon} />
                    </div>
                    <p style={{ width: "60%" }}> Sign up to get SMS alerts about shark sightings in your area </p>
                    <IconButton>
                        <SvgIcon component={CollapseIcon} />
                    </IconButton>

                </div>
            </div>
        );
    }
};


const styles = theme => ({

});

export default withStyles(styles)(SmsSignUp);