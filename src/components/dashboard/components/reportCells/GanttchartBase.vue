<template>
    <Highcharts
        class="w-100 h-100" 
        :constructorType="'ganttChart'"
        :options="cellConfigs.viewConfigs.displayOptions">
    </Highcharts>
</template>
<script>

import Highcharts from 'highcharts';
import Gantt from "highcharts/modules/gantt";
import {Chart} from 'highcharts-vue';
import DragDrop from "highcharts/modules/draggable-points"
Gantt(Highcharts);
DragDrop(Highcharts);
export default {
    components: {
        Highcharts: Chart
    },
    created(){
    },
    watch:{
        // cellConfigs:{
        //     deep: true,
        //     handler(newVl){
        //         if (newVl.viewConfigs && newVl.viewConfigs.displayOptions) {
        //             var  day = 1000 * 60 * 60 * 24;
        //             let plotOptions = {
        //                 series: {
        //                     animation: false, // Do not animate dependency connectors
        //                     dragDrop: {
        //                         draggableX: true,
        //                         draggableY: true,
        //                         dragMinY: 0,
        //                         dragMaxY: 2,
        //                         dragPrecisionX: day / 3 // Snap to eight hours
        //                     },
        //                     allowPointSelect: true,
        //                     point: {
        //                         events: {
        //                             // select: this.change(),
        //                             // unselect: this.change(),
        //                             // remove: this.change()
        //                         }
        //                     }
        //                 }
        //             };
        //             this.$set(newVl.viewConfigs.displayOptions,'plotOptions',plotOptions)
        //         }
        //     }
        // }
    },
    props: {
        cellConfigs: {
            default(){
                return {}
            }
        }
    },
    data(){
        return {
            change(){
                debugger
            }
        }
    },
    methods:{
       
    }
}
</script>