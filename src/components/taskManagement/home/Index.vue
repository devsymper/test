<template>
    <div class="w-100 h-100">
        <div style="height:40px; font-size:20px" class="font-weight-medium pl-3 pt-2">Home Page</div>
        <div v-if="listProjectRecent.length > 0" class="task-recent pl-3 pt-3 fs-13" style="height:200px">
            <div class="d-flex justify-space-between">Recent projects
                <div class="task-hover-poiter mr-2" @click="handleAllProjects" style="color:#0000aa">
                    View all projects
                </div>
            </div>
            <VuePerfectScrollbar style="width:100%;height: calc(100% - 20px);">
                <div style="width:100%" class="d-flex pt-4">
                    <div class="item-recent mr-3" v-for="(item) in listProjectRecent" :key="item.id" >
                        <div class="header-item-recent" style="height:23px;" :style="{'background':randomBackground()}">
                            <div class="icon-project">
                                <v-icon v-if="!!item.icon && item.icon.indexOf('mdi-') > -1" class="pt-0" style="font-size:24px">{{item.icon}}</v-icon>
                                <img class="img-fluid" style="object-fit: fill;border-radius:3px" v-else-if="!!item.icon && item.icon.indexOf('mdi-') < 0" :src="item.icon" width="24" height="24">
                            </div>
                            <div class="float-right">
                                <v-icon style="font-size:13px">mdi-star-outline</v-icon>
                                <v-icon style="font-size:13px" class="mx-1">mdi-cog-outline</v-icon>
                            </div>
                        </div>
                        <div class="body-item-recent">
                            <table class="w-100">
                                <tr>
                                    <td class="fs-14  px-1">
                                        <span @click="handleClickProject(item)" class="task-hover-poiter font-weight-medium">{{item.name}}</span>
                                    </td>
                                </tr>
                                <tr style="height:25px">
                                    <td class="px-1">
                                        Open issues
                                    </td>
                                    <td class="float-right px-1">
                                        <span class="open-issue">123</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-1">
                                        Done issues
                                    </td>
                                    <td class="float-right px-1">
                                        <span class="done-issue">13</span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div class="footer-item-recent mt-2">
                            <div class="d-flex justify-space-between px-1">
                                <div>
                                    3 boards
                                </div>
                                <div>
                                    <infoUser v-if="item.userLeader" class="userInfo fs-13" :userId="item.userLeader" :roleInfo="{}" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </VuePerfectScrollbar>

        </div>

        <div class="home-tabs w-100" style="height:calc(100% - 225px)">
            <v-tabs class="w-100 h-100 pl-4 mt-2 fs-13">
                <v-tab>
                    <span>Worked on</span>
                </v-tab>
                <v-tab >
                    <span>Assigned to me</span>
                </v-tab>
                <!-- <v-tab >
                    <span>Favorite</span>
                </v-tab> -->
                <!-- content -->
                <v-tab-item >
                    <issue-recent 
                        :recentIssue="recentIssue"
                    />
                </v-tab-item>
                <v-tab-item>
                    <assigned-recent 
                        :documentIds="documentIds"
                    />
                </v-tab-item>
            </v-tabs>
        </div>
    </div>
</template>

<script>
import { util } from "@/plugins/util";
import IssueRecent from './IssueRecent.vue';
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import AssignedRecent from './AssignedRecent.vue';
import infoUser from "@/components/common/user/InfoUser";

export default {
    components: {
        IssueRecent,
        VuePerfectScrollbar,
        AssignedRecent ,
        infoUser,
    },
    computed:{
        listProjectRecent(){
            let allUserById = this.$store.getters['app/mapIdToUser'];
            let listItemLog = this.recentPojects;
            let listProject = [];
            if (listItemLog.length > 0) {
                for (let i = 0; i < listItemLog.length; i++) {
                    let project = JSON.parse(listItemLog[i]['project']);
                    if (listProject.length > 0) {
                        let isCheck = listProject.find(ele => ele.id == project.id);
                        if (isCheck) {
                            continue; // thoát khỏi vòng lặp
                        }
                    }
                    listProject.push(project);
                }
            }

            return listProject;
        },
        documentIds(){
            return this.$store.state.taskManagement.listDocumentIdsInIssueType;
        },
    },
    props:{
        recentPojects:{
            type: Array,
            default(){
                return []
            }
        },
        recentIssue:{
            type: Array,
            default(){
                return []
            }
        }
    },
    data(){
        return{
            colors:[
                "#80F878FF",
                "#D1F658FF",
                "#63E6CDFF",
                "#80B8EBFF",
                "#F33163FF",
                "#EA5206FF",
                "#1CF2DFFF",
                "#25C308FF",
                "#F31B35FF",
                "#30DA25FF"
            ]
        }
    },
    methods:{
        handleClickProject(item){
            this.$router.push('/task-management/projects/'+item.id+'/kanban-board');
        },
        handleAllProjects(){
            this.$router.push("/task-management/projects");
        },
        randomBackground(){
            const random = Math.floor(Math.random() * this.colors.length);
            return this.colors[random];
        }
    }

}
</script>

<style scoped>
.task-hover-poiter:hover{
    cursor: pointer;
    text-decoration: underline;
    color: blue;
}
.item-recent {
    width:240px;
    min-width:240px;
    height:135px;
    border: 1px solid #eeeeee;
    border-radius: 5px;
   
}
.header-item-recent{
    position: relative;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}
.icon-project{
    position: absolute;
    left: 10px;
    top: -10px;
}

.open-issue{
    padding: 2px 4px;
    background: #aaa;
    border-radius: 6px;
}
.done-issue{
    padding: 2px 4px;
    background: rgb(179, 230, 172);
    border-radius: 6px;
}
.home-tabs >>> .v-tab{
    height: 30px;
    text-transform:unset;
}
.home-tabs >>> .v-item-group{
 height: 35px;
}
.home-tabs >>>.v-tabs-items{
    width:100%;
    height: calc(100% - 40px);
}
.home-tabs >>>.v-tabs-items .v-window__container,
.home-tabs >>>.v-tabs-items .v-window-item
{
    width:100%;
    height: 100%
}
</style>