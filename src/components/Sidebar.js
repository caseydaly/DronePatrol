import React from 'react';
import MapGL from 'react-map-gl';
import LocationSelector from './LocationSelector';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as SearchIcon } from '../assets/SearchIcon.svg';


export default class Sidebar extends React.Component {
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

        return (

            <div style={{ position: "fixed", width: "33%", height: "86%", backgroundColor: "white", marginLeft: "2.6%", marginTop: "2.9%", paddingLeft: "1.65%", paddingTop: "35px", paddingRight: "1.65%", borderRadius: 25 }}>
                <h1 style={{ fontSize: "24px", color: "#0075DF", fontWeight: 700, marginBottom: "0px", marginTop: "0px" }}>Drone Patrol</h1>
                <p style={{ fontSize: "16px", marginTop: "8px" }}> Locate sharks around your area. </p>
                <p style={{ fontWeight: 500, marginTop: "30px" }}>Choose Location</p>
                <LocationSelector />
                <p style={{ fontWeight: 500, marginTop: "30px" }}>Time period</p>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        fullWidth
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        id="date-picker-inline"
                        label="Start date"
                        value={this.state.startDate}
                        onChange={this.handleStartChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                    <KeyboardDatePicker
                        fullWidth
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
                        }}
                    />
                </MuiPickersUtilsProvider>
                <div style={{marginTop: 10}}>
                    <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SvgIcon component={SearchIcon}/>
                          </InputAdornment>
                        )
                    }}
                    >
                        Search
                    </Button>
                </div>
            </div>
        );
    }
};

const styles = {


};