<template>
	<div class="h-100 w-100">
		<AgDataTable
			:containerHeight="containerHeight"
			ref="displayTable" 
			:allColumns="allColumns"
			:editable="false"
			:getDataUrl="apiUrl"
			:useActionPanel="true"
		>
		</AgDataTable>
	</div>
</template>

<script>
import AgDataTable from './ListItems'
import {
    appConfigs
} from "@/configs";
import { util } from "@/plugins/util.js";

export default {
	data(){
		return {
			apiUrl: appConfigs.apiDomain.bpmne.models,
			containerHeight: null,
			allColumns:[
				{
					colId: "code",
					field: "code",
					headerName: "Mã",
					resizable: true,
					width: 145.55555555555554
				},
				{
					colId: "managers",
					field: "managers",
					headerName: "Quản lý",
					resizable: true,
					width: 312,
				},
				{
					colId: "price",
					field: "price",
					headerName: "test",
					resizable: true,
					width: 312,
				},
				
			],
			
		}
	},
	components:{
		AgDataTable
	},
	mounted(){
		  this.containerHeight = util.getComponentSize(this).h
	}
}
</script>

<style>

</style>