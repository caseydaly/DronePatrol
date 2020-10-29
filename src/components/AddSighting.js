import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as CloseDropdownIcon } from '../assets/CloseDropdownIcon.svg';
import { ReactComponent as OpenDropdownIcon } from '../assets/OpenDropdownIcon.svg';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, makeStyles, Button } from '@material-ui/core';
import CameraIcon from '../assets/CameraIcon.png';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import InputAdornment from '@material-ui/core/InputAdornment';
import { ReactComponent as CalendarIcon } from '../assets/CalendarIcon.svg';
import Dropzone from 'react-dropzone';

class AddSighting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            minimized: this.props.startCollapsed,
            image: null
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

    onDropFiles(acceptedFiles) {
        console.log(acceptedFiles);
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                const binaryStr = reader.result
                this.state.image = binaryStr;
            }
            reader.readAsArrayBuffer(file)
        })

    }

    reportSighting() {
        console.log(this.state.image)
        const obj = {
            "image": this.state.image,
            "lat": 122.1352135,
            "lon": -117.24875,
            "date": "10-29-2020"
        }
        const options = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(obj)
        }
        const response = fetch("http://0.0.0.0:5000/api/sighting", options);
        console.log(response);
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

                    <div style={{ display: "flex", width: "100%", height: 100 }}>
                        <Dropzone onDrop={this.onDropFiles.bind(this)}>
                            {({ getRootProps, getInputProps }) => (
                                <section style={{ width: "100%", height: "100%" }}>
                                    <div {...getRootProps()} style={{ width: "100%", height: "100%", backgroundColor: "#F4F7F9", borderStyle: "dashed", borderRadius: 15, justifyContent: "center" }}>
                                        <input {...getInputProps()} />
                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                    </div>

                    <div>
                        <Button onClick={this.reportSighting.bind(this)}>Send File</Button>
                    </div>
                </div>
            );
        }
    }


    render() {

        return (

            <div style={{ display: "flex", margin: 0, width: "100%", flexDirection: "column", paddingBottom: 20 }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", height: 68 }}>
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