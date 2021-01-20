<template>
    <Highcharts
        class="w-100 h-100" 
        :options="cellConfigs.viewConfigs.displayOptions">
    </Highcharts>
</template>
<script>

import {Chart} from 'highcharts-vue'
import Highcharts from 'highcharts';
import Treemap from 'highcharts/modules/treemap'
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts);
Treemap(Highcharts);

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