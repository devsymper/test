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
                <filterKanban 
                    :filters="filterProps"
                    @apply-filter="applyFilter"
                />
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
                    v-for="column in listColumn"
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
import { util } from '../../../plugins/util';
import symperAvatar from "@/components/common/SymperAvatar.vue";
import KanbanWorker from 'worker-loader!@/worker/taskManagement/kanban/Kanban.Worker.js';
import filterKanban from '../filter/Filter.vue';

export default {
    name: "KanbanBoard",
    components: {
        TaskCard,
        draggable,
        VuePerfectScrollbar,
        symperAvatar,
        filterKanban,
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
            return this.sTaskManagement.listColumnInBoard[idBoard];
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
                listStatus = util.cloneDeep(this.sTaskManagement.listStatusInProjects[this.projectId]);
            }
            return listStatus;
        },
        allIssueTypeInProject(){
            return this.sTaskManagement.listIssueTypeInProjects[this.projectId];
        },
        dataSprintAfterMapIssue(){
            return this.sTaskManagement.dataSprintAfterMapIssue[this.currentBoard.id];
        },
        currentBoard(){
            return this.$store.state.taskManagement.currentBoard;
        },
        sCurrentProject(){
            return this.$store.state.taskManagement.currentProject;
        },
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
        },
        currentBoard(after, before){
            if(after.id == before.id){
                return;
            }
            this.loadData();
        },
        sCurrentProject(after, before){
            if(after.id == before.id){
                return;
            }
            this.projectId = this.$route.params.id;
            this.kanbanWorker.postMessage({
                action:'getUserInProject',
                data:this.projectId
            });
        }
    },
    mounted(){
        this.settingBoardMenuitems = [
                { 
                    title: this.$t("taskManagement.settingBoard"),
                    menuAction: action => {
                        if (Object.keys(this.currentBoard).length > 0) {
                            this.$router.push("/task-management/projects/"+this.sCurrentProject.id+"/kanban-board/settings/" + this.currentBoard.id);
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
            flagGetListRoleUserInProject:false,  // gán cờ trạng thái: đã được gọi hàm hay chưa
            flagGetListOperatorInProject:false,  // gán cờ trạng thái: đã được gọi hàm hay chưa
            isGetListTask:false,
            kanbanWorker:null,
            projectId:null,
            listBoardColumn:null,
            settingBoardMenuitems: null,
            listUser:[],
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
                    }
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
            filterProps:{ // bộ lọc
                tmg_assignee : { 
                    title: "Thành viên",
                    type: "autocomplete",
                    value:"",
                    options: [],
                    validateStatus:{
                        isValid:true,
                        message:"Error"
                    },
                    validate(){
                      
                    }
                },
                tmg_status_id : {
                    title: "Trạng thái",
                    type: "autocomplete",
                    showId:false,
                    value:"",
                    options: [],
                    validateStatus:{
                        isValid:true,
                        message:""
                    },
                    validate(){
                    }
                },
                tmg_priority_id : {
                    title: "Mức độ ưu tiên",
                    type: "autocomplete",
                    value:"",
                    showId:false,
                    options: [],
                    validateStatus:{
                        isValid:true,
                        message:""
                    },
                    validate(){
                    }
                },
                tmg_issue_type : {
                    title: "Loại task vụ",
                    type: "autocomplete",
                    value:"",
                    showId:false,
                    options: [],
                    validateStatus:{
                        isValid:true,
                        message:""
                    },
                    validate(){
                    }
                }
            },
        };
    },
   
    methods:{
        applyFilter(){
            this.$emit('loading');
            if (this.currentBoard.type == "kanban") {
                var filter = util.cloneDeep(this.filter);
            }else{
                var filter = util.cloneDeep(this.filterScrum);
            }
            for (let name in this.filterProps) {
                if (this.filterProps[name].value) {
                    let item =   {
                        column : name,
                        operation : "and",
                        conditions : [
                            {
                                name : "in",
                                value : [this.filterProps[name].value],
                            }
                        ],
                    };
                    filter.filter.push(item);
                }
            }
            this.getListTasks(filter);
        },
        setDataForFilter(){
            //set list user
            let data = {};
            data.allUser = this.$store.state.app.allUsers;
            data.userInProject = this.listUser;
            data.allStatusInProject = this.sTaskManagement.listStatusInProjects[this.projectId];
            data.allPriority = this.sTaskManagement.allPriority;
            data.issueType = this.sCurrentProject.issueTypes;
            data.optionUser = this.filterProps.tmg_assignee.options;
            data.optionStatus = this.filterProps.tmg_status_id.options;
            data.optionPriority = this.filterProps.tmg_priority_id.options;
            data.optionIssueType = this.filterProps.tmg_issue_type.options;
            this.kanbanWorker.postMessage({
                action:'setDataForFilter',
                data: data
            });

        },
        checkUpdateTask(issue){
            if(issue.tmg_assignee == this.$store.state.app.endUserInfo.id){
                let data = {};
                data.projectId = this.sCurrentProject.id;
                data.listColumn = this.listColumn;
                data.issue = issue;
                this.kanbanWorker.postMessage({
                    action:'checkUpdateTaskToKanban',
                    data: data
                });
            }
            
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
        getUserPermission(){
            if (!this.sTaskManagement.listRoleUserInProject[this.projectId] || this.sTaskManagement.listRoleUserInProject[this.projectId].length == 0) {
                this.getListRoleUserInProject();
            }
            if (!this.sTaskManagement.listOperatorInProject[this.projectId] || this.sTaskManagement.listOperatorInProject[this.projectId].length == 0) {
                this.getListOperatorInProject();
            }
        },
        /**
         * Hàm lấy thông tin mapping của các trạng thái trong các cột
         * chỉ ra trạng thái nào được kết nối đến trạng thái nào
         */
        setMappingColumnDrag(){
            let allOperator = this.sTaskManagement.listOperatorInProject[this.projectId];
            let allNode = this.sTaskManagement.listStatusInProjects[this.projectId];
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
                dataSend.allIssueTypeInProject = this.sCurrentProject.issueTypes;
                dataSend.task = task;
                dataSend.status = status;
                this.kanbanWorker.postMessage({
                    action:'handleChangeStatusIssue',
                    data:dataSend
                });
            }
        },
        /**
         * tính toán chiều rộng cột kanban board
         */
        getColWidth(){
            let colLength = this.listColumn.length;
            if (colLength >= 4) {
                return {width:'320px'};
            }else{
                return {width:100/colLength + '%'};
            }
        },
        /**
         * Hàm lấy danh sách task hiên thị lên kanban board
         */
        getListTasks(filter = null){
            let data = {};
            data.listColumn = this.listColumn;
            data.allIssueTypeInProject =  this.sCurrentProject.issueTypes;
            if (this.currentBoard.type == "kanban") {
                if (!filter) {
                    let item = {
                        column : "tmg_assignee",
                        operation : "and",
                        conditions : [
                            {
                                name : "in",
                                value : [this.$store.state.app.endUserInfo.id],
                            }
                        ],
                    };
                    data.filter = util.cloneDeep(this.filter);
                    data.filter.filter.push(item);
                }else{
                    data.filter = filter;
                }
            }else{
                if (!filter) {
                    data.filter = util.cloneDeep(this.filterScrum);
                }else{
                    data.filter = filter;
                }
            }
            // đẩy xuống worker xử lý
            this.kanbanWorker.postMessage({
                action:'getListTasks',
                data:data
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
        getDataForBoard(){
            if (this.currentBoard.type == "scrum") {
                this.getListSprintInBoardScrum();
            }else{
                this.getListTasks();
            }
        },
        getListSprintInBoardScrum(){
            if (!this.sTaskManagement.dataSprintAfterMapIssue[this.currentBoard.id] || this.sTaskManagement.dataSprintAfterMapIssue[this.currentBoard.id].length == 0) {
                this.kanbanWorker.postMessage({
                    action:'getListSprintInBoard',
                    data:this.currentBoard.id
                });
            }else{
                this.getSprintRunning();
            }
        },
        getSprintRunning(){
            let listSprint = this.sTaskManagement.dataSprintAfterMapIssue[this.currentBoard.id];
            let sprintStart = listSprint.find(ele => ele.status == "running");
            if (sprintStart) {
                this.sprintStart = sprintStart;
                this.filterScrum.filter[0].conditions[0].value.push(sprintStart.id);
                this.getListTasks();
            }else{
                this.listBoardColumn = null;
                this.$emit('loaded-content');
            }
        },
        loadData(){
            this.$emit('loading');
            this.kanbanWorker.postMessage({
                action:'getDetailBoard',
                data:{boardId:this.currentBoard.id,
                allStatus: this.sTaskManagement.listStatusInProjects[this.sCurrentProject.id],
                projectId: this.sCurrentProject.id}
            });
        },
        addIssueClick(){
            this.$evtBus.$emit('add-issue-btn-click');
        },
        
       
    },
    created(){
        let self = this;
        this.$evtBus.$on('task-manager-submit-issue-success', (issue) =>{
            self.checkUpdateTask(issue);
        })
        this.kanbanWorker = new KanbanWorker();
        this.kanbanWorker.addEventListener("message", function (event) {
            let data = event.data;
            let dataToStore = {}
            switch (data.action) {
                case 'actionError':
                    self.$snotifyError("", "Update status error!");
                    break;
                
                case 'getUserInProject':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.listUser = res.data.listObject;
                        self.setDataForFilter();
                    } 
                    break;
                case 'handleChangeStatusIssue':
                    console.log("update task success");
                    break;
                case 'setNodeMap':
                    self.nodeMapPermission = data.dataAfter;
                    break;
                case 'getListTasks':
                    dataToStore = {key:self.currentBoard.id, data:Object.values(data.dataAfter)}
                    self.$store.commit("taskManagement/setListColumnInBoard",dataToStore);
                    self.$emit('loaded-content');
                    self.getUserPermission();
                    self.setDataForFilter();
                    break;
                case 'updateTaskToKanban':
                    dataToStore = {key:self.currentBoard.id, data:Object.values(data.dataAfter)}
                    self.$store.commit("taskManagement/setListColumnInBoard",dataToStore);
                    break;
              
                case 'getListRoleUserInProject':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        if (res.data.length == 0) {
                            self.$emit('loaded-content');
                        }
                        self.$store.commit("taskManagement/setListRoleUserInProject", res);
                    } 
                    break;
                case 'getListOperatorInProject':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit("taskManagement/setListOperatorInProject", res);
                        self.setMappingColumnDrag();
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
                case 'getDetailBoard':
                    dataToStore = {key:self.currentBoard.id, data:Object.values(data.dataAfter)}
                    self.$store.commit("taskManagement/setListColumnInBoard",dataToStore);
                    self.getDataForBoard()
                    break;
                case 'getListStatusInProject':
                    self.$store.commit("taskManagement/setListStautsInProject",{key:data.dataAfter.projectId, data:data.dataAfter.data});
                    break;
                case 'setDataForFilter':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        if (res.optionUser) {
                            self.$set(self.filterProps.tmg_assignee,'options',res.optionUser);
                        }
                        if (res.optionStatus) {
                            self.$set(self.filterProps.tmg_status_id,'options',res.optionStatus);
                        }
                        if (res.optionPriority) {
                            self.$set(self.filterProps.tmg_priority_id,'options',res.optionPriority);
                        }
                        if (res.optionIssueType) {
                            self.$set(self.filterProps.tmg_issue_type,'options',res.optionIssueType);
                        }
                    }
                    break;
                default:
                    break;
            }
        });
        this.loadData();
    },
    
    activated(){
        let breadcrumbs = [
                {
                    text: 'Kanban',
                    disabled: true
                },
            ]
        this.$store.commit("taskManagement/addToTaskManagementStore",{key:"headerBreadcrumbs",value:breadcrumbs})
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
    /* padding: 4px 0px; */
    text-align: center;
}
</style>
