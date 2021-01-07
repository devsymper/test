<template>
	<div class="header-ag-grid d-flex  w-100" >
		<div class="customHeaderLabel flex-grow-1">{{$t('table.'+params.displayName)}}</div> 
		<v-icon 
			class="fs-13 symper-table-dropdown-button " 
			:class="{'applied-filter': checkFilterCol(params.displayName)} " 
			:col-name="params.displayName" small 
			onclick="tableDropdownClickHandle(this,event)">mdi-filter-variant</v-icon>
	</div>

</template>

<script>
import { util } from '@/plugins/util';

export default {
	data: function () {
		
	},
	computed:{
		filteredColumns(){
			return this.$store.state.app.filteredColumns
		}
	},
	watch:{
		
	},
	beforeMount() {},
	mounted() {
	},
	methods: {
		checkFilterCol(col){
			if(Object.keys(this.filteredColumns).length > 0 ){
				if(this.filteredColumns[col]){
					return true
				}else{
					return false
				}
			}else{
				return false
			}
		}
	}
}	
</script>

<style>
.header-ag-grid{
	position: relative;
}
/* .icon-filter-ag-grid{
	position: absolute;
	top: 5px;
	right: 6px;
} */
</style>