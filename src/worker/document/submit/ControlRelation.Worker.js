
import { getAllPropFromData,getMapControlEffected } from "@/components/document/dataControl";
onmessage = function (event) {
    var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let dataForEachAction = workerDataReceive.data;
    switch (action) {
        case 'setDataForPropsControl':
            let dataControl =  getAllPropFromData(dataForEachAction.fields, dataForEachAction.viewType, dataForEachAction.allDataDetail);
            postMessage({action:'setDataForPropsControl', dataAfter : dataControl})
            break;
        case 'getMapControlEffected':
            let dataControlEffected =  getMapControlEffected(dataForEachAction.allControlObj, dataForEachAction.isBa);
            postMessage({action:'getMapControlEffected', dataAfter : dataControlEffected})
            break
        default:
            break;
    }
};