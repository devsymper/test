<template>
     <div class="h-100 w-100 d-flex flex-column p-2">
		 <div class="d-flex mb-2 ">
			 <div class="fs-17 ml-1 mt-1 font-weight-bold align-items-center flex-grow-1">Danh sách demo</div>
			 <div>
				  <v-text-field
                            class="d-inline-block mr-2 sym-small-size"
                            single-line
                            :append-icon="$i('input.search')"
                            outlined
                            dense
                            label="Search"
                            :placeholder="$t('common.search')"
                        ></v-text-field>
						
                         <v-btn
                            depressed
                            small
                            class="mr-2"
                        >
                            <v-icon left dark>mdi-plus</v-icon>
                            <span >{{$t('common.add')}}</span>
                        </v-btn>
                        <v-btn
                            depressed
                            small
                            class="mr-2"
                        >
                            <v-icon left dark>mdi-refresh</v-icon>
                            <span >{{$t('common.refresh')}}</span>
                        </v-btn>

                      
                        <!-- <v-btn
                            depressed
                            small
                            @click="exportExcel()"
                            class="mr-2"
                        >
                            <v-icon left dark>mdi-microsoft-excel</v-icon>
							<span >{{$t('common.export_excel')}}</span>
                        </v-btn>

                        
                        <v-btn
                            depressed
                            small
                            class="mr-2"
                        >
                            <v-icon left dark>mdi-database-import</v-icon>
                            <span>{{$t('common.import_excel')}}</span>
                        </v-btn>
                        
                    
                        <v-btn
                            depressed
                            small
                            @click="showImportHistory()"
                            class="mr-2"
                        >
                            <v-icon left dark>mdi-database-import</v-icon>
                            <span>{{$t('common.import_excel_history')}}</span>
                        </v-btn> -->
                      
			 </div>
		 </div>
		<ag-grid-vue :style="{
			width: '100%',
			height: tableHeight
		}"
			:class="{'ag-theme-balham': true}"
			:defaultColDef="defaultColDef"
			:gridOptions="gridOptions"
			:columnDefs="columnDefs"
			:rowData="rowData"
			@grid-ready="onGridReady"
		>
		</ag-grid-vue>
		<div class="mt-2">
			<Pagination
				:total="100"
				:totalVisible="7"
			></Pagination>
		</div>
	 </div>
</template>
<script>
import {AgGridVue} from "ag-grid-vue";
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-balham.css';
import { util } from '../../../plugins/util';
import Vue from "vue";
import Pagination from '@/components/common/Pagination'
import Api from "@/api/api.js";
import { getDataFromConfig, getDefaultFilterConfig } from "@/components/common/customTable/defaultFilterConfig.js";

var apiObj = new Api("");

export default {
    props:{
		//các props chuyển sang từ list items cũ
		apiMethod:{
			type: String,
			default : "GET"
		},
		customDataForApi: {
            type: Function,
            // default: (configs, columns, filterData)=>{}
            default: null
		},
		getDataUrl: {
            type: String,
            default: ""
		},
		customAPIResult: {
            type: Object,
            default(){
                return {}
            }
        },

        tableHeight: {
            type: String,
            default: 'calc(100% - 10px)'
		},
		useWorkFlowHeader:{
			type: Boolean,
			default:false
		},
       
    },
    data(){
		let self = this
        return {
			gridOptions:null,
			defaultColDef:null,
            columnDefs:[
				{headerName: 'Make', field: 'make'},
				{headerName: 'Model', field: 'model'},
				{headerName: 'Test', field: 'test'},
				{headerName: 'Test 2', field: 'testA'},
				{headerName: 'Test 3', field: 'testB'},
				{headerName: 'Test 4', field: 'testC'},
				{headerName: 'Test 5', field: 'testD'},
				{headerName: 'Test 6', field: 'testE'},
				{headerName: 'Test 7', field: 'testG'},
				{headerName: 'Test 8', field: 'testH'},
				{headerName: 'Test 9', field: 'testJ'},
				{headerName: 'Test 10', field: 'testK'},
				{headerName: 'Test 11', field: 'testM'},
				{headerName: 'Price', field: 'price'}
			],
           	rowData: [
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
				{make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
		
			],
        }
    },
    components: {
		AgGridVue,
		Pagination
    },
    beforeMount(){
		this.defaultColDef = {
            minWidth: 100,
            // filter: true,
            sortable: true,
            resizable: true,
        };
        this.gridOptions = {};
    },
	methods:{
		onGridReady(params){
			params.api.sizeColumnsToFit()
		},
		getData(columns = false, cache = false, applyFilter = true, lazyLoad = false ) {
            let thisCpn = this;
            let handler = (data) => {
                if(thisCpn.customAPIResult.reformatData){
                    data = thisCpn.customAPIResult.reformatData(data);
                }else{
                    data = data.data;
                }
                this.totalObject = data.total ? parseInt(data.total) : 0;
                thisCpn.columnDefs = thisCpn.getTableColumns(
                    data.columns
                );
                let resData = data.listObject ? data.listObject : []
                if(lazyLoad){
                    resData.forEach(function(e){
                        thisCpn.data.push(e)
                    })
                }else{
                    thisCpn.data = resData;
                }
                thisCpn.$emit('data-get', data.listObject);
            }
            this.prepareFilterAndCallApi(columns , cache , applyFilter, handler);
        },
	},
	   /**
         * Lấy ra cấu hình cho việc sort
         */
        prepareFilterAndCallApi(columns = false, cache = false, applyFilter = false, success, configs = {}){
            let url = this.getDataUrl;
			let method = this.apiMethod;
            if (url != "") {
                let thisCpn = this;
                let emptyOption = false;
                let header = {};
                let routeName = this.$getRouteName();
                if(routeName == "deployHistory" || routeName == "listProcessInstances" || thisCpn.useWorkFlowHeader){
                    header = {
                        Authorization: 'Basic cmVzdC1hZG1pbjp0ZXN0',
                        "Content-Type": "application/json",
                    };
                    // options = {};
                    emptyOption = true;
                }

                configs.searchKey = this.searchKey;
                configs.page = configs.page ? configs.page :  this.page ;
                configs.pageSize = configs.pageSize ? configs.pageSize : this.pageSize;
                configs.formulaCondition = this.conditionByFormula;
                let tableFilter = this.tableFilter;
                tableFilter.allColumnInTable = this.tableColumns;
                configs.emptyOption = emptyOption;

                if(this.customDataForApi){
                    configs.customDataForApi = this.customDataForApi;
                }
                getDataFromConfig(url, configs, columns, tableFilter, success, method, header);
            }
        },
}
    
    
</script>
<style>
   .ag-row{
        border-top-style:unset !important;
    }
</style>