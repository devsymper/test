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
export {
    // handlerRunOtherFormulasControl
}