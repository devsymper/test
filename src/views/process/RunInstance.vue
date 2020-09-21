<template>
    <div class="h-100 w-100">
        <div v-if="startWorkflowStatus == 'init'" class="h-100 w-100">
                 <v-skeleton-loader
                    ref="skeleton"
                    :type="'table-thead'"
                    class="mx-auto"
                ></v-skeleton-loader>
        </div>
        <div v-else class="h-100 w-100">

            <taskDetail 
                v-if="taskInfo.action.parameter.documentId > 0"
                :isInitInstance="true" 
                @task-submited="handleTaskSubmited" 
                :taskInfo="taskInfo"
                :parentHeight="thisHeight"
                @close-detail="closeDetail">
            </taskDetail>
            <div v-else style="text-align: center" class="mt-10">
                <i class="mdi mdi-check mr-2 d-inline-block"  style="color: green; font-size: 25px"></i>
                <h1 class="d-inline-block">{{$t('process.instance.startSuccessfully')}}</h1>
            </div>
        </div>
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
            startWorkflowStatus: 'init', // init | started
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
            let documentToStart = this.getStartDocId(definitionModel);
            if(documentToStart && documentToStart != 'null' ){
                this.taskInfo.action.parameter.documentId = documentToStart;
            }else{
                let processDef = await BPMNEApi.getDefinitionData(this.$route.params.id);
                try {
                    let instanceName = await this.getInstanceName([]);
                    let newProcessInstance = await runProcessDefinition(this, processDef, [], instanceName);
                    this.$snotifySuccess("Workfow started successfully!");
                } catch (error) {
                    this.$snotifyError(error ,"Error on run process definition ");
                }
            }
            this.startWorkflowStatus = 'started';
        },
        getStartDocId(definitionModel){
            return Number(definitionModel.mainProcess.initialFlowElement.formKey);
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

                let formula = dataObjsMap.instanceDisplayText.value;
                if(!formula || String(formula).trim() == ''){
                    resolve('');
                }else{
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
                                }else{
                                    resolve('');
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
                }

            })
        },
        handleTaskSubmited(outcomeData){
            this.saveTaskOutcome(outcomeData);
        },
        closeDetail(){
            this.$router.push("/workflow");
        }
    }
}
</script>

<style>

</style>