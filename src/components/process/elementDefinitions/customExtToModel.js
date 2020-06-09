import { allNodesAttrs } from "./../allAttrsOfNodes";
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

        addCustomPropsToForm(allSymEls[bizVizEl.id]);

        for (let attrName in attrs) {
            let attrDef = allNodesAttrs[attrName];
            if (typeof attrDef.pushToXML == 'function') {
                attrDef.pushToXML(vizEl, elKey, attrs[attrName], bpmnModeler, attrName);
            }
        }
    }
}

/**
 * 
 * @param {Object} symEl object chứa thông tin của element do Symper quy định
 */
function addCustomPropsToForm(symEl) {
    debugger
    if (symEl.type == 'StartNoneEvent' || symEl.type == 'UserTask') {
        for (let attrName in symEl.attrs) {
            let attr = symEl.attrs[attrName];
            if (attr.isSymperProp) {
                symEl.attrs.formproperties.value.push({
                    id: symEl.id + '___' + attrName,
                    name: symEl.id + '___' + attrName,
                    type: 'string',
                    variable: symEl.id + '___' + attrName,
                    expression: '',
                    default: typeof attr.value == 'object' ? JSON.stringify(attr.value) : attr.value,
                    text: ''
                });
            }
        }
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