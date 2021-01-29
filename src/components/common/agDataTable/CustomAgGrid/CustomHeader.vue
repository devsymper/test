<template>
	<div class="header-ag-grid d-flex  w-100" >
		<div class="custom-header-label flex-grow-1">{{prefix ? $t(prefix + params.displayName) : params.displayName}}</div> 
		<v-icon 
			class="fs-13 symper-table-dropdown-button " 
			v-if="!params.column.colDef.noFilter"
			:class="{'applied-filter': checkFilterCol(params.column.colId)} " 
			:col-name="params.column.colDef.field" small 
			onclick="tableDropdownClickHandle(this,event)">mdi-filter-variant</v-icon>
	</div>

</template>

<script>
export default {
	computed:{
		filteredColumns(){
			let widgetIdentifier = this.getWidgetIdentifier()
			return this.$store.state.app.filteredColumns[widgetIdentifier] ? this.$store.state.app.filteredColumns[widgetIdentifier] : {}
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
			debugger
			if(Object.keys(this.filteredColumns).length > 0 ){
				if(this.filteredColumns[col]){
					return true
				}else{
					return false
				}
			}else{
				return false
			}
		},
		getWidgetIdentifier(){
			let widgetIdentifier =  this.$route.path;
			widgetIdentifier = widgetIdentifier.replace(/(\/|\?|=)/g,'');
            return widgetIdentifier;
		},
	}
}	
</script>

<style>
.header-ag-grid{
	position: relative;
}
.custom-header-label{
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>