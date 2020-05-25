<template>
    <div class="h-100 w-100">
        <taskDetail :taskInfo="taskInfo" @save-task-outcome="saveTaskOutcome">

        </taskDetail>
    </div>
</template>

<script>
import BPMNEApi from "./../../api/BPMNEngine";
import taskDetail from "./../../views/tasks/taskDetail.vue";
import { runProcessDefinition } from '../../components/process/processAction';

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
        }
    },
    created(){
        this.getFirstNodeData();
    },
    methods: {
        async getFirstNodeData(){
            let idDefinition = this.$route.params.id;
            let definitionModel = await BPMNEApi.getDefinitionModel(idDefinition);
            this.taskInfo.docId = Number(definitionModel.mainProcess.initialFlowElement.formKey);
        },
        async saveTaskOutcome(){
            let processDef = await BPMNEApi.getDefinitionData(this.$route.params.id);
            let newProcessInstance = await runProcessDefinition(this, processDef);
            this.$snotifySuccess("Task submited");
        }
    }
}
</script>

<style>

</style>