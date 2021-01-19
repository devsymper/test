<template>
  <div class="w-100 h-100">
    <div style="height:40px; font-size:20px" class="font-weight-medium pl-3 pt-2">
        Backlog
        <span v-if="currentBoard.type == 'scrum'" class="float-right">
            <v-btn small class="px-1 ml-1" solo depressed @click="showPopupSprint" >
                <span>Create Sprint</span>
            </v-btn>
        </span>
    </div>
    <div v-if="currentBoard.type == 'scrum'" style="height:calc(100% - 41px)" >
        <sprint 
            ref="sprint"
            :currentBoard="currentBoard"
        />
    </div>
    <div v-else-if="currentBoard.type == 'kanban' && data" class="fs-13" style="height:calc(100% - 41px)">
        <VuePerfectScrollbar
            style="height:100%"
        >
            <v-expansion-panels
                v-model="panel"
                multiple
                style="overflow: hidden;"
            >
                <v-expansion-panel class="sym-expand-panel" v-for="(status,index) in data.statusInColumn" :key="index">
                    <v-expansion-panel-header class="v-expand-header px-4 py-0">{{status.name +'-'+ status.taskLifeCircleName}}</v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                        <v-list dense>
                            <v-list-item
                            class="issue-item"
                            v-for="(item, i) in status.tasks"
                            :key="i"
                            >
                                <div  :class="{'single-row': true }"
                                class="d-flex w-100 py-1">
                                    <div class="item-icon" v-if="item.infoIssueType">
                                        <v-icon v-if="!!item.infoIssueType.icon && item.infoIssueType.icon.indexOf('mdi-') > -1"  style="font-size:20px">{{item.infoIssueType.icon}}</v-icon>
                                        <img class="img-fluid" style="object-fit: fill;border-radius:3px" v-else-if="!!item.infoIssueType.icon && item.infoIssueType.icon.indexOf('mdi-') < 0" :src="item.infoIssueType.icon" width="20" height="20">
                                    </div>
                                    <div class="item-icon" v-else>
                                        <v-icon style="font-size:20px">mdi-progress-question</v-icon>
                                    </div>
                                    <div class="d-flex justify-space-between ml-2">
                                        <div>
                                            <div  @click.prevent.stop="handleShowDetailIssue(item)" class="task-hover-poiter">{{item.tmg_name}}</div>
                                            <div class="grey--text">
                                                    {{item.tmg_project_key}}-{{item.document_object_id}}
                                            </div>
                                        </div>    
                                    </div>
                                    <div class="mt-2 mr-2" style="margin-left:auto;min-width:120px">
                                        <div v-if="item.infoPriority">
                                            <v-icon :style="{'color':item.infoPriority.color, 'font-size':'18px'}">{{item.infoPriority.icon}}</v-icon>
                                            <span class="pl-1">{{item.infoPriority.name}}</span>
                                        </div>
                                    </div>  
                                    <div class="mt-2" style="min-width:120px">
                                        <span v-if="item.infoStatus" style="padding: 2px 4px; border-radius:3px; background:#f2f2f2;" :style="{'color':item.infoStatus.color}">{{item.infoStatus.name}}</span>
                                    </div> 
                                    <div class="mt-2 mx-1" style="min-width:120px" >
                                        <infoUser v-if="item.tmg_assignee" class="userInfo fs-13" :userId="item.tmg_assignee" :roleInfo="{}" />
                                    </div>   
                                </div>
                            
                            </v-list-item>
                        </v-list>
                     
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>

        </VuePerfectScrollbar>
    </div>
        <detail-issue
            :documentObjectId="documentObjectId"
            :issue="issue"
            ref="issue"
        />
  </div>
</template>

<script>
import { util } from '@/plugins/util';
import { documentApi } from "@/api/Document.js";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import CommonListIssue from '../home/commonListIssue.vue';
import infoUser from "@/components/common/user/InfoUser";
import DetailIssue from '@/components/taskManagement/issue/DetailIssue.vue';
import KanbanWorker from 'worker-loader!@/worker/taskManagement/kanban/Kanban.Worker.js';
import Sprint from './Sprint.vue';

export default {
    components:{
        VuePerfectScrollbar,
        CommonListIssue,
        infoUser,
        DetailIssue,
        Sprint
    },
    computed:{
        sTaskManagement(){
            return this.$store.state.taskManagement;
        },
        columnBacklog(){
            if (!this.currentBoard.id || this.currentBoard.type == 'scrum') {
                return {};
            }
            let idBoard=this.currentBoard.id;
            let backlogColumn = {};
            if (this.sTaskManagement.listColumnInBoard[idBoard] && this.sTaskManagement.listColumnInBoard[idBoard].length >= 0 ) {
                let columns = util.cloneDeep(this.sTaskManagement.listColumnInBoard[idBoard]);
                backlogColumn = columns.find(ele => ele.isBacklog == 1 && ele.isHidden == 0);
                backlogColumn['statusInColumn'] = [];
            }
            return backlogColumn;
        },
        listStatus(){
            let listStatus = [];
            if (this.sTaskManagement.listStatusInProjects[this.projectId] && this.sTaskManagement.listStatusInProjects[this.projectId].length >= 0 ) {
                listStatus = util.cloneDeep(this.$store.state.taskManagement.listStatusInProjects[this.projectId]);
            }
            return listStatus;
        },
        listStatusColumn(){
            if (!this.currentBoard.id) {
                return [];
            }
            let idBoard=this.currentBoard.id;
            let listStatusColumn = [];
            if (this.columnBacklog.id) {
                if (this.sTaskManagement.listStatusInColumnBoard[idBoard] && this.sTaskManagement.listStatusInColumnBoard[idBoard].length >= 0 ) {
                    let allStatusInBoard = this.sTaskManagement.listStatusInColumnBoard[idBoard];
                    for (let i = 0; i < allStatusInBoard.length; i++) {
                        if (allStatusInBoard[i].columnId == this.columnBacklog.id) {
                            listStatusColumn.push(allStatusInBoard[i]);
                        }
                    }
                }
            }
            return listStatusColumn;
        },
        allIssueTypeInProject(){
            return this.$store.state.taskManagement.listIssueTypeInProjects[this.projectId];
        },
    },
    data(){
        let self = this;
        return{
            isGetListTask:false,
            flagGetListColumnInBoard:false,  // gán cờ trạng thái: đã được gọi hàm hay chưa
            flagGetListStatusInColumnBoard:false,  // gán cờ trạng thái: đã được gọi hàm hay chưa
            kanbanWorker:null,
            currentBoard:{},
            data:null,
            projectId:null,
            documentObjectId:null,
            issue:null,
            panel: [0, 1 , 2, 3],
            filter:{
                ids: null,
                filter:[
                    {
                        column : "tmg_project_id",
                        operation : "and",
                        conditions : [
                            {
                                name : "in",
                                value : [self.$route.params.id],
                            }
                        ],
                    },
                    {
                        column : "tmg_sprint_id",
                        operation : "and",
                        conditions : [
                            {
                                name : "empty",
                                value : '',
                            }
                        ],
                    },
                ],
                page : 1,
                pageSize: 500,
                distinct: true
            },
        }
    },  
    methods:{
        showPopupSprint(){
            this.$refs.sprint.show();
        },
        handleShowDetailIssue(issue){
            this.documentObjectId = issue.document_object_id;
            this.issue = issue;
            this.$refs.issue.show();
        },
        getListTasks(){
            this.isGetListTask = true;
            let data = {};
            data.columnBacklog = this.columnBacklog;
            data.listStatusColumn = this.listStatusColumn;
            data.listStatus = this.listStatus;
            data.allIssueTypeInProject =  this.allIssueTypeInProject;
            data.allPriority = this.$store.state.taskManagement.allPriority;
            data.listIssueType = this.$store.state.taskManagement.listIssueTypeInProjects[this.projectId];
            data.allStatus = this.$store.state.taskManagement.allStatus;
            data.filter = this.filter;
            // đẩy xuống worker xử lý
            this.kanbanWorker.postMessage({
                action:'getListTasksBackLog',
                data:data
            });
        },
        getListColumnInBoard(idBoard){
            if (this.flagGetListColumnInBoard) {
                return
            }
            this.kanbanWorker.postMessage({
                action:'getListColumnInBoard',
                data:idBoard
            });
        },
        getListStatusInColumnBoard(idBoard){
            if (this.flagGetListStatusInColumnBoard) {
                return
            }
            this.kanbanWorker.postMessage({
                action:'getListStatusInColumnBoard',
                data:idBoard
            });
        },
        getMoreData(){
            let self = this;
            let idBoard = this.currentBoard.id;
     
            if (!this.sTaskManagement.listColumnInBoard[idBoard] || this.sTaskManagement.listColumnInBoard[idBoard].length == 0) {
                self.getListColumnInBoard(idBoard);
                this.flagGetListColumnInBoard = true;
            }
            if (!this.sTaskManagement.listStatusInColumnBoard[idBoard] || this.sTaskManagement.listStatusInColumnBoard[idBoard].length == 0) {
                self.getListStatusInColumnBoard(idBoard);
                this.flagGetListStatusInColumnBoard = true;
            }
       
            if (!self.isGetListTask && self.sTaskManagement.listColumnInBoard[idBoard] && self.sTaskManagement.listColumnInBoard[idBoard].length > 0 &&
                self.sTaskManagement.listStatusInColumnBoard[idBoard] && self.sTaskManagement.listStatusInColumnBoard[idBoard].length > 0
            ) {
                self.getListTasks();
            }
          
        },
        getDataForBoard(board=null){
            let self = this;
            if (board) {
                this.currentBoard = board;
            }else{
                this.currentBoard = this.$store.state.taskManagement.currentBoard;
            }
            if (this.$store.state.taskManagement.currentBoard) {
                this.getMoreData();
            }
        },
        loadData(){
            this.projectId = this.$route.params.id;
            let breadcrumbs = [
                    {
                        text: 'Backlog',
                        disabled: true
                    },
                ]
            this.$store.commit("taskManagement/addToTaskManagementStore",{key:"headerBreadcrumbs",value:breadcrumbs})
            let self = this;
            this.getDataForBoard();
        }
    },
    created(){
        let self = this;
        this.$evtBus.$on('selected-item-board', (board) =>{
            self.flagGetListStatusInColumnBoard = false;
            self.flagGetListColumnInBoard = false;
            self.isGetListTask = false;
            self.getDataForBoard(board);
        });

        this.kanbanWorker = new KanbanWorker();
        this.kanbanWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'getListTasksBackLog':
                    self.data = data.dataAfter;
                  //  self.$emit('loaded-content');
                    break;
                case 'getListColumnInBoard':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        if (res.data.length == 0) {
                            self.data = [];
                        }
                        self.$store.commit("taskManagement/setListColumnInBoard", res);
                        self.getMoreData();
                    } 
                    break;
                case 'getListStatusInColumnBoard':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit("taskManagement/setListStatusInColumnBoard", res);
                        self.getMoreData();
                    } 
                    break;
                default:
                    break;
            }
        });
    },
    activated(){
        this.loadData()
    }

}
</script>

<style scoped>
.task-hover-poiter:hover{
    cursor: pointer;
    text-decoration: underline;
    color: blue;
}

.grey--text{
    font-size: 11px;
}
.issue-item:hover{
    background: var(--symper-background-hover);
}
.sym-v-expand-content >>>.v-expansion-panel-content__wrap{
    padding-left: 2px;
    padding-right: 2px;
}
.v-expand-header{
    min-height: 40px;
}

</style>