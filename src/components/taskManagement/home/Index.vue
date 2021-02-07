<template>
    <div class="w-100 h-100">
        <div style="height:40px; font-size:20px" class="font-weight-medium pl-3 pt-2">Trang chủ</div>
        <div  class="task-recent pl-3 pt-3 fs-13" style="height:185px">
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
                                <v-icon v-else style="font-size:13px;color:white" @click.prevent.stop="updateFavorite(item)" >mdi-star-outline</v-icon>
                   
                                <v-icon style="font-size:13px;color:white"  @click.prevent.stop="goConfigProject(item)" class="mx-1">mdi-cog-outline</v-icon>
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
                                <div style="color:#ff8003">
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
            <div style="text-align:center; width:100%;height: calc(100% - 20px);" v-else>
                <img
                    class="my-2"
                    height="70px"
                    :src="require('@/assets/image/folder-empty.png')"/>
                <br/>
                <p class="font-weight-medium my-2">Bạn không có dự án nào truy cập gần đây !!!</p>
                <v-btn @click="handleAllProjects" color="blue" dark small depressed>
                    Xem tất cả dự án
                </v-btn>
            </div>

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
                        v-if="recentIssue.length > 0"
                        :recentIssue="recentIssue"
                    />
                    <div class="mt-4" style="text-align:center; width:100%;height: 100%" v-else>
                        <img
                            height="200px"
                            :src="require('@/assets/image/work.png')"/>
                        <br/>
                        <p class="font-weight-medium">Bạn không có tác vụ gần đây !!!</p>
                    </div>
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
import IssueRecent from './IssueRecent.vue';
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import AssignedRecent from './AssignedRecent.vue';
import infoUser from "@/components/common/user/InfoUser";
import HomeWorker from 'worker-loader!@/worker/taskManagement/home/Index.Worker.js';

export default {
    components: {
        IssueRecent,
        VuePerfectScrollbar,
        AssignedRecent ,
        infoUser,
    },
    computed:{
        documentIds(){
            return this.$store.state.taskManagement.listDocumentIdsInIssueType;
        },
        allProject(){
            return this.$store.state.taskManagement.allProject;
        }
       
    },
    watch:{
        recentPojects:{
            deep: true,
            immediate: true,
            handler(after) {
                if (after.length > 0 && this.allProject.length > 0) {
                    this.getDataProjectRecent();
                }
            }
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
                "#F44336",
                "#536DFE",
                "#388E3C",
                "#FF9800",
                "#E64A19",
                "#607D8B",
                "#1976D2",
                "#FFEB3B",
            ],
            projectIds:[],
            dataCountBoard:[],
            dataCountIssue:[],
            itemSelected: null,
            listProjectRecent:[],
            homeWorker:null,
        }
    },
    methods:{
        setStatusFavoriteProjectAfterUpate(){
            let item = this.listProjectRecent.find(ele => ele.id == this.itemSelected.id);
            if (item) {
                item.isFavorite = item.isFavorite == 1 ? 0 : 1;
            }
        },
        getDataProjectRecent(){
            if (this.homeWorker) {
                let data = {};
                data.allProject = this.$store.state.taskManagement.allProject;
                data.listItemLog = this.recentPojects;

                this.homeWorker.postMessage({
                    action:'getDataProjectRecent',
                    data:data
                });
            }
        },
        countIssueInListProject(){
            if (this.projectIds.length > 0) {
                if (this.homeWorker) {
                    this.homeWorker.postMessage({
                        action:'countIssueInListProject',
                        data:this.projectIds
                    });
                }
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
                if (this.homeWorker) {
                    this.homeWorker.postMessage({
                        action:'countBoardInProject',
                        data:this.projectIds
                    });
                }
            }
        },
        goConfigProject(obj){
            this.$router.push("/task-management/projects/"+obj.id+"/settings/details");
        },
        updateFavorite(obj){
            this.itemSelected = obj;
            this.setStatusFavoriteProjectAfterUpate();
            this.homeWorker.postMessage({
                action:'updateFavorite',
                data:obj.id
            });
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
        },
        getAllDocumentIdsInIssueType(){
            if (!this.$store.state.taskManagement.listDocumentIdsInIssueType || this.$store.state.taskManagement.listDocumentIdsInIssueType.length == 0) {
                this.homeWorker.postMessage({
                    action:'getAllDocumentIdsInIssueType',
                    data:null
                });
            }
        }
    },
    created(){
        let self = this;
        this.homeWorker = new HomeWorker();
        this.getAllDocumentIdsInIssueType();

        this.homeWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'updateFavoriteError':
                    self.setStatusFavoriteProjectAfterUpate();
                    break;
                case 'getAllDocumentIdsInIssueType':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit('taskManagement/setAllDocumentIdsInIssueType', res.data);
                    }
                    break;
                case 'countIssueInListProject':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.dataCountIssue = res.data;
                    }
                    break;
                case 'updateFavorite':
                    self.$snotifySuccess("Update project completed!");
                    self.$store.commit("taskManagement/updateStatusFavoriteProject", self.itemSelected.id);
                    break;
                case 'countBoardInProject':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.dataCountBoard = res.data;
                    } 
                    break;
                case 'getDataProjectRecent':
                    self.listProjectRecent = data.dataAfter.listProject;
                    self.projectIds =data.dataAfter.projectIds;
                    self.countBoardInProject();
                    self.countIssueInListProject();
                    break;
                default:
                    break;
            }
        });
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
    border: var(--symper-border);
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
    padding: 2px 6px;
    background: #4a6785;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    text-align: center;
    color: white;
}
.done-issue{
    padding: 2px 6px;
    background: green;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    text-align: center;
    color: white;
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