<template>
    <div class="w-100 h-100 pt-2">
        <VuePerfectScrollbar
            style="height:100%"
        >
            <v-expansion-panels
                v-model="panel"
                multiple
                style="overflow: hidden;"
            >
                <v-expansion-panel class="sym-expand-panel" v-for="obj in data" :key="obj.id">
                    <v-expansion-panel-header class="v-expand-header px-4 py-0">
                        <div class="font-weight-medium">
                            {{obj.name}} 
                            <span class="grey--text fs-11">
                                {{'('+obj.tasks.length+' issues)'}}
                            </span> 
                            <div class="text-ellipsis grey--text fs-11 pt-1">
                                {{obj.description}}
                            </div>
                             <div class="pt-1 grey--text fs-11">
                                {{$t('table.startTime') + ": " + obj.startTime}}  {{$t('table.endTime') + ": " + obj.endTime}}
                            </div>
                        </div>
                        <v-btn :disabled="isSprintStart()" v-if="obj.status == 'plan'" @click.prevent.stop="handleStartSprint(obj)" small class="btn-action-sprint px-1" solo depressed >
                            <span v-if="isSprintStart()">Planning</span>
                            <span v-else>Start sprint</span>
                        </v-btn>
                        <v-btn :disabled="isSprintStart()" v-else-if="obj.status == 'running'" @click.prevent.stop="handleStartSprint(obj)" small class="btn-action-sprint px-1" solo depressed >
                            <span>Running...</span>
                        </v-btn>
                        <v-btn  v-else-if="obj.status == 'done'"  small class="btn-action-sprint px-1" color="green" solo depressed >
                            <span style="color:white">Done</span>
                        </v-btn>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                        <v-list dense>
                            <draggable 
                            :list="obj.tasks" 
                            :animation="250"
                            @change="handleChange($event,obj)"
                            ghost-class="ghost-card" group="tasks">
                                <v-list-item
                                class="issue-item fs-13"
                                v-for="(item, i) in obj.tasks"
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
                            </draggable>
                        </v-list>
                                <!-- </transition-group> -->
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>

        </VuePerfectScrollbar>
        <modal-add-or-detail-sprint 
          ref="modalAddOrDetailSprint"
            :dataSprintProps="dataSprintProps"
            :infoSprint="infoSprint"
            :statusDetail="statusDetail"
            :actionSprint="actionSprint"
            :currentBoard="currentBoard"
            @add-sprint="addSprintSuccess"
            @start-sprint-success="startSprintSuccess"
        />

        <detail-issue
            :documentObjectId="documentObjectId"
            :issue="issue"
            ref="issue"
        />
    </div>
</template>

<script>
import KanbanWorker from 'worker-loader!@/worker/taskManagement/kanban/Kanban.Worker.js';
import { taskManagementApi } from "@/api/taskManagement.js";
import { util } from "@/plugins/util";
import infoUser from "@/components/common/user/InfoUser";
import ModalAddOrDetailSprint from './ModalAddOrDetailSprint.vue';
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import draggable from "vuedraggable";
import DetailIssue from '@/components/taskManagement/issue/DetailIssue.vue';

export default {
    components:{
        infoUser,
        ModalAddOrDetailSprint,
        VuePerfectScrollbar,
        draggable,
        DetailIssue
    },
    props:{
        currentBoard:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    computed:{
        allIssueTypeInProject(){
            let projectId = this.$route.params.id;
            return this.$store.state.taskManagement.listIssueTypeInProjects[projectId];
        },
    },
    data(){
        let self = this;
        return {
            documentObjectId:null,
            issue:null,
            kanbanWorker:null,
            panel: [0, 1 , 2, 3],
            actionSprint: null, 
            data:[],
            statusDetail:false,
            isLoading:false,
            infoSprint:{
                id:"",
                name: "",
                description: "",
                status: "",
                startTime:"",
                endTime:"",
            },
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
                                name : "not_empty",
                                value : '',
                            }
                        ],
                    },
                ],
                page : 1,
                pageSize: 200,
                distinct: true
            },
            dataSprintProps:{
                name : { 
                    title: "Name",
                    type: "text",
                    value: '',
                    validateStatus:{
                        isValid:true,
                        message:"Error"
                    },
                    validate(){
                        if (this.value=="") {
                            this.validateStatus.isValid=false;
                            this.validateStatus.message="Không bỏ trống";
                        }else{
                            this.validateStatus.isValid=true;
                            this.validateStatus.message="";
                        }
                    }
                },
                description : {
                    title: "Mô tả",
                    type: "text",
                    value: '',
                    validateStatus:{
                        isValid:true,
                        message:""
                    },
                    validate(){
                    }
                },
            }
        }
    },
    methods:{
        isSprintStart(){
            let allSprint = this.data;
            let item = allSprint.find(ele => ele.status == "running");
            if (item) {
                return true;
            }else{
                return false;
            }
        },
        handleChange(event,sprint){
            if(event.added){
                let task = event.added.element;
                let dataSend = {};
                dataSend.allIssueTypeInProject = this.allIssueTypeInProject;
                dataSend.task = task;
                dataSend.sprint = sprint;

                this.kanbanWorker.postMessage({
                    action:'handleChangeIssueInSprint',
                    data:dataSend
                });
            }
        },
        handleStartSprint(item){
            this.dataSprintProps.name.value=item.name;
            this.dataSprintProps.description.value=item.description;
            this.infoSprint.id=item.id;
            this.infoSprint.description=item.description;
            this.infoSprint.name=item.name;
            this.infoSprint.status=item.status;
            this.infoSprint.startTime=item.startTime;
            this.infoSprint.endTime=item.endTime;
            this.statusDetail=true;
            this.actionSprint = "start"
            this.$refs.modalAddOrDetailSprint.show();
        },
        handleShowDetailIssue(issue){
            this.documentObjectId = issue.document_object_id;
            this.issue = issue;
            this.$refs.issue.show();
        },
        show(){
            this.$refs.modalAddOrDetailSprint.show();
        },
        addSprintSuccess(sprint){
            this.$store.commit("taskManagement/addSprintToListInStore",sprint);
        },
        startSprintSuccess(){
            let sprint = this.data.find(ele => ele.id == this.infoSprint.id);
            if (sprint) {
                sprint.status = 'running';
                sprint.name = this.infoSprint.name;
                sprint.description = this.infoSprint.description;
                sprint.startTime = this.infoSprint.startTime;
                sprint.endTime = this.infoSprint.endTime;
                this.infoSprint['boardId'] = sprint.boardId; 
            }
            this.$store.commit("taskManagement/updateSprintToListInStore",this.infoSprint);
        },
        getListSprintInBoard(){
            if (!this.$store.state.taskManagement.listSprintInBoard[this.currentBoard.id] || this.$store.state.taskManagement.listSprintInBoard[this.currentBoard.id].length == 0) {
                this.kanbanWorker.postMessage({
                    action:'getListSprintInBoard',
                    data:this.currentBoard.id
                });
            }else{
                this.getIssueInSprint();
            }
        },
        getIssueInSprint(){
            let projectId = this.$route.params.id;
            if (!this.$store.state.taskManagement.listIssueInSprintProject[projectId] || this.$store.state.taskManagement.listIssueInSprintProject[projectId].length == 0) {
                let documentIds = this.$store.state.taskManagement.listDocumentIdsInProject[projectId];
                if (documentIds && documentIds.length > 0) {
                    this.filter.ids =JSON.stringify(documentIds);
                    this.kanbanWorker.postMessage({
                        action:'getIssueInSprint',
                        data:this.filter
                    });
                }
            }else{
                this.groupIssueInSprint();
            }
          
        },
        groupIssueInSprint(){
            let projectId = this.$route.params.id;
            let data = {};
            data.listSprintInBoard = this.$store.state.taskManagement.listSprintInBoard[this.currentBoard.id];
            data.listAllIssueInSprint = this.$store.state.taskManagement.listIssueInSprintProject[projectId];
            data.allPriority = this.$store.state.taskManagement.allPriority;
            data.listIssueType = this.$store.state.taskManagement.listIssueTypeInProjects[projectId];
            data.allStatus = this.$store.state.taskManagement.allStatus;
            if (data.listSprintInBoard.length > 0) {
                this.kanbanWorker.postMessage({
                    action:'groupIssueInSprint',
                    data:data
                });
            }
         
        }
    },
    created(){
        let self = this;
        this.kanbanWorker = new KanbanWorker();

        this.getListSprintInBoard();
        this.kanbanWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'actionError':
                    self.isLoading = false;
                    break;
                case 'getListSprintInBoard':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit("taskManagement/setListSprintInBoard", res);
                        self.getIssueInSprint();
                    }
                    break;
                case 'getIssueVersion':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.getIssueInSprint();
                    }
                    break;
                case 'getIssueInSprint':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        let dataSetStore = {};
                        dataSetStore.key = self.$route.params.id;
                        dataSetStore.data = res.data.listObject;
                        self.$store.commit("taskManagement/setListIssueInSprintProject", dataSetStore);
                        self.groupIssueInSprint();
                    }
                    break;
                    
                case 'groupIssueInSprint':
                    let res = data.dataAfter;
                    self.data = res;
                    break;
                case 'handleChangeIssueInSprint':
                    console.log("update task success");
                    break;
                default:
                    break;
            }
        });
    }
}
</script>

<style scoped>
.issue-item:hover{
    background: var(--symper-background-hover);
    cursor: pointer;
}
.sym-v-expand-content >>>.v-expansion-panel-content__wrap{
    padding-left: 2px;
    padding-right: 2px;
}
.v-expand-header{
    min-height: 40px;
}
.btn-action-sprint{
    flex:none!important;
}
.item-icon {
    padding-top:5px;
}
</style>