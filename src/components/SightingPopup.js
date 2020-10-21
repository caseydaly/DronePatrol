import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default function SightingPopup(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={{ position: "fixed", top: "20%", left: "20%", display: "flex", flexDirection: "column", height: 400, width: 800, paddingLeft: "10%", paddingRight: "10%", background: "white", zIndex: 11 }}>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Shark spotted - {props.location}
                </DialogTitle>
                <DialogContent dividers>
                    <div style={{ display: "flex", height: "20%", width: "100%", flexDirection: "row" }}>
                        <h3>Shark spotted - </h3>
                        <h4>{props.location}</h4>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", height: "80%", width: "100%", justifyContent: "space-between" }}>
                        <div>
                            <p>image here</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <p>Type of Shark:</p>
                            </div>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <p>Estimated Size:</p>
                            </div>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <p>GPS Coordinates:</p>
                            </div>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <p>Distance From Shore:</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}