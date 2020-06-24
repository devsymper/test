import { allNodesAttrs } from "./../allAttrsOfNodes";
import attrToXMLMethods from "./attrToXMLMethods";
import { util } from "../../../plugins/util";

/**
 * 
 * @param {Array} allVizEls mảng chứa các đối tượng do thư viện quản lý
 * @param {Object} allSymEls đối tượng chứa tất cả các thuộc tính của tất cả các elements trong modeler
 * @param {Object} moddle đối tượng thư viện để đẩy sang xml
 */
export const pushCustomElementsToModel = function(allVizEls, allSymEls, bpmnModeler) {
    for (let vizEl of allVizEls) {
        let bizVizEl = vizEl.businessObject;
        let attrs = allSymEls[bizVizEl.id].attrs;
        let elKey = '';
        if (bizVizEl.$type == 'bpmn:Process' || bizVizEl.$type == 'bpmn:Collaboration') {
            elKey = 'rootElements';
            vizEl = bizVizEl.$parent;
        } else if (bizVizEl) {

        }

        if (elKey) {
            vizEl[elKey] = removeOldSymperExts(vizEl[elKey]);
        }

        // addCustomPropsToForm(allSymEls[bizVizEl.id]);

        for (let attrName in attrs) {
            let attrDef = allNodesAttrs[attrName];
            if (typeof attrDef.pushToXML == 'function') {
                attrDef.pushToXML(vizEl, elKey, attrs[attrName], bpmnModeler, attrName);
            }
        }
        if (bizVizEl.$type == 'bpmn:Process') {
            addCustomAttrToDataObject(bizVizEl, attrs);
            attrToXMLMethods.dataObjectMethod(bizVizEl, 'flowElements', attrs.dataproperties, bpmnModeler, '');
            removeCustomAttrToDataObject(bizVizEl, attrs);
        }
    }
}

function addCustomAttrToDataObject(vizEl, attrs) {
    let keys = ['instanceDisplayText', 'controlsForBizKey'];
    for (let k of keys) {
        attrs.dataproperties.value.push({
            id: vizEl.id + "_" + k,
            name: vizEl.id + "_" + k,
            type: "string",
            defaultValue: attrs[k].value
        });
    }
}

/**
 * 
 * @param {Object} symEl object chứa thông tin của element do Symper quy định
 */
function addCustomPropsToForm(symEl) {
    if (symEl.type == 'StartNoneEvent' || symEl.type == 'UserTask') {
        symEl.attrs.formproperties.value = [];
        for (let attrName in symEl.attrs) {
            let attr = symEl.attrs[attrName];
            if (attr.isSymperProp) {
                symEl.attrs.formproperties.value.push({
                    id: symEl.id + '___' + attrName,
                    name: attrName,
                    type: 'string',
                    variable: symEl.id + '___' + attrName,
                    expression: '',
                    default: typeof attr.value == 'object' ? JSON.stringify(attr.value) : attr.value,
                    text: ''
                });
            }
        }
        console.log(symEl, 'xxxxxxxxxxxxxxxxx');
    }
}

function removeOldSymperExts(els) {
    let newArr = [];
    for (let el of els) {
        if (el.$type.indexOf('symper:') != 0) {
            newArr.push(el);
        }
    }
    return newArr;
}

function removeCustomAttrToDataObject(vizEl, attrs) {
    let keys = {
        instanceDisplayText: true,
        controlsForBizKey: true
    };
    for (let idx in attrs.dataproperties.value) {
        let item = attrs.dataproperties.value[idx];
        if (item.id) {
            let checkType = item.id.replace(vizEl.id + '_', '');
            if (keys[checkType]) {
                delete attrs.dataproperties.value[idx];
            }
        }
    }
    attrs.dataproperties.value = Object.values(attrs.dataproperties.value);
}

export const defaultTaskDescription = {
    action: {
        module: "document",
        resource: "document_object",
        scope: "workflow",
        action: '',
        parameter: {
            activityId: '',
            documentId: 0
        }
    },
    content: '',
    extraLabel: '',
    extraValue: '',
    approvalActions: '',
    targetElement: '',
}

export const collectInfoForTaskDescription = function(allVizEls, allSymEls, bpmnModeler) {
    for (let idEl in allSymEls) {
        let el = allSymEls[idEl];
        if (el.type == 'UserTask' || el.type == 'Task') {
            let elDocumentation = util.cloneDeep(defaultTaskDescription);
            elDocumentation.action.action = el.attrs.taskAction.value;
            elDocumentation.action.parameter.activityId = el.id;

            elDocumentation.content = el.attrs.notificationContent.value;
            elDocumentation.extraLabel = el.attrs.extraInfoLabel.value;
            elDocumentation.extraValue = el.attrs.extraInfoValue.value;

            if (el.attrs.taskAction.value == 'submit') {
                elDocumentation.action.parameter.documentId = el.attrs.formreference.value;
            } else if (el.attrs.taskAction.value == 'approval') {
                elDocumentation.targetElement = el.attrs.approvalForElement.value;
                elDocumentation.approvalActions = JSON.stringify(el.attrs.approvalActions.value);
            } else if (el.attrs.taskAction.value == 'update') {
                elDocumentation.targetElement = el.attrs.updateForElement.value;
            }
            el.attrs.documentation.value = JSON.stringify(elDocumentation);
        }
    }
}