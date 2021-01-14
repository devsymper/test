<template>
    <div class="symper-dashboard-editor h-100 w-100">
        <div class="d-flex">
            <div class="d-flex flex-column">
                <DashboardToolBar 
                    :style="{
                        height: '35px'
                    }"
                    :instanceKey="instanceKey"/>
                <DashboardWorkspace 
                    :style="{
                        height: 'calc(100 % - 35px)'
                    }"
                    :instanceKey="instanceKey"/>
            </div>
            <div class="d-flex flex-column h-100"
                :style="{
                    width: '250px'
                }">
                <ReportTytpeSelector 
                    :instanceKey="instanceKey"/>
                <ReportConfig 
                    :instanceKey="instanceKey"/>
            </div>
            <DashboardDasetDetail
                class="h-100"
                :style="{
                    width: '300px'
                }" 
                :instanceKey="instanceKey"/>
        </div>
    </div>
</template>

<script>
import DashboardDasetDetail from "@/components/dashboard/components/DashboardDasetDetail.vue";
import DashboardToolBar from "@/components/dashboard/components/DashboardToolBar.vue";
import DashboardWorkspace from "@/components/dashboard/components/DashboardWorkspace.vue";
import ReportConfig from "@/components/dashboard/components/ReportConfig.vue";
import ReportTypeSelector from "@/components/dashboard/components/ReportTypeSelector.vue";
import DashboardEditorWorker from 'worker-loader!@/worker/dashboard/DasboardEditor.Worker.js';
import { autoLoadChartClasses } from "@/components/dashboard/configPool/reportConfig.js";
var reportClasses = autoLoadChartClasses();
console.log(reportClasses, 'reportClassesreportClassesreportClasses');
export default {
    components: {
        DashboardDasetDetail,
        DashboardToolBar,
        DashboardWorkspace,
        ReportConfig,
        ReportTypeSelector
    },
    created(){
        this.dashboardEditorWorker = new DashboardEditorWorker();
        this.listenFromWorker();
        this.getDashboardInfo();
    },
    data(){
        return {
            instanceKey: Date.now() 
        }
    },
    methods: {
        getDashboardInfo(){
            if(this.idObject){
                this.dashboardEditorWorker.postMessage({
                    action: 'getDashboardInfo',
                    data: {
                        idDashboard: this.idObject 
                    }
                });
            }
        },
        setDashboardData(info){

        },
        listenFromWorker(){
            let mapActionAndMethod = {
                setDashboardData: this.setDashboardData
            };
            this.dashboardEditorWorker.addEventListener("message", function (event) {
                let data = event.data;
                let action = data.action;
                if(this[action]){
                    this[action](data.data);
                } else {
                    console.error(` action ${action} not found `);
                }
            });
        }
    },
    props: {
        action: {
            type: String,
            default: 'create'
        },
        idObject: {
            default: ''
        },
    }
}
</script>

<style>

</style>