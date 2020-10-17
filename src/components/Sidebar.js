import React from 'react';
import MapGL from 'react-map-gl';
import LocationSelector from './LocationSelector';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import SvgIcon from '@material-ui/core/SvgIcon';
import SearchButton from './SearchButton';
import { withStyles } from '@material-ui/core';
import { ReactComponent as CalendarIcon } from '../assets/CalendarIcon.svg';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import SmsSignUp from "./SmsSignUp";



class Sidebar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
            endDate: new Date()
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


    render() {

        const { classes } = this.props;

        return (

            <div style={{ position: "fixed", width: "33%", height: "86%", backgroundColor: "white", marginLeft: "2%", marginTop: "2%", paddingRight: "1.65%", paddingLeft: "1.65%", paddingTop: "1.65%", borderRadius: 25, overflowY: "auto", pointerEvents: "none" }}>
                <h1 style={{ fontSize: "24px", color: "#0075DF", fontWeight: 700, marginBottom: "0px", marginTop: "0px" }}>Drone Patrol</h1>
                <p style={{ fontSize: "16px", marginTop: "8px" }}> Locate sharks around your area. </p>
                <p style={{ fontWeight: 500, marginTop: "30px", marginBottom: "16px", height: 10 }}>Choose Location</p>
                <p style={{ marginTop: "0px", paddingTop: 0 }}>
                    <LocationSelector />
                </p>
                <p style={{ fontWeight: 500, marginTop: "20px", marginBottom: "10px" }}>Time period</p>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        fullWidth
                        className={classes.input}
                        inputVariant="outlined"
                        margin="normal"
                        keyboardIcon={
                            <InputAdornment position="start" variant="standard">
                                <SvgIcon component={CalendarIcon} />
                            </InputAdornment>
                        }
                        InputAdornmentProps={{ position: "start" }}
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        id="date-picker-inline"
                        label="Start date"
                        value={this.state.startDate}
                        onChange={this.handleStartChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                            edge: "start"
                        }}
                    />
                    <KeyboardDatePicker
                        fullWidth
                        className={classes.input}
                        inputVariant="outlined"
                        InputAdornmentProps={{ position: "start" }}
                        keyboardIcon={
                            <InputAdornment position="start" variant="standard">
                                <SvgIcon component={CalendarIcon} />
                            </InputAdornment>
                        }
                        disableToolbar
                        variant="inline"
                        margin="normal"
                        format="MM/dd/yyyy"
                        id="date-picker-inline"
                        label="End date"
                        value={this.state.endDate}
                        onChange={this.handleEndChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                            edge: "start"
                        }}
                    />
                </MuiPickersUtilsProvider>
                <div style={{ marginTop: 10, marginBottom: 20 }}>
                    <SearchButton />
                </div>
                <Divider />
                <SmsSignUp />
            </div>
        );
    }
};


const styles = theme => ({
    input: {
        background: "#F4F7F9",
        width: "100%"
    },
    root: {
        margin: 0,
        padding: 0
    },
    h5: {
        color: "#0075DF"
    }
});

export default withStyles(styles)(Sidebar);