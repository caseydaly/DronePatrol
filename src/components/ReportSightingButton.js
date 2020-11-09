import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { ReactComponent as BinocularsIcon } from '../assets/BinocularsIcon.svg';
import { ReactComponent as NavigateRightArrowIcon } from '../assets/NavigateRightArrowIcon.svg';
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
    }
});

export default function ReportSightingButton(props) {
    const classes = useStyles();

    return (
        <div style={{marginTop: 20}}>
            <Button
                variant="contained"
                classes={{
                    root: classes.root,
                    label: classes.label
                }}
                fullWidth
                startIcon={
                    <InputAdornment
                        position="start"
                    >
                        <SvgIcon component={BinocularsIcon} viewBox="0 0 26 26" />
                    </InputAdornment>
                }
                endIcon={
                    <InputAdornment
                        position="end"
                    >
                        <SvgIcon component={NavigateRightArrowIcon} viewBox="0 0 30 30" />
                    </InputAdornment>
                }
                onClick={props.onClick}
            >
                <p style={{ justifySelf: "center", width: "100%" }}>Report a Shark Sighting</p>
            </Button>
        </div>
    );

}

