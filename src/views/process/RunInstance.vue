<template>
    <div class="h-100 w-100">
        <taskDetail 
            :isInitInstance="true" 
            @task-submited="handleTaskSubmited" 
            :taskInfo="taskInfo"
            :parentHeight="thisHeight">

        </taskDetail>
    </div>
</template>

<script>
import BPMNEApi from "./../../api/BPMNEngine";
import taskDetail from "./../../views/tasks/taskDetail.vue";
import { runProcessDefinition, getVarsFromSubmitedDoc } from '../../components/process/processAction';
import { documentApi } from '../../api/Document';
import { formulasApi } from '../../api/Formulas';
import { util } from '../../plugins/util';

export default {
    components: {
        taskDetail: taskDetail
    },
    data(){
        return {
            taskInfo: {
                action: {
                    parameter: {
                        documentId: 0,
                    },
                    action: 'submit',
                }
            },
            thisHeight: 300,
            startType: 'submit', // các loại bắt đầu quy trình khác nhau: hiện tại chỉ có 1 loại là submit
            definitionModel: {} // các cấu hình của process definition
        }
    },
    mounted(){
        this.thisHeight = util.getComponentSize(this).h;
    },
    created(){
        let self = this;
        this.$store.dispatch('process/getAllDefinitions').then((res) => {
            self.getFirstNodeData();
        }).catch((err) => {

        });
    },
    methods: {
        async getFirstNodeData(){
            let idDefinition = this.$route.params.id;
            
            let definitionModel = await BPMNEApi.getDefinitionModel(idDefinition);
            this.definitionModel = definitionModel;
            this.taskInfo.action.parameter.documentId = Number(definitionModel.mainProcess.initialFlowElement.formKey);
        },
        // getValueForVariable(value, type){
        //     if(type == 'string'){
        //         return String(value);
        //     }else if(type == 'integer'){
        //         return isNaN(Number(value)) ? 0 : Number(value);
        //     }else{
        //         return value;
        //     }
        // },
        async saveTaskOutcome(outcomeData){
            let processDef = await BPMNEApi.getDefinitionData(this.$route.params.id);
            let vars = []; // các biến cần đưa vào process instance
            let startNode =  this.definitionModel.mainProcess.initialFlowElement;
            let startNodeId = startNode.id;
            let dataInputForFormula = {};

            try {
                
                let varsForBackend = await getVarsFromSubmitedDoc(outcomeData, startNodeId, startNode.formKey);
                vars = varsForBackend.vars;
                dataInputForFormula = varsForBackend.nameAndValueMap;

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
        handleTaskSubmited(outcomeData){
            this.saveTaskOutcome(outcomeData);
        }
    }
}
</script>

<style>

</style>