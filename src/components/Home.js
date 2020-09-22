import React from 'react';
import GreatWhite from '../assets/great-white.jpg';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: '',
            prediction: ''
        };
    }

    async componentDidMount() {
        if (this.state.prediction === '') {
            fetch("http://127.0.0.1:5000/")
                .then(response => response.text())
                .then((response) => {
                    //var url = URL.createObjectURL(response);
                    this.setState({prediction: response});
                })
                .catch(err => console.log(err))
        }
    }

    render() {

        console.log(this.state.prediction);

        return (

            <div style={styles.homeScreenContainer}>
                <img src={this.state.prediction}/>
            </div>
        );
    }
};

const styles = {
    homeScreenContainer: {
        justifyContent: "center",
        //backgroundImage: `url(${GreatWhite})`,
        flexDirection: "column",
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

