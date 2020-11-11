import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
    append as svgAppend,
    attr as svgAttr,
    classes as svgClasses,
    create as svgCreate,
    innerSVG
} from 'tiny-svg';

import h337  from 'heatmap.js';
import heatmapInstance  from 'heatmap.js';

import {
    getRoundRectPath
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
    is,
    getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import { isNil } from 'min-dash';

const HIGH_PRIORITY = 1500;

const STATUS_COLORS = {
    end: '#52B415',
    running: '#0760D9',
};
export default class CustomRenderer extends BaseRenderer {
    constructor(eventBus, bpmnRenderer) {
        super(eventBus, HIGH_PRIORITY);
        this.bpmnRenderer = bpmnRenderer;
    }

    canRender(element) {
        // ignore labels
        return !element.labelTarget;
    }

    drawShape(parentNode, element) {
        const shape = this.bpmnRenderer.drawShape(parentNode, element);
        if (element.type.includes('Task')) {
			let countEnd = element.businessObject.$attrs.countEnd;
			let countRunning = element.businessObject.$attrs.countRunning;
			let r = 16
			let runner = 0;
			svgClasses(shape).add('cursor-pointer');
			if(countEnd){
				var config = {
					container: parentNode,
					radius: 10,
					maxOpacity: .5,
					minOpacity: 0,
					blur: .75
				  };
				var heatmapInstance = h337.create(config);
				var dataPoint = {
					x: 100, // x coordinate of the datapoint, a number
					y: 100, // y coordinate of the datapoint, a number
					value: 100 // the value at datapoint(x, y)
				};
				heatmapInstance.addData(dataPoint);
			}
			if(countRunning){
				var config = {
					container: parentNode,
					radius: 10,
					maxOpacity: .5,
					minOpacity: 0,
					blur: .75
				  };
				var heatmapInstance = h337.create(config);
				var dataPoint = {
					x: 50, // x coordinate of the datapoint, a number
					y: 50, // y coordinate of the datapoint, a number
					value: 100 // the value at datapoint(x, y)
				};
				heatmapInstance.setData({
					max:20,
					data: dataPoint
				});
			}
          
          
        }
        return shape;
    }

    getShapePath(shape) {
        if (is(shape, 'bpmn:Task')) {
            return getRoundRectPath(shape, 2);
        }

        return this.bpmnRenderer.getShapePath(shape);
    }

    getColor(suitabilityScore) {
        if (suitabilityScore > 100) {
            return COLOR_GREEN;
        } else if (suitabilityScore > 25) {
            return COLOR_YELLOW;
        }

        return COLOR_RED;
    }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer'];

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect(parentNode, width, height, borderRadius, color) {
    const rect = svgCreate('rect');
    svgAttr(rect, {
        width: width,
        height: height,
        rx: borderRadius,
        ry: borderRadius,
        stroke: color,
        strokeWidth: 2,
        fill: color+'00'
    });

    svgAppend(parentNode, rect);

    return rect;
}


function insertText(parentNode,countInfor,colorSet=null , running = false) {
    const text = svgCreate('text');
    const textRole = svgCreate('text');
    svgAttr(text, {
        x:running == false ? 7 : 30,
        y:-4,
        fill:colorSet?colorSet.stroke:"#52B415"
    });
    svgAttr(textRole, {
        x:4,
        y:115,
        fill:"#aaaaaa"
    });
    svgAppend(parentNode, text);
    svgAppend(parentNode, textRole);
    innerSVG(text,countInfor);
    return text;
}