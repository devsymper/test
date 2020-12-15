<template>
	<div class="header-ag-grid d-flex  w-100" >
		<div class="customHeaderLabel flex-grow-1">{{params.displayName}}</div> 
		<v-btn icon tile x-small >
			<v-icon class="fs-13" small @click="handlerFilterClick(params)">mdi-filter-variant</v-icon>
		</v-btn>
	</div>

</template>

<script>
export default {
	data: function () {
		return {
			
		}
	},
	beforeMount() {},
	mounted() {
	},
	methods: {
		handlerFilterClick(params){
			debugger	
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