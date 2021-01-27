<template>
    <dashboard-view :url="getUrl()">

    </dashboard-view>
</template>
<script>
import { util } from '../../../plugins/util';
import DashboardView from '../../dashboard/DashboardView.vue';

export default {
    name: "Report",
    components:{
        DashboardView
    },
    methods:{
        getUrl(){
            return util.addEnvToUrl('https://bi.symper.vn/#/dashboard/159/view');
        }
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
