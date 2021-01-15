<template>
    <dashboard-view :url="'https://dev.bi.symper.vn/#/dashboard/159/view'">

    </dashboard-view>
</template>
<script>
import DashboardView from '../../dashboard/DashboardView.vue';

export default {
    name: "Report",
    components:{
        DashboardView
    },
    methods:{
        
    },
    activated(){
        let breadcrumbs = [
                {
                    text: 'Report',
                    disabled: true
                },
            ]
        this.$store.commit("taskManagement/addToTaskManagementStore",{key:"headerBreadcrumbs",value:breadcrumbs})
    }
};
</script>
