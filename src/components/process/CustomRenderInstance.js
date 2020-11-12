import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
    append as svgAppend,
    attr as svgAttr,
    classes as svgClasses,
    create as svgCreate,
    innerSVG
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
    todo: '#0760D9',
    overdue: '#cc0000'
};
import imgPosition from "@/assets/image/imagePosition.png";
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
            let currentNode=element.businessObject.$attrs.currentNode;
            let infoAssignee=element.businessObject.$attrs.infoAssignee;
            let colorSet=element.businessObject.$attrs.setColor;
            let runner = 0;
            let r = 8;
            let color;
            svgClasses(shape).add('cursor-pointer');
            for (let key in instanceStatus) {
                if (instanceStatus[key]) {
                    color = STATUS_COLORS[key];
                    let rect = drawRect(parentNode, r, r, r / 2, color);
                    let offset = runner * r * 1.5;
                    svgAttr(rect, {
                        transform: `translate(${offset}, -13)`
                    });
                    runner += 1;
                }
            }
            if (currentNode) {
                // let rect = drawRect(parentNode, r+108, r+88, 10, "#FF8003");
                let rect = insertImage(parentNode,imgPosition,r+30, r+30);
               
            }
            if (infoAssignee) {
                insertText(parentNode,infoAssignee,colorSet);
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

function insertImage(parentNode,href, width, height) {
    const img = svgCreate('image');
    svgAttr(img, {
        width: width,
        height: height,
        href:href,
        x:75,
        y:-25
    });
    svgAppend(parentNode, img);
    return img;
}
function insertText(parentNode,infoAssignee,colorSet=null) {
    const text = svgCreate('text');
    const textRole = svgCreate('text');
    svgAttr(text, {
        x:0,
        y:100,
        fill:colorSet?colorSet.stroke:"#52B415"
    });
    svgAttr(textRole, {
        x:0,
        y:115,
        fill:"#aaaaaa"
    });
    svgAppend(parentNode, text);
    svgAppend(parentNode, textRole);
    innerSVG(text,infoAssignee.assignee.displayName);
    if (infoAssignee.role) {
        innerSVG(textRole,infoAssignee.role.name);
    }
    return text;
}