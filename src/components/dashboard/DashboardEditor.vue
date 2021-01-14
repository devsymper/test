<template>
    <div class="symper-dashboard-editor h-100">
        <div class="d-flex h-100">
            <div class="d-flex flex-column">
                <DashboardToolBar 
                    :style="{
                        height: '35px'
                    }"
                    :instanceKey="instanceKey"/>
                <DashboardWorkspace 
                    :instanceKey="instanceKey"/>
            </div>
            <div class="d-flex flex-column h-100">
                <ReportTypeSelector 
                    :instanceKey="instanceKey"/>
                <ReportConfig 
                    :instanceKey="instanceKey"/>
            </div>
            <DashboardDasetDetail 
                ref="datasetDetail"
                :instanceKey="instanceKey"/>
            <v-btn @click="recheckSelectedColumn">
                Click
            </v-btn>
            <v-btn @click="testClearSelectedItem">Clear</v-btn>
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
            instanceKey: Date.now(),
            currentCellConfigs:{
                "sharedConfigs": {
                    "type": "pivot",
                    "yAxisCount": 1,
                    "cellId": "cell-1609348095437"
                },
                "rawConfigs": {
                    "setting": {
                    "value": {
                        "name": "Value",
                        "slot": "n",
                        "hasAgg": true,
                        "selectedColums": [
                        {
                            "as": "Số người làm",
                            "agg": "sum",
                            "cond": {
                            "val": "",
                            "type": "isall"
                            },
                            "edit": false,
                            "name": "sl_ns",
                            "type": "number",
                            "dataset": "2833",
                            "origin_type": "number"
                        }
                        ]
                    },
                    "rows": {
                        "name": "Rows",
                        "slot": "1",
                        "selectedColums": [
                        {
                            "as": "Ca làm",
                            "agg": "first",
                            "cond": {
                            "val": "",
                            "type": "isall"
                            },
                            "edit": false,
                            "name": "ca_lam",
                            "type": "text",
                            "dataset": "2833",
                            "origin_type": "text"
                        }  
                        ]
                    }
                    },
                    "extra": {
                    }
                },
                "viewConfigs": {
                    "isSelecting": true,
                    "selectedDataset": {"3665":{"assignee":true,"ngay_end_tt":true,"ngay_end":true}},
                    "showIcon": false,
                    "commentCount": 0,
                    "needSaveExtraOptions": {},
                    "filter": {},
                    "loadingData": false
                }
            }
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
        },
        recheckSelectedColumn(){
            this.$refs.datasetDetail.clearSelectedItemDisplay();
            this.$refs.datasetDetail.setSelectedDataset(this.currentCellConfigs.viewConfigs.selectedDataset, true);
        },
        testClearSelectedItem(){
            this.$refs.datasetDetail.clearSelectedItemDisplay();
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