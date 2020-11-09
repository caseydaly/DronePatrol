import React from 'react';
import LocationSelector from './LocationSelector';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import InputAdornment from '@material-ui/core/InputAdornment';
import SvgIcon from '@material-ui/core/SvgIcon';
import SearchButton from './SearchButton';
import { ReactComponent as CalendarIcon } from '../assets/CalendarIcon.svg';
import { withStyles } from '@material-ui/core';

class SidebarMainContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spots: null,
            selectedLocation: null
        };
    }

    async componentDidMount() {
        const response = await fetch("http://ec2-50-18-14-124.us-west-1.compute.amazonaws.com/api/spots");
        const spots = await response.json();
        this.setState({spots: spots})
    }

    selectLocationHandler(location) {
        this.setState({selectedLocation: location});
    }

    handleSearch() {
        console.log("updating viewport");
        this.props.onChange(this.state.selectedLocation);
    }

    render() {
        const { classes } = this.props;

        console.log("passing these spots to location selector: " + this.state.spots);

        return (
            <div>
                <h1 style={{ fontSize: "24px", color: "#0075DF", fontWeight: 700, marginBottom: "0px", marginTop: "0px" }}>Drone Patrol</h1>
                <p style={{ fontSize: "16px", marginTop: "8px" }}> Locate sharks around your area. </p>
                <p style={{ fontWeight: 500, marginTop: "25px", marginBottom: "10px", height: 10 }}>Choose Location</p>
                <p style={{ marginTop: "0px", paddingTop: 0 }}>
                    <LocationSelector spots={this.state.spots} handler={this.selectLocationHandler.bind(this)}/>
                </p>
                <p style={{ fontWeight: 500, marginTop: "20px", marginBottom: "5px" }}>Time period</p>
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
                    <SearchButton onClick={this.handleSearch.bind(this)}/>
                </div>
            </div>
        );

    }
}

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

export default withStyles(styles)(SidebarMainContainer);