<template>
    <div class="w-100 h-100">
        <div style="height:40px; font-size:20px" class="font-weight-medium pl-3 pt-2">Trang chủ</div>
        <div  class="task-recent pl-3 pt-3 fs-13" style="max-height:200px">
            <div class="d-flex justify-space-between">Dự án gần đây
                <div class="task-hover-poiter mr-2" @click="handleAllProjects" style="color:#0000aa">
                    Xem tất cả dự án
                </div>
            </div>
            <VuePerfectScrollbar v-if="listProjectRecent.length > 0" style="width:100%;height: calc(100% - 20px);">
                <div style="width:100%" class="d-flex pt-4">
                    <div class="item-recent mr-3" v-for="(item,index) in listProjectRecent" :key="item.id" >
                        <div class="header-item-recent" style="height:23px;" :style="{'background':getColor(index)}">
                            <div class="icon-project">
                                <v-icon v-if="!!item.icon && item.icon.indexOf('mdi-') > -1" class="pt-0" style="font-size:24px; color:#000">{{item.icon}}</v-icon>
                                <img class="img-fluid" style="object-fit: fill;border-radius:3px" v-else-if="!!item.icon && item.icon.indexOf('mdi-') < 0" :src="item.icon" width="24" height="24">
                            </div>
                            <div class="float-right">
                                <v-icon v-if="item.isFavorite==1" style="font-size:13px" color="yellow" @click="updateFavorite(item)">mdi-star</v-icon>
                                <v-icon v-else style="font-size:13px" @click.prevent.stop="updateFavorite(item)" >mdi-star-outline</v-icon>
                   
                                <v-icon style="font-size:13px"  @click.prevent.stop="goConfigProject(item)" class="mx-1">mdi-cog-outline</v-icon>
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
                                        Tác vụ đang làm
                                    </td>
                                    <td class="float-right px-1">
                                        <span class="open-issue">{{getNumberIssue(item,"TO DO")}}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-1">
                                        Tác vụ hoàn thành
                                    </td>
                                    <td class="float-right px-1">
                                        <span class="done-issue">{{getNumberIssue(item,"DONE")}}</span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div class="footer-item-recent mt-2">
                            <div class="d-flex justify-space-between px-1">
                                <div>
                                    {{getNumberBoard(item)}} boards
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
                    <span>Tác vụ gần đây</span>
                </v-tab>
                <v-tab >
                    <span>Tác vụ của tôi</span>
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
import { taskManagementApi } from "@/api/taskManagement.js";

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
            let allProject = this.$store.state.taskManagement.allProject;
            let listItemLog = this.recentPojects;
            let listProject = [];
            if (listItemLog.length > 0) {
                for (let i = 0; i < listItemLog.length; i++) {
                    let projectLog = JSON.parse(listItemLog[i]['project']);
                    let project = allProject.find(ele => ele.id == projectLog.id);
                    if (project) {
                        if (listProject.length > 0) {
                            let isCheck = listProject.find(ele => ele.id == project.id);
                            if (isCheck) {
                                continue; // thoát khỏi vòng lặp
                            }
                        }
                        this.projectIds.push(project.id);
                        listProject.push(project);
                    }
                }
            }
            return listProject;
        },
        documentIds(){
            return this.$store.state.taskManagement.listDocumentIdsInIssueType;
        },
       
    },
    watch:{
        listProjectRecent:{
            deep: true,
            immediate: true,
            handler(after) {
                if (after.length > 0) {
                    this.countBoardInProject();
                    this.countIssueInListProject();
                }
            }
        }
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
                "#63E6CDFF",
                "#80B8EBFF",
                "#F33163FF",
                "#EA5206FF",
                "#1CF2DFFF",
                "#25C308FF",
                "#F31B35FF",
                "#30DA25FF"
            ],
            projectIds:[],
            dataCountBoard:[],
            dataCountIssue:[],
        }
    },
    methods:{
        countIssueInListProject(){
            if (this.projectIds.length > 0) {
                taskManagementApi
                .countIssueInListProject(this.projectIds)
                .then(res => {
                    if (res.status == 200 && res.data) {
                        this.dataCountIssue = res.data;
                    }
                })
                .catch(err => {
                    this.$snotifyError("", "Can not count board!", err);
                });
            }
        },
        getNumberBoard(project){
            let item = this.dataCountBoard.find(ele => ele.tmg_project_id == project.id);
            if (item) {
                return item.count;
            }
            return "";
        },
        getNumberIssue(project,status){
            if (this.dataCountIssue[project.id]) {
                let item = this.dataCountIssue[project.id];
                let obj = item.find(ele => ele.status == status);
                if (obj) {
                    return obj.count;
                }else{
                    return "";
                }
            }
        },
        countBoardInProject(){
            if (this.projectIds.length > 0) {
                taskManagementApi
                .countBoardInListProject(this.projectIds)
                .then(res => {
                    if (res.status == 200 && res.data) {
                        this.dataCountBoard = res.data;
                    }
                })
                .catch(err => {
                    self.$snotifyError("", "Can not count board!", err);
                });
            }
        },
        goConfigProject(obj){
            this.$router.push("/task-management/projects/"+obj.id+"/settings/details");
        },
        updateFavorite(obj){
            let self=this;
            taskManagementApi
                .updateProjectFavorite(obj.id)
                .then(res => {
                    if (res.status == 200) {
                        self.$snotifySuccess("Update project completed!");
                        self.$store.commit("taskManagement/updateStatusFavoriteProject", obj.id);

                    }else{
                        self.$snotifyError("", "Can not update project!");
                    }
                })
                .catch(err => {
                    self.$snotifyError("", "Can not update project!", err);
                })
                .finally(() => {});
        },
        handleClickProject(item){
            this.$router.push('/task-management/projects/'+item.id+'/kanban-board');
        },
        handleAllProjects(){
            this.$router.push("/task-management/projects");
        },
        randomBackground(){
            const random = Math.floor(Math.random() * this.colors.length);
            return this.colors[random];
        },
        getColor(index){
            if(index >= this.colors.length){
                return this.randomBackground()
            }
            return this.colors[index];
        }
    },
    created(){
        if (!this.$store.state.taskManagement.listDocumentIdsInIssueType || this.$store.state.taskManagement.listDocumentIdsInIssueType.length == 0) {
            this.$store.dispatch("taskManagement/getAllDocumentIdsInIssueType");
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
    transition: all ease-in-out 300ms;
   
}
.item-recent:hover{
    box-shadow: var(--symper-box-shadow);
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