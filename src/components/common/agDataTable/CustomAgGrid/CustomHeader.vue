<template>
	<div class="header-ag-grid d-flex  w-100" >
		<div class="customHeaderLabel flex-grow-1">{{prefix ? $t(prefix + params.displayName) : params.displayName}}</div> 
		<v-icon 
			class="fs-13 symper-table-dropdown-button " 
			v-if="!params.column.colDef.noFilter"
			:class="{'applied-filter': checkFilterCol(params.displayName)} " 
			:col-name="params.column.colDef.field" small 
			onclick="tableDropdownClickHandle(this,event)">mdi-filter-variant</v-icon>
	</div>

</template>

<script>
export default {
	computed:{
		filteredColumns(){
			return this.$store.state.app.filteredColumns
		},
		prefix(){
			let prefix = this.params.headerPrefixKeypath
			prefix =
			prefix[prefix.length - 1] == "." || prefix == ""
				? prefix
				: prefix + ".";
			return  prefix
		}
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