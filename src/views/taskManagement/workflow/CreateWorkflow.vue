<template>
    <workflow-model
        :statusDetail="false"
        :listNode="listNode"
        :listLink="listLink"
    />
</template>

<script>
// import { taskManagementApi } from "@/api/taskManagement.js";
import WorkflowModel from '../../../components/taskManagement/workflow/WorkflowModel.vue';


export default {
    components: { WorkflowModel },
    data(){
        return{
            infoWorkflow:{},
            listNode:[],
            listLink:[],
        }
    },
    created(){
        this.$store.dispatch("taskManagement/getAllStatusCategory");
        this.$store.dispatch("taskManagement/getAllRole");

    }

}
</script>

<style>

</style>