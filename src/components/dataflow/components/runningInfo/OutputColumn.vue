<template>
  <div>
	<ag-grid-vue 
		:style="{
			width: '100%',
			height:tableHeight+ 'px',
		}"
		:class="{'ag-theme-balham': true}"
		:defaultColDef="defaultColDef"
		:gridOptions="gridOptions"
		:getContextMenuItems="getContextMenuItems"
		:columnDefs="columnDefs"
		:rowData="rowData"
		@cell-context-menu="cellContextMenu"
	>
	</ag-grid-vue>
  </div>
</template>

<script>
export default {
	data(){
		return {

		}
	},
	methods:{

	},
	beforeMount(){
		this.defaultColDef = {
            minWidth: 40,
			filter: true,
			sortable: true,
			resizable: true,
			wrapText: true,
			autoHeight: true,
		};
		this.gridOptions = {
			enableRangeSelection: true,
			getRowStyle: function(params) {
				if (params.node.rowIndex % 2 != 0) {
					return { background: '#fbfbfb' };
				}
			}
		}
    },
	components:{
		defaultColDef: null,
		gridOptions: null,
	}
}
</script>

<style>

</style>