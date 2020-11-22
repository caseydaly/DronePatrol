import React from 'react';
import LocationSelector from './LocationSelector';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchButton from './SearchButton';
import { ReactComponent as CalendarIcon } from '../assets/CalendarIcon.svg';
import { withStyles } from '@material-ui/core';
import Button from './Button';
import { ReactComponent as SearchIcon } from '../assets/SearchIcon.svg';
import SvgIcon from '@material-ui/core/SvgIcon';
import { isThisHour } from 'date-fns';

class SidebarMainContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLocation: null,
            startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
            endDate: new Date(),
            spots: this.props.spots
        };
    }

    async componentDidMount() {
    }

    selectLocationHandler(location) {
        this.setState({ selectedLocation: location });
    }

    handleSearch() {
        console.log("updating viewport");
        this.props.onChange(this.state.selectedLocation);
    }

    handleStartChange = (date) => {
        this.setState({ startDate: date });
    };

    handleEndChange = (date) => {
        this.setState({ endDate: date });
    };

    //when we receive new props with the surf spots, we have to rerender manually 
    componentDidUpdate(prevProps) {
        if (prevProps.spots.length === 0) // Check if the old spots was empty
        {
            this.setState({ spots: this.props.spots });
        }
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
                    <LocationSelector spots={this.state.spots} handler={this.selectLocationHandler.bind(this)} />
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
                    <Button
                        startIcon={<SvgIcon component={SearchIcon} viewBox='0 0 30 30' />}
                        text="Search"
                        onClick={this.handleSearch.bind(this)}
                    />
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