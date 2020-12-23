
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
            console.log(dataForEachAction);
            dataForEachAction.allControlObj = JSON.parse(dataForEachAction.allControlObj);
            dataForEachAction.isBa = JSON.parse(dataForEachAction.isBa);
            debugger
            let dataControlEffected =  getMapControlEffected(dataForEachAction.allControlObj, dataForEachAction.isBa);
            postMessage({action:'getMapControlEffected', dataAfter : dataControlEffected})
            break
        default:
            break;
    }
};