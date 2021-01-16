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
            if(prop == 'tableView'){
                properties[prop].value = (properties[prop].value) ? properties[prop].value : 'Flat'
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
                let childControl = GetControlProps(listField[childFieldId].type);
                let childProperties = childControl.properties
                let childFormulas = childControl.formulas
                let childType = listField[childFieldId].type
                let childId = listField[childFieldId]['properties'].id
                let childPrepareData = listField[childFieldId].dataPrepareSubmit;
                for(let childProp in childProperties){
                    let valueChildProp = listField[childFieldId]['properties'][childProp]
                    if (childType == 'checkbox') {
                        childProperties[childProp].value = valueChildProp;
                    } else {
                        if (childType == "number" && childProp == 'defaultValue' && valueChildProp == "") {
                            valueChildProp = 0;
                        }
                        childProperties[childProp].value = valueChildProp;
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
                       detectControlEffectedInTableInDoc(mapControlEffected[formulasType], name, formulas[formulasType].instance, allControlObj);
                   }
               }
           }
       }
   }
   return mapControlEffected
}

function detectControlEffectedInTableInDoc(mapControlEffected,name,formulaInstance, allControlObj){
    formulaInstance.detectControlInTable(mapControlEffected,name,formulaInstance.formulas,allControlObj)  
}

/**
 * hoangnd: kiểm tra công thức chạy infinity hay ko 
 *  
*/       
export const checkInfinityControl = (mapControlEffected) => {
    let controlInfinity = [];
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
 * Hàm kiểm tra xem có sự thay đổi của data input của 1 formula hay không
 * nếu có thì mới thực thi công thức
 * @param {*} instance state của phiên làm việc hiện tại
 * @param {*} dataInput dữ liệu đầu vào của công thức đang check
 * @param {*} rowIndex index của dòng trong bảng
 */
export const checkDataInputChange = function(rootChangeFieldName, dataInputBeforeChange, dataInput){
    if(Object.keys(dataInput).length == 0){
        return true;
    }
    for(let controlName in dataInput){
        if(controlName == rootChangeFieldName){
            return true;
        }
        if(dataInput[controlName] != null &&  typeof dataInput[controlName] == 'object'){
            for (let index = 0; index < dataInput[controlName].length; index++) {
                let cellValue = dataInput[controlName][index];
                if(!dataInputBeforeChange[controlName]){
                    continue;
                }
                if(!dataInputBeforeChange[controlName][index]){
                    return true;
                }
                if(dataInputBeforeChange[controlName][index] != cellValue){
                    return true;
                }
            }
        }
        else{
            if(dataInputBeforeChange[controlName] != dataInput[controlName]){
                return true;
            }
        }
    }
    return false;
}

export const genKeyFromDataInput = (dataInput)=>{
    let key = [];
    for(let control in dataInput){
        key.push(control+"_"+dataInput[control]);
    }
    return key.join('__');
}
 /** 
 * Hàm lấy dữ liệu của các control đầu vào để chuân bị cho việc run formulas
 * dataInput : {controlName : value}
 */
export const getDataInputFormula = (formulaInstance, listInput, extraData = null, rowIndex = null, dataAutoComplete = {}) =>{
    let inputControl = formulaInstance.getInputControl();
    let dataInput = {};
    for (let inputControlName in inputControl) {
        if(dataAutoComplete[inputControlName]){
            dataInput[inputControlName] = dataAutoComplete[inputControlName];
        }
        else{
            if(listInput.hasOwnProperty(inputControlName)){
                let controlIns = listInput[inputControlName];
                if(!controlIns){
                    dataInput[inputControlName] = "";
                }
                else{
                    if(controlIns.inTable != false){
                        let currentColData = '';
                        let tableControl = listInput[controlIns.inTable];
                        if(rowIndex != 'all' && rowIndex.length == 1){
                            currentColData = tableControl.tableInstance.getCellData(inputControlName, rowIndex[0]);
                        console.log(rowIndex,currentColData,'rowIndexrowIndex');
                        }
                        else if(rowIndex == 'all'){
                            currentColData = tableControl.tableInstance.getColData(inputControlName);
                        }
                        else if(rowIndex.length > 1){
                            let listRowData = [];
                            currentColData = tableControl.tableInstance.getColData(inputControlName);
                            for (let index = 0; index < rowIndex.length; index++) {
                                let rowInd = rowIndex[index];
                                let rowData = currentColData[rowInd];
                                listRowData.push(rowData);
                            }
                            currentColData = listRowData;
                        }
                        dataInput[inputControlName] = currentColData;
                    }
                    else{
                        dataInput[inputControlName] = controlIns.value;
                    }
                    if(controlIns.type == 'inputFilter'){
                        valueInputControl = dataInput[inputControlName].split(',')
                    }
                    if(controlIns.type == 'date'){
                        dataInput[inputControlName] = controlIns.convertDateToStandard(dataInput[inputControlName])
                    }
                    if(controlIns.type == 'time'){
                        dataInput[inputControlName] = controlIns.convertTimeToStandard(dataInput[inputControlName])
                    }
                    if(['number','percent'].includes(controlIns.type) && !dataInput[inputControlName]){
                        dataInput[inputControlName] = 0
                    }
                }
            }
            else{
                if(extraData && extraData[inputControlName]){
                    dataInput[inputControlName] = extraData[inputControlName];
                }
            }
        }
    }
    return dataInput;
}
/**
 * Ham xử lý data input để đưa ra data post cho hàm chạy công thức nhiều dòng trong table
 * @param {} dataInput 
 * @param {*} listIdRow 
 * @param {*} listInput 
 */
export const prepareDataGetMultiple = (dataInput, listIdRow, listInput)=>{
    let dataPost = {};
    /***
     * Chuẩn bị data để gọi api thực thi công thức cho các control trong table
     */
    if (Object.keys(dataInput).length > 0) {
        let allRowDataInput = [];
        for (let control in dataInput) {
            if(listInput[control]){
                let controlType = listInput[control].type;
                let dataRow = dataInput[control];
                if (!Array.isArray(dataRow)) {
                    for (let index = 0; index < listIdRow.length; index++) {
                        if (allRowDataInput.length <= index) {
                            allRowDataInput[index] = {};
                        }
                        if(['number','percent'].includes(controlType)){
                            if (!dataRow) {
                                dataRow = 0
                            } else {
                                dataRow = Number(dataRow);
                            }
                        }
                    
                        allRowDataInput[index][control] = dataRow;
                    }
                } else {
                    for (let i = 0; i < dataRow.length; i++) {
                        if (allRowDataInput.length <= i) {
                            allRowDataInput[i] = {};
                        }
                        let value = dataRow[i];
                        if(['number','percent'].includes(controlType)){
                            if (!value) {
                                value = 0
                            } else {
                                value = Number(value);
                            }
                        }
                        allRowDataInput[i][control] = value;
                    }
                }
            }
        }
        for (let index = 0; index < allRowDataInput.length; index++) {
            let rowInput = allRowDataInput[index];
            dataPost[listIdRow[index]] = rowInput;
        }
    } else {
        for (let index = 0; index < listIdRow.length; index++) {
            dataPost[listIdRow[index]] = "";
        }
    }
    return dataPost;
}