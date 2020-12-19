<template>
    <div class="h-100 w-100">
        <div style="height:40px">
            <div class="d-flex justify-space-between">
                <h2 class="ml-4">Column manager</h2>
                <v-btn small class="ml-1 px-1" solo depressed color="#999" @click="addColumn">
                    <span style="color:white">Add column</span>
                </v-btn>
            </div>
        </div>
        <div class="d-flex">
            <draggable :list="columns" :animation="250" class="py-4 h-100 w-100" ghost-class="ghost-columns" group="people">
                <transition-group type="transition" name="flip-list" class="wrap-kanban-board">
                    <div
                        v-for="(column,index) in columns"
                        :key="index"
                        :style="getColWidth()"
                        class=" board-column-item mr-4"
                    >
                        <div class="column-header">
                            <v-text-field
                            class="sym-small-size sym-style-input"
                            v-model="column.name"
                                solo
                            ></v-text-field>
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
                                 <div class="status-item" v-for="status in column.statusInColumn" :key="status.id">
                                    {{status.name}}
                                </div>
                            </draggable>
                        </div>
                     
                        
                    </div>
                </transition-group>
            </draggable>
            <div class="all-status">
                <div class="p-2 all-status__header">
                    Tất cả trạng thái
                </div>
                <draggable :list="listStatus"  :animation="250" ghost-class="ghost-card" class="h-100 list-group" group="status">
                    <!-- Each element from here will be draggable and animated. Note :key is very important here to be unique both for draggable and animations to be smooth & consistent. -->
                    <div class="status-item" v-for="status in listStatus" :key="status.id">
                        {{status.name}}
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
        }
    },
    components: {
        draggable,
        VuePerfectScrollbar
    },
    data(){
        return{
            listStatus:[{name:'heli',id:'123653f'},{name:'he43li',id:'qwasd'},{name:'hel1i',id:'123653qwf'}],
            columns:[]
        }
    },
    mounted(){
        this.columns = util.cloneDeep(this.listColumn)
    },
    methods:{
        getColWidth(){
            let colLength = this.columns.length;
            return {width:100/colLength + '%'};
        },
        addColumn(){
            this.columns.push({name:'new column',statusInColumn:[]})
        },
        onKeyDown(){
            
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