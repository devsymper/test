<template>
    <div class="h-100 w-100">
        <div style="height:40px">
            <div class="d-flex justify-space-between">
                <h2 class="ml-4">Quản lý cột</h2>
                <div>
                    <v-btn small class="ml-1 px-1" solo depressed color="#999" @click="addColumn">
                        <span style="color:white">Thêm cột</span>
                    </v-btn>
                    <v-btn
                        class="save-setting-btn"
                        v-if="listColumn.length > 0 && checkRole('task_manager_kanban_board','edit')"
                        depressed
                        :loading="isLoading"
                        small
                        @click="updateColumn"
                        >
                        {{$t('common.update')}}
                    </v-btn>
                    <v-btn
                        class="save-setting-btn"
                        v-else-if="listColumn.length == 0 && checkRole('task_manager_kanban_board','edit')"
                        :loading="isLoading"
                        depressed
                        small
                        @click="saveColumn"
                        >
                        {{$t('common.save')}}
                    </v-btn>
                </div>
            </div>
        </div>
        <div class="d-flex h-100">
            <VuePerfectScrollbar class="wrap-scroll">
                <draggable :list="listColumn" :animation="250" class="py-4 h-100 w-100" ghost-class="ghost-columns" group="people">
                    <transition-group type="transition" name="flip-list" class="wrap-kanban-board">
                        <div
                            v-for="(column,index) in listColumn"
                            :key="column.id+index"
                            :style="getColWidth()"
                            class=" board-column-item mr-4"
                        >
                            <div class="column-header">
                                <div class="d-flex">
                                    <v-text-field
                                        class="sym-small-size sym-style-input"
                                        v-model="column.name"
                                        solo
                                    ></v-text-field>
                                    <v-icon style="font-size:20px" @click="removeColumn(index)">mdi-delete-forever-outline</v-icon>
                                </div>
                                <div class="d-flex">
                                    <!-- <v-checkbox
                                        v-model="column.isHidden"
                                        class="sym-small-size sym-style-input mr-2"
                                        label="ẩn"
                                    ></v-checkbox> -->
                                    <v-checkbox
                                        v-model="column.isBacklog"
                                        class="sym-small-size sym-style-input"
                                        label="backlog"
                                    ></v-checkbox>
                                </div>
                            </div>
                            <div class="h-100">
                                <draggable :list="column.statusInColumn" :animation="250" ghost-class="ghost-card" class="h-100 list-group" group="status">
                                    <div class="status-item" v-for="status in column.statusInColumn" :key="status.nodeId">
                                        <div class="d-flex justify-space-between">
                                            {{status.name}}
                                            <div :style="{ 'background': status.color ,'width':'15px','height':'7px', 'margin-top': '7px'}" ></div>
                                        </div>
                                        <div>
                                            {{status.taskLifeCircleName ? status.taskLifeCircleName :""}}
                                        </div>
                                    </div>
                                </draggable>
                            </div>
                        
                            
                        </div>
                    </transition-group>
                </draggable>
            </VuePerfectScrollbar>

            <div class="all-status mt-4">
                <div class="p-2 all-status__header">
                    Tất cả trạng thái
                </div>
                <draggable :list="listStatus"  :animation="250" ghost-class="ghost-card" class="h-100 list-group" group="status">
                    <!-- Each element from here will be draggable and animated. Note :key is very important here to be unique both for draggable and animations to be smooth & consistent. -->
                    <div class="status-item" v-for="status in listStatus" :key="status.nodeId">
                        <div class="d-flex justify-space-between">
                            {{status.name}}
                            <div :style="{ 'background': status.color ,'width':'15px','height':'7px', 'margin-top': '7px'}" ></div>
                        </div>
                        <div>
                            {{status.taskLifeCircleName ? status.taskLifeCircleName :""}}
                        </div>
                    </div>
                 
                    <!-- </transition-group> -->
                </draggable>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { checkPermission } from "@/views/taskManagement/common/taskManagerCommon";
import KanbanWorker from 'worker-loader!@/worker/taskManagement/kanban/Kanban.Worker.js';
import { util } from 'jointjs';
export default {
    name:"columnSetting",
    components: {
        draggable,
        VuePerfectScrollbar
    },
    computed:{
        sTaskManagement() {
            return this.$store.state.taskManagement;
        },
        currentBoard(){
            return this.$store.state.taskManagement.currentBoard;
        },
        sCurrentProject(){
            return this.$store.state.taskManagement.currentProject;
        },
        
    },
    data(){
        return{
            isLoading:false,
            columns:[],
            kanbanWorker:null,
            listStatus:null,
            listColumn:null
        }
    },
    watch:{
        
        '$route':{
            immediate:true,
            deep:true,
            handler(to,from){
                if(to.name == 'kanbanBoardSetting'){
                    this.getListColumn();
                    this.getListStatus();
                }
            }
        }
    },
    methods:{
        getListColumn(){
            if (!this.currentBoard.id) {
                return [];
            }
            let idBoard = this.currentBoard.id;
            let columns = this.sTaskManagement.listColumnInBoard[idBoard];
            let backLogData = this.sTaskManagement.backLogData;
            if(backLogData.length > 0){
                columns.push(backLogData[0]);
                console.log('vao');
            }
            this.listColumn = columns;
        },
        getListStatus(){
            let allStatus = util.cloneDeep(this.sTaskManagement.listStatusInProjects[this.sCurrentProject.id]);
            for (let index = 0; index < this.listColumn.length; index++) {
                for (let i = 0; i < this.listColumn[index].statusInColumn.length; i++) {
                    let statusItem = this.listColumn[index].statusInColumn[i];
                    let findItem = allStatus.find(el => el.statusId == statusItem.id);
                    if(findItem){
                        let indexItem = allStatus.indexOf(findItem);
                        allStatus.splice(indexItem,1);   
                    }
                }
            }
            allStatus = allStatus.reduce((arr,obj)=>{
                obj['id'] = obj['statusId'];
                obj['id'] = obj['statusId'];
                arr.push(obj);
                return arr;
            },[])
            this.listStatus = allStatus;
        },
        checkRole(objectType,action){
            return checkPermission(objectType,action);
        },
        removeColumn(index){
            if (this.listColumn[index].statusInColumn && this.listColumn[index].statusInColumn.length > 0 ) {
                for (let i = 0; i < this.listColumn[index].statusInColumn.length; i++) {
                    this.listStatus.push(this.listColumn[index].statusInColumn[i]);
                }
            }
            this.listColumn.splice(index,1);
        },
        getColWidth(){
            let colLength = this.listColumn.length;
            if (colLength >= 4) {
                return {width:25 + '%'};
            }else{
                return {width:100/colLength + '%'};
            }
        },
        addColumn(){
            this.listColumn.push({id:'',name:'new column',isHidden:false,isBacklog:false,statusInColumn:[]})
        },
        saveColumn(){
            this.isLoading = true;
            let idBoard=this.$route.params.idBoard;
            let data={};
            data.data = JSON.stringify(this.listColumn);
            data.boardId = idBoard;
            
            this.kanbanWorker.postMessage({
                action:'saveColumn',
                data:data
            });
 
        },
        updateColumn(){
            this.isLoading = true;
            let idBoard=this.$route.params.idBoard;
            let data={};
            let newData = util.cloneDeep(this.listColumn);
            newData = newData.reduce((arr,obj)=>{
                let newObj = obj;
                let newStatusInColumn = newObj.statusInColumn.reduce((arr1, obj1) => {
                    delete obj1.tasks;
                    arr1.push(obj1)
                    return arr1
                },[]);
                obj.statusInColumn = newStatusInColumn;
                arr.push(obj)
                return arr;
            },[]);
            data.data = JSON.stringify(newData);
            data.boardId = idBoard;
            
            this.kanbanWorker.postMessage({
                action:'updateColumn',
                data:data
            });
        },
    },
    created(){
        let self = this;
        this.kanbanWorker = new KanbanWorker();
        this.kanbanWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'actionError':
                    self.$snotifyError("", "Update status error!");
                    self.isLoading = false;
                    break;
                case 'saveColumn':
                    self.$snotifySuccess("Add column completed!");
                    self.isLoading = false;
                    break;
                case 'updateColumn':
                    self.$snotifySuccess("Update column completed!");
                    self.isLoading = false;
                    break;
                default:
                    break;
            }
        });

    },
}
</script>

<style scoped>

.ghost-columns {
  opacity: 0.5;
  transition: transform 0.5s;
  background: #c8ebfb;
}
.wrap-kanban-board{
    display: flex;
    flex: 1 1 auto;
    max-width: 100%;
}
.wrap-scroll{
    width: calc(100% - 200px);
}
.board-column-item{
    min-height: 200px;
    border: var(--symper-border);
}
.column-header{
    font-weight: 500;
    padding: 8px;
    background: var(--symper-background-active);
}
.title-column{
    padding: 0 8px;
}
.all-status{
    width: 200px;
    border: var(--symper-border);
}
.all-status__header{
    background:  var(--symper-background-active);
}
.status-item{
    margin:8px ;
    padding: 8px;
    border: var(--symper-border);
    box-shadow: var(--symper-box-shadow);
}
.sym-style-input >>> .v-input__slot{
    box-shadow: none !important;
}
</style>