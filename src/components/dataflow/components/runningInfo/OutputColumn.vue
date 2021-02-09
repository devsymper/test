<template>
	<div class="dataflow-output-column-table h-100">
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
					height: contentRunningHeight - 120 + 'px',
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
	data() {
		return {
			defaultColDef: null,
			gridOptions: null,
			columnDefs: [
				{
					headerName: 'Name',
					field: 'columnName',
					columnTitle: 'table.id',
					width: 50,
				},
				{
					headerName: 'Type',
					field: 'type',
					columnTitle: 'table.id',
				},
				{
					headerName: 'Rename',
					field: 'title',
					columnTitle: 'table.id',
				}
			],
			tableHeight: 400,
			searchKey: ''
		};
	},
	methods: {
		cellContextMenu(params) {},
	},
	props: {
        action: {
            default: 'create'
        },
        instanceKey: {
            default: ''
		},
		contentRunningHeight:{
			type: Number,
			default: 0
		}
	},
	watch:{
		
	},
	computed:{
		tableData(){
			let rowData = this.$store.state.dataflow.allDataflow[this.instanceKey].selectedWidget.output;
			let self = this
			if(this.searchKey == ""){
				return rowData
			}else{
				let arr = []
				rowData.forEach(function(e){
					for(let i in e){
						if(e[i].toLowerCase().includes(self.searchKey.toLowerCase())){
							arr.push(e)
						}
					}
				})
				return arr
			}
		}
	},
	beforeMount() {
		this.defaultColDef = {
			minWidth: 40,
			filter: true,
			sortable: true,
			resizable: true,
			wrapText: true,
			flex: 1,
			autoHeight: true,
		};
		this.gridOptions = {
			enableRangeSelection: true,
			getRowStyle: function(params) {
				if (params.node.rowIndex % 2 != 0) {
					return { background: '#fbfbfb' };
				}
			},
		};
	},
	components: {
		AgGridVue,
	},

};
</script>

<style scoped>
.dataflow-output-column-table  >>>   .v-input__control .v-input__slot label,
.dataflow-output-column-table  >>>  .v-input__control .v-input__slot .v-icon,
.dataflow-output-column-table  >>>   .v-input__control .v-input__slot input{
    font:13px roboto
}
.dataflow-output-column-table >>>   .v-input__control .v-text-field__details {
    display: none;
}
.dataflow-output-column-table >>>   .v-input__control {
	margin: 4px 12px 4px 8px;
	min-height: unset;
}
.dataflow-output-column-table >>>   .v-input__control .v-input__slot {
	box-shadow: unset !important;
	margin-top: 8px;
	border: 1px solid lightgray;
}

</style>
