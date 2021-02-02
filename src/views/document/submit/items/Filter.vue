<template>
    <div class="content-filter">
        <div class="search-filter">
            <v-text-field
                prepend-inner-icon="mdi-magnify"
                outlined
                dense
                height="30"
                class="search"
                @keyup="handleKeyupSearch"
                v-model="search"
                hide-details
            ></v-text-field>
        </div>
        <div>
            Tìm kiếm trên các trường {{fieldSearch}}
        </div>
        <div class="content-table">
            <!-- :style="{'max-height':tableMaxHeight+'px','overflow':'auto'}" -->
            <!-- <data-table ref="dataTable" :isRenderAllRows="true" :columns="columns" @cell-change="cellChange" :data="data" class="hot-table" ></data-table> -->
            <ag-grid-vue
            style="width: 100%; height: 100%;"
            class="ag-theme-alpine"
            :columnDefs="columnDefs"
            :defaultColDef="defaultColDef"
            :gridOptions="gridOptions"
            :getRowHeight="getRowHeight"
            @grid-ready="onGridReady"
            :rowData="rowData">
            </ag-grid-vue>
        </div>
        <div class="footer-filter">
            <span class="total-record">Tổng số bản ghi: {{totalRecord}}</span>
            <v-btn @click="saveInputFilter" small color="primary" right class="save-input-filter">Lưu</v-btn>
        </div>
    </div>
</template>
<script>
import PerfectScrollbar from "perfect-scrollbar";
import DataTable from './../../../../components/common/customTable/DataTable.vue';
import { str } from "./../../../../plugins/utilModules/str.js";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridVue } from 'ag-grid-vue';
import { getControlInstanceFromStore } from '../../common/common';
import { util } from '../../../../plugins/util';
export default {
    components:{
        'data-table':DataTable,
        'ag-grid-vue':AgGridVue
    },
    props:{
        keyInstance:{
            type:Number,
            default:0
        },
        tableMaxHeight:{
            type: Number,
            default: 450
        }
    },
    data(){
        return {
            columns:null,
            data:null,
            formulas:null,
            search:null,
            controlName:null,
            fieldSearch:"",
            totalRecord:0,
            columnDefs: null,
            defaultColDef: null,
            rowData: null,
            gridOptions: null,
        }
    },
    beforeMount(){
        this.columns = []
        this.data = []
        this.gridOptions = {
            headerHeight:25,
            enableRangeSelection: true,
            rowBuffer: 0,
            rowSelection:'multiple'
        };
        
        this.defaultColDef = {
            minWidth: 150,
            sortable: true,
            resizable: true,
            filter: true,
            autoHeight:true,
            editable:true,
            wrapText:true,
        };
    },
    methods:{
        onGridReady(params){
			const agBodyViewport = document.querySelector('.content-filter .ag-body-viewport');
			const agBodyHorizontalViewport = document.querySelector('.content-filter .ag-body-horizontal-scroll-viewport');
			if (agBodyViewport) {
			const ps = new PerfectScrollbar(agBodyViewport);
				ps.update();
			}
			if (agBodyHorizontalViewport) {
			const ps = new PerfectScrollbar(agBodyHorizontalViewport);
				ps.update();
			}
		},
        getRowHeight:function (params) {
            return 25;
        },
        setData(data){
            let dataTable = [];
            this.columnDefs = [];
            for (let index = 0; index < data.length; index++) {
                let row = data[index];
                if(index == 0){
                    for(let c in row){
                        let colName = str.nonAccentVietnamese(c);
                        let item = {field:colName,headerName:c,type:'text',editable:false};
                        if(this.columnDefs.length == 0){
                            item.headerCheckboxSelection = true;
                            item.checkboxSelection = true;
                        }
                        this.columnDefs.push(item)
                    }
                }
                let item1 = {};
                for(let c in row){
                    let colName = str.nonAccentVietnamese(c);
                    item1[colName] = row[c];
                }
                dataTable.push(item1)
            }   
            this.rowData = null;
            this.rowData = dataTable;
            this.totalRecord = dataTable.length;
            setTimeout((self) => {
                self.setSelection();
            }, 500,this);
        },
        setSelection(){
            let controlIns = getControlInstanceFromStore(this.keyInstance, this.controlName);
            let currentValue = util.cloneDeep(controlIns.value);
            this.gridOptions.api.forEachNode(node => {
                let nodeData = node.data;
                if(currentValue.indexOf(nodeData[controlIns.name]) != -1){
                    node.setSelected(true);
                }
            });
        },
        saveInputFilter(){
            let listRowSelection = this.gridOptions.api.getSelectedRows();
            if(listRowSelection.length > 0){
                listRowSelection = listRowSelection.reduce((arr,obj)=>{
                    arr.push("'"+obj[this.controlName]+"'");
                    return arr;
                },[]);
            }
            this.$emit('save-input-filter',
            {value: (listRowSelection.length > 0) ? listRowSelection.join(',') : "",controlName:this.controlName}
            );
        },
        setFormulas(formulas){
            this.formulas = formulas;
            this.getSearchField(formulas.instance.formulas)
        },
        setControlName(controlName){
            this.controlName = controlName;
        },
        getSearchField(formulas){
            let titleFieldSearch = []
            let mapColumnToAlias = {}
            let allColumnQuery = formulas.match(/([0-9a-zA-Z_]+)\s+as\s+("(.*?)"|([0-9a-zA-Z_]+))/gm);
            for (let index = 0; index < allColumnQuery.length; index++) {
                const fieldSelect = allColumnQuery[index];
                fieldSelect = fieldSelect.split(' as ');
                if(fieldSelect.length > 1){
                    mapColumnToAlias[fieldSelect[0]] = fieldSelect[1].replace(/\"/gm,"");
                }
                else{
                    mapColumnToAlias[fieldSelect[0]] = fieldSelect[0].replace(/\"/gm,"");
                }
            }
            let allFieldCondition = formulas.match(/[a-zA-Z0-9_][^\s]*(?= ilike)/gm);
            if(allFieldCondition){
                for (let index = 0; index < allFieldCondition.length; index++) {
                    const controlTitle = (mapColumnToAlias.hasOwnProperty(allFieldCondition[index])) ? mapColumnToAlias[allFieldCondition[index]] : "";
                    titleFieldSearch.push(controlTitle)
                }
            }
            
            if(titleFieldSearch.length>0){
                this.fieldSearch = titleFieldSearch.join(", ")
            }  
        },
        handleKeyupSearch(data){
            this.$emit('search-data',{controlName:this.controlName,search:this.search})
        }
    }
}
</script>

<style scoped> 
    .search >>> .v-input__slot{
        min-height: unset !important;
        margin-top: 8px;
        padding-left: 8px !important;
    }
    .search >>> input{
        font-size: 13px;
    }
    .search >>> .v-input__prepend-inner{
        margin-top: 3px !important;
    }
    .search >>> .mdi{
        font-size: 20px !important;
    }
    .search >>> .v-label{
        font-size: 13px;
        top: 6px !important;
    }
    .search >>> fieldset{
        border-color:#c1c1c1 !important;
    }
    .save-input-filter{
        float: right;
        margin-right: 8px;
        margin-top: 6px;
    }
    .hot-table >>> .handsontable:first-child:not(.ht_master){
        overflow-x: hidden !important;
        overflow-y: auto !important;
    }
    .hot-table >>> .handsontable .ht_master thead{
        visibility: visible !important;
    }
    .hot-table >>> .handsontable .ht_master .wtHolder{
        overflow-y: hidden !important;
    }
    .content-table{
        height: calc(100% - 90px);
        overflow: hidden;
        font-size: 12px;
    }
    .content-filter{
        height: 100%;
    }
    .footer-filter .total-record{
        display: inline-block;
        margin-top: 16px;
    }
    .content-filter >>> .ag-theme-alpine .ag-cell{
        line-height: 20px!important;
    }
  
</style>