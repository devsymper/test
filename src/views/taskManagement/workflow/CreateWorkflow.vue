<template>
    <workflow-model
        v-if="allStatus.length > 0"
        :statusDetail="false"
        :listNode="listNode"
        :listLink="listLink"
        :allStatus="allStatus"
    />
</template>

<script>
import WorkflowModel from '../../../components/taskManagement/workflow/WorkflowModel.vue';
import { taskManagementApi } from "@/api/taskManagement.js";


export default {
    components: { WorkflowModel },
    data(){
        return{
            infoWorkflow:{},
            listNode:[],
            listLink:[],
        }
    },
    computed:{
        allStatus(){
            return this.$store.state.taskManagement.allStatus;
        }
    },
    methods:{
        getAllStatus(){
            taskManagementApi
            .getAllStatus()
            .then(res => {
                if (res.status == 200) {
                    this.$store.commit("taskManagement/setAllStatus",res.data.listObject);
                }else{
                    self.$snotifyError("", "Can not get all status");
                }
            })
            .catch(err => {
                self.$snotifyError("", "Can not get all status");
            });
        }
    },
    created(){
        let projectId=this.$route.params.id;
        this.$store.dispatch("taskManagement/getAllStatusCategory");
        this.$store.dispatch("taskManagement/getAllRole",projectId);
        if (!this.$store.state.taskManagement.allStatus || this.$store.state.taskManagement.allStatus.length == 0) {
            this.getAllStatus();
        }

    }

}
</script>

<style>

</style>