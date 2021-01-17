
import { workerStore } from '@/worker/document/submit/WorkerStateManagement';
import ClientSQLManager from "@/views/document/submit/clientSQLManager";
import Formulas from "@/views/document/submit/formulas";
import { prepareDataGetMultiple, genKeyFromDataInput } from '@/components/document/dataControl';

onmessage = function (event) {
    var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let dataOfAction = workerDataReceive.data;
    let keyInstance = dataOfAction.keyInstance;
    switch (action) {
        case 'runFormula':
            let controlName = dataOfAction.controlName;
            let formulaInstance = dataOfAction.formulaInstance
            let from = dataOfAction.from
            let formulaIns = new Formulas(formulaInstance.keyInstance,formulaInstance.formulas,formulaInstance.type);
            // let rowIndex = dataOfAction.rowIndex;
            // if(rowIndex == undefined){
            //     rowIndex = null
            // }
            // let extraData = dataOfAction.extraData;
            let sqlRowId = dataOfAction.sqlRowId;
            let dataInput = {};
            if(dataOfAction.dataInput){
                dataInput = dataOfAction.dataInput;
            }
            // else{
            //     dataInput = formulaIns.getDataInputFormula(rowIndex,extraData);
            // }
            /**
             * Trương hợp chạy công thức cho cả cột trong table
             */
            if(from == 'columnTable'){
                let listIdRow = dataOfAction.listIdRow;
                let dataPostForGetMultiple = prepareDataGetMultiple(dataInput, listIdRow, workerStore['submit'][keyInstance]['inputData']);
                let cacheRowData = {};
                //cache các data input giống nhau -> chỉ chạy 1 lần
                for(let rowId in dataPostForGetMultiple){
                    let key = genKeyFromDataInput(dataPostForGetMultiple[rowId]);
                    if(Object.keys(cacheRowData).includes(key)){
                        delete dataPostForGetMultiple[rowId];
                    }
                    if(!cacheRowData[key]){
                        cacheRowData[key] = [];
                    }
                    if(!cacheRowData[key].includes(rowId)){
                        cacheRowData[key].push(rowId);
                    }
                }
                formulaIns.getDataMultiple(dataPostForGetMultiple).then(res=>{
                    if(res && res['data']){
                        if(Object.keys(cacheRowData).length > 0){
                            let data = res['data'];
                            for(let rowId in data){
                                for(let key in cacheRowData){
                                    let rowIdCache = cacheRowData[key];
                                    if(rowIdCache.includes(rowId)){
                                        for (let index = 0; index < rowIdCache.length; index++) {
                                            res['data'][rowIdCache[index]] = data[rowId];
                                        }
                                    }
                                }
                            }
                        }
                        postMessage({action:'afterRunFormulasSuccess', dataAfter : 
                            {controlName:controlName, from:from, res:res, formulaType:formulaInstance.type, dataRowId:listIdRow}
                        })
                        
                    }
                })
            }
            else{
                /**
                 * Trường hợp chạy công thức cho các công thưc dạng list như autocomplete hay list
                 */
                if(['autocomplete','list'].includes(formulaInstance.type)){
                    formulaIns.handleRunAutoCompleteFormulas(dataInput).then(res=>{
                        if(res && res['data']){
                            postMessage({action:'afterRunFormulasSuccess', dataAfter : 
                                {controlName:controlName, from:from, res:res, formulaType:formulaInstance.type}
                            })
                        }
                    })
                }
                /**
                 * trường hợp chạy công thức cho các trường hợp còn lại
                 */
                else{
                    formulaIns.handleBeforeRunFormulas(dataInput).then(res=>{
                        if(res && res['data']){
                            postMessage({action:'afterRunFormulasSuccess', dataAfter : 
                                {controlName:controlName, from:from, res:res, formulaType:formulaInstance.type,dataRowId:sqlRowId}
                            })
                        }
                    })
                }
            }
            break;
            /**
             * Có cập nhật input trên main thì worker cũng phải lưu lại giá trị
             */
        case 'getDataInputFormula':
            let formulaInstanceTmp = dataOfAction.objectIdentiferFormula;
            let titleObjectFormula = dataOfAction.titleObjectFormula;
            let dataRes = {}
            if(formulaInstanceTmp){
                let formulaInsTmp = new Formulas(formulaInstanceTmp.keyInstance,formulaInstanceTmp.formulas,formulaInstanceTmp.type);
                let dataInputObjectIdentifier = formulaInsTmp.getDataInputFormula();
                dataRes['dataInputObjectIdentifier'] = dataInputObjectIdentifier
            }
            if(titleObjectFormula){
                let titleObjectFormulaTmp = new Formulas(titleObjectFormula.keyInstance,titleObjectFormula.formulas,titleObjectFormula.type);
                let dataInputTitleObjectFormulas = titleObjectFormulaTmp.getDataInputFormula();
                dataRes['dataInputTitleObjectFormulas'] = dataInputTitleObjectFormulas
            }
            postMessage({action:'getDataInputFormula', dataAfter : dataRes})
            break;
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
        case 'addWorkflowVariable':
            if(!workerStore['submit'][keyInstance]){
                workerStore['submit'][keyInstance] = {}
            }
            if(!workerStore['submit'][keyInstance]['inputData']){
                workerStore['submit'][keyInstance]['inputData'] = {}
            }
            let workflowVariable = dataOfAction.workflowVariable;
            for(let inputBinding in workflowVariable){
                workerStore['submit'][keyInstance]['inputData'][inputBinding] = {
                    name:inputBinding,
                    type:'textInput',
                    value:workflowVariable[inputBinding]
                }
            }
            console.log(workerStore,'workerStoreworkerStore');
            break;
        case 'updateDocumentObjectId':
            workerStore['submit'][keyInstance]['document_object_id'] = dataOfAction.documentObjectId;
            break;
        case 'createSQLiteDB':
            ClientSQLManager.createDB(keyInstance).then(res=>{
                postMessage({action:'afterCreateSQLiteDB'})
            });
            break;
        case 'closeDB':
            ClientSQLManager.closeDB(keyInstance);
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