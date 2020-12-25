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
                        v-if="listColumn.length > 0"
                        depressed
                        small
                        @click="updateColumn"
                        >
                        {{$t('common.update')}}
                    </v-btn>
                    <v-btn
                        class="save-setting-btn"
                        v-else
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
                                    <div class="status-item" v-for="status in column.statusInColumn" :key="status.statusRoleId">
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
                    <div class="status-item" v-for="status in listStatus" :key="status.statusRoleId">
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
          
        }
    },
    components: {
        draggable,
        VuePerfectScrollbar
    },
    computed:{
        listStatus(){
            let projectId=this.$route.params.id;
            return util.cloneDeep(this.$store.state.taskManagement.listStatusInProjects[projectId]);
        }
    },
    data(){
        return{
            columns:[]
        }
    },
    mounted(){
      //  this.columns = util.cloneDeep(this.listColumn)
    },
    methods:{

        getStatusForListColumn(){
            let self = this;
            this.columns = util.cloneDeep(this.listColumn);
            if (this.listStatus.length > 0 ) {
                for (let i = 0; i < this.listStatusColumn.length; i++) {
                    let idColumn = this.listStatusColumn[i].columnId;
                    let statusRoleId = this.listStatusColumn[i].statusRoleId;
                    let item = this.listStatus.find(ele => ele.statusRoleId == statusRoleId);
                    if (item) {
                        let column = this.columns.find(ele => ele.id == idColumn);
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
            if (this.columns[index].statusInColumn.length > 0 ) {
                for (let i = 0; i < this.columns[index].statusInColumn.length; i++) {
                    this.listStatus.push(this.columns[index].statusInColumn[i]);
                }
                //this.listStatus.concat(this.columns[index].statusInColumn);
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
            this.columns.push({name:'new column',isHidden:false,isBacklog:false,statusInColumn:[]})
        },
        onKeyDown(){
            
        },
        saveColumn(){
            let idBoard=this.$route.params.idBoard;
            let data={};
                data.data = JSON.stringify(this.columns);
                data.boardId = idBoard;
                taskManagementApi
                    .addColumnInBoard(data)
                    .then(res => {
                        if (res.status == 200) {
                            this.$snotifySuccess("Add column completed!");
                        }else{
                            this.$snotifyError("", "Can not add column!");
                        }
                    })
                    .catch(err => {
                        this.$snotifyError("", "Can not add column!", err);
                    });

        },
        updateColumn(){
            let idBoard=this.$route.params.idBoard;
            let data={};
                data.data = JSON.stringify(this.columns);
                data.boardId = idBoard;
                taskManagementApi
                    .updateColumnInBoard(data)
                    .then(res => {
                        if (res.status == 200) {
                            this.$snotifySuccess("Update column completed!");
                        }else{
                            this.$snotifyError("", "Can not update column!");
                        }
                    })
                    .catch(err => {
                        this.$snotifyError("", "Can not update column!", err);
                    });

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