import React from 'react';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';



export default function Success(props) {

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", justifyContent: "flex-start", alignItems: "center" }}>
            <div>
                <CheckCircleOutlineIcon style={{ color: "#4BB543", fontSize: "66px" }} />
            </div>
            <div style={{padding: 0, margin: 0}}>
                <h3 style={{padding: 0, marginTop: 10}} > We have received your sighting, and are confirming the details before posting. </h3>
            </div>
        </div>
    );
}