import {
    GetControlProps
} from "./../../components/document/controlPropsFactory.js";
import {
    util
} from "./../../plugins/util.js";


/**
 * Hàm xử lí việc bóc tách dữ liệu của các field từ server để đưa vào store
 * dữ liệu là các thuộc tính và các công thức của các control trong doc
 * @param {} fields 
 */
export const allControlNotSetData = ['approvalHistory', 'submit', 'draft', 'reset']
export const setDataForPropsControl = function(worker, fields, allDataDetail, viewType) {
    worker.postMessage({action:'setDataForPropsControl',data:{ fields: fields, viewType: viewType, allDataDetail: allDataDetail}});
}
export const getAllPropFromData = (fields, viewType, allDataDetail)=>{
    let listControlToStore = {}
    let controlMapDatasetDataflow = {};
    for (let controlId in fields) {
        let control = GetControlProps(fields[controlId].type);
        let userUpdate = fields[controlId].userUpdate
        let properties = control.properties;
        let formulas = control.formulas
        let type = fields[controlId].type;
        if (type == 'dataFlow') {
            controlMapDatasetDataflow[fields[controlId].properties['name']] = fields[controlId].properties['datasets'];
        }
        let fieldProperties = fields[controlId]['properties'];
        let id = fieldProperties.id;
        let prepareData = fields[controlId].dataPrepareSubmit;
        for(let prop in properties){
            if (type == 'checkbox') {
                let valueControl = fieldProperties[prop];
                properties[prop].value = valueControl;
            } else {
                let valueControl = fieldProperties[prop];
                if (type == "number" && prop == 'defaultValue' && valueControl == "") {
                    valueControl = 0;
                }
                properties[prop].value = valueControl;
            }
        }
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
        if (fields[controlId].type != "table" && allDataDetail != null) {
            let value = ""
            if (properties.hasOwnProperty('name')) {
                let controlName = properties['name'].value;
                let allData = util.cloneDeep(allDataDetail);
                value = allData[controlName];
            }
            listControlToStore[controlId] = {
                id: id,
                properties: properties,
                formulas: formulas,
                type: type,
                value: (type == 'percent') ? value * 100 : value,
                prepareData: prepareData,
                userUpdate: userUpdate
            }
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
                for(let childProp in childProperties){
                    let valueChildControl = listField[childFieldId]['properties'][childProp]
                    if (childType == 'checkbox') {
                        childProperties[childProp].value = (valueChildControl == 0 || valueChildControl == '0' || valueChildControl == '') ? false : true
                    } else {
                        if (childType == "number" && childProp == 'defaultValue' && valueChildControl == "") {
                            valueChildControl = 0;
                        }
                        childProperties[childProp].value = valueChildControl;
                    }
                }
                if (listField[childFieldId]['formulas'] != false && listField[childFieldId]['formulas'] != "[]") {
                    if (viewType != 'detail') {
                        for(let childFormulaType in childFormulas){
                            if (!listField[childFieldId]['formulas'][childFormulaType]) {
                                delete childControl.formulas[childFormulaType];
                            } else {
                                if (childFormulaType == 'linkConfig') {
                                    if (listField[childFieldId]['formulas'][childFormulaType] && listField[childFieldId]['formulas'][childFormulaType]['configData'].length > 0) {
                                        childFormulas[childFormulaType].configData = listField[childFieldId]['formulas'][childFormulaType]['configData'];
                                    }
                                } else {
                                    childFormulas[childFormulaType].value = listField[childFieldId]['formulas'][childFormulaType];
                                }
                            }
                        }
                    }
                }
                if (childProperties.hasOwnProperty('name') && allDataDetail != null) {
                    let controlName = childProperties['name'].value;
                    let allData = util.cloneDeep(allDataDetail[properties['name'].value]);
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
            listControlToStore[controlId] = {
                id: id,
                properties: properties,
                formulas: formulas,
                type: fields[controlId].type,
                listFields: listChildField,
                value: colValue,
                prepareData: prepareData,
                userUpdate: userUpdate
            }
        }
    }
    return {listControlToStore: listControlToStore, controlMapDatasetDataflow:controlMapDatasetDataflow}
}

/**
* Hàm lấy ra các control bị ảnh hưởng từ 1 control
* từ đó tạo dựng mối quan hệ cho các control
* lưu vào db cho lần submit sau không phải tìm lại
*/
export const getMapControlEffected = (allControlObj) => {
   let mapControlEffected = {};
   for (let name in allControlObj) {
       let type = allControlObj[name].type;
       if (type != "submit" && type != "reset" && type != "draft") {
           let formulas = allControlObj[name].controlFormulas;
           for (let formulasType in formulas) {
               if(formulasType == 'autocomplete'){
                   continue
               }
               if(!mapControlEffected.hasOwnProperty(formulasType)){
                   mapControlEffected[formulasType] = {}
               }
               if(formulasType == 'linkConfig'){
                   let allConfig = formulas[formulasType].configData;
                   for (let index = 0; index < allConfig.length; index++) {
                       let config = allConfig[index];
                       if(config.instance){
                         let inputControl = config.instance.inputControl;
                           for (let controlEffect in inputControl) {
                               if (!mapControlEffected[formulasType].hasOwnProperty(controlEffect)) {
                                   mapControlEffected[formulasType][controlEffect] = {};
                               }
                               mapControlEffected[formulasType][controlEffect][name] = true;
                           }
                       }
                   }
               }
               else{
                   if(formulas[formulasType].hasOwnProperty('instance')){
                       let inputControl = formulas[formulasType].instance.inputControl;
                       let inputLocalFormulas = formulas[formulasType].instance.inputForLocalFormulas;
                       let inputFromDatasets = formulas[formulasType].instance.inputFromDatasets;
                       for (let controlEffect in inputControl) {
                           if (!mapControlEffected[formulasType].hasOwnProperty(controlEffect)) {
                               mapControlEffected[formulasType][controlEffect] = {};
                           }
                           mapControlEffected[formulasType][controlEffect][name] = true;
                       }
                       for (let controlEffect in inputFromDatasets) {
                           if (!mapControlEffected[formulasType].hasOwnProperty(controlEffect)) {
                               mapControlEffected[formulasType][controlEffect] = {};
                           }
                           mapControlEffected[formulasType][controlEffect][name] = true;
                       }
                       for (let controlEffect in inputLocalFormulas) {
                           if (!mapControlEffected[formulasType].hasOwnProperty(controlEffect)) {
                               mapControlEffected[formulasType][controlEffect] = {};
                           }
                           mapControlEffected[formulasType][controlEffect][name] = true;
                       }
                       detectControlEffectedInTableInDoc(mapControlEffected[formulasType], name, formulas[formulasType].instance);
                   }
               }
           }
       }
   }
   return mapControlEffected
}

/**
 * hoangnd: kiểm tra công thức chạy infinity hay ko 
 *  
*/       
export const checkInfinityControl = (mapControlEffected) => {
    controlInfinity = [];
    for(let formulaType in mapControlEffected){
        if(['list','formulas'].includes(formulaType)){
            for(let controlName in mapControlEffected[formulaType]){
                let infinityLoopFound = search(controlName, mapControlEffected[formulaType][controlName], mapControlEffected[formulaType]);
                controlInfinity.push(infinityLoopFound)
            }
        }
    }
    return controlInfinity;
}
/**
 * DFS trong cây mối quan hệ để tìm control trùng lặp
 */
function search (controlCheck, effectedControl, mapControlEffected) {
    var i, children = Object.keys(effectedControl);
    for (i = 0; i < children.length; i += 1) {
        if(mapControlEffected[children[i]]){
            if(children[i] == controlCheck){
                return children[i];
            }
            else{
                if(!Object.keys(mapControlEffected[children[i]]).includes(children[i]) && children[i] != controlCheck){
                    search(controlCheck, mapControlEffected[children[i]], mapControlEffected);
                }
            }
        }
    }
}

/**
 * Hàm lấy các control đầu vào là các cột của table sqllite
 */
function detectControlEffectedInTableInDoc(mapControlEffected,name,formulasInstance){
    formulasInstance.detectControlInTable(mapControlEffected,name,formulasInstance.formulas,this.sDocumentSubmit.listInputInDocument)  
}