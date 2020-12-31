<template>
    <listWorkflow
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
        getListWorkflowInProject(){
            let self=this;
            let projectId=this.$route.params.id;
            if (this.$store.state.taskManagement.allWorkflow.length == 0 ) {
                taskManagementApi
                .getListWorkflowInProject(projectId)
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
        let projectId=this.$route.params.id;
        this.getListWorkflowInProject();
        this.$store.dispatch("taskManagement/getAllStatusCategory");
        this.$store.dispatch("taskManagement/getAllRole",projectId);
    },
    activated(){
        let projectId=this.$route.params.id;
        let breadcrumbs = [
                {
                    text: 'Dashboard',
                    disabled: false,
                    to: '/task-management/projects/'+projectId+'/kanban-board',
                },
                {
                    text: 'Project',
                    disabled: true,
                    to: '',
                },
                {
                    text: 'Work flow',
                    disabled: true,
                    to: '',
                },
            ];
        this.$store.commit("taskManagement/addToTaskManagementStore",{key:"headerBreadcrumbs",value:breadcrumbs})
    }

}
</script>

<style>

</style>