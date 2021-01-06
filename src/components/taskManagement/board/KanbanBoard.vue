<template>
    <div class="kanban-board-view h-100">
        <div class="kanban-board-view__header">
            <div class="left-content">
                <v-icon>mdi-view-dashboard-variant-outline</v-icon>
                <span>Kanban Board</span>
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
            <div class="wrap-kanban-board py-4 h-100">
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
        return {
            projectId:null,
            listBoardColumn:null,
            settingBoardMenuitems: null,
            listUser:[],
            currentBoard:{},
            dragging:false,
            nodeMapPermission:{},
        };
    },
   
    methods:{
        onSearch(vl){
            let val = vl;
            $('.list-control-autocomplete .sym-control').removeClass('d-none');
            $('.list-control-autocomplete .sym-control:not(:Contains("' + val + '"))').addClass('d-none');
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
                for (let i = 0; i < allOperator.length; i++) {
                    if (allOperator[i].tmg_to_status_id) {
                        if (!this.nodeMapPermission[allOperator[i].tmg_to_status_id]) {
                            this.nodeMapPermission[allOperator[i].tmg_to_status_id] = {};
                            this.nodeMapPermission[allOperator[i].tmg_to_status_id]["allowTo"] = [];
                            this.nodeMapPermission[allOperator[i].tmg_to_status_id]["permission"] = [];
                            this.nodeMapPermission[allOperator[i].tmg_to_status_id]["disable"] = false;
                        }
                    
                        let node = allNode.find(ele => ele.nodeId == allOperator[i].tmg_to_status_id);
                        // get role cho node
                        if (node) {
                            if (node.roleIds.length > 10) {
                                this.nodeMapPermission[allOperator[i].tmg_to_status_id]["permission"] = JSON.parse(node.roleIds);
                            }
                        }
                        // get status được phép chuyển trạng thái đến
                        if (allOperator[i].tmg_from_status_id) {
                            if (this.nodeMapPermission[allOperator[i].tmg_to_status_id]["allowTo"].indexOf(allOperator[i].tmg_from_status_id) == -1) {
                                this.nodeMapPermission[allOperator[i].tmg_to_status_id]["allowTo"].push(allOperator[i].tmg_from_status_id);
                            }
                        }else{ // trường hợp cho phép all, add hết status cùng task life circle
                            let taskLifeCircleId = allOperator[i].tmg_task_life_circle_id;
                            let listNodeInTaskLifeCircle =  allNode.filter( node =>{
                                return node.taskLifeCircleId == taskLifeCircleId;
                            });

                            if (listNodeInTaskLifeCircle.length > 0) {
                                for (let j = 0; j < listNodeInTaskLifeCircle.length; j++) {
                                    if (this.nodeMapPermission[allOperator[i].tmg_to_status_id]["allowTo"].indexOf(listNodeInTaskLifeCircle[j].nodeId) == -1) {
                                        this.nodeMapPermission[allOperator[i].tmg_to_status_id]["allowTo"].push(listNodeInTaskLifeCircle[j].nodeId);
                                    }
                                }
                            }
                        }
                    }
                }
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
                let dataPost ={};
                let dataControl ={};
                let issueType = this.allIssueTypeInProject.find(ele => ele.id == task.tmg_issue_type);
                if (issueType) {
                    dataPost['documentId'] = issueType.documentId;
                }
                
                dataControl.tmg_status_id = status.statusId;
                dataControl.tmg_status_category_id = status.statusCategoryId;
                dataControl.tmg_status = status.name;
                dataPost['documentObjectWorkflowObjectId'] = "";
                dataPost['documentObjectWorkflowId'] = "";
                dataPost['documentObjectTaskId'] = "";
                dataPost['dataControl'] = JSON.stringify(dataControl);
               
                documentApi.updateDocument(task.document_object_id,dataPost).then(res => {
                    if (res.status == 200) {
                        console.log("update task success");
                    }else{
                        this.$snotifyError("", "Update status error!");
                    }
                })

                
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
        async getListTasks(){
            let documentId = this.allIssueTypeInProject.reduce((arr,obj)=>{
                if(!arr.includes(obj.documentId)){
                    if (obj.documentId) {
                        arr.push(obj.documentId)
                    }
                }
                return arr
            },[])
            let allTask = await documentApi.getListObjectByMultipleDocument({ids:JSON.stringify(documentId)})
            allTask = allTask['data']['listObject'];
            let columns = this.listColumn;
            if (this.listStatus.length > 0 ) {
                for (let i = 0; i < this.listStatusColumn.length; i++) {
                    let idColumn = this.listStatusColumn[i].columnId;
                    let statusId = this.listStatusColumn[i].statusId;
                    let taskLifeCircleId = this.listStatusColumn[i].taskLifeCircleId;
                    let item = this.listStatus.find(ele => ele.statusId == statusId &&  ele.taskLifeCircleId == taskLifeCircleId );
                    if (item) {
                        let taskInStatus = allTask.filter(task=>{
                            return task.tmg_status_id == statusId && task.tmg_task_life_circle_id == taskLifeCircleId;
                        })
                        item['tasks'] = taskInStatus;
                        let column = columns.find(ele => ele.id == idColumn);
                        if (column) {
                            column.statusInColumn.push(item);
                        }
                    }
                }  
            }
            this.listBoardColumn = columns;
            this.$emit('loaded-content');
            this.setNodeMap();
        },
        async getListBoard(){
            let res = await taskManagementApi.getListBoardInProject(this.projectId) ;
            if (res.status == 200) {
                this.$store.commit("taskManagement/setListBoardInProject", res.data.listObject);
            }
            this.getDataForBoard();
        },
        async getDataForBoard(board=null){
            let self = this;
            if (board) {
                this.currentBoard = board;
            }else{
                let allBoard = this.listBoard;
                if (allBoard.length>0) {
                    this.currentBoard = allBoard[0];  
                }
            }
            self.$store.commit("taskManagement/setCurrentBoard",this.currentBoard);
          
            let idBoard = this.currentBoard.id;

            if (!this.sTaskManagement.listStatusInProjects[this.projectId] || this.sTaskManagement.listStatusInProjects[this.projectId].length == 0) {
                await this.$store.dispatch("taskManagement/getListStautsInProject", this.projectId);
            }
            if (!this.sTaskManagement.listColumnInBoard[idBoard] || this.sTaskManagement.listColumnInBoard[idBoard].length == 0) {
                await this.$store.dispatch("taskManagement/getListColumnInBoard",idBoard);
            }
            if (!this.sTaskManagement.listStatusInColumnBoard[idBoard] || this.sTaskManagement.listStatusInColumnBoard[idBoard].length == 0) {
                await this.$store.dispatch("taskManagement/getListStatusInColumnBoard",idBoard);
            }
            if(!this.allIssueTypeInProject){
                await this.$store.dispatch("taskManagement/getListIssueTypeInProjects", this.projectId);
            }
            if (!this.sTaskManagement.listRoleUserInProject[this.projectId] || this.sTaskManagement.listRoleUserInProject[this.projectId].length == 0) {
                await this.$store.dispatch("taskManagement/getListRoleUserInProject",this.projectId);
            }
            if (!this.sTaskManagement.listOperatorInProject[this.projectId] || this.sTaskManagement.listOperatorInProject[this.projectId].length == 0) {
                await this.$store.dispatch("taskManagement/getListOperatorInProject",this.projectId);
            }
            this.getListTasks();
        },
        async getUserInProject(){
            let self=this;
            let projectId=this.$route.params.id;
            let list = await taskManagementApi.getUserInProject(projectId);
            if (list.status == 200 && list.data) {
                self.listUser = list.data.listObject;
            }
        },
        loadData(){
            this.projectId = this.$route.params.id;
            this.getListBoard();
            this.getUserInProject();
            this.$store.dispatch("taskManagement/getListWorkflowInProject",this.projectId);

            if (!this.sTaskManagement.listDocumentIdsInProject[this.projectId] || this.sTaskManagement.listDocumentIdsInProject[this.projectId].length == 0) {
                this.$store.dispatch("taskManagement/getListDocumentIdsInProject",this.projectId);
            }
            
            let breadcrumbs = [
                    {
                        text: 'Kanban',
                        disabled: true
                    },
                ]
            this.$store.commit("taskManagement/addToTaskManagementStore",{key:"headerBreadcrumbs",value:breadcrumbs})
            let self = this;
            if (this.projectId) {
                let allProject=this.sTaskManagement.allProject;
                let project=allProject.find(element => element.id==this.projectId);
                if (project) {
                    self.$store.commit("taskManagement/setCurrentProject", project);
                }else{ // call api get detail project
                    taskManagementApi
                        .getDetailProject(this.projectId)
                        .then(res => {
                            if (res.status == 200) {
                                self.$store.commit("taskManagement/setCurrentProject", res.data);
                            }else{
                                self.$snotifyError("", "Can not get detail project with id:"+this.projectId);
                            }
                        })
                        .catch(err => {
                            self.$snotifyError("", "Can not get detail project with id:"+this.projectId);
                        })
                        .always(() => {});
                }
            }
        },
        addIssueClick(){
            this.$evtBus.$emit('add-issue-btn-click');
        }
       
    },
    created(){
        let self = this;
        this.$evtBus.$on('selected-item-board', (board) =>{
            self.$emit('loading');
            self.getDataForBoard(board);
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
    margin-left: 8px;
}
.left-content .mdi{
    margin-bottom: 5px;
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
