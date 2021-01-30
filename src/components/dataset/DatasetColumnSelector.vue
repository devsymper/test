<template>
	<div class="dataflow-output-column">
		<v-text-field
			v-model="searchKey"
			single-line
			solo
		>

		</v-text-field>
		<div class="ml-2 mr-2">
			<ag-grid-vue
				:style="{
					width: '100%',
					height: tableHeight + 'px',
				}"
				:class="{ 'ag-theme-balham': true }"
				:defaultColDef="defaultColDef"
				:gridOptions="gridOptions"
				:columnDefs="columnDefs"
				:rowData="tableData"
				@cell-context-menu="cellContextMenu"
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
		useCheckbox:{
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			defaultColDef: null,
			gridOptions: null,
			columnDefs: [
				{
					checkboxSelection:true,
					editable:false,
					field:"select",
					width:50,
				},
				{
					headerName: 'Name',
					field: 'name',
					type: 'numeric',
				},
				{
					headerName: 'Type',
					field: 'type',
					type: 'numeric',
				},
				{
					headerName: 'Rename',
					field: 'title',
					type: 'numeric',
				},
				{
					headerName: 'Description',
					field: 'from',
					type: 'numeric',
				},
			],
			tableHeight: 400,
			searchKey: ''
		};
	},
	methods: {
		cellContextMenu(params) {},
	},
	computed:{
		tableData(){
			let self = this
			if(this.searchKey == ""){
				return this.rowData
			}else{
				let arr = []
				this.rowData.forEach(function(e){
					delete e.list_foreign_key
					for(let i in e){
						if(e[i].toLowerCase()){
							if(e[i].toLowerCase().includes(self.searchKey.toLowerCase())){
								arr.push(e)
							}
						}
					}
				})
				return arr
			}
		},
	},
	beforeMount() {
		this.defaultColDef = {
			minWidth: 40,
			filter: true,
			sortable: true,
			resizable: true,
			autoHeight: true,
			headerCheckboxSelection: function isFirstColumn(params) {
				var displayedColumns = params.columnApi.getAllDisplayedColumns();
				var thisIsFirstColumn = displayedColumns[0] === params.column;
				return thisIsFirstColumn;
			},
			rowSelection: "multiple"
		};
		this.gridOptions = {
			enableRangeSelection: true,
		};
	},
	components: {
		AgGridVue,
	},
};
</script>

<style scoped>
.dataflow-output-column  >>>   .v-input__control .v-input__slot label,
.dataflow-output-column  >>>  .v-input__control .v-input__slot .v-icon,
.dataflow-output-column  >>>   .v-input__control .v-input__slot input{
    font:13px roboto
}
.dataflow-output-column >>>   .v-input__control .v-text-field__details {
    display: none;
}
.dataflow-output-column >>>   .v-input__control {
	margin: 4px 12px 4px 8px;
	min-height: unset;
}
.dataflow-output-column >>>   .v-input__control .v-input__slot {
	box-shadow: unset !important;
	margin-top: 8px;
	border: 1px solid lightgray;
}

</style>
