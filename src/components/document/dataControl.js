import {
    GetControlProps
} from "./../../components/document/controlPropsFactory.js";
import store from './../../store'
import sDocument from './../../store/document'
import {
    util
} from "./../../plugins/util.js";


/**
 * Hàm xử lí việc bóc tách dữ liệu của các field từ server để đưa vào store
 * dữ liệu là các thuộc tính và các công thức của các control trong doc
 * @param {} fields 
 */
export const allControlNotSetData = ['approvalHistory', 'submit', 'draft', 'reset']
export const setDataForPropsControl = function(fields, instance, from) {
    let controlMapDatasetDataflow = {};
    let viewType = sDocument.state.viewType[instance];
    for (let controlId in fields) {
        let control = GetControlProps(fields[controlId].type);
        let userUpdate = fields[controlId].userUpdate
        let properties = control.properties;
        let formulas = control.formulas
        let type = fields[controlId].type;
        if (type == 'dataFlow') {
            controlMapDatasetDataflow[fields[controlId].properties['name']] = fields[controlId].properties['datasets'];
        }
        let id = fields[controlId]['properties'].id;
        let prepareData = fields[controlId].dataPrepareSubmit;
        $.each(properties, function(k, v) {
            if (type == 'checkbox') {
                let valueControl = fields[controlId]['properties'][k];
                properties[k].value = valueControl;
            } else {
                let valueControl = fields[controlId]['properties'][k];
                if (type == "number" && k == 'defaultValue' && valueControl == "") {
                    valueControl = 0;
                }
                properties[k].value = valueControl;
            }
        })
        if (fields[controlId]['formulas'] != false && fields[controlId]['formulas'] != "[]") {
            if (viewType != 'detail') {
                for (let fType in formulas) {
                    if (!fields[controlId]['formulas'][fType]) {
                        delete control.formulas[fType];
                    } else {
                        if (fType == 'linkConfig') {
                            if (fields[controlId]['formulas'][fType] && fields[controlId]['formulas'][fType]['configData'].length > 0) {
                                formulas[fType].configData = fields[controlId]['formulas'][fType]['configData'];
                            }
                        } else {
                            formulas[fType].value = fields[controlId]['formulas'][fType]
                        }
                    }
                }
            }
        }
        if (fields[controlId].type != "table" && sDocument.state.detail[instance].allData != null) {
            let value = ""
            if (properties.hasOwnProperty('name')) {
                let controlName = properties['name'].value;
                let allData = util.cloneDeep(sDocument.state.detail[instance].allData);
                value = allData[controlName];
            }
            addToAllControlInDoc(controlId, {
                id: id,
                properties: properties,
                formulas: formulas,
                type: type,
                value: (type == 'percent') ? value * 100 : value,
                prepareData: prepareData,
                userUpdate: userUpdate
            }, instance, from);
        } else {
            let listField = fields[controlId].listFields
            let listChildField = {};
            let colValue = {};
            let childObjectId = [];
            for (let childFieldId in listField) {
                let childControl = GetControlProps(listField[childFieldId].type)
                let childProperties = childControl.properties
                let childFormulas = childControl.formulas
                let childType = listField[childFieldId].type
                let childId = listField[childFieldId]['properties'].id
                let childPrepareData = listField[childFieldId].dataPrepareSubmit;
                $.each(childProperties, function(k, v) {
                    if (childType == 'checkbox') {
                        childProperties[k].value = (listField[childFieldId]['properties'][k] == 0 || listField[childFieldId]['properties'][k] == '0' || listField[childFieldId]['properties'][k] == '') ? false : true
                    } else {
                        let valueChildControl = listField[childFieldId]['properties'][k];
                        if (childType == "number" && k == 'defaultValue' && valueChildControl == "") {
                            valueChildControl = 0;
                        }
                        childProperties[k].value = valueChildControl;
                    }
                })
                if (listField[childFieldId]['formulas'] != false && listField[childFieldId]['formulas'] != "[]") {
                    if (viewType != 'detail') {
                        $.each(childFormulas, function(k, v) {
                            if (!listField[childFieldId]['formulas'][k]) {
                                delete childControl.formulas[k];
                            } else {
                                if (k == 'linkConfig') {
                                    if (listField[childFieldId]['formulas'][k] && listField[childFieldId]['formulas'][k]['configData'].length > 0) {
                                        childFormulas[k].configData = listField[childFieldId]['formulas'][k]['configData'];
                                    }
                                } else {
                                    childFormulas[k].value = listField[childFieldId]['formulas'][k];
                                }
                            }
                        })
                    }
                }
                if (childProperties.hasOwnProperty('name') && sDocument.state.detail[instance].allData != null) {
                    let controlName = childProperties['name'].value;
                    let allData = util.cloneDeep(sDocument.state.detail[instance].allData[properties['name'].value]);
                    if (allData != null && allData != undefined) {
                        let countRow = allData.length;
                        for (let j = 0; j < countRow; j++) {
                            let rowData = allData[j];
                            if (childObjectId.length < countRow) {
                                childObjectId.push(rowData['document_object_id']);
                            }
                            if (!colValue.hasOwnProperty(controlName)) {
                                colValue[controlName] = []
                            }
                            colValue[controlName].push(rowData[controlName]);
                        }
                    }
                    listChildField[childFieldId] = {
                        id: childId,
                        properties: childProperties,
                        formulas: childFormulas,
                        type: childType,
                        prepareData: childPrepareData,
                        value: colValue[controlName]
                    }
                }

            }
            colValue['childObjectId'] = childObjectId;
            addToAllControlInDoc(controlId, {
                    id: id,
                    properties: properties,
                    formulas: formulas,
                    type: fields[controlId].type,
                    listFields: listChildField,
                    value: colValue,
                    prepareData: prepareData,
                    userUpdate: userUpdate
                },
                instance, from);
        }
    }
    store.commit(
        "document/addToDocumentSubmitStore", { key: 'listControlMappingDatasets', value: controlMapDatasetDataflow, instance: instance }
    );
}

function addToAllControlInDoc(controlId, control, instance, from) {
    store.commit(
        "document/addControl", { id: controlId, props: control, from: 'submit', instance: instance }
    );
}