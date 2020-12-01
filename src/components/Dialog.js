import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';



export default function Dialog(props) {

    var locationStyle;
    if (!props.location || props.location==="top") {
        locationStyle="2%";
    } else if (props.location==="middle") {
        locationStyle="32%";
    } else if (props.location==="bottom") {
        locationStyle="62%";
    }
    
    return (
        <div style={{...styles.baseStyle, top: locationStyle}}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", height: 10, width: "100%" }}>
                <IconButton
                    edge="end"
                    onClick={props.onClose}
                >
                    <CloseIcon />
                </IconButton>
            </div>
            {props.children}
        </div >
    );
}

const styles = {
    baseStyle: { 
        position: "fixed", 
        right: "2%", 
        display: "flex", 
        flexDirection: "column", 
        height: "20%", 
        width: "25%", 
        padding: "2%", 
        background: "white", 
        zIndex: 10, 
        borderRadius: 25 
    }
}