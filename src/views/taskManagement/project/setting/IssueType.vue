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
    data(){
        return{
            listIssueType:[]
        }
    },
    methods:{
        addIssueType(){
            this.getListIssueTypeInProject();
        },
        getListIssueTypeInProject(){
            let self=this;
            let projectId=this.$route.params.id;
            taskManagementApi
                .getListIssueTypeInProject(projectId)
                .then(res => {
                    if (res.status == 200) {
                        self.listIssueType=res.data.listObject;
                    }else{
                        self.$snotifyError("", "Can not get list issue type in project!!!");
                    }
                })
                .catch(err => {
                    self.$snotifyError("", "Can not get list issue type in project!!", err);
                })
                .always(() => {});
        }
    },
    created(){
        this.getListIssueTypeInProject();
    },
    activated(){
        //this.toggleMainContentLoader(false);
    }

}
</script>

<style>

</style>