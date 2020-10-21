import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SharkPic from '../assets/SharkPic.png';
import CloseIcon from '@material-ui/icons/Close';



export default function SightingPopup(props) {

    return (
        <div style={{ position: "fixed", top: "20%", left: "20%", display: "flex", flexDirection: "column", height: 350, width: 650, padding: "2%", background: "white", zIndex: 10, borderRadius: 25 }}>
            <div style={{ display: "flex", height: "10%", width: "100%", flexDirection: "row", background: "#F2F5FA", borderRadius: 25, color: "#0075DF", alignItems: "center", paddingLeft: "3%", justifyContent: "space-between" }}>
                <div>
                    <h3><span style={{fontWeight: "bold"}}>Shark spotted - </span> <span style={{fontWeight: "lighter"}}>{props.location}</span></h3>
                </div>
                <div style={{ display: "flex", justifySelf: "flex-end" }}>
                    <IconButton onClick={props.handleClose}>
                        <CloseIcon />
                    </IconButton>
                </div>

            </div>
            <div style={{ display: "flex", flexDirection: "row", height: "80%", width: "100%", justifyContent: "space-between", marginTop: "3%" }}>
                <div>
                    <img src={SharkPic} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "80%", marginLeft: "5%" }}>
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
        </div >
    );
}