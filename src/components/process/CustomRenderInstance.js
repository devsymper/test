import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
    append as svgAppend,
    attr as svgAttr,
    classes as svgClasses,
    create as svgCreate
} from 'tiny-svg';

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
    done: '#52B415',
    todo: '#ffc800',
    overdue: '#cc0000'
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
            let instanceStatus = element.businessObject.$attrs.statusCount;
            let runner = 0;
            let r = 8;
            svgClasses(shape).add('cursor-pointer');

            for (let key in instanceStatus) {
                if (instanceStatus[key]) {
                    let color = STATUS_COLORS[key];
                    let rect = drawRect(parentNode, r, r, r / 2, color);
                    let offset = runner * r * 1.5;
                    svgAttr(rect, {
                        transform: `translate(${offset}, -13)`
                    });
                    runner += 1;
                }
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
        fill: color
    });

    svgAppend(parentNode, rect);

    return rect;
}