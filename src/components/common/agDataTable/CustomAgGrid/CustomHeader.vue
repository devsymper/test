<template>
	<div class="header-ag-grid d-flex  w-100" >
		<div class="customHeaderLabel flex-grow-1">{{$t('table.'+params.displayName)}}</div> 
		<v-icon class="fs-13" :col-name="params.displayName" small onclick="tableDropdownClickHandle(this,event)">mdi-filter-variant</v-icon>
	</div>

</template>

<script>
import { util } from '@/plugins/util';

export default {
	data: function () {
		return {
			
		}
	},
	computed:{
		colName(){

		}
	},
	beforeMount() {},
	mounted() {
	},
	methods: {
		
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