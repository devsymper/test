<template>
    <div class="w-100 h-100">
        <v-tabs 
            class="w-100 h-100 fs-13 tab-board" 
            style="text-align:left"
            vertical>
            <v-tab class="fs-13">
                <v-icon class="fs-15" left>
                mdi-package-variant-closed
                </v-icon>
                Action pack
            </v-tab>
            <v-tab class="fs-13">
                <v-icon class="fs-15" left>
                mdi-shield-key-outline
                </v-icon>
                Permission
            </v-tab>
            <v-tab class="fs-13">
                <v-icon class="fs-15" left>
                mdi-account-circle-outline
                </v-icon>
                Role
            </v-tab>
            <v-tab-item>
                <action-pack 
                />
            </v-tab-item>
            <v-tab-item>
                
            </v-tab-item>
            <v-tab-item>
                <accessProject 
                    :roles="roles"
                    :listUser="listUser"
                    @add-role-success="getListRole"
                    @change-role-user="changeRoleUser"
                    @remove-member="removeMember"
                    @add-people-success="addPeopleSuccess"
                    @remove-role-success="removeRoleSuccess"
                />
            </v-tab-item>
            
        </v-tabs>
    </div>
 

</template>

<script>
import accessProject from "@/components/taskManagement/project/Access";
import { taskManagementApi } from "@/api/taskManagement.js";
import ActionPack from '../../../../components/taskManagement/project/ActionPack.vue';

export default {
    components:{
        accessProject,
        ActionPack,
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

<style scoped>
.tab-board >>>.v-slide-group__wrapper{
    width:200px;
}
.tab-board >>>.v-tab
{
    height: 35px;
    justify-content: left;
}
</style>