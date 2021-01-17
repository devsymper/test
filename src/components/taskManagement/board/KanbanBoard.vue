<template>
    <div class="kanban-board-view h-100">
        <div class="kanban-board-view__header">
            <div class="left-content d-flex">
                <v-icon>mdi-view-dashboard-variant-outline</v-icon>
                <span v-if="currentBoard.type == 'kanban'" class="ml-2">Kanban Board</span>
                <div v-else>
                    <div v-if="Object.keys(sprintStart).length > 0">
                        <div style="height:25px;position:relative" >
                            <span class="ml-2" style=" font-size: 18px;font-weight: 500;">
                                Scrum Board {{sprintStart ? ': '+sprintStart.name :''}}
                            </span>
                            <v-btn style="position: absolute;top: -2px;" @click="completeSprint" small class="px-1" solo depressed >
                                <span class="fs-13">Complete sprint</span>
                            </v-btn>
                        </div>
                        <div class="pl-2 grey--text fs-11 text-ellipsis w-100">
                            {{sprintStart.description}}
                        </div>
                        <div class="pl-2 grey--text fs-11">
                            {{$t('table.startTime') + ":" + sprintStart.startTime}}  {{$t('table.endTime') + ":" + sprintStart.endTime}}
                        </div>
                    </div>
                    <div v-else>
                        <span class="ml-2" style=" font-size: 18px;font-weight: 500;">
                            Scrum Board
                        </span>
                    </div>
                    
                </div>
            </div>
            <div class="right-content">
                 <v-text-field
                    v-on:input="onSearch($event)"
                    class="sym-small-size sym-style-input d-inline-block mr-3"
                    append-icon="mdi-magnify"
                    solo
                    :placeholder="$t('common.search')"
                    hide-details
                ></v-text-field>
               
                <div class="list-user d-inline-block" v-for="(obj) in getUser()" :key="obj.id">
                    <span class="count-user" v-if="obj.count">{{obj.count}}+</span>
                    <symperAvatar v-else :size="22" class="user-avatar" :userId="obj.userId" />
                </div>
                <div class="ml-3 d-inline-block">
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon    
                                v-bind="attrs"
                                v-on="on">mdi-dots-horizontal</v-icon>
                         
                        </template>
                        <v-list dense>
                            <v-list-item
                                v-for="(item, index) in settingBoardMenuitems"
                                :key="index"
                                @click="item.menuAction(item)"
                            >
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>
            </div>
        </div>
        <VuePerfectScrollbar :key="currentBoard.id" class="wrap-scroll">
            <div class="wrap-kanban-board py-5 h-100">
                <div
                    v-for="column in listBoardColumn"
                    :key="column.id"
                    :style="getColWidth()"
                    class="board-column-item rounded mr-4"
                >
                    <p class="title-column">{{column.name}}</p>
                    <!-- Draggable component comes from vuedraggable. It provides drag & drop functionality -->
                    <VuePerfectScrollbar style="max-height: calc(100vh - 200px);" class="wrap-scroll-column">
                        <div v-for="(status, index) in column.statusInColumn"
                            :key="index"
                            class="mt-2 list-control-autocomplete"
                            :style="{
                                'border': (dragging && !nodeMapPermission[status.nodeId].disable) ? '2px dashed '+ status.color : '2px dashed #f2f2f2',
                                'min-height': (dragging) ? '50px' :''
                            }"
                        >
                            <p>{{status.name}} - {{status.taskLifeCircleName}}</p>
                            <draggable 
                            :disabled="nodeMapPermission[status.nodeId] ? nodeMapPermission[status.nodeId].disable : false"
                            :list="status.tasks" 
                            :animation="250"
                            @start="startMoveTask($event,status)" 
                            @end="endMoveTask"
                            @change="handleChange($event,status)"
                            ghost-class="ghost-card" group="tasks">
                                <!-- Each element from here will be draggable and animated. Note :key is very important here to be unique both for draggable and animations to be smooth & consistent. -->
                                <task-card
                                    v-for="(task) in status.tasks"
                                    :key="task.id"
                                    :task="task"
                                    :status="status"

                                    class="mt-3 cursor-move sym-control"
                                ></task-card>
                                <!-- </transition-group> -->
                            </draggable>

                        </div>
                    </VuePerfectScrollbar>
                    <div class="text-center mt-2">
                        <v-btn @click="addIssueClick" depressed height="25">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </div>
                    
                </div>
            </div>
        </VuePerfectScrollbar>
    </div>

</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import draggable from "vuedraggable";
import TaskCard from "@/components/taskManagement/board/TaskCard.vue";
import { taskManagementApi } from "@/api/taskManagement.js";
import { util } from '../../../plugins/util';
import { documentApi } from "@/api/Document.js";
import symperAvatar from "@/components/common/SymperAvatar.vue";
import KanbanWorker from 'worker-loader!@/worker/taskManagement/kanban/Kanban.Worker.js';

export default {
    name: "KanbanBoard",
    components: {
        TaskCard,
        draggable,
        VuePerfectScrollbar,
        symperAvatar
    },
    computed:{
        listBoard(){
            return this.$store.state.taskManagement.listBoardInProject;
        },
        sTaskManagement() {
            return this.$store.state.taskManagement;
        },
        listColumn(){
            if (!this.currentBoard.id) {
                return [];
            }
            let idBoard=this.currentBoard.id;
            let arrColumn = [];
            if (this.sTaskManagement.listColumnInBoard[idBoard] && this.sTaskManagement.listColumnInBoard[idBoard].length >= 0 ) {
                let columns = util.cloneDeep(this.sTaskManagement.listColumnInBoard[idBoard]);
                for (let i = 0; i < columns.length; i++) {
                    if (columns[i].isHidden == 0 && columns[i].isBacklog == 0) {
                        let obj={};
                        obj.statusInColumn = [];
                        obj.name = columns[i].name;
                        obj.id = columns[i].id;
                        arrColumn.push(obj);
                    }
                }
            }
            return arrColumn;
        },
        listStatusColumn(){
            if (!this.currentBoard.id) {
                return [];
            }
            let idBoard=this.currentBoard.id;
            let listStatusColumn = [];
            if (this.sTaskManagement.listStatusInColumnBoard[idBoard] && this.sTaskManagement.listStatusInColumnBoard[idBoard].length >= 0 ) {
                listStatusColumn = util.cloneDeep(this.sTaskManagement.listStatusInColumnBoard[idBoard]);
            }
            return listStatusColumn;
        },
        listStatus(){
            let listStatus = [];
            if (this.sTaskManagement.listStatusInProjects[this.projectId] && this.sTaskManagement.listStatusInProjects[this.projectId].length >= 0 ) {
                listStatus = util.cloneDeep(this.$store.state.taskManagement.listStatusInProjects[this.projectId]);
            }
            return listStatus;
        },
        allIssueTypeInProject(){
            return this.$store.state.taskManagement.listIssueTypeInProjects[this.projectId];
        },
        dataSprintAfterMapIssue(){
            return this.$store.state.taskManagement.dataSprintAfterMapIssue[this.currentBoard.id];
        }
    },
    watch:{
        dataSprintAfterMapIssue:{
            deep:true,
            immediate:true,
            handler(val){
                if (val) {
                    this.getListTasks(true);
                }
            }
        }
    },
    mounted(){
        this.settingBoardMenuitems = [
                { 
                    title: this.$t("taskManagement.settingBoard"),
                    menuAction: action => {
                        if (Object.keys(this.currentBoard).length > 0) {
                            this.$router.push("/task-management/projects/"+this.projectId+"/kanban-board/settings/" + this.currentBoard.id);
                        }else{
                            console.log("Chưa có data");
                        }
                    },
                },
            ]
    },
    data() {
        let self = this;
        return {
            sprintStart:{},
            flagGetListStatusInProject:false,  // gán cờ trạng thái: đã được gọi hàm hay chưa
            flagGetListColumnInBoard:false,  // gán cờ trạng thái: đã được gọi hàm hay chưa
            flagGetListStatusInColumnBoard:false,  // gán cờ trạng thái: đã được gọi hàm hay chưa
            flagGetListIssueTypeInProjects:false,  // gán cờ trạng thái: đã được gọi hàm hay chưa
            flagGetListRoleUserInProject:false,  // gán cờ trạng thái: đã được gọi hàm hay chưa
            flagGetListOperatorInProject:false,  // gán cờ trạng thái: đã được gọi hàm hay chưa
            isGetListTask:false,
            kanbanWorker:null,
            projectId:null,
            listBoardColumn:null,
            settingBoardMenuitems: null,
            listUser:[],
            currentBoard:{},
            dragging:false,
            nodeMapPermission:{},
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
            filterScrum:{
                ids: null,
                filter:[
                    {
                        column : "tmg_sprint_id",
                        operation : "and",
                        conditions : [
                            {
                                name : "in",
                                value : [],
                            }
                        ],
                    },
                ],
                page : 1,
                pageSize: 500,
                distinct: true
            },
        };
    },
   
    methods:{
        checkUpdateTask(issue){
            let data = {};
            data.projectId = this.projectId;
            data.listBoardColumn = this.listBoardColumn;
            data.issue = issue;
            this.kanbanWorker.postMessage({
                action:'checkUpdateTaskToKanban',
                data: data
            });
        },
        onSearch(vl){
            let val = vl;
            $('.list-control-autocomplete .sym-control').removeClass('d-none');
            $('.list-control-autocomplete .sym-control:not(:Contains("' + val + '"))').addClass('d-none');
        },
        completeSprint(){
            let data={};
            data.name=this.sprintStart.name;
            data.description=this.sprintStart.description;
            data.status='done';
            data.startTime=this.sprintStart.startTime;
            data.endTime=this.sprintStart.endTime;

            // đẩy xuống worker xử lý
            this.kanbanWorker.postMessage({
                action:'handleUpdateSprint',
                data:{id:this.sprintStart.id,data:data}
            });
        },
        getHeightFrameDrag(event, statusLength){
            let parentFrameEl = $(event.target).closest('.wrap-scroll-column');
            let h = parentFrameEl.height();
            return h/statusLength + 'px';
        },
        startMoveTask(event,status){
            this.dragging = true;
            for (const key in this.nodeMapPermission) {
                if (key == status.nodeId) {
                    continue ;
                }
                $(event.target).find('.sym-control').addClass('item-dragging');

                let arrAllowTo = this.nodeMapPermission[key].allowTo;
                let isCheck = arrAllowTo.indexOf(status.nodeId);
                if (isCheck == -1) {
                    this.nodeMapPermission[key].disable = true;
                }else{ // check them role
                    let allRoleUser = this.sTaskManagement.listRoleUserInProject[this.projectId];
                    let hasRole = false;
                    if (this.nodeMapPermission[key].permission.length > 0) {
                        for (let i = 0; i < allRoleUser.length; i++) {
                            let checkRole = this.nodeMapPermission[key].permission.indexOf(allRoleUser[i].roleId);
                            if (checkRole > -1) {
                                hasRole = true;
                                break;
                            }                       
                        }   
                    }else{
                        hasRole = true;
                    }
                    if (!hasRole) {
                        this.nodeMapPermission[key].disable = true;
                    }

                    $('.list-control-autocomplete .sym-control:not(.item-dragging)').addClass('d-none');
                }
            }
        },
        endMoveTask(){
            this.dragging = false;
            for (const key in this.nodeMapPermission) {
                this.nodeMapPermission[key].disable = false;
            }
            $('.list-control-autocomplete .sym-control').removeClass('d-none').removeClass('item-dragging');

        },
        /**
         * 
         */
        setNodeMap(){
            let allOperator = this.$store.state.taskManagement.listOperatorInProject[this.projectId];
            let allNode = this.$store.state.taskManagement.listStatusInProjects[this.projectId];
            if (allOperator.length > 0 && allNode.length > 0) {
                let data = {};
                data.allOperator = allOperator;
                data.allNode = allNode;
                this.kanbanWorker.postMessage({
                    action:'setNodeMap',
                    data:data
                });
            }

        },
        getUser(){
            if (this.listUser.length > 1) {
                let arr = this.listUser.slice(0,2);
                arr.push({count:this.listUser.length - arr.length});
                return arr;    
            }
            return this.listUser;
        },
        handleChange(event, status){
            if(event.added){
                let task = event.added.element;
                let dataSend = {};
                dataSend.allIssueTypeInProject = this.allIssueTypeInProject;
                dataSend.task = task;
                dataSend.status = status;

                this.kanbanWorker.postMessage({
                    action:'handleChangeStatusIssue',
                    data:dataSend
                });
            }
        },
        
        setBoard(board){
            this.currentBoard = board;
            this.$store.commit("taskManagement/setCurrentBoard",board);
        },
        /**
         * tính toán chiều rộng cột kanban board
         */
        getColWidth(){
            let colLength = this.listBoardColumn.length;
            if (colLength >= 4) {
                return {width:'320px'};
            }else{
                return {width:100/colLength + '%'};
            }
        },
        /**
         * Hàm lấy danh sách task hiên thị lên kanban board
         */
        getListTasks(isCheck = false){
            if (!isCheck) {
                this.isGetListTask = true;
            }
            let data = {};
            data.listColumn = this.listColumn;
            data.listStatusColumn = this.listStatusColumn;
            data.listStatus = this.listStatus;
            data.allIssueTypeInProject =  this.allIssueTypeInProject;
            data.boardType = this.currentBoard.type;
            if (this.currentBoard.type == "kanban") {
                data.filter = this.filter;
            }else{
                data.filter = this.filterScrum;
            }
            // đẩy xuống worker xử lý
            this.kanbanWorker.postMessage({
                action:'getListTasks',
                data:data
            });
        },
        getListBoard(){
            this.kanbanWorker.postMessage({
                action:'getListBoard',
                data:this.projectId
            });
        },
        getListStatusInProject(){
            if (this.flagGetListStatusInProject) {
                return;
            }
            this.kanbanWorker.postMessage({
                action:'getListStatusInProject',
                data:this.projectId
            });
        },
        getListColumnInBoard(idBoard){
            if (this.flagGetListColumnInBoard) {
                return;
            }
            this.kanbanWorker.postMessage({
                action:'getListColumnInBoard',
                data:idBoard
            });
        },
        getListStatusInColumnBoard(idBoard){
            if (this.flagGetListStatusInColumnBoard) {
                return;
            }
            this.kanbanWorker.postMessage({
                action:'getListStatusInColumnBoard',
                data:idBoard
            });
        },
        getListIssueTypeInProjects(){
            if (this.flagGetListIssueTypeInProjects) {
                return;
            }
            this.kanbanWorker.postMessage({
                action:'getListIssueTypeInProjects',
                data:this.projectId
            });
        },
        getListRoleUserInProject(){
            if (this.flagGetListRoleUserInProject) {
                return;
            }
            this.kanbanWorker.postMessage({
                action:'getListRoleUserInProject',
                data:this.projectId
            });
        },
        getListOperatorInProject(){
            if (this.flagGetListOperatorInProject) {
                return;
            }
            this.kanbanWorker.postMessage({
                action:'getListOperatorInProject',
                data:this.projectId
            });
        },  
        getMoreData(){
            let self = this;
            let idBoard = this.currentBoard.id;
            if (!this.sTaskManagement.listStatusInProjects[this.projectId] || this.sTaskManagement.listStatusInProjects[this.projectId].length == 0) {
                self.getListStatusInProject();
                this.flagGetListStatusInProject = true;
            }
            if (!this.sTaskManagement.listColumnInBoard[idBoard] || this.sTaskManagement.listColumnInBoard[idBoard].length == 0) {
                self.getListColumnInBoard(idBoard);
                this.flagGetListColumnInBoard = true;
            }
            if (!this.sTaskManagement.listStatusInColumnBoard[idBoard] || this.sTaskManagement.listStatusInColumnBoard[idBoard].length == 0) {
                self.getListStatusInColumnBoard(idBoard);
                this.flagGetListStatusInColumnBoard = true;
            }
            if(!this.sTaskManagement.listIssueTypeInProjects[this.projectId] ||  this.sTaskManagement.listIssueTypeInProjects[this.projectId].length == 0){
                self.getListIssueTypeInProjects();
                this.flagGetListIssueTypeInProjects = true;
            }
            if (!this.sTaskManagement.listRoleUserInProject[this.projectId] || this.sTaskManagement.listRoleUserInProject[this.projectId].length == 0) {
                self.getListRoleUserInProject();
                this.flagGetListRoleUserInProject = true;
            }
            if (!this.sTaskManagement.listOperatorInProject[this.projectId] || this.sTaskManagement.listOperatorInProject[this.projectId].length == 0) {
                self.getListOperatorInProject();
                this.flagGetListOperatorInProject = true;

            }
            if (!self.isGetListTask && self.sTaskManagement.listStatusInProjects[self.projectId] && self.sTaskManagement.listStatusInProjects[self.projectId].length > 0 &&
                self.sTaskManagement.listColumnInBoard[idBoard] && self.sTaskManagement.listColumnInBoard[idBoard].length > 0 &&
                self.sTaskManagement.listStatusInColumnBoard[idBoard] && self.sTaskManagement.listStatusInColumnBoard[idBoard].length > 0 &&
                self.sTaskManagement.listIssueTypeInProjects[self.projectId] &&  self.sTaskManagement.listIssueTypeInProjects[self.projectId].length > 0
            ) {
                self.getListTasks();
            }
          
        },
        getDataForBoard(board=null){
            let self = this;
            
            if (board) {
                this.currentBoard = board;
            }else{
                if (Object.keys(this.$store.state.taskManagement.currentBoard).length > 0 && this.$store.state.taskManagement.currentBoard.projectId == this.projectId) {
                        this.currentBoard = this.$store.state.taskManagement.currentBoard;
                }else{
                    let allBoard = this.listBoard;
                    if (allBoard.length>0) {
                        this.currentBoard = allBoard[0];  
                    }
                }
             
            }
            let idBoard = this.currentBoard.id;
            self.$store.commit("taskManagement/setCurrentBoard",this.currentBoard);
            if (this.currentBoard.type == "scrum") {
                this.getListSprintInBoardScrum();
            }else{
                this.getMoreData();
            }
        },
        getListSprintInBoardScrum(){
            if (!this.$store.state.taskManagement.dataSprintAfterMapIssue[this.currentBoard.id] || this.$store.state.taskManagement.dataSprintAfterMapIssue[this.currentBoard.id].length == 0) {
                this.kanbanWorker.postMessage({
                    action:'getListSprintInBoard',
                    data:this.currentBoard.id
                });
            }else{
                this.getSprintRunning();
            }
        },
        getSprintRunning(){
            let listSprint = this.$store.state.taskManagement.dataSprintAfterMapIssue[this.currentBoard.id];
            let sprintStart = listSprint.find(ele => ele.status == "running");
            if (sprintStart) {
                this.sprintStart = sprintStart;
                this.filterScrum.filter[0].conditions[0].value.push(sprintStart.id);
                this.getMoreData();
            }else{
                this.listBoardColumn = null;
                this.$emit('loaded-content');
            }
        },
        getUserInProject(){
            this.kanbanWorker.postMessage({
                action:'getUserInProject',
                data:this.projectId
            });
        },
        getListWorkflowInProject(){
            this.kanbanWorker.postMessage({
                action:'getListWorkflowInProject',
                data:this.projectId
            });
        },
        getListDocumentIdsInProject(){
            this.kanbanWorker.postMessage({
                action:'getListDocumentIdsInProject',
                data:this.projectId
            });
        },
        getDetailProject(){
            this.kanbanWorker.postMessage({
                action:'getDetailProject',
                data:this.projectId
            });
        },
        loadData(){
            let self = this;
            this.projectId = this.$route.params.id;
            this.getListBoard();
            this.getUserInProject();
            this.getListWorkflowInProject();
            if (!this.sTaskManagement.listDocumentIdsInProject[this.projectId] || this.sTaskManagement.listDocumentIdsInProject[this.projectId].length == 0) {
                this.getListDocumentIdsInProject();
            }
            let breadcrumbs = [
                    {
                        text: 'Kanban',
                        disabled: true
                    },
                ]
            this.$store.commit("taskManagement/addToTaskManagementStore",{key:"headerBreadcrumbs",value:breadcrumbs})
            if (this.projectId) {
                let allProject=this.sTaskManagement.allProject;
                let project=allProject.find(element => element.id==this.projectId);
                if (project) {
                    self.$store.commit("taskManagement/setCurrentProject", project);
                }else{ // call api get detail project
                    self.getDetailProject();
                }
            }
        },
        addIssueClick(){
            this.$evtBus.$emit('add-issue-btn-click');
        }
       
    },
    created(){
        let self = this;
        this.$evtBus.$on('task-manager-submit-issue-success', (issue) =>{
            console.log("issue-create",issue);
            self.checkUpdateTask(issue);
        })
        this.$evtBus.$on('selected-item-board', (board) =>{
            self.flagGetListOperatorInProject = false;
            self.flagGetListRoleUserInProject = false;
            self.flagGetListIssueTypeInProjects = false;
            self.flagGetListStatusInProject = false;
            self.flagGetListStatusInColumnBoard = false;
            self.flagGetListColumnInBoard = false;
            self.isGetListTask = false;
            self.$emit('loading');
            self.getDataForBoard(board);
            setTimeout(() => {
                self.$emit('loaded-content');
            }, 500);
        });
        this.$evtBus.$on('task-manager-change-project', () =>{
            self.flagGetListOperatorInProject = false;
            self.flagGetListRoleUserInProject = false;
            self.flagGetListIssueTypeInProjects = false;
            self.flagGetListStatusInProject = false;
            self.flagGetListStatusInColumnBoard = false;
            self.flagGetListColumnInBoard = false;
            self.isGetListTask = false;
            self.loadData();
        })
        
        this.kanbanWorker = new KanbanWorker();
        this.kanbanWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'actionError':
                    self.$snotifyError("", "Update status error!");
                    break;
                case 'getListBoard':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit("taskManagement/setListBoardInProject", res.data.listObject);
                        self.getDataForBoard();
                    } 
                    break;
                case 'getUserInProject':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.listUser = res.data.listObject;
                    } 
                    break;
                case 'handleChangeStatusIssue':
                    console.log("update task success");
                    break;
                case 'setNodeMap':
                    self.nodeMapPermission = data.dataAfter;
                    break;
                case 'getListTasks':
                    self.listBoardColumn = data.dataAfter;
                    self.$emit('loaded-content');
                    self.setNodeMap();
                    break;
                case 'updateTaskToKanban':
                    self.listBoardColumn = data.dataAfter;
                    break;
                case 'getListWorkflowInProject':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit('taskManagement/setAllWorkflow', res.data.listObject);
                    } 
                    break;
                case 'getListDocumentIdsInProject':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit('taskManagement/setListDocumentIdsInProject', res);
                    } 
                    break;
                case 'getDetailProject':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit("taskManagement/setCurrentProject", res.data);
                    } 
                    break;
                case 'getListStatusInProject':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit("taskManagement/setListStautsInProject", res);
                        self.getMoreData();
                    } 
                    break;
                case 'getListColumnInBoard':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        if (res.data.length == 0) {
                            self.$emit('loaded-content');
                        }
                        self.$store.commit("taskManagement/setListColumnInBoard", res);
                        self.getMoreData();
                    } 
                    break;
                case 'getListStatusInColumnBoard':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        if (res.data.length == 0) {
                            self.$emit('loaded-content');
                        }
                        self.$store.commit("taskManagement/setListStatusInColumnBoard", res);
                        self.getMoreData();
                    } 
                    break;
                case 'getListIssueTypeInProjects':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit("taskManagement/setListIssueTypeInProjects", res);
                        self.getMoreData();
                    } 
                    break;
                case 'getListRoleUserInProject':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        if (res.data.length == 0) {
                            self.$emit('loaded-content');
                        }
                        self.$store.commit("taskManagement/setListRoleUserInProject", res);
                        self.getMoreData();
                    } 
                    break;
                case 'getListOperatorInProject':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit("taskManagement/setListOperatorInProject", res);
                        self.getMoreData();
                    } 
                    break;
                case 'getListSprintInBoard':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit("taskManagement/setListDataSprintAfterAfterMapIssue", res);
                        self.getSprintRunning();
                    }
                    break;
                case 'handleUpdateSprint':
                    self.$snotifySuccess("Complete sprint!");
                    self.sprintStart.status = 'done';
                    self.$store.commit("taskManagement/updateSprintToListInStore",self.sprintStart);
                    break;
                default:
                    break;
            }
        });

    },
    
    activated(){
        this.loadData()
    }
};
</script>

<style scoped>
.kanban-board-view__header{
    height: 50px;
    display: flex;
}
.wrap-scroll{
    height: calc(100% - 50px);
}
.board-column-item {
    min-width: 320px;
    display: table;
    background: var(--symper-background-default);
    padding: 8px;
    transition: all ease-in-out 300ms;
}
.ghost-card {
  opacity: 0.5;
  background: #F7FAFC;
  border: 1px solid #4299e1;
}
.wrap-kanban-board{
    display: flex;
    flex: 1 1 auto;
    max-width: 100%;
}
.left-content{
    padding: 12px 0;
}
.left-content span{
    font-size: 18px;
    font-weight: 500;
}
.right-content{
    padding: 8px;
    margin-left: auto;
}
.user-in-project{
    height: 24px;
    width: 24px;
    border-radius: 50%;
    margin-right: -4px;
}
.list-user{
    vertical-align: middle;
}
.title-column{
    font-weight: 500;
    font-size: 15px;
}
.sym-style-input >>> .v-input__slot{
    box-shadow: none !important;
}
.user-avatar{
    margin-left: -6px;
    box-shadow: var(--symper-box-shadow);
}
.list-user:nth-child(4){
    border-radius: 50%;
    background: #f2f2f2;
    width: 24px;
    height: 24px;
    padding: 4px 0px;
    text-align: center;
}
</style>
