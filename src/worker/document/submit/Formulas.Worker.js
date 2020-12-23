
// import { checkDataInputChange } from "@/views/document/submit/handlerCheckRunFormulas";
// import { minimizeDataAfterRunFormula} from "@/views/document/common/common";
import { minimizeDataAfterRunFormula,checkDataInputChange } from "@/components/document/dataControl";

onmessage = function (event) {
    var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let dataForEachAction = workerDataReceive.data;
    switch (action) {
        case 'runFormula':
            let formulaInstance = dataForEachAction.formulaInstance
            let dataInput = dataForEachAction.dataInput
            debugger
            formulaInstance.handleBeforeRunFormulas(dataInput).then(rs=>{
                let value = minimizeDataAfterRunFormula(rs);
                postMessage({action:'afterRunFormulasSuccess', dataAfter : value})
            });

            
            break;
       
        default:
            break;
    }
};