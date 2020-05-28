import { GetControlProps } from "./../../components/document/controlPropsFactory.js";
import store from './../../store'
export const setDataForPropsControl = function(fields) {
    for (let controlId in fields) {
        let control = GetControlProps(fields[controlId].type)
        let properties = control.properties
        let formulas = control.formulas
        let type = fields[controlId].type
        let id = fields[controlId].id;
        $.each(properties, function(k, v) {
            if (properties[k].type == 'checkbox') {
                properties[k].value = (fields[controlId][k] == 0 || fields[controlId][k] == '0' || fields[controlId][k] == '') ? false : true
            } else {
                properties[k].value = fields[controlId][k]
            }
        })
        if (fields[controlId].type != "table") {
            addToAllControlInDoc(controlId, { id: id, properties: properties, formulas: formulas, type: fields[controlId].type });
        } else {
            let listField = fields[controlId].listFields
            let listChildField = {};
            for (let childFieldId in listField) {
                let childControl = GetControlProps(listField[childFieldId].type)
                let childProperties = childControl.properties
                let childFormulas = childControl.formulas
                let childType = listField[childFieldId].type
                let childId = listField[childFieldId].id
                $.each(childProperties, function(k, v) {
                    if (childProperties[k].type == 'checkbox') {
                        childProperties[k].value = (listField[childFieldId][k] == 0 || listField[childFieldId][k] == '0' || listField[childFieldId][k] == '') ? false : true
                    } else {
                        childProperties[k].value = listField[childFieldId][k]
                    }
                })
                listChildField[childFieldId] = { id: childId, properties: childProperties, formulas: childFormulas, type: childType }
            }
            addToAllControlInDoc(controlId, { id: id, properties: properties, formulas: formulas, type: fields[controlId].type, listFields: listChildField });
        }

    }
}

function addToAllControlInDoc(controlId, control) {
    store.commit(
        "document/addControl", { id: controlId, props: control }
    );
}