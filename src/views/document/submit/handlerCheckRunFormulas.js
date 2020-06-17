import Util from './util'
import store from './../../../store'
import sDocument from './../../../store/document'

/**
 * Đánh dấu là control này đã được bind giá trị
 * @param {string} fieldName
 */
const markBinedField = function(fieldName) {
    let rootChangeFieldName = sDocument.state.submit.rootChangeFieldName;
    let docStatus = sDocument.state.submit.docStatus;
    let impactedFieldsList = sDocument.state.submit.impactedFieldsList;
    let impactedFieldsListWhenStart = sDocument.state.submit.impactedFieldsListWhenStart;
    if (docStatus == 'init') {
        impactedFieldsListWhenStart[fieldName] = true;
        store.commit("document/addToDocumentSubmitStore", {
            key: 'impactedFieldsListWhenStart',
            value: impactedFieldsListWhenStart
        });
    } else if (impactedFieldsList.hasOwnProperty(rootChangeFieldName) && impactedFieldsList[rootChangeFieldName].hasOwnProperty(fieldName)) {
        impactedFieldsList[rootChangeFieldName][fieldName] = true;
        store.commit("document/addToDocumentSubmitStore", {
            key: 'impactedFieldsList',
            value: impactedFieldsList
        });

    }
}

/**
 * Reset lại bộ theo dõi việc bind giá trị cho các control
 * @param {string} fieldToReset
 */
const resetImpactedFieldsList = function(fieldToReset = null) {
    let rootChangeFieldName = sDocument.state.submit.rootChangeFieldName;
    let impactedFieldsList = sDocument.state.submit.impactedFieldsList;
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
        value: impactedFieldsList
    });
}

/**
 * Kiểm tra xem control fieldName có thể chạy công thức để bind giá trị hay không
 * @param {string} fieldName
 */
const checkCanBeBind = function(fieldName) {
    let docStatus = sDocument.state.submit.docStatus;
    let impactedFieldsList = sDocument.state.submit.impactedFieldsList;
    let listInputInDocument = sDocument.state.submit.listInputInDocument;
    let rootChangeFieldName = sDocument.state.submit.rootChangeFieldName;
    let impactedFieldsListWhenStart = sDocument.state.submit.impactedFieldsListWhenStart;

    // return true;
    // Nếu đã được bind dữ liệu trước đó rồi thì ko cần bind nữa
    if (impactedFieldsList[rootChangeFieldName] !== undefined && impactedFieldsList[rootChangeFieldName][fieldName] === true) {
        return false;
    }

    if (docStatus == 'init' && impactedFieldsListWhenStart[fieldName] === true) {
        return false;
    }

    if (docStatus == 'init') {
        // for (var j in listInputInDocument[fieldName]['fmlData']['relateControlNames']) {
        //     if (impactedFieldsListWhenStart[j] === false) {
        //         // Nếu một trong các control cần thiết đóng góp giá trị chưa được bind data
        //         return false;
        //     }
        // }
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