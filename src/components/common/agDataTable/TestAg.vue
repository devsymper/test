<template>
	<div class="h-100 w-100">
		<AgDataTable
			:containerHeight="containerHeight"
			ref="displayTable" 
			:editable="false"
			:pageTitle="'Danh sách demo'"
			:customAPIResult="customAPIResult"
			:getDataUrl="apiUrl"
			:customComponents="customAgComponents"
			:getContextMenuItems="getContextMenuItems"
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
import TestCellRenderer from './TestCellRenderer'

export default {
	data(){
		return {
			apiUrl: appConfigs.apiDomain.bpmne.models,
			containerHeight: null,
			customAgComponents: {
                rendererName: TestCellRenderer,
            },
			getContextMenuItems(params) {
				var result = [
					{
						name: 'Alert ' + params.node.data.id,
						action: function () {
							window.alert('Alerting about ' + params.node.data.id);
						},
						cssClasses: ['redFont', 'bold'],
					},
				];
				return result;
			},	
			customAPIResult:{
				reformatData(res){
					return{
						columns:[
							{name: "id", title: "id", type: "numeric"},
							{name: "processKey", title: "key", type: "text"},
							{name: "name", title: "name", type: "text", cellRenderer: 'rendererName'},
							{name: "userCreate", title: "user_create", type: "text"},
							{name: "lastUserUpdate", title: "last_user_update", type: "text"},
							{name: "description", title: "description", type: "text"},
							{name: "createAt", title: "create_at", type: "date"},
							{name: "lastUpdateTime", title: "last_update_at", type: "date"},
						],
						listObject:res.data.listObject,
						total: res.data.total
					} 
				}
			}
			
			
		}
	},
	components:{
		AgDataTable,
		TestCellRenderer
	},
	mounted(){
		  this.containerHeight = util.getComponentSize(this).h
		}
}
</script>

<style>

</style>