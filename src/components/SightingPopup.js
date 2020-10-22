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
import { ReactComponent as GpsCoordinatesIcon } from '../assets/GpsCoordinatesIcon.svg';
import { ReactComponent as SharkDistanceIcon } from '../assets/SharkDistanceIcon.svg';
import { ReactComponent as SharkSizeIcon } from '../assets/SharkSizeIcon.svg';
import { ReactComponent as SharkTypeIcon } from '../assets/SharkTypeIcon.svg';
import SvgIcon from '@material-ui/core/SvgIcon';
import Divider from '@material-ui/core/Divider';



export default function SightingPopup(props) {

    return (
        <div style={{ position: "fixed", top: "20%", left: "20%", display: "flex", flexDirection: "column", height: "40%", width: "50%", padding: "2%", background: "white", zIndex: 10, borderRadius: 25 }}>
            <div style={{ display: "flex", height: "10%", width: "100%", flexDirection: "row", background: "#F2F5FA", borderRadius: 25, color: "#0075DF", alignItems: "center", paddingLeft: "3%", justifyContent: "space-between" }}>
                <div>
                    <h3><span style={{ fontWeight: "bold" }}>Shark spotted - </span> <span style={{ fontWeight: "lighter" }}>{props.sighting.location}</span></h3>
                </div>
                <div style={{ display: "flex", justifySelf: "flex-end" }}>
                    <IconButton onClick={props.handleClose}>
                        <CloseIcon />
                    </IconButton>
                </div>

            </div>
            <div style={{ display: "flex", flexDirection: "row", height: "80%", width: "100%", justifyContent: "space-between", marginTop: "3%" }}>
                <div>
                    <img src={SharkPic} width="100%" height="100%" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "80%", marginLeft: "2%", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <SvgIcon component={SharkTypeIcon} />
                        <p style={{ marginLeft: "3%" }}>Type of Shark:</p>
                        <p style={{ fontWeight: "bold", marginLeft: "3%" }}>{props.sighting.type}</p>
                    </div>
                    <Divider/>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <SvgIcon component={SharkSizeIcon} />
                        <p style={{ marginLeft: "3%" }}>Estimated Size:</p>
                        <p style={{ fontWeight: "bold", marginLeft: "3%" }}>{props.sighting.size} feet</p>
                    </div>
                    <Divider/>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <SvgIcon component={GpsCoordinatesIcon} />
                        <p style={{ marginLeft: "3%" }}>GPS Coordinates:</p>
                        <p style={{ fontWeight: "bold", marginLeft: "3%" }}>{props.sighting.lat}</p>
                        <p style={{ fontWeight: "bold" }}>{props.sighting.long}</p>
                    </div>
                    <Divider/>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <SvgIcon component={SharkDistanceIcon} />
                        <p style={{ marginLeft: "3%" }}>Distance From Shore:</p>
                        <p style={{ fontWeight: "bold", marginLeft: "3%" }}>{props.sighting.distanceToShore} feet</p>
                    </div>
                </div>
            </div>
        </div >
    );
}