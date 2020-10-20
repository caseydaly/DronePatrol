/// my-map-controller.js
import { MapController } from 'react-map-gl';

export default class CustomMapController extends MapController {

    // Override the default event handler
    handleEvent(event) {
        // if (event != null && event.center != null) {
        //     if (!this.eventIsInSidebar(event.center.x, event.center.y)) {
        //         super.handleEvent(event);
        //     }
        // }
        super.handleEvent(event);
    }


    eventIsInSidebar(x, y) {
        const minX = window.innerWidth * .02; //we have a 2% left margin for the sidebar
        const minY = window.innerHeight * .02; //we have a 2% upper margin for sidebar
        const maxX = window.innerWidth * .33;
        const maxY = window.innerHeight * .86;

        if (x > minX && x < maxX && y < maxY && y > minY) {
            return true;
        }

        return false;

    }
}