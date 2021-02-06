<template>
    <div class="symper-dashboard-editor h-100 w-100">
        <div class="d-flex h-100 w-100">
            <div class="d-flex flex-column"
                :style="{
                    width: workspaceWidth
                }">
                <DashboardToolBar 
                    :style="{
                        height: '40px'
                    }"
                    :action="action"
                    :idDashboard="idObject"
                    :instanceKey="instanceKey"/>

                <DashboardWorkspace 
                    :style="{
                        height: 'calc(100 % - 35px)'
                    }"
                    ref="dashboardWorkspace"
                    :action="action"
                    :instanceKey="instanceKey"/>
            </div>
            <div class="d-flex flex-column h-100" v-if="action != 'view'"
                :style="{
                    width: '200px'
                }">
                <ReportTypeSelector 
                    :instanceKey="instanceKey"
					@selected-type="handleSelectedChartType"
                />
                <ReportConfig 
                    :instanceKey="instanceKey"/>
            </div>
            <DashboardDasetDetail
                v-if="action != 'view'"
                ref="datasetDetail"
                class="h-100"
                :instanceKey="instanceKey"
				@show-dataset-selector="toggleDatasetDialog"
				@show-relation-selector="toggleRelationDialog"
                :style="{
                    width: '250px'
                }" 
            />
        </div>
		<DatasetSelector
            v-if="action != 'view'"
			ref="datasetSelector"
			v-model="listDatasetSelected"
			@list-dataset-selected="changeSelectedDatasets"
			@cancel="handlerCancelSelectDataset"
			:tableHeight="tableHeight"
		/>
		<RelationSelector
            v-if="action != 'view'"
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
        this.tableHeight = util.getComponentSize(this).h - 100;
        if(this.action == 'create'){
            this.$store.commit('dashboard/setSelectedCell', {id: 'global', instanceKey: this.instanceKey});
        }
	},
	watch:{
    },
    computed: {
        workspaceWidth(){
            if(this.action == 'view'){
                return '100%';
            }else{
                return 'calc(100% - 450px)';
            }
        },
        myData(){
           return this.$store.state.dashboard.allDashboard[this.instanceKey];
        }
    },
    methods: {
        changeSelectedDatasets(datasetIds){
            this.listDatasetSelected = datasetIds;
            this.dashboardEditorWorker.postMessage({
                action: 'getDatasetInfo',
                data: datasetIds
            });
        },
        applySelectedDatasets(datasets){
            if(this.action != 'view'){
                this.myData.dashboardConfigs.info.datasets = datasets.reduce((map, el) => {
                    map[el.id] = true;
                    return map;
                }, {});
                this.$refs.datasetDetail.getColumnDataset(datasets);
            }
        },
		handlerCancelSelectDataset(listDatasetIds){
            this.listDatasetSelected = listDatasetIds;
        },
		handlerListDatasetSelected(listDatasetIds){
			this.listDatasetSelected = listDatasetIds;
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
            this.changeSelectedDatasets(data.relateDatasetIds);
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
		handleSelectedChartType(type){
            if(this.myData.currentCellConfigs.sharedConfigs.type == 'global'){
                this.$refs.dashboardWorkspace.addCell(type);            
            }else{

            }
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

<style scoped>
.v-list-item{
	min-height: unset !important;
}
.v-list-item__title{
	font-size: 13px !important;
}
</style>