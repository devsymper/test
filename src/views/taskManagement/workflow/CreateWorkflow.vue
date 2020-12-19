<template>
    <workflow-model
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
            allStatus:[],
        }
    },
    methods:{
        getAllStatus(){
            taskManagementApi
            .getAllStatus()
            .then(res => {
                if (res.status == 200) {
                    this.allStatus = res.data.listObject;
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
        this.$store.dispatch("taskManagement/getAllStatusCategory");
        this.$store.dispatch("taskManagement/getAllRole");
        this.getAllStatus();

    }

}
</script>

<style>

</style>