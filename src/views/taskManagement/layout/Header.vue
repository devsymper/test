<template>
    <div class="task-manager-app-header">
        <div class="app-header_left" :class="{ 'breadcrumb-hide-sidebar': hideSidebar }">
            <v-breadcrumbs :items="headerBreadcrumbs">
                <template v-slot:divider>
                    <v-icon>mdi-chevron-right</v-icon>
                </template>
            </v-breadcrumbs>
            <div class="app-header_left--content">

            </div>
        </div>
        <div class="app-header_right">
             <v-btn
                class="add-task-btn"
                depressed
                color="primary"
                @click="showPopupCreateIssue"
                >
                Create
            </v-btn>
            <div class="search">
                <div>
                <input type="text" placeholder="Search . . ." required>
                </div>
            </div>
            <v-icon @click="handleHome" style="font-size:24px;color:#5a6061">mdi-home-account</v-icon>
            <div class="pr-3" style="position:relative;padding: 3px 0;margin-top:3px">
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon    
                            v-bind="attrs"
                            v-on="on">mdi-cog-outline
                        </v-icon>
                    </template>
                    <v-list dense>
                        <v-list-item
                            v-for="(item, index) in settings"
                            :key="index"
                            @click="item.menuAction(item)"
                        >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
            <!-- <div class="user-info">
                <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <img
                    class="user-avatar"
                    :src="currentUserAvatar"
                    v-bind="attrs"
                    v-on="on"
                    >
                </template>
                <v-list>
                    <v-list-item
                    v-for="(item, index) in items"
                    :key="index"
                    >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
                </v-menu>
            </div> -->
        </div>
        <popup-issue
            ref="popupIssue"
        />
        
    </div>
</template>
<script>
import { appConfigs } from '../../../configs.js';
import { taskManagementApi } from "@/api/taskManagement.js";
import popupIssue from "../../../components/taskManagement/issue/popupIssue"
export default {
    components:{
        popupIssue
    },
    data(){
        let self=this;
        return {
            items: [
                { title: 'Click Me' },
                { title: 'Click Me' },
                { title: 'Click Me' },
                { title: 'Click Me 2' },
            ],
            settings: [
                { 
                    title: "Priority",
                    menuAction: action => {
                        self.$router.push("/task-management/priorities");
                    },
                },
            ],
            
        }
    },
    methods:{
        handleHome(){
            this.$router.push("/task-management");
        },
        showPopupCreateIssue(){
            this.$refs.popupIssue.show();
        },
        getAllUserOperations(projectId){
            let thisCpn = this;
            taskManagementApi.getAllActionOfProject(projectId).then(res=>{
                if(res.status == 200){
                    thisCpn.$store.commit('taskManagement/addToTaskManagementStore',{key:'userOperations',value:res.data})
                }
            })
        }
    },
    watch:{
        sCurrentProject(vl){
            this.getAllUserOperations(vl.id);
        }
    },
    created(){
        this.$store.dispatch("taskManagement/getAllStatusCategory");
        if (!this.$store.state.taskManagement.allPriority || this.$store.state.taskManagement.allPriority == 0) {
            this.$store.dispatch("taskManagement/getAllPriority");
        }
    },
    computed:{
        sCurrentProject(){
            return this.$store.state.taskManagement.currentProject
        },
        currentUserAvatar(){
            let userId = this.$store.state.app.endUserInfo.id;
            return appConfigs.apiDomain.fileManagement+'readFile/user_avatar_' + userId;
        },
        headerBreadcrumbs(){
            return this.$store.state.taskManagement.headerBreadcrumbs;
        },
        hideSidebar(){
            return this.$store.state.taskManagement.hideSidebar;
        },
        sTaskManagement(){
            return this.$store.state.taskManagement;
        }
    }
}
</script>
<style scoped>
    .task-manager-app-header{
        height: 45px;
        display: flex;
    }
    .app-header_right{
        margin-left: auto;
        padding: 7px;
        display: flex;
    }
    .app-header_right >>> .v-icon{
        font-size: 20px;
        margin: 0 8px;
    }
    .user-info .user-avatar{
        height: 30px;
        width: 30px;
        border-radius: 50%;
    }
    .bandge{
        position: absolute;
        left: 19px;
        font-size: 12px;
        background: red;
        border-radius: 50%;
        display: inline-block;
        width: 15px;
        height: 15px;
        text-align: center;
        color: white;
    }
    .app-header_left >>> .v-breadcrumbs {
        padding: 12px;
    }
    .app-header_left >>> .v-breadcrumbs .v-breadcrumbs__item{
        font-size: 13px;
        color: rgba(0, 0, 0, 0.87);
    }
    .add-task-btn{
        height: 30px !important;
        width: 54px !important;
        font-size: 13px !important;
        margin-right: 8px;
    }
    .search{
        padding: 2px;
    }
    
    .search > div {
        display: inline-block;
        position: relative;
    }

    .search > div:after {
        content: "";
        background: var(--symper-sub-text-color-default);
        width: 2px;
        height: 8px;
        position: absolute;
        top: 14px;
        right: -2px;
        transform: rotate(135deg);
    }

    .search > div > input {
        color: var(--symper-sub-text-color-default);
        font-size: 13px;
        background: transparent;
        width: 16px;
        height: 16px;
        border: solid 1px var(--symper-sub-text-color-default);
        outline: none;
        border-radius: 35px;
        transition: all 0.5s;
    }

    .search > div > input::placeholder {
        color: #efefef;
        opacity: 0;
        transition: opacity 150ms ease-out;
    }

    .search > div > input:focus::placeholder {
        opacity: 1;
    }

    .search > div > input:focus,
    .search > div > input:not(:placeholder-shown) {
        width: 250px;
        padding: 10px;

    }
    .app-header_left--content{
        display: flex;
    }
    .breadcrumb-hide-sidebar{
        margin-left: 30px;
    }
</style>