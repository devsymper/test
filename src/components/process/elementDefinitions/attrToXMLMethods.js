import { allNodesAttrs } from "./../allAttrsOfNodes";
const noNeedPrefix = {
    name: true,
    id: true,
    escalationCode: true
};
const PREFIX = 'symper:';

function clearEmptyAttr(bizObj) {
    for (let key in bizObj) {
        if (bizObj[key] === '') {
            delete bizObj[key];
        }
    }

    for (let key in bizObj.$attrs) {
        if (bizObj.$attrs[key] === '') {
            delete bizObj.$attrs[key];
        }
    }
}
export default {
    addStringValueAsTag(el, elKey, attr, bpmnModeler, attrName) {
        let moddle = bpmnModeler.get('moddle');
        let newEl = moddle.create('symper:' + attr.toXML.name);
        newEl.text = attr.value;
        el[elKey].unshift(newEl);
    },
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
        console.log(attrName, value, value !== '');

        if (value !== '' && attrName != 'overrideid') {
            let objToUpdate = {};
            if (typeof value != 'number' && typeof value != 'string') {
                value = JSON.stringify(value);
            }
            let toXMLname = allNodesAttrs[attrName].toXML.name;
            objToUpdate[toXMLname] = value;
            if (el.businessObject) {
                clearEmptyAttr(el.businessObject);
                // el.businessObject.$attrs[attrName] = value;
                modeling.updateProperties(el, objToUpdate);
            }
        }
    },

    formPropertyMethod(el, elKey, attr, bpmnModeler, attrName) {

        let moddle = bpmnModeler.get('moddle');
        let modeling = bpmnModeler.get('modeling');
        let extensionElements = moddle.create('bpmn:ExtensionElements');
        extensionElements.values = [];
        for (let row of attr.getValue(attr.value)) {
            let subEl = moddle.create('symper:formProperty');
            for (let key in row) {
                let vl = row[key];
                subEl[key] = vl;
            }
            extensionElements.values.push(subEl);
        }
        modeling.updateProperties(el, {
            extensionElements
        });
    },


    dataObjectMethod(el, elKey, attr, bpmnModeler, attrName) {

        let moddle = bpmnModeler.get('moddle');
        let modeling = bpmnModeler.get('modeling');

        for (let item of attr.value) {
            if (!item.id || !item.name) {
                continue;
            }
            let dataObject = moddle.create('symper:dataObject');
            dataObject.id = item.id;
            dataObject.name = item.name;
            dataObject.itemSubjectRef = "xsd:string"

            let extensionElement = moddle.create('bpmn:ExtensionElements');
            let valueTag = moddle.create("symper:symper_symper_value_tag");
            valueTag.text = item.defaultValue;
            extensionElement.values = [valueTag];

            modeling.updateProperties({
                businessObject: dataObject
            }, {
                extensionElements: extensionElement
            });
            el[elKey].push(dataObject);
        }
    },

    notPushToXML(el, elKey, attr, bpmnModeler, attrName) {

    },

    documentationMethod(el, elKey, attr, bpmnModeler, attrName) {
        if (el.businessObject && attr.value != '') {
            let moddle = bpmnModeler.get('moddle');
            let bizObj = el.businessObject;
            let newEl = moddle.create("symper:documentation");
            newEl.text = attr.value;
            bizObj.documentation = [newEl];
        }
    }
}