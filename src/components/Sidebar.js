import React from 'react';
import MapGL from 'react-map-gl';
import LocationSelector from './LocationSelector';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";


export default class Sidebar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            startDate: new Date()
        };
    }

    componentDidMount(props) {

    }

    handleDateChange = (date) => {
        this.setState({ startDate: date });
    };

    render() {

        return (

            <div style={{ position: "fixed", width: "33%", height: "86%", backgroundColor: "white", marginLeft: "2.6%", marginTop: "2.9%", paddingLeft: "1.65%", paddingTop: "35px", paddingRight: "1.65%", borderRadius: 25 }}>
                <h1 style={{ fontSize: "24px", color: "#0075DF", fontWeight: 700, marginBottom: "0px", marginTop: "0px" }}>Drone Patrol</h1>
                <p style={{ fontSize: "16px", marginTop: "8px" }}> Locate sharks in your area. </p>
                <p style={{ fontWeight: 500, marginTop: "30px" }}>Choose Location</p>
                <LocationSelector />
                <p style={{ fontWeight: 500, marginTop: "30px" }}>Select dates</p>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Date picker inline"
                        value={this.state.startDate}
                        onChange={this.handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </MuiPickersUtilsProvider>

            </div>
        );
    }
};

const styles = {


};