import {formula} from "../input/index.js";
import {addEvent} from "./resizeWindow.js";

export class ControllerPlot{
    constructor(model, view){
        this.view = view;
        let self = this;
        model.changeCallback = function() {
            self.renderView();
        };
        view.onCheckedCallback = function(firstX,lastX) {
            model.recalculate(firstX,lastX);
        };
        formula.on('change', data => model.recalculate(-10,10,data));
        addEvent(window, "resize", ()=>{view.plot(view)});
    }

    renderView() {
        this.view.plot();
    }
}