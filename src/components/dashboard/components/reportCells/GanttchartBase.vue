<template>
    <div class="w-100 h-100">
        <div class="action-gantt">
            <v-btn small depressed >
                Create task
            </v-btn>
            <v-btn small depressed >
                Update
            </v-btn>
            <v-btn @click="saveUpdate" small depressed >
                Save
            </v-btn>
            <v-icon @click.stop.prevent="showPopupConfig" class="fs-16">mdi-cog-outline</v-icon>
        </div>

        <Highcharts
            ref="chart"
            style="height:calc(100% - 30px)"
            class="w-100 py-1" 
            :constructorType="'ganttChart'"
            :options="options">
        </Highcharts>
        <popup-config-ganttchart 
            ref="configGantt"
            :cellConfigs="cellConfigs"
        />
    </div>
</template>
<script>

import Highcharts from 'highcharts';
import Gantt from "highcharts/modules/gantt";
import {Chart} from 'highcharts-vue';
import DragDrop from "highcharts/modules/draggable-points"
import { util } from '@/plugins/util';
import PopupConfigGanttchart from '../PopupConfigGanttchart.vue';


Gantt(Highcharts);
DragDrop(Highcharts);
export default {
    components: {
        Highcharts: Chart,
        PopupConfigGanttchart,
    },
    created(){
    },
    computed:{
        options(){
            let self = this;
			var  day = 1000 * 60 * 60 * 24;
            let optionData = util.cloneDeep(this.cellConfigs.viewConfigs.displayOptions);
            optionData.plotOptions = {
                series: {
                    animation: false, // Do not animate dependency connectors
                    dragDrop: {
                        draggableX: true,
                        draggableY: true,
                        dragMinY: 0,
                        dragMaxY: 2,
                        dragPrecisionX: day / 48 // Snap to eight hours
                    },
                    allowPointSelect: true,
                    point: {
                        events: {
                            select: self.selected,
                            unselect: self.change,
                            remove: self.change,
                            drop: self.drop
                            // click: self.change,
                        }
                    }
                }
            };
            return optionData;
        }
    },
   
    props: {
        cellConfigs: {
            default(){
                return {}
            }
        },
        isView: {
            default: true
        },
    },
    data(){
        return {
         
        }
    },
    methods:{
        selected(e){
            console.log("selected",e);
        },
        drop(e){
            this.$emit("dragDrop-gantt",e)
        },
        showPopupConfig(){
            this.$refs.configGantt.show();
        },
        saveUpdate(){
            this.$emit("save-update-gantt");
        }
    }
}
</script>
<style scoped>
.action-gantt{
    position: absolute;
    top: 1px;
    right: 30px;
}
</style>