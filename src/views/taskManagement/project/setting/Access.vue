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
        async getListRole(){
            let self = this;
            let allRole = await taskManagementApi.getListRole();
            if (allRole.status == 200 && allRole.data) {
                self.roles = allRole.data.listObject;
            }
               
        },
        async getUserInProject(){
            let self=this;
            let projectId=this.$route.params.id;
            let list = await taskManagementApi.getUserInProject(projectId);
            if (list.status == 200 && list.data) {
                self.listUser = list.data.listObject;
            }
        }
    },
    async created(){
        await this.getUserInProject();
        await this.getListRole();
    },
    activated(){
        //this.toggleMainContentLoader(false);
    }

}
</script>

<style>

</style>