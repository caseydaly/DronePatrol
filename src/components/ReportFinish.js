import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import IconButton from '@material-ui/core/IconButton';
import { ReactComponent as NavigateBackIcon } from '../assets/NavigateBackIcon.svg';
import ReportSightingGraphic from '../assets/ReportSightingGraphic.svg';
import LocationSelector from './LocationSelector';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import Button from './Button';
import { ReactComponent as CurrentLocationIcon } from '../assets/CurrentLocationIcon.svg';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import { ReactComponent as CalendarIcon } from '../assets/CalendarIcon.svg';
import InputAdornment from '@material-ui/core/InputAdornment';

export default class ReportFinish extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLocation: null
        }
    }

    onNavBackSelect() {
        //this.props.onNavBack();
    }

    onSubmit() {

    }

    onChooseLocation() {

    }

    render() {
        return (
            <div style={styles.container}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <IconButton
                        edge="end"
                        onClick={this.onNavBackSelect.bind(this)}
                        style={{ marginLeft: -15, color: "#0075DF" }}
                    >
                        <NavigateBeforeIcon
                            fontSize="large"
                        />
                    </IconButton>
                    <h2 style={{ color: "#0075DF", fontWeight: 800 }}>Report a Shark Sighting</h2>
                </div>
                <div style={{ display: "flex" }}>
                    <h4 style={{ margin: 0, fontWeight: 350 }}>Add information about the sighting.</h4>
                </div>
                <div style={{marginTop:20}}>
                    <h4 style={{ margin: 0, fontWeight: 450, marginBottom: 10 }}>Choose a date</h4>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            fullWidth
                            className={styles.input}
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
                    </MuiPickersUtilsProvider>
                </div>
                <div style={{ display: "flex", marginTop: 20 }}>
                    <h4 style={{ margin: 0, fontWeight: 350 }}>Click below or drag and drop an image/video</h4>
                </div>
                <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between", marginTop: 20 }}>
                    <div style={{display: "flex", width: "45%"}}>
                        <Button
                            text="Submit"
                            onClick={this.onSubmit.bind(this)}
                        />
                    </div>
                    <div style={{display: "flex", width: "45%"}}>
                        <Button
                            text="Change Location"
                            onClick={this.onChooseLocation.bind(this)}
                        />
                    </div>
                </div>
            </div>
        );
    }

}

const styles = {
    container: {
        position: "fixed",
        width: "33%",
        backgroundColor: "white",
        marginLeft: "1%",
        marginTop: "1%",
        padding: "1.5%",
        borderRadius: 25,
        cursor: 'default',
        zIndex: 10
    },
    iconColorPrimary: {
        color: ""
    },
    input: {
        background: "#F4F7F9",
        width: "100%"
    },

}