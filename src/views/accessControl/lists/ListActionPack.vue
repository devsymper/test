<template>
	<ListItem 
		:pageTitle="'Danh sách action pack'"
		:containerHeight="containerHeight"
	/>

</template>

<script>
import ListItem from "@/components/common/ListItems.vue"
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
		}
	},
	mounted(){
    },
}
</script>

<style>

</style>