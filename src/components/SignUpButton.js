import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
    },
    label: {
        textTransform: 'capitalize',
        textAlign: "center",
        fontSize: 20
    },
});


export default function SignUpButton(props) {
    const classes = useStyles();

    return (
        <Button
            variant="contained"
            classes={{
                root: classes.root,
                label: classes.label
            }}
            fullWidth
            startIcon={
                <InputAdornment position="start">
                    <SvgIcon component={SharkStrokeWhiteIcon} />
                </InputAdornment>
            }
            onClick={props.handler}
        >
            <p style={{justifySelf: "center", width: "100%"}}>Sign Up</p>
        </Button>
    );
}