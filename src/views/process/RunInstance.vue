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
            try {
                let ctrls = await documentApi.detailDocument(startNode.formKey);
                ctrls = ctrls.data.fields;
                let ctrlsMap = Object.values(ctrls).reduce((map, el, idx)=>{
                    map[el.properties.name] = el;
                    return map;
                }, {});

                for(let ctrlName in outcomeData ){
                    if(typeof outcomeData[ctrlName] != 'object'){
                        let ctrlType = 'string';
                        if(ctrlsMap[ctrlName]){
                            ctrlType = this.getVarType(ctrlsMap[ctrlName].type)
                        }

                        let value = this.getValueForVariable(outcomeData[ctrlName], ctrlType);
                        vars.push({
                            name: startNodeId+'.'+ctrlName,
                            type: ctrlType,
                            value: value
                        });    
                    }
                }
                // let newProcessInstance = await runProcessDefinition(this, processDef, vars);
                let newProcessInstance = await runProcessDefinition(this, processDef, []);
                this.$snotifySuccess("Task submited successfully");
            } catch (error) {
                this.$snotifyError(error ,"Error on run process definition ");
            }
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