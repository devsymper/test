
// import { checkDataInputChange } from "@/views/document/submit/handlerCheckRunFormulas";
// import { minimizeDataAfterRunFormula} from "@/views/document/common/common";
import { minimizeDataAfterRunFormula } from "@/components/document/dataControl";
import { workerStore } from '@/worker/document/submit/WorkerStateManagement';
import ClientSQLManager from "@/views/document/submit/clientSQLManager";
import Formulas from "@/views/document/submit/formulas";

onmessage = function (event) {
    var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let dataOfAction = workerDataReceive.data;
    let keyInstance = dataOfAction.keyInstance;
    let controlName = dataOfAction.controlName;
    switch (action) {
        case 'runFormula':
            let formulaInstance = dataOfAction.formulaInstance
            let from = dataOfAction.from
            let formulaIns = new Formulas(formulaInstance.keyInstance,formulaInstance.formulas,formulaInstance.type)
            formulaIns.handleBeforeRunFormulas(workerStore['submit'][formulaInstance.keyInstance]['inputData']).then(rs=>{
                let value = minimizeDataAfterRunFormula(rs);
                postMessage({action:'afterRunFormulasSuccess', dataAfter : {controlName:controlName, from:from, value:value, formulaType:formulaInstance.type}})
            });
            break;
        case 'updateWorkerStore':
            let type = dataOfAction.type;
            let value = dataOfAction.value;
            if(!workerStore[type][keyInstance]){
                workerStore[type][keyInstance] = {}
            }
            if(!workerStore[type][keyInstance]['inputData']){
                workerStore[type][keyInstance]['inputData'] = {}
            }
            workerStore[type][keyInstance]['inputData'][controlName] = value;
            break;
        case 'createSQLiteDB':
            ClientSQLManager.createDB(keyInstance).then(res=>{
                postMessage({action:'afterCreateSQLiteDB'})
            });
            break;
        case 'executeSQliteDB':
            let func = dataOfAction['func'];
            if(func == 'delete'){
                ClientSQLManager.delete(keyInstance, dataOfAction.tableName, false);
            }
            else if(func = 'deleteRow'){
                ClientSQLManager.deleteRow(keyInstance, dataOfAction.tableName, dataOfAction.condition);
            }
            else if(func = 'insertRow'){
                ClientSQLManager.insertRow(keyInstance, dataOfAction.tableName, dataOfAction.columns, dataOfAction.rowData, dataOfAction.isPromise);
            }
            else if(func = 'editRow'){
                ClientSQLManager.editRow(keyInstance, dataOfAction.tableName, dataOfAction.column, dataOfAction.value,dataOfAction.condition, true);
            }
            else if(func = 'insertAll'){
                ClientSQLManager.insertDataToTable(keyInstance, dataOfAction.tableName, dataOfAction.columns, dataOfAction.allData);
                
            }
            else if(func = 'createTable'){
                ClientSQLManager.createTable(keyInstance, dataOfAction.tableName, dataOfAction.columns,"","");
            }
        default:
            break;
    }
};