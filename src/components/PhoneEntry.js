import React from 'react';
import { forwardRef } from 'react'
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as PhoneIcon } from '../assets/PhoneIcon.svg';

const normalizeInput = (value, previousValue) => {
    if (!value) return value;
    const currentValue = value.replace(/[^\d]/g, '');
    const cvLength = currentValue.length;

    if (!previousValue || value.length > previousValue.length) {
        if (cvLength < 4) return currentValue;
        if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
        return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
    }
};

const validateInput = value => {
    let error = ""

    if (!value) error = "Required!"
    else if (value.length !== 14) error = "Invalid phone format. ex: (555) 555-5555";

    return error;
}


export default function PhoneEntry(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState('');

    const handler = (event) => {
        const val = event.target.value;
        setValue(previousValue => normalizeInput(val, previousValue));
        props.onChange(event.target.value);
    };

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
            value={value}
            onChange={handler}
        />
    );

};

const useStyles = makeStyles({
    input: {
        background: "#F4F7F9",
        color: "#000000"
    }
});