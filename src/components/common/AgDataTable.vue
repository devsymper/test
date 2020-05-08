<template>
     <ag-grid-vue style="width: 100%; height: calc(100% - 40px);"
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
import { util } from '../../plugins/util';
    export default {
        props:{
            allColumns:{
                type:Array,
                default: function () { return [] }
            },
            rowData:{
                type:Array,
                default: function () { return [] }
            },
            fitColumns:{
                type:Boolean,
                default:true
            }
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
                modules: [ClientSideRowModelModule, RowGroupingModule],
                autoGroupColumnDef: null,
                groupDefaultExpanded: null,
                getDataPath: null,
            }
        },
        components: {
            AgGridVue
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
                editable:true,
                field:'name',
                headerName: 'Tên',
                minWidth: 200,
                cellRendererParams: { innerRenderer:renderImage },
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
                let controlName = null;
                let table = '';
                let value = params.newValue;
                if(params.colDef.field == 'name'){  // truowng hop thay doi ten control, cần gán lại tên control cũ để tìm trong store
                    controlName = params.oldValue[params.oldValue.length - 1];
                    table = (params.oldValue.length > 1) ? params.oldValue[0] : ''
                    value = (params.oldValue.length > 1) ? value[1] : value;
                }
                if(controlName == null){
                    controlName = params.data.name[params.data.name.length - 1];
                }
                let dataEmit = {propName :params.colDef.field,controlName: controlName,value:value}
                if(table != ''){
                    dataEmit['tableName'] = table;
                }
                this.$emit('update-props',dataEmit)
                
            }
        },
    }
    window.renderImage = function renderImage(params) {
        var imageElement = document.createElement("img");
        var element = document.createElement("span");
        imageElement.src = "https://hoangnd.dev.symper.vn"+params.data.icon;
        imageElement.height = "14";
        imageElement.style = "margin-right:8px;"
        element.appendChild(imageElement);
        let value = (params.value.length == 1) ? params.value[0] : params.value[1]
        element.appendChild(document.createTextNode(value));
        return element
    };

    window.checkboxRenderer = function checkboxRenderer(params) {
        
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox"; 
        checkbox.checked = params.value
        checkbox.addEventListener('click', function (event) {
            params.value=!params.value;
            let colName = params.colDef.field;
            params.node.data[colName] = params.value;
        });
        return checkbox
    };
    window.fontSizeCellRenderer = function fontSizeCellRenderer(params) {
        let el = document.createElement('span');
        if (params.value !== "" || params.value !== undefined || params.value !== null) {
            el.innerHTML = params.value;
        }
        return el
    }
</script>