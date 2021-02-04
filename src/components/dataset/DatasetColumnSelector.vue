<template>
	<div class="dataflow-output-column h-100">
		<v-text-field
			v-model="searchKey"
			single-line
			append-icon="mdi-magnify"
			solo
			class="s-input-search"
		>
		</v-text-field>
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
					checkboxSelection: true,
					editable: false,
					field: "selected",
					headerName: "select",
					width: 50,
				},
				{
					headerName: 'Name',
					field: 'columnName',
					type: 'text',
					width:70,
				},
				{
					headerName: 'Type',
					field: 'type',
					type: 'text',
					editable: true,
					cellEditor:'agSelectCellEditor',
					cellEditorParams: {
						values: ['number', 'text', 'datetime', 'date', 'time']
					},
					width:70,
				},
				{
					headerName: 'Rename',
					field: 'title',
					type: 'text',
                    editable: true,
				},
				{
					headerName: 'Description',
					field: 'description',
					type: 'text',
                    editable: true,
				},
			],
			tableHeight: 400,
			searchKey: '',
			gridApi: null,
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
						if(e[i]){
							if(e[i].toLowerCase()){
								if(e[i].toLowerCase().includes(self.searchKey.toLowerCase())){
									arr.push(e)
								}
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
		};
		this.gridOptions = {
			enableRangeSelection: true,
			rowSelection: "multiple"
		};
	},
	methods:{
		 setRowSelected(rowIndex, selected){
            let runner = 0;
            this.gridApi.forEachNode(function(node) {
                if(runner == rowIndex){
                    node.setSelected(selected);
                    node.data.selected = selected;
                }
                runner += 1;
            });
        },
	},
	mounted(){
        this.gridApi = this.gridOptions.api;
	},
	components: {
		AgGridVue,
	},
	watch:{
		rowData:{
			deep: true,
			immediate: true,
			handler(arr){
				let self = this
				arr.forEach(function(e){
					if(e.selected){
						debugger
						self.setRowSelected(e.id, false)
					}
				})
			}
		}
	}
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
	height: 28px;
}
.dataflow-output-column >>>   .v-input__control .v-input__slot .v-icon {
	font-size: 18px ;
}

.s-input-search >>> .v-input__slot{
	margin: 0px!important;
}
</style>
