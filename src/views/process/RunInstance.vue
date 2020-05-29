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
        async saveTaskOutcome(outcomeData){
            let processDef = await BPMNEApi.getDefinitionData(this.$route.params.id);
            let vars = []; // các biến cần đưa vào process instance
            let startNode =  definitionModel.mainProcess.initialFlowElement;
            let startNodeId = startNode.id;
            try {
                let ctrls = await documentApi.detailDocument(startNode.formKey).data.fields;
                let ctrlsMap = Object.values(ctrls).reduce((map, el, idx)=>{
                    map[el.name] = el;
                    return map;
                }, {});

                for(let ctrlName in outcomeData ){
                    if(typeof outcomeData[ctrlName] != 'object'){
                        vars.push({
                            name: startNodeId+'.'+ctrlName,
                            type: this.getVarType(ctrlsMap[ctrlName].type),
                            value: outcomeData[ctrlName]
                        });    
                    }
                }
                let newProcessInstance = await runProcessDefinition(this, processDef, vars);
                this.$snotifySuccess("Task submited successfully");
            } catch (error) {
                
            }
        },
        getVarType(originType){
            let numberTypes = {
                number: true,
                percent: true,
            };
            return numberTypes[originType] ? 'number' : 'string';
        },
        handleTaskSubmited(outcomeData){
            this.saveTaskOutcome(outcomeData);
        }
    }
}
</script>

<style>

</style>