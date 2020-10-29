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
import CameraIcon from '../assets/CameraIcon.png';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import InputAdornment from '@material-ui/core/InputAdornment';
import { ReactComponent as CalendarIcon } from '../assets/CalendarIcon.svg';
import Dropzone from 'react-dropzone'
import { CenterFocusStrong } from '@material-ui/icons';

class AddSighting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            minimized: false
        };
        this.renderDropdownIcon.bind(this);
        this.renderBody.bind(this);
    }

    componentDidMount(props) {

    }

    onDropdownSelect(event) {
        console.log("Minimizing add sighting container");
        console.log(event);
        this.setState({ minimized: !this.state.minimized });
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
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                fullWidth
                                className={this.props.input}
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
                                label="Date of sighting"
                                value={this.state.date}
                                onChange={this.handleEndChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                    edge: "start"
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </div>

                    <div style={{display: "flex"}}>
                        <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
                            {({ getRootProps, getInputProps }) => (
                                <section>
                                    <div {...getRootProps()} style={{height: 50, width: "100%", backgroundColor: "#F4F7F9", borderStyle: "dashed", borderRadius: 15, justifyContent: "center"}}>
                                        <input {...getInputProps()} />
                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                    </div>
                </div>
            );
        }
    }


    render() {

        return (

            <div style={{ display: "flex", margin: 0, width: "100%", flexDirection: "column", paddingBottom: 20, height: 250 }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <div >
                        <img src={CameraIcon} />
                    </div>
                    <p style={{ width: "66%" }}> Report a shark sighting </p>
                    <div style={{ display: "flex", alignSelf: "flex-start" }}>
                        {this.renderDropdownIcon()}
                    </div>
                </div>
                {this.renderBody()}
            </div>
        );
    }
};

const styles = theme => ({
    input: {
        background: "#F4F7F9",
        width: "100%"
    }
});

export default withStyles(styles)(AddSighting);