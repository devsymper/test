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

        for (let attrName in attrs) {
            let attrDef = allNodesAttrs[attrName];
            if (typeof attrDef.pushToXML == 'function') {
                attrDef.pushToXML(vizEl, elKey, attrs[attrName], bpmnModeler, attrName);
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