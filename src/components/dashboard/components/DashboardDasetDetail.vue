<template>
    <div class="w-100 h-100 fs-13" >
        <div class="pt-2 d-flex">
            <v-icon>mdi-chevron-right</v-icon>
            <div style="width:95%;padding-top:3px">
                <span class="font-weight-medium">Fields</span> 
                <v-icon @click="showDatasetSelector" class="float-right fs-16 mx-3">mdi-database</v-icon>
                <v-icon @click="showRelationSelector" class="float-right fs-16" >mdi-relation-zero-or-one-to-one-or-many</v-icon>
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
                    <v-expansion-panel-header class="v-expand-header px-4 py-0">
                        <v-icon v-if="dataset.type == 'doc'" class="fs-15 icon-table">mdi-table-large</v-icon>
                        <v-icon v-else class="fs-15 icon-table">mdi-view-module-outline</v-icon>
                        <v-icon class="selected-dataset-mark" v-if="dataset.isSelected">mdi-check-circle</v-icon>
                        <span :title="dataset.title" class="dataset-item-title fs-13 pl-2">{{dataset.title}}</span>
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
                                <v-expansion-panel-header class="v-expand-header px-4 py-0">
                                    <v-icon class="fs-15 icon-table">mdi-table-large</v-icon>
                                    <v-icon class="selected-dataset-mark" v-if="dataset.isSelected">mdi-check-circle</v-icon>
                                    <span class="dataset-item-title fs-13 pl-2">{{datasetAndColumn[subId].title}}</span>
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
                                            :key="columnIdx"
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
                                :key="columnIdx"
                                :infoColumn="column" />
                        </draggable>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </VuePerfectScrollbar>
    </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import draggable from "vuedraggable";
import columnInfo from "@/components/common/bi/ColumnInfo";
import DashboardDatasetWorker from 'worker-loader!@/worker/dashboard/dashboard/DashboardDataset.Worker.js';

export default {
    components:{
        VuePerfectScrollbar,
        draggable,
        columnInfo
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
            return this.$store.state.dashboard;
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
            dataSetTest :[{"id":"2833","name":"x_sgcnl","type":"doc","uid":null,"status":null,"id_database":null,"alias_name":"[BM.10.02] SỔ G.CA BP GCNL","generated_sql":null,"created_at":null,"updated_at":null,"symper_id":"1747","table_name":null,"id_parent":null,"list_foreign_key":[],"title":"[BM.10.02] SỔ G.CA BP GCNL"},{"id":"2865","name":"x_bcsx_ngay","type":"doc","uid":null,"status":null,"id_database":null,"alias_name":"VID-BCSX NGÀY","generated_sql":null,"created_at":null,"updated_at":null,"symper_id":"1787","table_name":null,"id_parent":null,"list_foreign_key":[],"title":"VID-BCSX NGÀY"},{"id":"2891","name":"lk_bcsxnl_th","type":"dataset_by_dataflow","uid":null,"status":null,"id_database":null,"alias_name":"lk_bcsxnl_th","generated_sql":null,"created_at":null,"updated_at":null,"symper_id":"0","table_name":null,"id_parent":null,"list_foreign_key":[],"title":"lk_bcsxnl_th"},{"id":"2892","name":"lk_bcsxnl_na","type":"dataset_by_dataflow","uid":null,"status":null,"id_database":null,"alias_name":"lk_bcsxnl_na","generated_sql":null,"created_at":null,"updated_at":null,"symper_id":"0","table_name":null,"id_parent":null,"list_foreign_key":[],"title":"lk_bcsxnl_na"},{"id":"2893","name":"lk_bcsxth_na","type":"dataset_by_dataflow","uid":null,"status":null,"id_database":null,"alias_name":"lk_bcsxth_na","generated_sql":null,"created_at":null,"updated_at":null,"symper_id":"0","table_name":null,"id_parent":null,"list_foreign_key":[],"title":"lk_bcsxth_na"},{"id":"2894","name":"lk_bcsxth_th","type":"dataset_by_dataflow","uid":null,"status":null,"id_database":null,"alias_name":"lk_bcsxth_th","generated_sql":null,"created_at":null,"updated_at":null,"symper_id":"0","table_name":null,"id_parent":null,"list_foreign_key":[],"title":"lk_bcsxth_th"},{"id":"2895","name":"lk_bcsxln_na","type":"dataset_by_dataflow","uid":null,"status":null,"id_database":null,"alias_name":"lk_bcsxln_na","generated_sql":null,"created_at":null,"updated_at":null,"symper_id":"0","table_name":null,"id_parent":null,"list_foreign_key":[],"title":"lk_bcsxln_na"},{"id":"2896","name":"lk_bcsxln_th","type":"dataset_by_dataflow","uid":null,"status":null,"id_database":null,"alias_name":"lk_bcsxln_th","generated_sql":null,"created_at":null,"updated_at":null,"symper_id":"0","table_name":null,"id_parent":null,"list_foreign_key":[],"title":"lk_bcsxln_th"},{"id":"2897","name":"lk_bcsxm_th","type":"dataset_by_dataflow","uid":null,"status":null,"id_database":null,"alias_name":"lk_bcsxm_th","generated_sql":null,"created_at":null,"updated_at":null,"symper_id":"0","table_name":null,"id_parent":null,"list_foreign_key":[],"title":"lk_bcsxm_th"},{"id":"2898","name":"lk_bcsxm_na","type":"dataset_by_dataflow","uid":null,"status":null,"id_database":null,"alias_name":"lk_bcsxm_na","generated_sql":null,"created_at":null,"updated_at":null,"symper_id":"0","table_name":null,"id_parent":null,"list_foreign_key":[],"title":"lk_bcsxm_na"},{"id":"2899","name":"lk_bcsxsp_th","type":"dataset_by_dataflow","uid":null,"status":null,"id_database":null,"alias_name":"lk_bcsxsp_th","generated_sql":null,"created_at":null,"updated_at":null,"symper_id":"0","table_name":null,"id_parent":null,"list_foreign_key":[],"title":"lk_bcsxsp_th"},{"id":"3347","name":"sgcth1","type":"dataset_by_dataflow","uid":null,"status":null,"id_database":null,"alias_name":"sgcth1","generated_sql":null,"created_at":null,"updated_at":null,"symper_id":"0","table_name":null,"id_parent":null,"list_foreign_key":[],"title":"sgcth1"}]
        }
    },
    methods:{
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
        postSelectedDatasetBefor(selectedDataset,setSelect = true){
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
.sym-expand-panel{
    margin-top: 0px ;
}
</style>