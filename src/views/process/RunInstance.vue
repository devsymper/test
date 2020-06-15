<template>
    <div class="h-100 w-100">
        <taskDetail @task-submited="handleTaskSubmited" :taskInfo="taskInfo">

        </taskDetail>
    </div>
</template>

<script>
import BPMNEApi from "./../../api/BPMNEngine";
import taskDetail from "./../../views/tasks/taskDetail.vue";
import { runProcessDefinition } from '../../components/process/processAction';
import { documentApi } from '../../api/Document';
import { formulasApi } from '../../api/Formulas';

export default {
    components: {
        taskDetail: taskDetail
    },
    data(){
        return {
            taskInfo: {
                docId: 0// Nếu là submit cần biết document id là gì để load form
            },
            startType: 'submit', // các loại bắt đầu quy trình khác nhau: hiện tại chỉ có 1 loại là submit
            definitionModel: {} // các cấu hình của process definition
        }
    },
    created(){
        this.getFirstNodeData();
    },
    methods: {
        async getFirstNodeData(){
            let idDefinition = this.$route.params.id;
            
            let definitionModel = await BPMNEApi.getDefinitionModel(idDefinition);
            this.definitionModel = definitionModel;
            this.taskInfo.docId = Number(definitionModel.mainProcess.initialFlowElement.formKey);
        },
        getValueForVariable(value, type){
            if(type == 'string'){
                return String(value);
            }else if(type == 'integer'){
                return isNaN(Number(value)) ? 0 : Number(value);
            }else{
                return value;
            }
        },
        async saveTaskOutcome(outcomeData){
            let processDef = await BPMNEApi.getDefinitionData(this.$route.params.id);
            let vars = []; // các biến cần đưa vào process instance
            let startNode =  this.definitionModel.mainProcess.initialFlowElement;
            let startNodeId = startNode.id;
            let dataInputForFormula = {};

            try {
                let ctrls = await documentApi.detailDocument(startNode.formKey);
                ctrls = ctrls.data.fields;
                let ctrlsMap = Object.values(ctrls).reduce((map, el, idx)=>{
                    map[el.properties.name] = el;
                    return map;
                }, {});

                for(let ctrlName in outcomeData ){
                    let itemKey = startNodeId+'_'+ctrlName;
                    if(typeof outcomeData[ctrlName] != 'object'){
                        let ctrlType = 'string';
                        if(ctrlsMap[ctrlName]){
                            ctrlType = this.getVarType(ctrlsMap[ctrlName].type)
                        }

                        let value = this.getValueForVariable(outcomeData[ctrlName], ctrlType);
                        vars.push({
                            name: itemKey,
                            type: ctrlType,
                            value: value
                        });   
                        dataInputForFormula[itemKey] =  value;
                    }else{
                        vars.push({
                            name: itemKey,
                            type: 'string',
                            value: JSON.stringify(outcomeData[ctrlName])
                        });
                    }
                }
                
                let instanceName = await this.getInstanceName(dataInputForFormula);
                // let newProcessInstance = await runProcessDefinition(this, processDef, [], instanceName);
                let newProcessInstance = await runProcessDefinition(this, processDef, vars, instanceName);
                this.$snotifySuccess("Task submited successfully");
            } catch (error) {
                this.$snotifyError(error ,"Error on run process definition ");
            }
        },
        async getInstanceName(dataInput){
            let self = this;
            return new Promise((resolve, reject) => {
                
                let dataObjs = self.definitionModel.processes[0].dataObjects;
                let dataObjsMap = {};

                for(let obj of dataObjs){
                    let objKey = obj.id.replace(self.definitionModel.mainProcess.id+'_','');
                    dataObjsMap[objKey] = obj;
                }

                if(dataObjsMap.instanceDisplayText){
                    formulasApi.execute({
                        data_input: JSON.stringify(dataInput),
                        formula: dataObjsMap.instanceDisplayText.value
                    }).then((formulaData) => {
                        if( formulaData.status == 200){
                            formulaData = formulaData.data.data;
                            if(formulaData.length > 0){
                                formulaData = formulaData[0];
                                resolve(Object.values(formulaData)[0]);
                            }
                        }else{
                            resolve('');
                        }
                    }).catch(err=>{
                        reject(err);
                    });                    
                }else{
                    resolve('');
                }
            })
        },
        getVarType(originType){
            let numberTypes = {
                number: true,
                percent: true,
            };
            console.log(originType, numberTypes[originType] ? 'integer' : 'string');
            
            return numberTypes[originType] ? 'integer' : 'string'; // hoặc date
        },
        handleTaskSubmited(outcomeData){
            this.saveTaskOutcome(outcomeData);
        }
    }
}
</script>

<style>

</style>