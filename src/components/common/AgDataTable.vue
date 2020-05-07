<template>
     <ag-grid-vue style="width: 100%; height: calc(100% - 40px);"
                 class="ag-theme-balham"
                 :gridOptions="gridOptions"
                 :defaultColDef="defaultColDef"
                 :autoGroupColumnDef="autoGroupColumnDef"
                 :columnDefs="columns"
                 @on-first-data-rendered="firstDataRendered"
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
                headerName: 'Tên',
                minWidth: 200,
                cellRendererParams: { suppressCount: true },
                // cellRenderer: renderImage,
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
            refreshData(data){
                this.columns = data;
                this.gridOptions.api.refreshCells();
            },
            autoSizeAll(skipHeader) {
                var allColumnIds = [];
                this.gridOptions.columnApi.getAllColumns().forEach(function(column) {
                    allColumnIds.push(column.colId);
                });
                this.gridOptions.columnApi.autoSizeColumns(allColumnIds, skipHeader);
            },
            firstDataRendered(params){
                console.log(params);
                
                params.api.sizeColumnsToFit()
            }
        },
    }
    window.renderImage = function renderImage(params) {
        var imageElement = document.createElement("img");
        var element = document.createElement("span");
        imageElement.src = "https://hoangnd.dev.symper.vn"+params.data.icon;
        imageElement.height = "14";
        // element.appendChild(imageElement);
        element.appendChild(document.createTextNode(params.value));
        // this.eGui.appendChild(imageElement);
        return element


    };
    window.checkboxRenderer = function checkboxRenderer(params) {
        console.log(params);
        
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox"; 
        checkbox.checked = params.value
        return checkbox


    };
</script>