
import { workerStore } from '@/worker/document/submit/WorkerStateManagement';
import ClientSQLManager from "@/views/document/submit/clientSQLManager";
import Formulas from "@/views/document/submit/formulas";
import { prepareDataGetMultiple } from '@/components/document/dataControl';

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
            let formulaIns = new Formulas(formulaInstance.keyInstance,formulaInstance.formulas,formulaInstance.type);
            let rowIndex = dataOfAction.rowIndex;
            if(rowIndex == undefined){
                rowIndex = null
            }
            let extraData = dataOfAction.extraData;
            let sqlRowId = dataOfAction.sqlRowId;
            let dataInput = formulaIns.getDataInputFormula(rowIndex,extraData);
            if(['rowTable','columnTable'].includes(from)){
                dataInput = dataOfAction.dataInput
            }
            /**
             * Trương hợp chạy công thức cho cả cột trong table
             */
            if(from == 'columnTable'){
                let listIdRow = dataOfAction.listIdRow;
                let dataPostForGetMultiple = prepareDataGetMultiple(dataInput, listIdRow, workerStore['submit'][keyInstance]['inputData']);
                formulaIns.getDataMultiple(dataPostForGetMultiple).then(res=>{
                    postMessage({action:'afterRunFormulasSuccess', dataAfter : 
                        {controlName:controlName, from:from, res:res, formulaType:formulaInstance.type, dataRowId:listIdRow}
                    })
                })
            }
            else{
                /**
                 * Trường hợp chạy công thức cho các công thưc dạng list như autocomplete hay list
                 */
                if(['autocomplete','list'].includes(formulaInstance.type)){
                    formulaIns.handleRunAutoCompleteFormulas(dataInput).then(res=>{
                        postMessage({action:'afterRunFormulasSuccess', dataAfter : 
                            {controlName:controlName, from:from, res:res, formulaType:formulaInstance.type}
                        })
                    })
                }
                /**
                 * trường hợp chạy công thức cho các trường hợp còn lại
                 */
                else{
                    formulaIns.handleBeforeRunFormulas(dataInput).then(res=>{
                        postMessage({action:'afterRunFormulasSuccess', dataAfter : 
                            {controlName:controlName, from:from, res:res, formulaType:formulaInstance.type,dataRowId:sqlRowId}
                        })
                    })
                }
            }
            break;
            /**
             * Có cập nhật input trên main thì worker cũng phải lưu lại giá trị
             */
        case 'updateWorkerStore':
            let type = dataOfAction.type;
            if(!workerStore[type][keyInstance]){
                workerStore[type][keyInstance] = {}
            }
            if(!workerStore[type][keyInstance]['inputData']){
                workerStore[type][keyInstance]['inputData'] = {}
            }
            let controlIns = dataOfAction.controlIns;
            workerStore[type][keyInstance]['inputData'][controlIns.name] = controlIns;
            break;
        case 'createSQLiteDB':
            ClientSQLManager.createDB(keyInstance).then(res=>{
                postMessage({action:'afterCreateSQLiteDB'})
            });
            break;
            /**
             * Các hàm thực thi với sqlite
             */
        case 'executeSQliteDB':
            let func = dataOfAction['func'];
            if(func == 'delete'){
                ClientSQLManager.delete(keyInstance, dataOfAction.tableName, false);
            }
            else if(func == 'deleteRow'){
                ClientSQLManager.deleteRow(keyInstance, dataOfAction.tableName, dataOfAction.condition);
            }
            else if(func == 'insertRow'){
                ClientSQLManager.insertRow(keyInstance, dataOfAction.tableName, dataOfAction.columns, dataOfAction.rowData, dataOfAction.isPromise);
            }
            else if(func == 'editRow'){
                ClientSQLManager.editRow(keyInstance, dataOfAction.tableName, dataOfAction.columns, dataOfAction.value,dataOfAction.condition, true);
            }
            else if(func == 'insertAll'){
                ClientSQLManager.insertDataToTable(keyInstance, dataOfAction.tableName, dataOfAction.columns, dataOfAction.allData);
                
            }
            else if(func == 'createTable'){
                ClientSQLManager.createTable(keyInstance, dataOfAction.tableName, dataOfAction.columns,"","");
            }
            break;
        default:
            break;
    }
};