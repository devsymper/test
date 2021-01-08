<template>
    <div class="h-100 w-100">
        <div style="height:40px">
            <div class="d-flex justify-space-between">
                <h2 class="ml-4">Column manager</h2>
                <div>
                    <v-btn small class="ml-1 px-1" solo depressed color="#999" @click="addColumn">
                        <span style="color:white">Add column</span>
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
                <draggable :list="columns" :animation="250" class="py-4 h-100 w-100" ghost-class="ghost-columns" group="people">
                    <transition-group type="transition" name="flip-list" class="wrap-kanban-board">
                        <div
                            v-for="(column,index) in columns"
                            :key="index"
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
                                    <v-checkbox
                                        v-model="column.isHidden"
                                        class="sym-small-size sym-style-input mr-2"
                                        label="ẩn"
                                    ></v-checkbox>
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
import { taskManagementApi } from "@/api/taskManagement.js";
import { checkPermission } from "@/views/taskManagement/common/taskManagerCommon";

import {
    util
} from "@/plugins/util.js";
export default {
    name:"columnSetting",
    props:{
        listColumn:{
            type:Array,
            default() {
                return [];
            }
        },
        listStatusColumn:{
            type:Array,
            default() {
                return [];
            }
        },
    },
    watch:{
        listStatusColumn:{
            deep: true,
            immediate:true,
            handler(newVl){
                if (newVl.length > 0 && this.listColumn.length > 0) {
                    this.getStatusForListColumn();
                }
            }
        },
        listStatusInProject:{
            deep: true,
            immediate:true,
            handler(newVl){
                this.listStatus = util.cloneDeep(newVl);
                this.getStatusForListColumn();
            }
        },
    },
    components: {
        draggable,
        VuePerfectScrollbar
    },
    computed:{
        listStatusInProject(){
            let projectId=this.$route.params.id;
            if (this.$store.state.taskManagement.listStatusInProjects[projectId] && this.$store.state.taskManagement.listStatusInProjects[projectId].length > 0) {
                return this.$store.state.taskManagement.listStatusInProjects[projectId];
            }else{
                return [];
            }
        }
    },
    data(){
        let self = this;
        return{
            isLoading:false,
            columns:[],
            listStatus:[]
        }
    },
    mounted(){
      //  this.columns = util.cloneDeep(this.listColumn)
    },
    methods:{
        checkRole(objectType,action){
            return checkPermission(objectType,action);
        },
        getStatusForListColumn(){
            let self = this;
            self.columns = util.cloneDeep(self.listColumn);
            if (self.listStatus.length > 0 ) {
                for (let i = 0; i < self.listStatusColumn.length; i++) {
                    let idColumn = self.listStatusColumn[i].columnId;
                    let statusId = self.listStatusColumn[i].statusId;
                    let taskLifeCircleId = self.listStatusColumn[i].taskLifeCircleId;
                    let item = self.listStatus.find(ele => ele.statusId == statusId &&  ele.taskLifeCircleId == taskLifeCircleId );
                    if (item) {
                        let column = self.columns.find(ele => ele.id == idColumn);
                        if (column) {
                            column.statusInColumn.push(item);
                        }
                        let index = self.listStatus.indexOf(item);
                        if (index > -1) {
                            self.listStatus.splice(index, 1);
                        }
                    }
                    
                }  
            }

        },
        removeColumn(index){
            if (this.columns[index].statusInColumn && this.columns[index].statusInColumn.length > 0 ) {
                for (let i = 0; i < this.columns[index].statusInColumn.length; i++) {
                    this.listStatus.push(this.columns[index].statusInColumn[i]);
                }
            }
            this.columns.splice(index,1);
        },
        getColWidth(){
            let colLength = this.columns.length;
            if (colLength >= 4) {
                return {width:25 + '%'};
            }else{
                return {width:100/colLength + '%'};
            }
        },
        addColumn(){
            this.columns.push({id:'',name:'new column',isHidden:false,isBacklog:false,statusInColumn:[]})
        },
        onKeyDown(){
            
        },
        saveColumn(){
            this.isLoading = true;
            let idBoard=this.$route.params.idBoard;
            let data={};
                data.data = JSON.stringify(this.columns);
                data.boardId = idBoard;
                taskManagementApi
                    .addColumnInBoard(data)
                    .then(res => {
                        if (res.status == 200) {
                            this.$snotifySuccess("Add column completed!");
                            this.$store.dispatch("taskManagement/getListColumnInBoard",idBoard);

                        }else{
                            this.$snotifyError("", "Can not add column!");
                        }
                        this.isLoading = false;

                    })
                    .catch(err => {
                        this.isLoading = false;
                        this.$snotifyError("", "Can not add column!", err);
                    });

        },
        async updateColumn(){
            this.isLoading = true;
            let idBoard=this.$route.params.idBoard;
            let data={};
            data.data = JSON.stringify(this.columns);
            data.boardId = idBoard;
            let res =await taskManagementApi.updateColumnInBoard(data);
            if (res.status == 200) {
                this.$snotifySuccess("Update column completed!");
                await this.$store.dispatch("taskManagement/getListColumnInBoard",idBoard);
                await this.$store.dispatch("taskManagement/getListStatusInColumnBoard",idBoard);
                this.listStatus =(this.listStatusInProject.length > 0 )? util.cloneDeep(this.listStatusInProject) : [];
            }else{
                this.$snotifyError("", "Can not update column!");
            }
            this.isLoading = false;
            this.getStatusForListColumn();
        }
    }
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