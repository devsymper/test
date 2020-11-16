<template>
	<ListItem 
		:pageTitle="'Danh sách vai trò người dùng'"
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
	props:{
		containerHeight:{
			type: Number,
		}
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