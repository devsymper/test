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
            <draggable :list="listColumn" :animation="250" class="py-4 h-100 w-100" ghost-class="ghost-columns" group="people">
                <transition-group type="transition" name="flip-list" class="wrap-kanban-board">
                    <div
                        v-for="column in listColumn"
                        :key="column.name"
                        :style="getColWidth()"
                        class=" board-column-item mr-4"
                    >
                        <div class="column-header">
                            <input class="title-column" v-model="column.name">
                        </div>
                        <div class="h-100">
                            <draggable  :animation="250" ghost-class="ghost-card" class="h-100" group="status">
                                <!-- Each element from here will be draggable and animated. Note :key is very important here to be unique both for draggable and animations to be smooth & consistent. -->
                                <div class="status-item">
                                    hello
                                </div>
                                <!-- </transition-group> -->
                            </draggable>
                        </div>
                     
                        
                    </div>
                </transition-group>
            </draggable>
            <div class="all-status">
                <div class="p-2 all-status__header">
                    Tất cả trạng thái
                </div>
                <draggable  :animation="250" ghost-class="ghost-card" class="h-100" group="status">
                    <!-- Each element from here will be draggable and animated. Note :key is very important here to be unique both for draggable and animations to be smooth & consistent. -->
                    <div class="status-item">
                        hello
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
            headers: ["id", "name", "sport"],
            list: [
                { id: 1, name: "Abby", sport: "basket" },
                { id: 2, name: "Brooke", sport: "foot" },
                { id: 3, name: "Courtenay", sport: "volley" },
                { id: 4, name: "David", sport: "rugby" }
            ],
        }
    },
    methods:{
        getColWidth(){
            let colLength = this.listColumn.length;
            return {width:100/colLength + '%'};
        },
        addColumn(){
            this.listColumn.push({name:'new column'})
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
</style>