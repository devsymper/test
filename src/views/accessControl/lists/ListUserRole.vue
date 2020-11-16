<template>
	<ListItem 
		 ref="listSystemRole"
		:useDefaultContext="false"
		:pageTitle="$t('systemRole.list.title')"
		:tableContextMenu="tableContextMenu"
		:containerHeight="containerHeight"
		:getDataUrl="getListUrl"
		:headerPrefixKeypath="'common'"
	/>

</template>

<script>
import ListItem from "@/components/common/ListItems.vue"
import { appConfigs } from "@/configs.js";
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
			getListUrl: appConfigs.apiDomain.systemRole+'system-role',
		}
	},
	mounted(){
    },
}
</script>

<style>

</style>