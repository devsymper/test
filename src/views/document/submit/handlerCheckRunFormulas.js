import Util from './util'
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
    console.log(sDocumentSubmit);
    console.log(instance);

    if (docStatus === 'init') {
        impactedFieldsListWhenStart[fieldName] = true;
        store.commit("document/addToDocumentSubmitStore", {
            key: 'impactedFieldsListWhenStart',
            value: impactedFieldsListWhenStart,
            instance: instance
        });
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
    if (impactedFieldsList[rootChangeFieldName] !== undefined && impactedFieldsList[rootChangeFieldName][fieldName] === true) {
        return false;
    }


    if (docStatus == 'init') {
        // for (var j in listInputInDocument[fieldName]['fmlData']['relateControlNames']) {
        //     if (impactedFieldsListWhenStart[j] === false) {
        //         // Nếu một trong các control cần thiết đóng góp giá trị chưa được bind data
        //         return false;
        //     }
        // }

        if (listInputInDocument[fieldName]['controlFormulas'].hasOwnProperty('formulas')) {
            for (var j in listInputInDocument[fieldName]['controlFormulas']['formulas']['instance']['inputControl']) {
                if (impactedFieldsListWhenStart[j] === false) {
                    return false;
                }
            }
        }
    } else if (impactedFieldsList.hasOwnProperty(rootChangeFieldName)) {
        if (listInputInDocument[fieldName]['controlFormulas'].hasOwnProperty('formulas')) {
            for (var j in listInputInDocument[fieldName]['controlFormulas']['formulas']['instance']['inputControl']) {
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
export {
    markBinedField,
    checkCanBeBind,
    resetImpactedFieldsList

}