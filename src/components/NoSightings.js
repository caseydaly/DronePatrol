import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import BinocularsIconBlue from '../assets/BinocularsIconBlue.svg';
import Button from './Button';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';


export default function NoSightings(props) {

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", justifyContent: "flex-start", alignItems: "center" }}>
            <div style={{ padding: 0, margin: 0 }}>
                <img src={BinocularsIconBlue} width={50} height={50} />
            </div>
            <div>
                <h4 style={{ textAlign: "center" }}>There aren't many sightings at this time. </h4>
            </div>
            <div >
                <Button
                    endIcon={<NavigateNextIcon />}
                    text="Click to see sample data"
                    onClick={props.onClick}
                    height={40}
                />
            </div>
        </div>
    );
}