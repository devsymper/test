<template>
	<div class="h-100 w-100">
		<AgDataTable
			:containerHeight="containerHeight"
			ref="displayTable" 
			:editable="false"
			:pageTitle="'Danh sách demo'"
			:customAPIResult="customAPIResult"
			:getDataUrl="apiUrl"
			:getContextMenuItems="getContextMenuItems"
			:useActionPanel="true"
			:showActionPanelInDisplayConfig="true"
			@row-selected="handlerRowClicked"
		>
			 <template slot="right-panel-content" slot-scope="{}">  
				 <div class="fs-50 font-weight-bold h-100 w-100">
					 {{ title }}
				 </div>
            </template>
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
		let self = this
		return {
			title: '',
			apiUrl: appConfigs.apiDomain.bpmne.models,
			containerHeight: null,
			getContextMenuItems(params) {
				var result = [
					{
						name: 'Alert Param',
						action: function () {
							window.alert('Alerting about ' + params.node.data.id);
						},
						cssClasses: ['redFont', 'bold'],
					},
					{
						name: 'Show Panel ',
						action: function () {
							self.$refs.displayTable.actionPanel = true
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
							{name: "processKey", title: "processKey", type: "text"},
							{name: "name", title: "name", type: "text", 
							 	cellRenderer: function(params) {
									return '<span class="mdi mdi-car-lifted-pickup"></span> <span>'+ params.value +'</span>';
								}
							},
							{name: "userCreate", title: "userCreate", type: "text"},
							{name: "lastUserUpdate", title: "lastUserUpdate", type: "text"},
							{name: "description", title: "description", type: "text"},
							{name: "createAt", title: "createAt", type: "date"},
							{name: "lastUpdateTime", title: "lastUpdateTime", type: "date"},
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
	},
	mounted(){
		this.containerHeight = util.getComponentSize(this).h
	},
	methods:{
		handlerRowClicked(params){
			this.$refs.displayTable.actionPanel = true
			this.title = params.id
		}
	}
}
</script>

<style>

</style>