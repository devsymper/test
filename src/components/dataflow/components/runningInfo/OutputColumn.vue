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
	data() {
		return {
			defaultColDef: null,
			gridOptions: null,
			columnDefs: [
				{
					headerName: 'Name',
					field: 'columnName',
					type: 'numeric',
					columnTitle: 'table.id',
					width: 50,
				},
				{
					headerName: 'Type',
					field: 'type',
					type: 'numeric',
					columnTitle: 'table.id',
				},
				{
					headerName: 'Rename',
					field: 'title',
					type: 'numeric',
					columnTitle: 'table.id',
				},
				{
					headerName: 'Description',
					field: 'from',
					type: 'numeric',
					columnTitle: 'table.id',
				},
			],
			rowData: [
				{
					uid: 'stmp_1602843448654_dc',
					idDataset: 'stmp_1602843448654',
					columnName: 'dc',
					type: 'text',
					symperDocId: 'stmp_1602843448654',
					title: 'DC',
					from: '044f658d-8b39-4510-a9d2-8731ea98cc6b',
				},
				{
					uid: 'stmp_1602843448654_tuan',
					idDataset: 'stmp_1602843448654',
					columnName: 'tuan',
					type: 'number',
					symperDocId: 'stmp_1602843448654',
					title: 'Tuần',
					from: '044f658d-8b39-4510-a9d2-8731ea98cc6b',
				},
				{
					uid: 'stmp_1602843448654_tb1_ca',
					idDataset: 'stmp_1602843448654',
					columnName: 'tb1_ca',
					type: 'text',
					symperDocId: 'stmp_1602843448654',
					title: 'Ca làm',
					from: '044f658d-8b39-4510-a9d2-8731ea98cc6b',
				},
				{
					uid: 'stmp_1602843448654_ma_hang',
					idDataset: 'stmp_1602843448654',
					columnName: 'ma_hang',
					type: 'text',
					symperDocId: 'stmp_1602843448654',
					title: 'Mã SP',
					from: '044f658d-8b39-4510-a9d2-8731ea98cc6b',
				},
				{
					uid: 'stmp_1602843448654_tb1_ngay',
					idDataset: 'stmp_1602843448654',
					columnName: 'tb1_ngay',
					type: 'date',
					symperDocId: 'stmp_1602843448654',
					title: 'Ngày sx',
					from: '044f658d-8b39-4510-a9d2-8731ea98cc6b',
				},
				{
					uid: 'stmp_1602843448654_loai_lenh',
					idDataset: 'stmp_1602843448654',
					columnName: 'loai_lenh',
					type: 'text',
					symperDocId: 'stmp_1602843448654',
					title: 'Loại lệnh',
					from: '044f658d-8b39-4510-a9d2-8731ea98cc6b',
				},
				{
					uid: 'stmp_1602843448654_tb1_sl_xuong',
					idDataset: 'stmp_1602843448654',
					columnName: 'tb1_sl_xuong',
					type: 'number',
					symperDocId: 'stmp_1602843448654',
					title: 'SL xương',
					from: '044f658d-8b39-4510-a9d2-8731ea98cc6b',
				},
				{
					uid: 'stmp_1602843448654_cdsx',
					idDataset: 'stmp_1602843448654',
					columnName: 'cdsx',
					type: 'text',
					symperDocId: 'stmp_1602843448654',
					title: 'CÔNG ĐOẠN',
					from: '044f658d-8b39-4510-a9d2-8731ea98cc6b',
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
