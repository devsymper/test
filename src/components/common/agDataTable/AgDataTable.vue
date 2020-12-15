<template>
     <ag-grid-vue :style="{
         width: '100%',
         height: tableHeight
     }"
                 :class="{'ag-theme-balham': true, 'like-handson-table': likeHandsonTable == true, 'hide-row-border': hideRowBorderCss == true}"
                 :gridOptions="gridOptions"
                 :defaultColDef="defaultColDef"
                 :autoGroupColumnDef="autoGroupColumnDef"
                 :columnDefs="columns"
                 @first-data-rendered="firstDataRendered"
                 @cell-editing-started="cellEditingStarted"
                 @cell-value-changed="cellValueChanged"
                 @cell-double-clicked="cellDoubleClick"
                 @cell-clicked="cellClicked"
                 @cell-context-menu="cellContextMenu($event)"
                 @cell-mouse-over="cellMouseOver"
                 @cell-mouse-out="cellMouseOut"
                 :rowData="rowDataTable"
                 :treeData="true"
                 :animateRows="true"
                 :enableRangeSelection="true"
                 :allowContextMenuWithControlKey="true"
                 :groupDefaultExpanded="groupDefaultExpanded"
                 :frameworkComponents="frameworkComponents"
                 :modules="modules"
                 :getDataPath="getDataPath"
                 @grid-ready="onGridReady"
                 >
    </ag-grid-vue>
</template>
<script>
import {AgGridVue} from "ag-grid-vue";
import { MenuModule } from '@ag-grid-enterprise/menu';
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
        minWidth:{
            type: Number,
            default:400
        },

        // tìm keyword trong https://www.ag-grid.com/javascript-grid-provided-renderer-group/ để biết thêm thông tin chi tiết
        cellRendererParams: {
            default(){
                return {}
            }
        },
        groupColumnCellEditorName: {
            default(){
                return {}
            }
        },
        // css like handson table
        likeHandsonTable:{
            type: Boolean,
            default: false
        },
        hideRowBorderCss:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return {
            gridOptions:null,
            modules: [
                MenuModule,
                RowGroupingModule,
                ClientSideRowModelModule,
                RowGroupingModule
            ],
            defaultColDef: null,
            autoGroupColumnDef: null,
            columns:[],
            rowDataTable:[],
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
        this.gridOptions.rowHeight = 20.5;
		this.columns = this.allColumns;
        this.rowDataTable = this.rowData;
        this.autoGroupColumnDef = {
            editable:this.editable,
            field:'name',
            headerName: 'Tên',
            minWidth: this.minWidth,
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
            },
           
            cellEditor: this.groupColumnCellEditorName
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
    },  
    methods:{
        cellContextMenu(params,x){
			params.event.preventDefault()
            params.event.stopPropagation()
            this.$emit('on-cell-context-menu', params)
        },
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
        autoSizeAll(skipHeader){
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
        cellDoubleClick(params){
            params.event.preventDefault()
            params.event.stopPropagation()
            this.$emit('on-cell-dbl-click',params)
        },
        cellClicked(params){
            this.$emit('on-cell-click',params)
        },
        cellMouseOver(params){
            this.$emit('on-cell-mouse-over',params)
        },
        cellMouseOut(params){
            this.$emit('on-cell-mouse-out',params)
        },
        onGridReady(param){
            this.$emit('grid-ready', param)
        }
        
    },
}
    
    
</script>
<style scoped>
    .like-handson-table >>> .ag-header{
        background-color: #FFFFFF;
        
    }
    .like-handson-table >>> .ag-header-icon .ag-icon{
        display: inline-block;
    }
    .like-handson-table >>> .ag-row{
        background-color: #FFFFFF;
    }
    .like-handson-table >>> .ag-row:hover{
        background-color:unset;
    }
    .like-handson-table >>> .ag-cell-wrapper span{
        margin-left:0px
    }
    .like-handson-table >>> .ag-cell-wrapper .ag-row-group .ag-row-group-indent-3 {
        padding-left: 0px !important;
    }
     .like-handson-table >>> .ag-header{
        min-height:unset !important;
        height: 28px !important;
    }
     .like-handson-table >>> .ag-header .ag-header-cell-text,
     .like-handson-table >>> .ag-header .ag-header-icon{
         margin-bottom:9px;
         font:12px roboto;
         font-weight: 600;
    }
     .like-handson-table >>> .ag-row{
         /* transform: translateY(20px) !important; */
    }
    /* .like-handson-table >>> .ag-cell-wrapper.ag-row-group[class*="ag-row-group-indent"],
    .like-handson-table >>> .ag-cell-wrapper.ag-row-group-leaf-indent[class*="ag-row-group-indent"] {
      padding-left: 2;
    } */
    .like-handson-table >>> .ag-cell-wrapper.ag-row-group{
        align-items:unset !important;
    }
    .like-handson-table >>> .ag-cell{
        margin-bottom:unset;
    }
    .like-handson-table >>> .ag-cell-wrapper {
        /* height:unset !important */
    }
    .like-handson-table >>> .ag-cell{
        line-height: unset !important;
    }
    .like-handson-table >>> .ag-group-child-count{
        display:none !important;
    }
    .like-handson-table >>> .ag-group-expanded,
    .like-handson-table >>> .ag-group-contracted{
        height: unset !important;
    }
    .hide-row-border >>> .ag-row{
        border-top-style:unset !important;
    }
   
</style>