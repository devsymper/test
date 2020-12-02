<template>
    <accessProject 
        :roles="roles"
        :listUser="listUser"
        @add-role-success="getListRole"
        @change-role-user="changeRoleUser"
        @remove-member="removeMember"
        @add-people-success="addPeopleSuccess"
        @remove-role-success="removeRoleSuccess"
    />

</template>

<script>
import accessProject from "@/components/taskManagement/project/Access";
import { taskManagementApi } from "@/api/taskManagement.js";

export default {
    components:{
        accessProject
    },
    data(){
        return{
            roles:[],
            listUser:[]
        }
    },
    methods:{
        addPeopleSuccess(){
            this.getUserInProject();
        },
        removeRoleSuccess(){
            this.getListRole();
        },
        changeRoleUser(){
            this.getUserInProject();
        },
        removeMember(){
            this.getUserInProject();
        },
        getListRole(){
            let self=this;
            taskManagementApi
                .getListRole()
                .then(res => {
                    if (res.status == 200) {
                        self.roles=res.data.listObject;
                    }else{
                        self.$snotifyError("", "Can not get list role!!!");
                    }
                })
                .catch(err => {
                    self.$snotifyError("", "Can not get list role!!!");
                })
                .always(() => {});
        },
        getUserInProject(){
            let self=this;
            let projectId=this.$route.params.id;
            taskManagementApi
                .getUserInProject(projectId)
                .then(res => {
                    if (res.status == 200) {
                        self.listUser=res.data.listObject;
                    }else{
                        self.$snotifyError("", "Can not get list user in project!!!");
                    }
                })
                .catch(err => {
                    self.$snotifyError("", "Can not get list project!!!");
                })
                .always(() => {});
        }
    },
    created(){
        this.getUserInProject();
        this.getListRole();
    },
    activated(){
        //this.toggleMainContentLoader(false);
    }

}
</script>

<style>

</style>