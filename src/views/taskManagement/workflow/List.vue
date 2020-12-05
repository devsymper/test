<template>
    <listWorkflow
        :listWorkflow="listWorkflow"
    />

</template>

<script>
import listWorkflow from "@/components/taskManagement/workflow/List";
import { taskManagementApi } from "@/api/taskManagement.js";

export default {
    components:{
        listWorkflow
    },
    data(){
        return{
            listWorkflow:[],
        }
    },
    methods:{
        getListWorkflow(){
            let self=this;
            if (this.$store.state.taskManagement.allWorkflow.length == 0 ) {
                taskManagementApi
                .getListWorkflow()
                .then(res => {
                    if (res.status == 200) {
                        self.listWorkflow = res.data.listObject;
                        self.$store.commit("taskManagement/setAllWorkflow", res.data.listObject);
                    }else{
                        self.$snotifyError("", "Can not get all workflow");
                    }
                })
                .catch(err => {
                    self.$snotifyError("", "Can not get all workflow");
                });
            }else{
                this.listWorkflow = this.$store.state.taskManagement.allWorkflow;
            }
          
        }
    },
    created(){
        this.getListWorkflow();
    }

}
</script>

<style>

</style>