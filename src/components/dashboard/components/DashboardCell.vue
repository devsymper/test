<template>
    <div 
        class="w-100 h-100 border-all"
        @click="selectThisCell">

    </div>
</template>

<script>
import { getDefaultReportConfig } from "@/components/dashboard/configPool/reportConfig.js";
export default {
    methods: {
        selectThisCell(){
            this.$store.commit('dashboard/setSelectedCell', {id: this.cellConfigs.sharedConfigs.cellId, instanceKey: this.instanceKey});
        }
    },
    props: {
        layoutItem: {
            default(){
                return {}
            }
        },
        cellConfigs: {
            default(){
                return getDefaultReportConfig()
            }
        },
        instanceKey: {
            defaul: ''
        },
    }
}
</script>

<style>


</style>