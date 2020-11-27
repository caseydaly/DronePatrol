//manage dialogs on the right side of the screen

import React from 'react';
import Dialog from './Dialog';

export default class DialogManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {

        //we can only fit 3 dialogs, so cut off list after index 2
        var children = this.props.children;
        children = children.slice(0, 3);

        const locationMappings = {
            0: "top",
            1: "middle",
            2: "bottom"
        };

        if (children.length > 0) {
            return (
                <div> 
                    {children.map((child, index) => 
                        <Dialog location={locationMappings[index]} onClose={() => this.props.removeDialog(index)}>
                            {child}
                        </Dialog>
                    )}
                </div>
            );
        } else {
            return null;
        }
    }

}