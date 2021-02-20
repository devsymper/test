<template>
    <div class="h-100">
        <ag-grid-vue :style="{width: '100%', height: '100%'}" class="ag-theme-balham" id="myGrid"
            :columnDefs="columnDefs"
            :rowData="nodeData.variables"
            @cell-editing-stopped="handleStopEditCell"
            :gridOptions="gridOptions"> 
        </ag-grid-vue>
    </div>
</template>

<script>
import {AgGridVue} from "ag-grid-vue";

export default {
    components: {
        'ag-grid-vue':AgGridVue,
    },
    props:{
        nodeData:{
            type: Object,
            default(){
                return {
                }
            }
        },
        mode: {
            default: 'define' // define, setValue
        }
    },
    watch:{
        nodeData:{
            deep:true,
            immediate:true,
            handler(vl){
                if (vl && vl.variables && vl.variables.length == 0) {
                    vl.variables.push({
                        name: '',
                        type: 'number',
                        defaultValue: 0,
                        title: ''
                    })
                }
            }
        }
    },
    data() {
        return {
            gridOptions: {
                defaultColDef: {
                    editable: true,
                },
                enableRangeSelection: true,
            }
        }
    },
    computed: {
        columnDefs(){
            if(this.mode == 'define'){
                return [
                    { 
                        field: 'name', 
                        headerName:'Name',
                        width: 120,
                    },
                    {
                        field: 'type', 
                        headerName:'Data type',
                        width: 100,
                        cellEditorSelector: function(){
                            return {
                                component: 'agRichSelectCellEditor',
                                params: {
                                    values: ['number', 'text', 'date']
                                }
                            };
                        } 
                    },
                    { 
                        field: 'defaultValue', 
                        headerName:'Default value',
                        width: 120,
                    },
                    { 
                        field: 'title', 
                        headerName:'Title' 
                    },
                ];
            }else if(this.mode == 'setValue'){
                return [
                     { 
                        field: 'name', 
                        headerName:'Name',
                        width: 120,
                        editable: false,
                    },
                    {
                        field: 'type', 
                        headerName:'Data type',
                        width: 100,
                        cellEditorSelector: function(){
                            return {
                                component: 'agRichSelectCellEditor',
                                params: {
                                    values: ['number', 'text', 'date']
                                }
                            };
                        },
                        editable: false,
                    },
                    { 
                        field: 'defaultValue', 
                        headerName:'Default value',
                        width: 120,
                        editable: false,
                    },
                    { 
                        field: 'title', 
                        headerName:'Title' ,
                        editable: false,
                    },
                    { 
                        field: 'value', 
                        headerName:'Value' ,
                        editable: true,
                    },
                ]
            }
        }
    },
    mounted() {
        this.gridApi = this.gridOptions.api;
        this.gridColumnApi = this.gridOptions.columnApi;
    },
    methods: {
        handleStopEditCell(row){
            if(row.rowIndex == this.nodeData.variables.length - 1){
                this.nodeData.variables.push({
                    name: '',
                    type: 'number',
                    defaultValue: 0,
                    title: ''
                });
                this.gridApi.setFocusedCell(row.rowIndex + 1, row.colDef.field);
            }
        },
    },

}
</script>

<style>

</style>