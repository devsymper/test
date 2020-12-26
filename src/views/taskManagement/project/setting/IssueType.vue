<template>
    <issueType 
        :listIssueType="listIssueType"
        @add-issuetype="addIssueType"
    />

</template>

<script>
import issueType from "@/components/taskManagement/project/IssueType";
import { taskManagementApi } from "@/api/taskManagement.js";

export default {
    components:{
        issueType
    },
    computed:{
        listIssueType(){
            let projectId = this.$route.params.id;
            return this.$store.state.taskManagement.listIssueTypeInProjects[projectId];
        }
    },
    data(){
        return{
        }
    },
    methods:{
        addIssueType(){
            let projectId=this.$route.params.id;
            this.$store.dispatch("taskManagement/getListIssueTypeInProjects", projectId);
        },
    },
    created(){
        let projectId=this.$route.params.id;
        if (!this.$store.state.taskManagement.listIssueTypeInProjects[projectId] || this.$store.state.taskManagement.listIssueTypeInProjects[projectId].length == 0) {
            this.$store.dispatch("taskManagement/getListIssueTypeInProjects", projectId);
        }
        this.$store.dispatch("taskManagement/getListWorkflowInProject",projectId);
        this.$store.dispatch("taskManagement/getListDocumentConfigFieldIssue");
        
    },
    activated(){
        //this.toggleMainContentLoader(false);
    }

}
</script>

<style>

</style>