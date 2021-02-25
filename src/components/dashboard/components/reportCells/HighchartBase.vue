<template>

    <div ref="highchartWrapper">
         <Highcharts
            class="w-100 h-100" 
            ref="highchartSymper"
            :options="cellConfigs.viewConfigs.displayOptions">
        </Highcharts>
    </div>
   
</template>
<script>

import {Chart} from 'highcharts-vue'
import { util } from "@/plugins/util";
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
        printInnerHTML(headerHTML){
            let domHTML = this.$refs.highchartWrapper.innerHTML
            let fullHTML = headerHTML + domHTML;
            debugger
            util.printDOM(fullHTML);
        }
    }
}
</script>