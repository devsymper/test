<template>
    <div class="symper-dashboard-editor h-100 w-100">
        <div class="d-flex h-100 w-100">
            <div class="d-flex flex-column"
                :style="{
                    width: 'calc(100% - 450px)'
                }">
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
			<div>
				<v-icon @click="showReportConfig = true">
					mdi-folder
				</v-icon>
				<v-icon @click="toggleDatasetDialog">
					mdi-file
				</v-icon>
			</div>	
            <div class="d-flex flex-column h-100"
                :style="{
                    width: '200px'
                }">
                <ReportTypeSelector 
                    :instanceKey="instanceKey"
					:showReportConfig="showReportConfig"
					@selected-type="handlerSelectedChartType"
					@collapse-report-config="showReportConfig = false"
					/>
                <ReportConfig 
                    :instanceKey="instanceKey"/>
            </div>
            <DashboardDasetDetail
                class="h-100"
                :style="{
                    width: '250px'
                }" 
                :instanceKey="instanceKey"/>
        </div>
		<DatasetSelector
			ref="datasetSelector"
			:tableHeight="tableHeight"
		/> 	
    </div>
</template>

<script>
import DashboardDasetDetail from "@/components/dashboard/components/DashboardDasetDetail.vue";
import DashboardToolBar from "@/components/dashboard/components/DashboardToolBar.vue";
import DashboardWorkspace from "@/components/dashboard/components/DashboardWorkspace.vue";
import ReportConfig from "@/components/dashboard/components/ReportConfig.vue";
import ReportTypeSelector from "@/components/dashboard/components/ReportTypeSelector.vue";
import DashboardEditorWorker from 'worker-loader!@/worker/dashboard/DasboardEditor.Worker.js';
import DatasetSelector from '@/components/dataset/DatasetSelector'
import {util} from '@/plugins/util'
import { autoLoadChartClasses } from "@/components/dashboard/configPool/reportConfig.js";

var reportClasses = autoLoadChartClasses();

export default {
    components: {
        DashboardDasetDetail,
        DashboardToolBar,
        DashboardWorkspace,
        ReportConfig,
		ReportTypeSelector,
		DatasetSelector
    },
    created(){
        this.dashboardEditorWorker = new DashboardEditorWorker();
        this.listenFromWorker();
        this.getDashboardInfo();
    },
    data(){
        return {
			instanceKey: Date.now() ,
			showReportConfig: true,
			showDatasetSelectorDialog: false,
			tableHeight: 0
        }
	},
	mounted(){
		this.tableHeight = util.getComponentSize(this).h - 100
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
		toggleDatasetDialog(){
			this.$refs.datasetSelector.show()
		},
		handlerSelectedChartType(type){

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