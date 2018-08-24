
import { ModelPlot } from './model.js';
import { ViewPlot } from './view.js';
import { ControllerPlot } from './controller.js';

const modelPlot = new ModelPlot();
export const viewPlot = new ViewPlot(modelPlot);
const controllerPlot = new ControllerPlot(modelPlot,viewPlot);
