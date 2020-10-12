import React from 'react';
import MapGL from 'react-map-gl';
import LocationSelector from './LocationSelector';


export default class Sidebar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        };
    }

    componentDidMount(props) {

    }

    render() {

        return (

            <div style={{position: "fixed", width: "33%", height: "86%", backgroundColor: "white", marginLeft: "2.6%", marginTop: "2.9%", paddingLeft: "1.65%", paddingTop: "35px", borderRadius: 25}}>
                <h1 style={{fontSize: "24px", color: "#0075DF", fontWeight: 700, marginBottom: "0px", marginTop: "0px"}}>Drone Patrol</h1>
                <p style={{fontSize: "16px", marginTop: "8px"}}> Locate sharks in your area. </p>
                <p style={{fontWeight: 500, marginTop: "30px"}}>Choose Location</p>
                <LocationSelector />
            </div>
        );
    }
};

const styles = {


};