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
import {Chart} from 'highcharts-vue'
Gantt(Highcharts);

export default {
    components: {
        Highcharts: Chart
    },
    created(){
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

        }
    },
    methods:{
        
    }
}
</script>