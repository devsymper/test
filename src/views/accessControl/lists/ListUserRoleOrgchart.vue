<template>
	<ListItem 
		:pageTitle="'Danh sách orgchart'"
		:containerHeight="containerHeight"
	/>

</template>

<script>
import ListItem from "@/components/common/ListItems.vue"
import { util } from "@/plugins/util.js";
export default {
	components:{
		ListItem
	},
	
	data(){
		return{
			containerHeight: null,
		}
	},
	mounted(){
        this.containerHeight = util.getComponentSize(this).h
    },
}
</script>

<style>

</style>