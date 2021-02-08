<template>
  <div class="w-100 h-100">
    <div style="height:40px; font-size:20px" class="font-weight-medium pl-3 pt-2">
        Backlog
        <span v-if="sCurrentBoard.type == 'scrum'" class="float-right">
            <v-btn small class="px-1 ml-1" solo depressed @click="showPopupSprint" >
                <span>Create Sprint</span>
            </v-btn>
        </span>
    </div>
    <div v-if="sCurrentBoard.type == 'scrum'" style="height:calc(100% - 41px)" >
        <sprint 
            ref="sprint"
            :currentBoard="sCurrentBoard"
        />
    </div>
    <div v-else-if="sCurrentBoard.type == 'kanban' && data" class="fs-13" style="height:calc(100% - 41px)">
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
                                        <span style="padding: 2px 4px; border-radius:3px; background:#f2f2f2;" :style="{'color':status.color}">{{status.name}}</span>
                                    </div> 
                                    <div class="mt-2 mx-1" style="min-width:160px" >
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
       
        listStatus(){
            let listStatus = [];
            if (this.sTaskManagement.listStatusInProjects[this.projectId] && this.sTaskManagement.listStatusInProjects[this.projectId].length >= 0 ) {
                listStatus = util.cloneDeep(this.$store.state.taskManagement.listStatusInProjects[this.projectId]);
            }
            return listStatus;
        },
      
        allIssueTypeInProject(){
            return this.sTaskManagement.currentProject.issueTypes;
        },
        sCurrentBoard(){
            return this.sTaskManagement.currentBoard;
        }
    },
    watch:{
        sCurrentBoard:function(after){
             this.kanbanWorker.postMessage({
                    action:'getDetailBoard',
                    data:{boardId:after.id,
                    allStatus: null,
                    projectId: after.projectId}
                });
        },
    },
    data(){
        let self = this;
        return{
            kanbanWorker:null,
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
                        operation : "equal",
                        conditions : [
                            {
                                name : "in",
                                value : self.$route.params.id,
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
        checkUpdateTaskInBacklog(issue){
            if (!issue.tmg_sprint_id) {
                let data = {};
                data.dataSend = this.data;
                data.projectId = this.projectId;
                data.issue = issue;
                data.allPriority = this.$store.state.taskManagement.allPriority;
                data.listIssueType = this.$store.state.taskManagement.listIssueTypeInProjects[this.projectId];
                data.allStatus = this.$store.state.taskManagement.allStatus;
                this.kanbanWorker.postMessage({
                    action:'checkUpdateTaskInBacklog',
                    data: data
                });
            }
        },
        showPopupSprint(){
            this.$refs.sprint.show();
        },
        handleShowDetailIssue(issue){
            this.documentObjectId = issue.document_object_id;
            this.issue = issue;
            this.$refs.issue.show();
        },
        getListTasks(backLogColumn){
            let data = {};
            if(backLogColumn.length > 0){
                data.backLogData = backLogColumn[0]
                data.allStatus = this.listStatus;
                data.listIssueType =  this.allIssueTypeInProject;
                data.allPriority = this.$store.state.taskManagement.allPriority;
                data.filter = this.filter;
                // đẩy xuống worker xử lý
                this.kanbanWorker.postMessage({
                    action:'getListTasksBackLog',
                    data:data
                });
            }
            else{
                this.$emit('loaded-content')
            }
            
        },
          
    },
    created(){
        let self = this;
        this.$evtBus.$on('task-manager-submit-issue-success', (issue) =>{
            self.checkUpdateTaskInBacklog(issue);
        })
        this.kanbanWorker = new KanbanWorker();
        this.kanbanWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'getListTasksBackLog':
                    self.data = data.dataAfter;
                    self.$emit('loaded-content')
                    break;
                case 'updateTaskInBacklog':
                    if (data.dataAfter) {
                        self.data = data.dataAfter;
                    }
                case 'getListStatusInProject':
                    self.$store.commit("taskManagement/setListStatusInProject",{key:data.dataAfter.projectId, data:data.dataAfter.data});
                    break;
                case 'getDetailBoard':
                    let listNewColumn = data.dataAfter.listNewColumn;
                    let backLogColumn = data.dataAfter.backLogColumn;
                    if(Object.keys(backLogColumn).length > 0){
                        backLogColumn = Object.values(backLogColumn);
                    }
                    let dataToStore = {key:self.sTaskManagement.currentBoard.id, data:Object.values(listNewColumn)}
                    self.$store.commit("taskManagement/setListColumnInBoard",dataToStore);
                    self.$store.commit("taskManagement/addToTaskManagementStore",{key:'backLogData',value:backLogColumn});
                    self.getListTasks(backLogColumn);
                    break;
                default:
                    break;
            }
        });
    },
    activated(){
        this.projectId = this.$route.params.id;
        let breadcrumbs = [
                {
                    text: 'Backlog',
                    disabled: true
                },
            ]
        this.$store.commit("taskManagement/addToTaskManagementStore",{key:"headerBreadcrumbs",value:breadcrumbs});
         this.kanbanWorker.postMessage({
                    action:'getDetailBoard',
                    data:{boardId:this.sCurrentBoard.id,
                    allStatus: null,
                    projectId: this.sCurrentBoard.projectId}
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
.sym-expand-panel::before{
    box-shadow: none !important;
}
.sym-expand-panel{
    border-radius: 4px !important;
    border:var(--symper-border)
}

</style>