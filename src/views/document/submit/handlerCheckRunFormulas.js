import { util } from '../../../plugins/util';
import store from './../../../store'
import sDocument from './../../../store/document'

/**
 * Đánh dấu là control này đã được bind giá trị
 * @param {string} fieldName
 */
const markBinedField = function(instance, fieldName) {
    let sDocumentSubmit = sDocument.state.submit[instance];
    let rootChangeFieldName = sDocumentSubmit.rootChangeFieldName;
    let docStatus = sDocumentSubmit.docStatus;
    let impactedFieldsList = sDocumentSubmit.impactedFieldsList;
    let impactedFieldsListWhenStart = sDocumentSubmit.impactedFieldsListWhenStart;
    if (docStatus === 'init') {
        impactedFieldsListWhenStart[fieldName] = true;
        let check = checkFinishProcessFormulasInit(impactedFieldsListWhenStart);
        if (check) {
            store.commit("document/addToDocumentSubmitStore", {
                key: 'readyLoaded',
                value: true,
                instance: instance
            });
        }
        store.commit("document/addToDocumentSubmitStore", {
            key: 'impactedFieldsListWhenStart',
            value: impactedFieldsListWhenStart,
            instance: instance
        });
    } else if (docStatus == 'beforeSubmit') {
        let dataImpactedControlRefresh = sDocumentSubmit.dataImpactedControlRefresh;
        if (Object.keys(Object.values(dataImpactedControlRefresh)[0]).length == 0) {
            store.commit("document/addToDocumentSubmitStore", {
                key: 'readySubmit',
                value: true,
                instance: instance
            });
            return;
        }
        let root = findRoot(dataImpactedControlRefresh, fieldName);
        if (root == false) return;
        dataImpactedControlRefresh[root][fieldName] = true;
        store.commit("document/addToDocumentSubmitStore", {
            key: 'dataImpactedControlRefresh',
            value: dataImpactedControlRefresh,
            instance: instance
        });
        let check = checkFinishProcessFormulas(dataImpactedControlRefresh);
        if (check) {
            store.commit("document/addToDocumentSubmitStore", {
                key: 'readySubmit',
                value: true,
                instance: instance
            });
        }

    } else if (impactedFieldsList.hasOwnProperty(rootChangeFieldName) && impactedFieldsList[rootChangeFieldName].hasOwnProperty(fieldName)) {
        impactedFieldsList[rootChangeFieldName][fieldName] = true;
        store.commit("document/addToDocumentSubmitStore", {
            key: 'impactedFieldsList',
            value: impactedFieldsList,
            instance: instance
        });

    }
}

/**
 * Reset lại bộ theo dõi việc bind giá trị cho các control
 * @param {string} fieldToReset
 */
const resetImpactedFieldsList = function(instance, fieldToReset = null) {
    let sDocumentSubmit = sDocument.state.submit[instance];
    let rootChangeFieldName = sDocumentSubmit.rootChangeFieldName;
    let impactedFieldsList = sDocumentSubmit.impactedFieldsList;
    fieldToReset = fieldToReset === null ? rootChangeFieldName : fieldToReset;
    if (impactedFieldsList.hasOwnProperty(fieldToReset)) {
        for (var j in impactedFieldsList[fieldToReset]) {
            if (impactedFieldsList[fieldToReset].hasOwnProperty(j)) {
                impactedFieldsList[fieldToReset][j] = false;
            }
        }
    }
    store.commit("document/addToDocumentSubmitStore", {
        key: 'impactedFieldsList',
        value: impactedFieldsList,
        instance: instance
    });
}
const findRoot = function(dataImpactedControlRefresh, fieldName) {

    for (let controlRoot in dataImpactedControlRefresh) {
        if (Object.keys(dataImpactedControlRefresh[controlRoot]).includes(fieldName)) {
            return controlRoot
        }
    }
    return false
}

const checkFinishProcessFormulas = function(dataImpactedControlRefresh) {
    for (let controlRoot in dataImpactedControlRefresh) {
        if (Object.values(dataImpactedControlRefresh[controlRoot]).includes(false)) {
            return false
        }
    }
    return true
}
const checkFinishProcessFormulasInit = function(dataImpactedControlRefresh) {
    for (let controlRoot in dataImpactedControlRefresh) {
        if (Object.values(dataImpactedControlRefresh[controlRoot]).includes(false)) {
            return false
        }
    }
    return true
}

/**
 * Kiểm tra xem control fieldName có thể chạy công thức để bind giá trị hay không
 * @param {string} fieldName
 */
const checkCanBeBind = function(instance, fieldName) {
    let sDocumentSubmit = sDocument.state.submit[instance];
    let docStatus = sDocumentSubmit.docStatus;
    let impactedFieldsList = sDocumentSubmit.impactedFieldsList;
    let listInputInDocument = sDocumentSubmit.listInputInDocument;
    let rootChangeFieldName = sDocumentSubmit.rootChangeFieldName;
    let impactedFieldsListWhenStart = sDocumentSubmit.impactedFieldsListWhenStart;
    // return true;
    // Nếu đã được bind dữ liệu trước đó rồi thì ko cần bind nữa

    if (docStatus == 'init') {
        if (listInputInDocument[fieldName]['controlFormulas'].hasOwnProperty('formulas')) {
            for (var j in listInputInDocument[fieldName]['controlFormulas']['formulas']['instance']['inputControl']) {
                if (impactedFieldsListWhenStart[j] === false) {
                    return false;
                }
            }
        }
    } else if (docStatus == 'beforeSubmit') {
        let dataImpactedControlRefresh = sDocumentSubmit.dataImpactedControlRefresh
        let root = findRoot(dataImpactedControlRefresh, fieldName);
        if (root == false) return true;
        if (listInputInDocument[fieldName]['controlFormulas'].hasOwnProperty('formulas')) {
            for (var j in listInputInDocument[fieldName]['controlFormulas']['formulas']['instance']['inputControl']) {
                if (dataImpactedControlRefresh[root].hasOwnProperty(j)) {

                    if (dataImpactedControlRefresh[root][j] === false) {

                        return false;
                    }
                }
            }
        }
    } else if (impactedFieldsList.hasOwnProperty(rootChangeFieldName)) {
        if (listInputInDocument[fieldName]['controlFormulas'].hasOwnProperty('formulas')) {
            let inputControl = listInputInDocument[fieldName]['controlFormulas']['formulas']['instance']['inputControl'];
            for (var j in inputControl) {
                if(j == rootChangeFieldName){
                    continue;
                }
                if (impactedFieldsList[rootChangeFieldName].hasOwnProperty(j)) {
                    if (impactedFieldsList[rootChangeFieldName][j] === false) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
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
/**
 * Sau khi user thay đổi 1 công thức thì gán old input Data của tất cả control trong 1 luồng thực thi
 * mục đích để kiểm tra nếu có sự thay đổi data input thì mới thực thi công thức
 * với control trong table thì dạng mảng ngoài table dạng giá trị string
 */
const setDataInputBeforeChange = function(instance, controlInstance, rowIndex = null, oldCellData = null){
    let dataInputBeforeChange = {};
    let sDocumentSubmit = sDocument.state.submit[instance];
    let listInputInDocument = sDocumentSubmit.listInputInDocument;
    let impactedFieldsList = sDocumentSubmit.impactedFieldsList;
    let allControlChange = impactedFieldsList[controlInstance.name];
    allControlChange[controlInstance.name] = true;
    for(let controlName in allControlChange){
        let controlChangeIns = listInputInDocument[controlName];
        if(controlChangeIns.inTable){
            let tableControl = listInputInDocument[controlChangeIns.inTable];
            let tableIns = tableControl.tableInstance;
            if(rowIndex != null){
                let cellData = tableIns.getCellData(controlName, rowIndex);
                if(controlName == controlInstance.name){
                    cellData = oldCellData;
                }
                dataInputBeforeChange[controlName] = cellData
            }
            else{
                let colData = tableIns.getColData(controlName);
                dataInputBeforeChange[controlName] = colData
            }
        }
        else{
            dataInputBeforeChange[controlName] = util.cloneDeep(controlChangeIns.value);
        }
    }
    store.commit("document/addToDocumentSubmitStore", {
        key: 'dataInputBeforeChange',
        value: dataInputBeforeChange,
        instance: instance
    });
}
export {
    markBinedField,
    checkCanBeBind,
    resetImpactedFieldsList,
    setDataInputBeforeChange

}