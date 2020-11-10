import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button as MaterialUiButton} from '@material-ui/core';
import { ReactComponent as SharkStrokeWhiteIcon } from '../assets/SharkStrokeWhiteIcon.svg';
import InputAdornment from '@material-ui/core/InputAdornment';
import SvgIcon from '@material-ui/core/SvgIcon';

const useStyles = makeStyles({
    root: {
        display: "flex",
        justifyContent: "start",
        backgroundColor: '#0075DF',
        borderRadius: 6,
        border: 0,
        color: 'white',
        height: 48,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        '&:hover': {
            backgroundColor: '#0075DF'
        }
    },
    label: {
        textTransform: 'capitalize',
        textAlign: "center",
        fontSize: 20
    },
});


export default function Button(props) {
    const classes = useStyles();

    return (
        <MaterialUiButton
            variant="contained"
            classes={{
                root: classes.root,
                label: classes.label
            }}
            fullWidth
            onClick={props.onClick}
            startIcon={
                props.startIcon && 
                <InputAdornment position="start">
                    {props.startIcon}
                </InputAdornment>
            }
            endIcon={
                props.endIcon && 
                <InputAdornment position="end">
                    {props.endIcon}
                </InputAdornment>
            }
        >
            <p style={{ justifySelf: "center", width: "100%" }}>{props.text}</p>
        </MaterialUiButton>

    );

}