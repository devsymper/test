<template>
  <div class="w-100 h-100">
    <div style="height:40px; font-size:20px" class="font-weight-medium pl-3 pt-2">
        Backlog
    </div>
    <div v-if="data" class="fs-13" style="height:calc(100% - 41px)">
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
export default {
    components:{
        VuePerfectScrollbar,
        CommonListIssue,
        infoUser,
        DetailIssue
    },
    computed:{
  
        currentBoard(){
            return this.$store.state.taskManagement.currentBoard;
        },
        sTaskManagement(){
            return this.$store.state.taskManagement;
        },
        columnBacklog(){
            if (!this.currentBoard.id) {
                return {};
            }
            let idBoard=this.currentBoard.id;
            let backlogColumn = {};
            if (this.sTaskManagement.listColumnInBoard[idBoard] && this.sTaskManagement.listColumnInBoard[idBoard].length >= 0 ) {
                let columns = util.cloneDeep(this.sTaskManagement.listColumnInBoard[idBoard]);
                backlogColumn = columns.find(ele => ele.isBacklog == 1 && ele.isHidden == 0);
                backlogColumn.statusInColumn = [];
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
        return{
            data:null,
            projectId:null,
            documentObjectId:null,
            issue:null,
            panel: [0, 1 , 2, 3],

        }
    },  
    methods:{
        getMoreInfoForTask(issue){
            let allPriority = this.$store.state.taskManagement.allPriority;
            let listIssueType = this.$store.state.taskManagement.listIssueTypeInProjects[this.projectId];
            let allStatus = this.$store.state.taskManagement.allStatus;

            if (issue.tmg_priority_id) { 
                let priority = allPriority.find(ele => ele.id == issue.tmg_priority_id);
                if (priority) {
                    let infoPriority = {};
                    infoPriority.id = priority.id;
                    infoPriority.name = priority.name;
                    infoPriority.color = priority.color;
                    infoPriority.icon = priority.icon;

                    issue["infoPriority"] = infoPriority;
                }
            }    
            // get info issue type
            if (issue.tmg_issue_type) { 
                let issueType = listIssueType.find(ele => ele.id == issue.tmg_issue_type);
                if (issueType) {
                    let infoIssueType = {};
                    infoIssueType.id = issueType.id;
                    infoIssueType.name = issueType.name;
                    infoIssueType.icon = issueType.icon;

                    issue["infoIssueType"] = infoIssueType;
                }
            }    
            // get staus issue
            if (issue.tmg_status_id) { 
                let status = allStatus.find(ele => ele.id == issue.tmg_status_id);
                if (status) {
                    let infoStatus = {};
                    infoStatus.id = status.id;
                    infoStatus.name = status.name;
                    infoStatus.color = status.color;
                    issue["infoStatus"] = infoStatus;
                }
            } 
        },
        handleShowDetailIssue(issue){
            this.documentObjectId = issue.document_object_id;
            this.issue = issue;
            this.$refs.issue.show();
        },
        async getListTasks(){
            let documentId = this.allIssueTypeInProject.reduce((arr,obj)=>{
                if(!arr.includes(obj.documentId)){
                    arr.push(obj.documentId)
                }
                return arr
            },[])
            let allTask = await documentApi.getListObjectByMultipleDocument({ids:JSON.stringify(documentId)})
            allTask = allTask['data']['listObject'];
            let column = this.columnBacklog;
            if (this.listStatus.length > 0 ) {
                for (let i = 0; i < this.listStatusColumn.length; i++) {
                    let idColumn = this.listStatusColumn[i].columnId;
                    let statusRoleId = this.listStatusColumn[i].statusRoleId;
                    let item = this.listStatus.find(ele => ele.statusRoleId == statusRoleId);
                    if (item) {
                        let taskInStatus = allTask.filter(task=>{
                            return task.tmg_status_role_id == statusRoleId;
                        });
                        if (taskInStatus.length > 0) {
                            for (let j = 0; j < taskInStatus.length; j++) {
                                this.getMoreInfoForTask(taskInStatus[j]);
                            }
                        }
                        item['tasks'] = taskInStatus;
                        column.statusInColumn.push(item);
                    }
                }  
            }
            this.data = column;
           // this.$emit('loaded-content')
        },
        async getDataForBoard(){
            let self = this;
            if (this.$store.state.taskManagement.currentBoard) {
                let idBoard =  this.$store.state.taskManagement.currentBoard.id;
                if (!this.sTaskManagement.listColumnInBoard[idBoard] || this.sTaskManagement.listColumnInBoard[idBoard].length == 0) {
                    await this.$store.dispatch("taskManagement/getListColumnInBoard",idBoard);
                }
                if (!this.sTaskManagement.listStatusInColumnBoard[idBoard] || this.sTaskManagement.listStatusInColumnBoard[idBoard].length == 0) {
                    await this.$store.dispatch("taskManagement/getListStatusInColumnBoard",idBoard);
                }
            }
            if (!this.sTaskManagement.listStatusInProjects[this.projectId] || this.sTaskManagement.listStatusInProjects[this.projectId].length == 0) {
                await this.$store.dispatch("taskManagement/getListStautsInProject", this.projectId);
            }
          
            if(!this.allIssueTypeInProject){
                await this.$store.dispatch("taskManagement/getListIssueTypeInProjects", this.projectId);
            }
            this.getListTasks();
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