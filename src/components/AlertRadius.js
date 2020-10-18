import React, { useState } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as RadiusIcon } from '../assets/RadiusIcon.svg';

const handleChange = value => {
    console.log(value);
};

export default function AlertRadius() {

    const { selected, changeSelected } = useState();
    const classes = useStyles();

    return (
        <Select
            value={selected}
            onChange={handleChange}
            defaultValue={5}
            fullWidth
            variant="outlined"
            margin="dense"
            startAdornment={
                <InputAdornment position="start">
                    <SvgIcon component={RadiusIcon} />
                </InputAdornment>
            }
            className={classes.input}

        >
            <MenuItem value={1}>Within 1 mile radius</MenuItem>
            <MenuItem value={5}>Within 5 mile radius</MenuItem>
            <MenuItem value={10}>Within 10 mile radius</MenuItem>
            <MenuItem value={25}>Within 25 mile radius</MenuItem>
        </Select>
    );
}

const useStyles = makeStyles({
    input: {
        background: "#F4F7F9",
        color: "#000000"
    }
});