<template>
     <ag-grid-vue :style="{
         width: '100%',
         height: tableHeight
     }"
                 class="ag-theme-balham"
                 :gridOptions="gridOptions"
                 :defaultColDef="defaultColDef"
                 :autoGroupColumnDef="autoGroupColumnDef"
                 :columnDefs="columns"
                 @first-data-rendered="firstDataRendered"
                 @cell-editing-started="cellEditingStarted"
                 @cell-value-changed="cellValueChanged"
                 :rowData="rowDataTable"
                 :treeData="true"
                :animateRows="true"
                :groupDefaultExpanded="groupDefaultExpanded"
                :frameworkComponents="frameworkComponents"
                :modules="modules"
                 :getDataPath="getDataPath"
                 >
    </ag-grid-vue>
</template>
<script>
import {AgGridVue} from "ag-grid-vue";
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-balham.css';
import { util } from '../../../plugins/util';
import ImageRenderer from './ImageRenderer';
import CheckBoxRenderer from './CheckBoxRenderer';
import Vue from "vue";


export default {
    props:{
        tableHeight: {
            type: String,
            default: 'calc(100% - 40px)'
        },
        // Danh sách tất cả các column theo định dạng của ag grid
        allColumns:{
            type:Array,
            default: function () { return [] }
        },
        
        // Data để đổ vào table: dựa theo định dạng của ag grid
        rowData:{
            type:Array,
            default: function () { return [] }
        },
        
        // Có cho phép edit dữ liệu của table hay không
        editable: {
            default: true
        },

        // Đăng ký các component phục vụ việc custom render cell trong table
        customComponents: {
            default(){
                return {}
            }
        },

        // tìm keyword trong https://www.ag-grid.com/javascript-grid-provided-renderer-group/ để biết thêm thông tin chi tiết
        cellRendererParams: {
            default(){
                return {}
            }
        },
    },
    data(){
        return {
            gridOptions:null,
            modules: [
                RowGroupingModule,
            ],
            defaultColDef: null,
            autoGroupColumnDef: null,
            columns:[],
            rowDataTable:[],
            modules: [ClientSideRowModelModule, RowGroupingModule],
            autoGroupColumnDef: null,
            groupDefaultExpanded: null,
            getDataPath: null,
            frameworkComponents: null,
        }
    },
    components: {
        AgGridVue
    },
    watch:{
        rowData(){
            this.rowDataTable = this.rowData
        }
    },
    beforeMount(){
        this.defaultColDef = {
            minWidth: 100,
            filter: true,
            sortable: true,
            resizable: true,
        };
        this.autoGroupColumnDef = { minWidth: 100 };
        this.gridOptions = {};
        this.columns = this.allColumns;
        this.rowDataTable = this.rowData;
        this.autoGroupColumnDef = {
            editable:this.editable,
            field:'name',
            headerName: 'Tên',
            minWidth: 200,
            cellRendererParams: this.cellRendererParams,
            valueSetter: function(params){
                let x = util.cloneDeep(params.newValue)
                let y = util.cloneDeep(params.oldValue);
                if(params.data['name'].length > 1){
                    params.data['name'][1] = x
                }
                else{
                    params.data['name'][0] = x
                }
                params.oldValue = y
            }
        };
        this.groupDefaultExpanded = -1;
        this.getDataPath = data => {
            return data.name;
        };

        this.frameworkComponents = {};
        for(let key in this.customComponents){
            this.frameworkComponents[key] = Vue.extend(this.customComponents[key])
        }
    },
    
    mounted(){
        // this.gridOptions.api.sizeColumnsToFit();
    },  
    methods:{
        refreshData(columns){
            this.gridOptions.api.clearFocusedCell()
            this.columns = columns;
            this.gridOptions.api.refreshCells();
            this.autoSizeAll(false);
        },
        refreshCell(rowNode,key,value){
            this.gridOptions.api.clearFocusedCell()
            rowNode.setDataValue(key,value);
            this.gridOptions.api.refreshCells({columns:[key]});
        },
        autoSizeAll(skipHeader) {
            var allColumnIds = [];
            this.gridOptions.columnApi.getAllColumns().forEach(function(column) {
                allColumnIds.push(column.colId);
            });
            this.gridOptions.columnApi.autoSizeColumns(allColumnIds, skipHeader);
        },
        firstDataRendered(params){
            // this.autoSizeAll(false)
        },
        cellEditingStarted(params){
            let rowNode = params.node;
            this.$emit('on-cell-click',{rowNode:rowNode,col:params.colDef,rowData:params.data,controlName:params.data.name[params.data.name.length - 1],curValue:params.value}); 
        },
        cellValueChanged(params){
            this.$emit('on-cell-change',params)
        },
        
    },
}
    
    
</script>