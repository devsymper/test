import { GetControlProps } from "./../../components/document/controlPropsFactory.js";
import store from './../../store'
/**
 * Hàm xử lí việc bóc tách dữ liệu của các field từ server để đưa vào store
 * dữ liệu là các thuộc tính và các công thức của các control trong doc
 * @param {} fields 
 */
export const setDataForPropsControl = function(fields) {
    for (let controlId in fields) {
        let control = GetControlProps(fields[controlId].type)
        let properties = control.properties
        let formulas = control.formulas
        let type = fields[controlId].type
        let id = fields[controlId]['properties'].id;
        $.each(properties, function(k, v) {
            if (type == 'checkbox') {
                properties[k].value = (fields[controlId]['properties'][k] == 0 || fields[controlId]['properties'][k] == '0' || fields[controlId]['properties'][k] == '') ? false : true
            } else {
                properties[k].value = fields[controlId]['properties'][k]
            }
        })
        if (fields[controlId]['formulas'] != false) {
            $.each(formulas, function(k, v) {
                if (fields[controlId]['formulas'][k] == "") {
                    delete control.formulas[k];
                } else {
                    formulas[k].value = fields[controlId]['formulas'][k]
                }
            })
        }
        if (fields[controlId].type != "table") {
            addToAllControlInDoc(controlId, { id: id, properties: properties, formulas: formulas, type: type });
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
                    if (childType == 'checkbox') {
                        childProperties[k].value = (listField[childFieldId]['properties'][k] == 0 || listField[childFieldId]['properties'][k] == '0' || listField[childFieldId]['properties'][k] == '') ? false : true
                    } else {
                        childProperties[k].value = listField[childFieldId]['properties'][k]
                    }
                })
                if (listField[childFieldId]['formulas'] != false) {
                    $.each(childFormulas, function(k, v) {
                        if (listField[childFieldId]['formulas'][k] == "") {
                            delete childControl.formulas[k];
                        } else {
                            childFormulas[k].value = listField[childFieldId]['formulas'][k]
                        }

                    })
                }
                listChildField[childFieldId] = { id: childId, properties: childProperties, formulas: childFormulas, type: childType }
            }
            addToAllControlInDoc(controlId, { id: id, properties: properties, formulas: formulas, type: fields[controlId].type, listFields: listChildField });
        }

    }
    console.log(store.state.document.editor);

}

function addToAllControlInDoc(controlId, control) {
    store.commit(
        "document/addControl", { id: controlId, props: control }
    );
}