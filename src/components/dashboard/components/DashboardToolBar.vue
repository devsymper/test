<template>
<div v-if="instanceKey">
    
</div>  
</template>

<script>
import { getDefaultDashboardConfig } from "@/components/dashboard/configPool/defaultDashboardConfigs.js";
export default {
    computed: {
        dashboardInfo(){
            if(this.instanceKey){
                return this.$store.state.dashboard.allDashboard[this.instanceKey].dashboardConfigs.info;
            }
        }
    },
    props: {
        instanceKey: {
            default: ''
        }
    },
    data(){
        return {

        }
    }
}
</script>

<style>

</style>