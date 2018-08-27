import {viewPlot} from './plot/indexPlot.js';
//resizer
const v1 = document.querySelector('.column-one');
const v2 = document.querySelector('.column-two');
const r1_lr_handle = document.querySelector('.button-resize');

let mouseStartPosition = {};
let v1StartWidth;
let v2StartWidth;
let resBtn;
r1_lr_handle.addEventListener("mousedown", mousedownR1RL);

function mousedownR1RL(e) {
    // get v1 width
    v1StartWidth = v1.offsetWidth;
    v2StartWidth = v2.offsetWidth;
    // get mouse position
    mouseStartPosition.x = e.pageX;
    mouseStartPosition.y = e.pageY;
    resBtn = e.target;
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
}




function mousemove(e) {
    if(resBtn) {

        let diff = mouseStartPosition.x - e.pageX;
        if((v2StartWidth + diff) < 550){
            viewPlot.plot(viewPlot);
        }else{
            v1.style.flexBasis = v1StartWidth + -1 * diff + 'px';
            v2.style.flexBasis = v2StartWidth + diff + 'px';
            viewPlot.plot(viewPlot);
        }
    }
}


function mouseup(e) {
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
    resBtn = null;
}



