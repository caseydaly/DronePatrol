import React from 'react';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';



export default function SmsSignUpSuccess(props) {

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", justifyContent: "flex-start", alignItems: "center" }}>
            <div>
                <CheckCircleOutlineIcon style={{ color: "#4BB543", fontSize: "66px" }} />
            </div>
            <div style={{padding: 0, margin: 0}}>
                <h3 style={{padding: 0, marginTop: 10}} > We have sent a text to your phone to confirm your number. </h3>
            </div>
        </div>
    );
}