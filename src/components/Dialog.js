import React from 'react';
import CloseIcon from '@material-ui/icons/Close';



export default function Dialog(props) {

    return (
        <div style={{ position: "fixed", right: "2%", top: "2%", display: "flex", flexDirection: "column", height: "20%", width: "25%", padding: "2%", background: "white", zIndex: 10, borderRadius: 25 }}>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-end", height: 10, width: "100%"}}>
                <CloseIcon />
            </div>
            {props.children}
        </div >
    );
}