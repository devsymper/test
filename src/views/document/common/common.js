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
const checkDbOnly = function(controlName) {
    let control = getControlInstanceFromStore(controlName);
    if (control.controlProperties['isDBOnly'] != undefined &&
        (control.controlProperties['isDBOnly'].value == "1" ||
            control.controlProperties['isDBOnly'].value == true ||
            control.controlProperties['isDBOnly'].value == 1)) {
        return control;
    } else {
        return false
    }
}
const getControlInstanceFromStore = function(controlName) {
    if (sDocument.state.submit.listInputInDocument.hasOwnProperty(controlName)) {
        return sDocument.state.submit.listInputInDocument[controlName]
    } else {
        return false
    }
}
export {
    // handlerRunOtherFormulasControl
    getControlInstanceFromStore,
    checkDbOnly
}