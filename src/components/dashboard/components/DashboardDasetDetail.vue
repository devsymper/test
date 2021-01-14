<template>
    <div class="h-100 fs-13" style="width:260px;">
        <div>
            <v-icon>mdi-chevron-right</v-icon>
            Fields
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
            v-model="search"
            label="Search"
            :placeholder="$t('common.search')"
            style="width: inherit"
        ></v-text-field>
        <VuePerfectScrollbar 
            style="height:calc(100% - 100px)">
            <v-expansion-panels
                multiple
                flat
                style="overflow: hidden;"
                v-model="openedPanelParent"
            >
                <v-expansion-panel class="sym-expand-panel " v-for="(dataset,idx) in datasetAndColumn" :key="idx" v-show="dataset.show && !dataset.isSubDataset">
                    <v-expansion-panel-header class="v-expand-header px-4 py-0">
                        <v-icon class="fs-15 icon-table">mdi-table-large</v-icon>
                        <v-icon class="selected-dataset-mark" v-if="dataset.isSelected">mdi-check-circle</v-icon>
                        <span class="dataset-item-title fs-13 pl-2">{{dataset.title}}</span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                        <v-expansion-panels
                            multiple
                            flat
                            style="overflow: hidden;"
                            v-model="openedPanelChild"
                        >
                            <!-- Danh sách các table trong doc -->
                            <v-expansion-panel class="sym-expand-panel" v-for="(subId,idx) in dataset.subDatasetIds" :key="idx"  v-show="datasetAndColumn[subId].show" >
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
export default {
    components:{
        VuePerfectScrollbar,
        draggable,
        columnInfo
    },
    computed:{

    },
    props:{
        selectedCell:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    data(){
        return{
            openedPanelParent:[],
            openedPanelChild:[],
            search:"",
               datasetAndColumn:{
                "3665": {
                "id": "3665",
                "name": "symper_wbs",
                "type": "doc",
                "uid": null,
                "status": null,
                "id_database": null,
                "alias_name": "SYMPER Wbs",
                "generated_sql": null,
                "created_at": null,
                "updated_at": null,
                "symper_id": "2186",
                "table_name": null,
                "id_parent": null,
                "list_foreign_key": [],
                "title": "SYMPER Wbs",
                "show": true,
                "subDatasetIds": [
                "3666"
                ],
                "isSelected": false,
                "columns": [
                {
                    "id": "469194",
                    "name": "id_bug",
                    "title": "BUG ID",
                    "type": "text",
                    "uid": "",
                    "id_dataset": "3665",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "text",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469195",
                    "name": "priority",
                    "title": "MỨC ĐỘ ƯU TIÊN",
                    "type": "text",
                    "uid": "",
                    "id_dataset": "3665",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "text",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469196",
                    "name": "so_id",
                    "title": "SỐ ID",
                    "type": "number",
                    "uid": "",
                    "id_dataset": "3665",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "number",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469197",
                    "name": "ma_module",
                    "title": "MODULE",
                    "type": "text",
                    "uid": "",
                    "id_dataset": "3665",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "text",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469198",
                    "name": "tong_tg",
                    "title": "Tổng thời gian",
                    "type": "number",
                    "uid": "",
                    "id_dataset": "3665",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "number",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469199",
                    "name": "ngay_end_tt",
                    "title": "NGÀY END TT",
                    "type": "date",
                    "uid": "",
                    "id_dataset": "3665",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "date",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469200",
                    "name": "task_des",
                    "title": "TASK DESCRIPTION",
                    "type": "text",
                    "uid": "",
                    "id_dataset": "3665",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "text",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469201",
                    "name": "chi_tiet",
                    "title": "CHI TIẾT CÔNG VIỆC",
                    "type": "text",
                    "uid": "",
                    "id_dataset": "3665",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "text",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469202",
                    "name": "mo_ta_bug",
                    "title": "Mô tả bug",
                    "type": "text",
                    "uid": "",
                    "id_dataset": "3665",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "text",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469203",
                    "name": "ngay_start",
                    "title": "NGÀY KHỞI TẠO",
                    "type": "date",
                    "uid": "",
                    "id_dataset": "3665",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "date",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469204",
                    "name": "assignee",
                    "title": "ASSIGNEE",
                    "type": "text",
                    "uid": "",
                    "id_dataset": "3665",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "text",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469205",
                    "name": "ngay_end",
                    "title": "NGÀY END",
                    "type": "date",
                    "uid": "",
                    "id_dataset": "3665",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "date",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469206",
                    "name": "ten_module",
                    "title": "TÊN MODULE",
                    "type": "text",
                    "uid": "",
                    "id_dataset": "3665",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "text",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469207",
                    "name": "ma_wbs",
                    "title": "WBS",
                    "type": "text",
                    "uid": "",
                    "id_dataset": "3665",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "text",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469208",
                    "name": "tong_tg_tt",
                    "title": "Tổng thời gian TT",
                    "type": "number",
                    "uid": "",
                    "id_dataset": "3665",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "number",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469209",
                    "name": "reporter",
                    "title": "REPORTER",
                    "type": "text",
                    "uid": "",
                    "id_dataset": "3665",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "text",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469210",
                    "name": "loai",
                    "title": "LOẠI TASK",
                    "type": "text",
                    "uid": "",
                    "id_dataset": "3665",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "text",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469211",
                    "name": "ttsd",
                    "title": "TRẠNG THÁI",
                    "type": "text",
                    "uid": "",
                    "id_dataset": "3665",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "text",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469212",
                    "name": "giai_phap",
                    "title": "GIẢI PHÁP",
                    "type": "text",
                    "uid": "",
                    "id_dataset": "3665",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "text",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469213",
                    "name": "wbs_id",
                    "title": "WBS ID",
                    "type": "text",
                    "uid": "",
                    "id_dataset": "3665",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "text",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                }
                ]
            },
            "3666": 
            {
                "id": "3666",
                "name": "tb1",
                "type": "doc",
                "uid": null,
                "status": "1",
                "id_database": "1",
                "alias_name": "TB1",
                "generated_sql": "",
                "created_at": "2021-01-12 22:40:02",
                "updated_at": "2021-01-12 22:40:02",
                "symper_id": "2187",
                "table_name": "document_child_symper_wbs_tb1",
                "id_parent": "3665",
                "list_foreign_key": [],
                "show": true,
                "isSubDataset": true,
                "title": "TB1",
                "isSelected": false,
                "columns": [
                {
                    "id": "469214",
                    "name": "tb1_ngay_kt",
                    "title": "Ngày kết thúc",
                    "type": "date",
                    "uid": "",
                    "id_dataset": "3666",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "date",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469215",
                    "name": "tb1_task_id",
                    "title": "Task ID",
                    "type": "text",
                    "uid": "",
                    "id_dataset": "3666",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "text",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469216",
                    "name": "tb1_priority",
                    "title": "TB1 PRIORITY",
                    "type": "text",
                    "uid": "",
                    "id_dataset": "3666",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "text",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469217",
                    "name": "tb1_duration",
                    "title": "TB1 DURATION",
                    "type": "number",
                    "uid": "",
                    "id_dataset": "3666",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "number",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469218",
                    "name": "tb1_cv",
                    "title": "TB1 CV",
                    "type": "text",
                    "uid": "",
                    "id_dataset": "3666",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "text",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                },
                {
                    "id": "469219",
                    "name": "tb1_ngay_bd",
                    "title": "Ngày bắt đầu",
                    "type": "date",
                    "uid": "",
                    "id_dataset": "3666",
                    "created_at": "2021-01-12 22:40:02",
                    "origin_type": "date",
                    "updated_at": "2021-01-12 22:40:02",
                    "list_foreign_key": [],
                    "show": true,
                    "isSelected": false
                }
                ]
            }
            },
         
        }
    },
    methods:{
        onSearch(vl){
            $('.sym-expand-panel .column-dataset').removeClass('d-none');
            $('.sym-expand-panel .column-dataset:not(:contains("' + vl + '"))').addClass('d-none');
        },
        cloneColumn(item){
            let agg = item.type == 'number'?'sum':'first';
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
                origin_type: item.origin_type
            }
        },
        clearSelectedItemDisplay(){
            for(let key in this.datasetAndColumn){
                this.datasetAndColumn[key].isSelected = false;
                if (this.datasetAndColumn[key].columns.length > 0) {
                    let columns = this.datasetAndColumn[key].columns;
                    for (let i = 0; i < columns.length; i++) {
                        columns[i].isSelected = false;
                    }
                }
            }
        },
        setSelectedDataset(selectedDataset,setSelect = true){
            for(let dtsId in selectedDataset){
                let dtsInfo = this.datasetAndColumn[dtsId];
                if(!dtsInfo){
                    continue;
                }
                dtsInfo.isSelected = setSelect;
                this.datasetAndColumn[dtsId].isSelected = setSelect;
                for(let name in selectedDataset[dtsId]){
                    let column = this.datasetAndColumn[dtsId].columns.find(ele => ele.name == name);
                    if (column) {
                        column.isSelected = setSelect;
                    }
                }
                if(dtsInfo.id_parent && this.datasetAndColumn[dtsInfo.id_parent]){
                    this.datasetAndColumn[dtsInfo.id_parent].isSelected = setSelect;
                }
            }
        },

    },
    created(){

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
</style>