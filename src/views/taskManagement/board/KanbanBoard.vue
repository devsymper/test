<template>
    <div class="kanban-board-view h-100">
        <div class="kanban-board-view__header">
            <div class="left-content">
                <v-icon>mdi-view-dashboard-variant-outline</v-icon>
                <span>Kanban Board</span>
            </div>
            <div class="right-content">
                 <v-text-field
                 class="sym-small-size sym-style-input d-inline-block mr-3"
                    append-icon="mdi-magnify"
                    solo
                    :placeholder="$t('common.search')"
                    hide-details
                ></v-text-field>
                <div class="list-user d-inline-block" v-for="(obj) in listUser" :key="obj.id">
                    <symperAvatar :size="22" class="user-avatar" :userId="obj.userId" />
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
        <VuePerfectScrollbar class="wrap-scroll">
            <div class="wrap-kanban-board py-4 h-100">
                <div
                    v-for="column in listBoardColumn"
                    :key="column.id"
                    :style="getColWidth()"
                    class="board-column-item rounded mr-4"
                >
                    <p class="title-column">{{column.name}}</p>
                    <!-- Draggable component comes from vuedraggable. It provides drag & drop functionality -->
                    <VuePerfectScrollbar style="max-height: calc(100vh - 200px);">
                        <div v-for="(status, index) in column.statusInColumn"
                            :key="index"
                            class="mt-2"
                            :style="{
                                'border': (dragging) ? '2px dashed '+ status.color : '2px dashed #f2f2f2'
                            }"
                        >
                            <p>{{status.name}}-{{status.taskLifeCircleName}}</p>
                            <draggable :list="status.tasks" :animation="250" 
                            @start="dragging=true" @end="dragging=false"
                            ghost-class="ghost-card" group="tasks">
                                <!-- Each element from here will be draggable and animated. Note :key is very important here to be unique both for draggable and animations to be smooth & consistent. -->
                                <task-card
                                    v-for="(task) in status.tasks"
                                    :key="task.id"
                                    :task="task"
                                    class="mt-3 cursor-move"
                                ></task-card>
                                <!-- </transition-group> -->
                            </draggable>

                        </div>
                    </VuePerfectScrollbar>
                    <div class="text-center mt-2">
                        <v-btn depressed height="25">
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
        currentBoard(){
            return this.boardCurrent;
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
            listUser:null,
            tasks: [
                {
                    id: 14,
                    title: "Add discount code to checkout page",
                    date: "Sep 14",
                    issueType:{
                        icon:'mdi-tools'
                    },
                    priority:{
                        icon:'mdi-tools'
                    }
                },
            ],
            boardCurrent:{},
            dragging:false
        };
    },
   
    methods:{
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
                    arr.push(obj.documentId)
                }
                return arr
            },[])
            let allTask = await documentApi.getListObjectByMultipleDocument({ids:JSON.stringify(documentId)})
            allTask = allTask['data']['listObject'];
            let columns = this.listColumn;
            if (this.listStatus.length > 0 ) {
                for (let i = 0; i < this.listStatusColumn.length; i++) {
                    let idColumn = this.listStatusColumn[i].columnId;
                    let statusRoleId = this.listStatusColumn[i].statusRoleId;
                    let item = this.listStatus.find(ele => ele.statusRoleId == statusRoleId);
                    if (item) {
                        let statusId = item.statusId;
                        let taskInStatus = allTask.filter(task=>{
                            return task.tmg_status_id == statusId;
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
        },
        async getListBoard(){
            let res = await taskManagementApi.getListBoardInProject(this.projectId) ;
            if (res.status == 200) {
                this.$store.commit("taskManagement/setListBoardInProject", res.data.listObject);
            }
            this.getDataForBoard();
        },
        async getDataForBoard(){
            let allBoard = this.listBoard;
            if (allBoard.length>0) {
                this.boardCurrent = allBoard[0];  
            }
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
            this.getListTasks();
        },
        async getUserInProject(){
            let self=this;
            let projectId=this.$route.params.id;
            let list = await taskManagementApi.getUserInProject(projectId);
            if (list.status == 200 && list.data) {
                self.listUser = list.data.listObject;
            }
        }
       
    },
    created(){
        let self = this;
        this.$evtBus.$on('selected-item-board', (data) =>{
			if (data.id) {
                self.boardCurrent=data;
			}
        });
        
    },
    activated(){
        this.projectId = this.$route.params.id;
        this.getListBoard();
        this.getUserInProject();
   
        if (!this.sTaskManagement.listDocumentIdsInProject[this.projectId] || this.sTaskManagement.listDocumentIdsInProject[this.projectId].length == 0) {
            this.$store.dispatch("taskManagement/getListDocumentIdsInProject",this.projectId);
        }
        
        let breadcrumbs = [
                {
                    text: 'Dashboard',
                    disabled: true,
                    to: '/report',
                },
                {
                    text: 'test kanban',
                    disabled: false,
                    to: 'breadcrumbs_link_1',
                },
                {
                    text: 'Link 2',
                    disabled: true,
                    to: 'breadcrumbs_link_2',
                },
            ]
        this.$store.commit("taskManagement/addToTaskManagementStore",{key:"headerBreadcrumbs",value:breadcrumbs})
        let id=this.$route.params.id;
        let self = this;
        if (id) {
            let allProject=this.sTaskManagement.allProject;
            let project=allProject.find(element => element.id==id);
            if (project) {
                self.$store.commit("taskManagement/setCurrentProject", project);
            }else{ // call api get detail project
                taskManagementApi
                    .getDetailProject(id)
                    .then(res => {
                        if (res.status == 200) {
                            self.$store.commit("taskManagement/setCurrentProject", res.data);
                        }else{
                            self.$snotifyError("", "Can not get detail project with id:"+id);
                        }
                    })
                    .catch(err => {
                        self.$snotifyError("", "Can not get detail project with id:"+id);
                    })
                    .always(() => {});
            }
        }
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
</style>
