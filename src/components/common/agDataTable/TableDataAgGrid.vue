<template>
	<div class="dataflow-output-column h-100">
	
		<div class="ml-2 mr-2" style="height: calc(100% - 57px)">
			<ag-grid-vue
				:style="{
					width: '100%',
					height: '100%',
				}"
				:class="{ 'ag-theme-balham': true }"
				:defaultColDef="defaultColDef"
                :suppressRowClickSelection="true"
				:gridOptions="gridOptions"
				:columnDefs="columnDefs"
				:rowData="rowData"
				@grid-ready="onGridReady"
			>
			</ag-grid-vue>
		</div>
	</div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue';
export default {
	props:{
		rowData:{
			type: Array,
			default(){
			}
		},
		columnDefs:{
			type: Array,
			default(){
			}
		},
		
	},
	data() {
		return {
			defaultColDef: null,
			gridOptions: null,
			gridApi: null,
		};
	},
	beforeMount(){
		this.defaultColDef = {
			minWidth: 40,
			filter: true,
			sortable: true,
			resizable: true,
			autoHeight: true,
		};
		this.gridOptions = {
			enableRangeSelection: true,
			rowSelection: "multiple"
		};
	},
	methods:{
		onGridReady(params){
			this.gridApi = params.api
		},
		
	},

	components: {
		AgGridVue,
	},
};
</script>

<style scoped>

</style>
