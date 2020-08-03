import sDocument from './../../../store/document'
import store from './../../../store'
const handlerRunOtherFormulasControl = function(controlName, controlEffected, formulasType) {
    if (Object.keys(controlEffected).length > 0) {
        for (let i in controlEffected) {
            let controlEffectedInstance = listInputInDocument[i];
            let controlId = controlEffectedInstance.id
            let allFormulas = controlEffectedInstance.controlFormulas;
            if (allFormulas.hasOwnProperty(formulasType)) {
                if (allFormulas[formulasType].hasOwnProperty('instance')) {
                    let formulasInstance = allFormulas[formulasType].instance;
                    if (formulasInstance.getFormulas() != "") {
                        this.handlerBeforeRunFormulasValue(formulasInstance, controlId, controlName, formulasType)
                    }
                }
            }
        }
    }
}
const checkDbOnly = function(instance, controlName) {
    let control = getControlInstanceFromStore(instance, controlName);
    if (control.controlProperties['isDBOnly'] != undefined &&
        (control.controlProperties['isDBOnly'].value == "1" ||
            control.controlProperties['isDBOnly'].value == true ||
            control.controlProperties['isDBOnly'].value == 1)) {
        return control;
    } else {
        return false
    }
}
const getControlInstanceFromStore = function(instance, controlName) {
    console.log('ágsadasd', controlName);
    console.log('ágsadasd', sDocument.state.submit[instance].listInputInDocument);
    if (sDocument.state.submit[instance].listInputInDocument.hasOwnProperty(controlName)) {
        return sDocument.state.submit[instance].listInputInDocument[controlName]
    } else {
        return false
    }
}
const getControlTitleFromName = function(instance, controlName) {
    let control = getControlInstanceFromStore(instance, controlName);
    if (control != false) {
        return control.title;
    } else {
        return false
    }
}
const checkInTable = function(element) {
    let table = element.closest('.s-control-table');
    let tableId = '0'
    if (table.length > 0) {
        tableId = table.attr('id');
    }
    return tableId;
}
const getControlType = function(instance, controlName) {
    let control = getControlInstanceFromStore(instance, controlName);
    if (control != false) {
        return control.type;
    } else {
        return false
    }
}
const getSDocumentSubmitStore = function(instance) {
    return sDocument.state.submit[instance]
}
const getListInputInDocument = function(instance) {
    return getSDocumentSubmitStore(instance).listInputInDocument;
}
export {
    // handlerRunOtherFormulasControl
    getControlInstanceFromStore,
    checkDbOnly,
    checkInTable,
    getControlTitleFromName,
    getControlType,
    getSDocumentSubmitStore,
    getListInputInDocument
}