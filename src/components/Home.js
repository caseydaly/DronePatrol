import React from 'react';
import GreatWhite from '../assets/great-white.jpg';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: ''
        };
    }

    async componentDidMount() {

    }

    render() {
        return (

            <div style={styles.homeScreenContainer}>
                <h1 style={styles.titleContainer}>SharkWatch</h1>
            </div>
        );
    }
};

const styles = {
    homeScreenContainer: {
        justifyContent: "center",
        backgroundImage: `url(${GreatWhite})`,
        backgroundSize: "cover",
        overflow: "hidden",
        imageRendering: "-webkit-optimize-contrast",
        width: "100%",
        height: "100%",
        flex: 1
    },
    titleContainer: {
        justifyContent: "center",
        alignItems: "center",
        fontSize: 100,
        height: "100%",
        width: "100%",
        textAlign: "center",
        color: "#1E90FF"
    }

}

