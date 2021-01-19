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
                    :action="action"
                    :instanceKey="instanceKey"/>
            </div>
            <div class="d-flex flex-column h-100"
                :style="{
                    width: '200px'
                }">
                <ReportTypeSelector 
                    :instanceKey="instanceKey"
					@selected-type="handlerSelectedChartType"
                />
                <ReportConfig 
                    :instanceKey="instanceKey"/>
            </div>
            <DashboardDasetDetail
                ref="datasetDetail"
                class="h-100"
				@show-dataset-selector="toggleDatasetDialog"
				@show-relation-selector="toggleRelationDialog"
                :style="{
                    width: '250px'
                }" 
            />
        </div>
		<DatasetSelector
			ref="datasetSelector"
			v-model="listDatasetSelected"
			@list-dataset-selected="handlerListDatasetSelected"
			@cancel="handlerCancelSelectDataset"
			:tableHeight="tableHeight"
		/>
		<RelationSelector
			ref="relationSelector"
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
import RelationSelector from '@/components/relation/RelationSelector'
import {util} from '@/plugins/util'
import { autoLoadChartClasses } from "@/components/dashboard/configPool/reportConfig.js";
import { getDefaultDashboardConfig } from "@/components/dashboard/configPool/dashboardConfigs.js";
import Global from "@/components/dashboard/reports/Global.chart.js";

var reportClasses = autoLoadChartClasses();

export default {
    components: {
        DashboardDasetDetail,
        DashboardToolBar,
        DashboardWorkspace,
        ReportConfig,
		ReportTypeSelector,
		DatasetSelector,
		RelationSelector
    },
    created(){
        this.dashboardEditorWorker = new DashboardEditorWorker();
        this.listenFromWorker();
        this.getDashboardInfo();
        this.initDashboardData();
    },
    data(){
        return {
            instanceKey: Date.now(),
            tableHeight: 0,
            listDatasetSelected:[],
        };
	},
	mounted(){
		this.tableHeight = util.getComponentSize(this).h - 100
	},
	watch:{
    },
    computed: {
        myData(){
           return this.$store.state.dashboard.allDashboard[this.instanceKey];
        }
    },
    methods: {
		handlerListDatasetSelected(listDatasetIds){
		},
		handlerCancelSelectDataset(listDatasetIds){
		},
        initDashboardData(){
            let defaultData = getDefaultDashboardConfig();
            let data = {
                ...defaultData,
                instanceKey: this.instanceKey,
                showReportConfig: true,
            }
            data.dashboardConfigs.allCellConfigs.global = new Global();
            this.$store.commit('dashboard/setDashboardConfig', {
                instanceKey: this.instanceKey,
                data
            });
        },
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
        setRestoredDashboardConfigs(data){
            this.listDatasetSelected = data.relateDatasetIds;
            this.$set(
                this.myData.dashboardConfigs,
                'allCellConfigs',
                data.allCellConfigs
            );

            this.$set(
                this.myData.dashboardConfigs,
                'info',
                data.dashboardInfo
            );
            this.$store.commit('dashboard/setSelectedCell', {id: 'global', instanceKey: this.instanceKey});
		},
		
		toggleDatasetDialog(){
			this.$refs.datasetSelector.show()
		},
		toggleRelationDialog(){
			this.$refs.relationSelector.show()
		},
		handlerSelectedChartType(type){

		},
        listenFromWorker(){
            let self = this;
            this.dashboardEditorWorker.addEventListener("message", function (event) {
                let data = event.data;
                let action = data.action;
                if(self[action]){
                    self[action](data.data);
                } else {
                    console.error(` action ${action} not found `);
                }
            });
        },
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