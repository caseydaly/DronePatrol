import React from 'React';

class AddSighting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    renderBody() {
        if (!this.state.minimized) {
            return (
                <div>

                </div>
            );
        }
    }

    render() {
        return ();
    }
}

export default AddSighting;