<template>
    <div class="w-100 h-100 fs-13" >
        <div class="pt-2 d-flex">
            <v-icon>mdi-chevron-right</v-icon>
            <div style="width:95%" class="d-flex">
                <div class="font-weight-medium flex-grow-1 mt-1" >Fields</div> 
                <v-btn class="float-right" icon tile small @click="showDashboardVariables">
                    <v-icon small>
                        mdi-table-large-plus
                    </v-icon>
                </v-btn>
                <v-btn class="float-right" icon tile small @click="showRelationSelector">
                    <v-icon small>
                        mdi-relation-zero-or-one-to-one-or-many
                    </v-icon>
                </v-btn>
               
                 <v-btn class="float-right mr-1" icon tile small @click="showDatasetSelector">
                    <v-icon small>
                        mdi-database
                    </v-icon>
                </v-btn>
            </div>
        </div>
        <v-text-field
            v-on:input="onSearch($event)"
            class="d-inline-block pa-2 sym-small-size"
            single-line
            append-icon="mdi-magnify"
            outlined
            hide-details
            dense
            flat
            label="Search"
            :placeholder="$t('common.search')"
            style="width: inherit"
        ></v-text-field>
        <preloader 
            v-if="loadding"
            style="height:100px!important;width:250px"
            class="mx-auto" />
        <VuePerfectScrollbar 
            v-else
            style="height:calc(100% - 100px)">
            <v-expansion-panels
                multiple
                flat
                style="overflow: hidden;"
                v-model="openedPanelParent"
            >
                <v-expansion-panel class="sym-expand-panel " v-for="(dataset,idx) in datasetAndColumn" :key="idx" v-show="dataset.show && !dataset.isSubDataset">
                    <v-expansion-panel-header class="v-expand-header sym-expand-panel-header px-4 py-0">
                        <v-menu 
                            absolute
                            left
                            nudge-left="10"
                            nudge-bottom="10"
                            >
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" @click.prevent.stop="showDetailDataset(dataset)" v-if="dataset.type == 'doc'" class="fs-15 icon-table">mdi-table-large</v-icon>
                                <v-icon v-on="on" @click.prevent.stop="showDetailDataset(dataset)" v-else class="fs-15 icon-table">mdi-view-module-outline</v-icon>
                                <v-icon  class="selected-dataset-mark" v-show="dataset.isSelected">mdi-check-circle</v-icon>
                                <span v-on="on" @click.prevent.stop="showDetailDataset(dataset)" class="dataset-item-title fs-13 pl-2">{{dataset.title}}</span>
                            </template>
                            <dataset-detail-tooltip 
                                v-if="dataSetDetail"
                                :info="dataSetDetail"
                            />
                        </v-menu>
                        <v-icon class="fs-15" style="position: absolute;right: 40px;" @click.prevent.stop="removeDataset(dataset)">mdi-close</v-icon>
						<v-menu offset-y>
							<template v-slot:activator="{ on, attrs }">
									<v-icon 
										class="fs-15 menu-add-column"
										v-bind="attrs"
										v-on="on"
									>
									mdi-dots-horizontal
									</v-icon>
							</template>
							<div class="p-2 btn-add-column d-flex" @click="addMeasureToDataset(dataset)" >
								<v-icon small>
									mdi-pencil-box-outline
								</v-icon>
								<span class="ml-1">
									Thêm cột
								</span>
							</div>
						</v-menu>
						
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                        <v-expansion-panels
                            multiple
                            flat
                            style="overflow: hidden;"
                            v-model="openedPanelChild"
                        >
                            <!-- Danh sách các table trong doc -->
                            <v-expansion-panel class="sym-expand-panel dataset-child" v-for="(subId,idx) in dataset.subDatasetIds" :key="idx"  v-show="datasetAndColumn[subId].show" >
                                <v-expansion-panel-header class="v-expand-header sym-expand-panel-header px-4 py-0">
                                    <v-menu 
                                        absolute
                                        left
                                        nudge-left="10"
                                        nudge-bottom="10"
                                        >
                                        <template v-slot:activator="{ on }">
                                            <v-icon v-on="on"  @click.prevent.stop="showDetailDataset(datasetAndColumn[subId])" class="fs-15 icon-table">mdi-table-large</v-icon>
                                            <v-icon class="selected-dataset-mark" v-show="datasetAndColumn[subId].isSelected">mdi-check-circle</v-icon>
                                            <span v-on="on"  @click.prevent.stop="showDetailDataset(datasetAndColumn[subId])" class="dataset-item-title fs-13 pl-2">{{datasetAndColumn[subId].title}}</span>
                                        </template>
                                        <dataset-detail-tooltip 
                                             v-if="dataSetDetail"
                                            :info="dataSetDetail"
                                        />
										<v-menu offset-y>
											<template v-slot:activator="{ on, attrs }">
													<v-icon 
														class="fs-15 menu-add-column"
														v-bind="attrs"
														v-on="on"
													>
													mdi-dots-horizontal
													</v-icon>
											</template>
											<div class="p-2 btn-add-column" @click="addMeasureToDataset(dataset)">
												<v-icon small>
													mdi-pencil-box-outline
												</v-icon>
												<span class="ml-1">
													Thêm cột
												</span>
											</div>
										</v-menu>
									</v-menu>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content class="sym-v-expand-content">
                                    <!-- Danh sách các control trong table -->
                                    <draggable
                                        :clone="cloneColumn"
                                        :list="datasetAndColumn[subId].columns"
                                        :animation="250"
                                        ghost-class="ghost-card"
                                        :group="{ name: 'drop-column', pull: 'clone', put: false }"
                                        >
                                        <columnInfo 
                                            class="column-dataset"
                                            v-for="(column, columnIdx) in datasetAndColumn[subId].columns" 
                                            v-show="column.show" 
											@config-caculated-column="handleCaculatedColumnClick"
                                            :key="columnIdx"
											@remove-item="removeItem(columnIdx, datasetAndColumn[subId].columns)"
                                            :infoColumn="column" />
                                    </draggable>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    <!-- Danh sách các control ngoài table -->
                        <draggable
                            :clone="cloneColumn"
                            :list="dataset.columns"
                            :animation="250"
                            ghost-class="ghost-card"
                            :group="{ name: 'drop-column', pull: 'clone', put: false }"
                            >
                            <columnInfo 
                                class="column-dataset"
                                v-for="(column, columnIdx) in dataset.columns"
                                v-show="column.show" 
								@remove-item="removeItem(columnIdx, dataset.columns)"
								@config-caculated-column="handleCaculatedColumnClick"
                                :key="columnIdx"
                                :infoColumn="column" />
                        </draggable>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </VuePerfectScrollbar>
		<CalculatedColumnConfig ref="calculatedColumnConfig" @apply-configs="handlerApplyConfig" />
        <v-dialog
            v-model="showVariables"
            max-width="850px"
            scrollable
        >
        <v-card>
            <v-card-title>
                <span class="fs-16">Dashboard variables</span>
            </v-card-title>
            <v-card-text>
                <variables-pannel ref="dashboardVariables" :originDatasets="datasetAndColumn" class="bg-white w-100"/>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    class="btn-add"
                    @click="applyVariables"
                >
                    Apply
                </v-btn>

                <v-btn
                color="red darken-1"
                text
                @click="showVariables = false"
                >
                    {{$t("common.close")}}
                </v-btn>
            
            </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import draggable from "vuedraggable";
import columnInfo from "@/components/common/bi/ColumnInfo";
import DashboardDatasetWorker from 'worker-loader!@/worker/dashboard/dashboard/DashboardDataset.Worker.js';
import { util } from '../../../plugins/util';
import DatasetDetailTooltip from './DatasetDetailTooltip.vue';
import CalculatedColumnConfig from '@/components/common/bi/CalculatedColumnConfig'
import VariablesPannel from './VariablesPannel.vue';

export default {
    components:{
        VuePerfectScrollbar,
        draggable,
        columnInfo,
		CalculatedColumnConfig,
        DatasetDetailTooltip,
        VariablesPannel
    },
    computed:{
        datasetAndColumn(){
            return this.$store.state.dashboard.allDashboard[this.instanceKey].allDatasetColumns;
        },
        selectedDataset(){
            if (this.$store.state.dashboard.allDashboard[this.instanceKey].currentCellConfigs && this.$store.state.dashboard.allDashboard[this.instanceKey].currentCellConfigs.viewConfigs) {
                return this.$store.state.dashboard.allDashboard[this.instanceKey].currentCellConfigs.viewConfigs.selectedDataset;
            }
        },
        allDashboard(){
            return this.$store.state.dashboard.allDashboard;
        }
    },
    watch:{
        selectedDataset:{
            deep: true,
            immediate: true,
            handler(newVl){
                if (this.dashboardDatasetWorker) {
                    if (newVl) {
                        this.postSelectedDatasetBefor(newVl);
                    }else{
                        this.clearSelectedItemDisplay()
                    }
                }
             
            }
        }
    },
    props:{
        selectedCell:{
            type:Object,
            default(){
                return {}
            }
        },
        instanceKey:{
            default: '',
        }
    },
    data(){
        return{
            loadding:false,
            dashboardDatasetWorker:null,
            openedPanelParent:[],
            openedPanelChild:[],
            search:"",
            infoDataflows:[],
            dataSetDetail:null,
			showVariables:false,
			selectingCalculatedColumn: null,
        }
    },
    methods:{
		handlerApplyConfig(obj){
			for(let i in obj){
				this.selectingCalculatedColumn[i] = obj[i]
			}
		},
		handleCaculatedColumnClick(inforColumn, event){
			this.selectingCalculatedColumn = inforColumn
			this.$refs.calculatedColumnConfig.show(inforColumn, event)
		},
        showDashboardVariables(){
            this.showVariables = true;
            let vars = util.cloneDeep(this.allDashboard[this.instanceKey].dashboardConfigs.info.variables);
            setTimeout((self) => {
                self.$refs.dashboardVariables.setItems(Object.values(vars));
            }, 300, this);
        },
        applyVariables(){
            let vars = this.$refs.dashboardVariables.getItems();
            this.allDashboard[this.instanceKey].dashboardConfigs.info.variables = vars.reduce((map, el) => {
                map[el.name] = el;
                return map;
            }, {});
            this.showVariables = false;
        },
        onSearch(vl){
            // call function setOpenPanle để count max panle set all open khi search
            if(this.delayTimer){
                clearTimeout(this.delayTimer);
            }
            this.delayTimer = setTimeout((self) => {
                this.loadding = true;
                if (!vl) {
                    self.openedPanelParent = [];
                    self.openedPanelChild = [];
                }else{
                    self.dashboardDatasetWorker.postMessage({
                        action: 'setOpenPanel',
                        data:{
                            datasetAndColumn: self.datasetAndColumn
                        }
                    });
                }
                self.dashboardDatasetWorker.postMessage({
                    action: 'searchDatasetColumn',
                    data:{
                        datasetAndColumn: self.datasetAndColumn,
                        vl:vl
                    }
                });
            }, 300,this);
          
		},
		showDatasetSelector(){
			this.$emit('show-dataset-selector')
		},
		showRelationSelector(){
			this.$emit('show-relation-selector')
		},
        setOpenPanelAfter(data){
            this.openedPanelParent = data.openedPanelParent;
            this.openedPanelChild = data.openedPanelChild;
        },
        cloneColumn(item){
            let agg = item.type == 'number' ? 'sum':'first';
            return {
                name:item.name,
                type:item.type,
                dataset:item.id_dataset,
                agg:agg,
                edit:false,
                as:item.title?item.title:item.name,
                symper_id:item.symper_id,
                cond:{
                    type:'isall',
                    val:''
                },
                origin_type: item.origin_type,
                newClonedColumn: true
            }
        },
        clearSelectedItemDisplay(){
            this.dashboardDatasetWorker.postMessage({
				action: 'clearSelectedItemDisplay',
				data:{
                    datasetAndColumn: this.datasetAndColumn
				}
            });
		},
		removeItem(idx, arr){
			arr.splice(idx, 1)
		},
        clearSelectedItemDisplayAfter(data){
            let dataPos = {};
            dataPos.key = this.instanceKey;
            dataPos.data = data.datasetAndColumn;
            this.$store.commit("dashboard/addDatasetAndColumnInDashboard",dataPos);
        },
        searchDatasetColumnAfter(data){
            let dataPos = {};
            dataPos.key = this.instanceKey;
            dataPos.data = data.datasetAndColumn;
            this.$store.commit("dashboard/addDatasetAndColumnInDashboard",dataPos);
            setTimeout((self) => {
                self.loadding = false;
            }, 100,this);
        },
        postSelectedDatasetBefor(selectedDataset){
            this.dashboardDatasetWorker.postMessage({
				action: 'postSelectedDatasetBefor',
				data:{
                    selectedDataset: selectedDataset,
                    datasetAndColumn: this.datasetAndColumn
				}
            });
        },
        postSelectedDatasetAfter(data){
            let dataPos = {};
            dataPos.key = this.instanceKey;
            dataPos.data = data.datasetAndColumn;
            this.$store.commit("dashboard/addDatasetAndColumnInDashboard",dataPos);
        },
        listenFromWorker(){
            let self = this;
            this.dashboardDatasetWorker.addEventListener("message", function (event) {
                let data = event.data;
                let action = data.action;
                if(self[action]){
                    self[action](data.data);
                } else {
                    console.error(` action ${action} not found `);
                }
            });
        },
        getColumnDataset(listDataset){
            this.dashboardDatasetWorker.postMessage({
				action: 'getColumnDataset',
				data:{
                    listDataset: listDataset,
                    listColumnInDataset: this.$store.state.dashboard.listColumnInDataset
				}
            });
        },
        postGetColumnDatasetAfter(data){
            let dataPos = {};
            dataPos.key = this.instanceKey;
            dataPos.data = data.datasetAndColumn;
            this.$store.commit("dashboard/addDatasetAndColumnInDashboard",dataPos);

            let listColumnInDataset = data.listColumnInDataset;
            this.$store.commit("dashboard/setListColumnInDataset",listColumnInDataset);
            this.getInfoDataFlow();

        },
        getInfoDataFlow(){
            this.dashboardDatasetWorker.postMessage({
				action: 'getInfoDataFlow',
				data:{
                    datasetAndColumn: this.datasetAndColumn
				}
            });
		},
		addMeasureToDataset(dataset){
			let newCol = {
				id: Date.now() + '',
				id_dataset: dataset.id,
				isSelected: false,
				name: 'new_column_' + dataset.columns.length,
				origin_type: "text",
				show: true,
				title: "New column " + dataset.columns.length,
				type: "text",
				formula: '',
				showMeasureConfig: false,
				calculation: 'measure', // phục vụ cho hiển thị xem cột này tính toán từ đâu: measure hay caculated field
			};
			dataset.columns.unshift(newCol);
			// this.refsToColumns[dataset.id + newCol.name] = newCol;
			// SDashboardEditor.trackingMeasureInDataset(dataset, newCol);
		},
        getInfoDataFlowAfter(data){
            if (Array.isArray(data.infoDataFlow)) {
                this.infoDataflows = data.infoDataFlow;
            }else{
                this.infoDataflows = [data.infoDataFlow];
            }
        },
        removeDataset(dataset){
            let idDataset = dataset.id;
            let datasetColumn = util.cloneDeep(this.datasetAndColumn);
            if (dataset.subDatasetIds && dataset.subDatasetIds.length > 0) {
                for (let i = 0; i < dataset.subDatasetIds.length; i++) {
                    delete datasetColumn[dataset.subDatasetIds[i]];                    
                }
            }
            delete datasetColumn[idDataset];

            let dataPos = {};
            dataPos.key = this.instanceKey;
            dataPos.data = datasetColumn;
            this.$store.commit("dashboard/addDatasetAndColumnInDashboard",dataPos);

        },
        showDetailDataset(dataset){
            if (dataset.type == 'doc') {
                this.dataSetDetail = dataset
            }else{
                let infoDataFlow = this.infoDataflows.find(ele => ele.id == dataset.id);
                if (infoDataFlow) {
                    infoDataFlow.type = 'dataset_by_dataflow'
                    this.dataSetDetail = infoDataFlow;
                }
            }
        }
    },
    created(){
        this.dashboardDatasetWorker = new DashboardDatasetWorker();
        this.listenFromWorker();
    }

}
</script>

<style scoped>
.ghost-card {
    opacity: 0.5;
    background: #F7FAFC;
    border: 1px solid #4299e1;
}
.v-expand-header{
    min-height: 20px;
}
.icon-table {
    flex: none;
}
.sym-v-expand-content >>>.v-expansion-panel-content__wrap{
    padding: 0px;
    padding-left: 16px;
}
.selected-dataset-mark{
    position: absolute;
    top: 0px;
    font-size: 12px;
    left: 12px;
    color: #f58634;
}
.dataset-item-title{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.dataset-item-title:hover{
    text-decoration: underline;
}
.sym-expand-panel{
    margin-top: 0px ;
}
.btn-add-column{
	cursor: pointer;
	background-color: #ffffff;
	z-index: 10000;
	width: 100px
}
.menu-add-column{
	opacity: 0;
	position: absolute;
	right: 22px;
	z-index: 10000;
}
.sym-expand-panel-header:hover .menu-add-column{
	opacity: 1;
}
.btn-add-column:hover{
	background-color: lightgray;
}
</style>
<style >
.sym-expand-panel-header:hover	.v-expansion-panel-header__icon{
	opacity: 0;
}
</style>