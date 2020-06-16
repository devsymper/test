import { GetControlProps } from "./../../components/document/controlPropsFactory.js";
import store from './../../store'
import sDocument from './../../store/document'
import { util } from "./../../plugins/util.js";


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
                let valueControl = fields[controlId]['properties'][k];
                if (type == "number" && valueControl == "") {
                    valueControl = 0;
                }
                properties[k].value = valueControl;
            }
        })
        if (fields[controlId]['formulas'] != false && fields[controlId]['formulas'] != "[]") {

            $.each(formulas, function(k, v) {
                if (fields[controlId]['formulas'][k] == "") {
                    delete control.formulas[k];
                } else {
                    formulas[k].value = fields[controlId]['formulas'][k]
                }
            })
        }
        if (fields[controlId].type != "table" && sDocument.state.detail.allData != null) {
            let value = ""
            if (properties.hasOwnProperty('name')) {
                let controlName = properties['name'].value;
                let allData = util.cloneDeep(sDocument.state.detail.allData);
                value = allData[controlName];
            }
            addToAllControlInDoc(controlId, { id: id, properties: properties, formulas: formulas, type: type, value: value });
        } else {
            let listField = fields[controlId].listFields
            let listChildField = {};
            let i = 0;
            let colValue = {}
            for (let childFieldId in listField) {
                let childControl = GetControlProps(listField[childFieldId].type)
                let childProperties = childControl.properties
                let childFormulas = childControl.formulas
                let childType = listField[childFieldId].type
                let childId = listField[childFieldId]['properties'].id
                $.each(childProperties, function(k, v) {
                    if (childType == 'checkbox') {
                        childProperties[k].value = (listField[childFieldId]['properties'][k] == 0 || listField[childFieldId]['properties'][k] == '0' || listField[childFieldId]['properties'][k] == '') ? false : true
                    } else {
                        let valueChildControl = listField[childFieldId]['properties'][k];
                        if (childType == "number" && valueChildControl == "") {
                            valueChildControl = 0;
                        }
                        childProperties[k].value = valueChildControl;
                    }
                })
                if (listField[childFieldId]['formulas'] != false && listField[childFieldId]['formulas'] != "[]") {
                    $.each(childFormulas, function(k, v) {
                        if (listField[childFieldId]['formulas'][k] == "") {
                            delete childControl.formulas[k];
                        } else {
                            childFormulas[k].value = listField[childFieldId]['formulas'][k]
                        }

                    })
                }
                if (childProperties.hasOwnProperty('name') && sDocument.state.detail.allData != null) {
                    let controlName = childProperties['name'].value;
                    let allData = util.cloneDeep(sDocument.state.detail.allData[properties['name'].value]);
                    if (allData != null && allData != undefined) {
                        let countRow = allData.length;
                        for (let j = 0; j < countRow; j++) {
                            let rowData = allData[j];
                            if (!colValue.hasOwnProperty(controlName)) {
                                colValue[controlName] = []
                            }
                            colValue[controlName].push(rowData[controlName])
                        }
                    }


                }
                listChildField[childFieldId] = { id: childId, properties: childProperties, formulas: childFormulas, type: childType }
                i++;
            }
            addToAllControlInDoc(controlId, { id: id, properties: properties, formulas: formulas, type: fields[controlId].type, listFields: listChildField, value: colValue });
        }

    }

}

function addToAllControlInDoc(controlId, control) {
    store.commit(
        "document/addControl", { id: controlId, props: control }
    );
}