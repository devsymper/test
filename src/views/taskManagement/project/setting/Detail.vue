<template>
    <detailProject 
        v-if="Object.keys(infoProject).length>0"
        :infoProject="infoProject"
    />

</template>

<script>
import detailProject from "@/components/taskManagement/project/Detail";
import { taskManagementApi } from "@/api/taskManagement.js";

export default {
    components:{
        detailProject
    },
    data(){
        return{
            infoProject:{}
        }
    },
    created(){
        let self=this;
        let id=this.$route.params.id;
        if (id) {
            let allProject=this.$store.state.taskManagement.allProject;
            let project=allProject.find(element => element.id==id);
            if (project) {
                self.infoProject=project;
                self.$store.commit("taskManagement/setCurrentProject", project);
            }else{ // call api get detail project
                taskManagementApi
                    .getDetailProject(id)
                    .then(res => {
                        if (res.status == 200) {
                            self.infoProject=res.data;
                            self.$store.commit("taskManagement/setCurrentProject", res.data);
                        }else{
                            self.$snotifyError("", "Can not get detail project with id:"+id);
                        }
                    })
                    .catch(err => {
                        self.$snotifyError("", "Can not get detail project with id:"+id);
                    })
                    .finally(() => {});
            }
        }
        this.$store.dispatch("taskManagement/getAllCategory");
        this.$store.dispatch("taskManagement/getListDocumentConfigFieldIssue");
        this.$store.commit("taskManagement/addToTaskManagementStore",{key:'currentPage',value:'projectSetting'});
    },
    activated(){
        let projectId=this.$route.params.id;
        let breadcrumbs = [
                {
                    text: 'Project Setting',
                    disabled: true,
                    to: '',
                },
                {
                    text: 'Detail',
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