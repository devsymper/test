import { allNodesAttrs } from "./../allAttrsOfNodes";
const noNeedPrefix = {
    name: true,
    id: true,
    escalationCode: true
};
const PREFIX = 'symper:'
export default {
    // Tạo ra các thẻ mới và chèn vào element cha
    pushNewEqualEls(el, elKey, attr, bpmnModeler, attrName) {
        let moddle = bpmnModeler.get('moddle');
        let modeling = bpmnModeler.get('modeling');
        let attrValue = attr.value;
        for (let item of attrValue) {
            let canAdd = false;
            for (let key in item) {
                if (item[key]) {
                    canAdd = true;
                    break;
                }
            }

            if (canAdd) {
                let newEl = moddle.create('symper:' + attr.toXML.name);
                newEl.text = '';
                for (let key in item) {
                    if (noNeedPrefix[key]) {
                        newEl[key] = item[key];
                    } else {
                        let newkey = 'symper:' + key;
                        newEl.$attrs[newkey] = item[key];
                    }
                }
                console.log(newEl, 'newElnewElnewElnewElnewEl');

                el[elKey].unshift(newEl);
            }
        }
    },

    setValueAsAttr(el, elKey, attr, bpmnModeler, attrName) {
        let modeling = bpmnModeler.get("modeling");
        let value = allNodesAttrs[attrName].getValue(attr.value);
        let objToUpdate = {};
        if (typeof value != 'number' && typeof value != 'string') {
            value = JSON.stringify(value);
        }
        let toXMLname = allNodesAttrs[attrName].toXML.name;
        objToUpdate[toXMLname] = value;
        if (el.businessObject) {
            // el.businessObject.$attrs[attrName] = value;
            modeling.updateProperties(el, objToUpdate);
        }
    },

    formPropertyMethod(el, elKey, attr, bpmnModeler, attrName) {
        let moddle = bpmnModeler.get('moddle');
        let modeling = bpmnModeler.get('modeling');
        let extensionElements = moddle.create('bpmn:ExtensionElements');

        for (let row of attr.value) {
            let subEl = moddle.create('symper:formProperty');
            for (let key in row) {
                subEl[key] = row[key];
            }
            extensionElements.get('values').push(subEl);
        }
        modeling.updateProperties(el, {
            extensionElements,
        });
    },

    notPushToXML(el, elKey, attr, bpmnModeler, attrName) {

    }
}