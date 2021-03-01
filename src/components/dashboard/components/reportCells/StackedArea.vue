<template>
    <HighchartBase :cellConfigs="cellConfigs" ref="highChartBase"/>
</template>

<script>
import HighchartBase from "./HighchartBase";
export default {
    components: {
        HighchartBase
    },
    props: {
        cellConfigs: {
            default(){
                return {}
            }
        }
    },
    methods:{
        printInnerHTML(headerHTML){
            this.$refs.highChartBase.printInnerHTML(headerHTML)
        }
    }
}    
</script>

<style>

</style>