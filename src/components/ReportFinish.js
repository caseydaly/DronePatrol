import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import IconButton from '@material-ui/core/IconButton';
import { ReactComponent as NavigateBackIcon } from '../assets/NavigateBackIcon.svg';
import ReportSightingGraphic from '../assets/ReportSightingGraphic.svg';
import LocationSelector from './LocationSelector';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import Button from './Button';
import DragAndDropIcon from '../assets/DragAndDropIcon.svg';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import { ReactComponent as CalendarIcon } from '../assets/CalendarIcon.svg';
import InputAdornment from '@material-ui/core/InputAdornment';
import Dropzone from 'react-dropzone';


export default class ReportFinish extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLocation: null,
            sightingDate: new Date(),
            filesSelected: 0,
            image: null
        }
    }

    onNavBackSelect() {
        this.props.onNavBack();
    }

    onChooseLocation() {
        this.props.onNavLocation()
    }

    onDropFiles(acceptedFiles) {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                const binaryStr = reader.result

                this.state.image = binaryStr.split(',')[1];
            }
            reader.readAsDataURL(file)
            this.setState({ filesSelected: this.state.filesSelected + 1 })
        })

    }

    handleDateChange = (date) => {
        this.setState({ sightingDate: date });
    };

    onSubmit() {
        this.props.onSubmit(this.state.image, Math.round(this.state.sightingDate.getTime() / 1000))
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
                    <h4 style={{ margin: 0, fontWeight: 350 }}>Add information about the sighting, or click anywhere on the map to change the shark's location.</h4>
                </div>
                <div style={{ marginTop: 20 }}>
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
                            value={this.state.sightingDate}
                            onChange={this.handleDateChange}
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

                <Dropzone onDrop={this.onDropFiles.bind(this)}>
                    {({ getRootProps, getInputProps }) => (
                        <section style={{ width: "100%", height: "100%" }}>
                            <div {...getRootProps()} style={{ display: "flex", width: "100%", height: 250, backgroundColor: "#F4F7F9", borderRadius: 6, marginTop: 20, justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                                <input {...getInputProps()} />
                                <img src={DragAndDropIcon} />
                                {this.state.filesSelected === 1 && <p> 1 file selected. </p>}
                                {this.state.filesSelected > 1 && <p> {this.state.filesSelected} files selected. </p>}
                            </div>
                        </section>
                    )}
                </Dropzone>


                <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between", marginTop: 20 }}>
                    <div style={{ display: "flex", width: "100%" }}>
                        <Button
                            text="Submit"
                            onClick={this.onSubmit.bind(this)}
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