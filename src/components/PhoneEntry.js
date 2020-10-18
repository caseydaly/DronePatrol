import React from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as PhoneIcon } from '../assets/PhoneIcon.svg';

export default function PhoneEntry(props) {
    const classes = useStyles();

    return (
        <TextField
            fullWidth
            variant="outlined"
            className={classes.input}
            margin="dense"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SvgIcon component={PhoneIcon} />
                    </InputAdornment>
                ),
                classes: {
                    input: classes.input,
                }
            }}
            InputLabelProps={{
                shrink: true
            }}
            placeholder="Enter phone number"
            onChange={props.handler}
        />
    );

};

const useStyles = makeStyles({
    input: {
        background: "#F4F7F9",
        color: "#000000"
    }
});