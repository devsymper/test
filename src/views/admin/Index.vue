<template>
	<ListItems
		ref="listWorkFlow"
		:pageTitle="'Danh sách các quy trình'"
		:getDataUrl="apiUrl"
		:showButtonAdd="false"
		:showExportButton="false"
		:showImportButton="false"
		:customAPIResult="customAPIResult"
		:tableContextMenu="tableContextMenu"
		:useDefaultContext="false"
		:useActionPanel="true"
		@row-selected="onRowSelected"
		:actionPanelWidth="1000"
		:containerHeight="containerHeight"
		:showImportHistoryBtn="false"
		:showActionPanelInDisplayConfig="false"
	> 
		<template slot="right-panel-content">  
			<DetailWorkflow 
				:itemData="selectedItem"
			/>
		</template>
	</ListItems>
</template>

<script>
import ListItems from "@/components/common/ListItems.vue"
import DetailWorkflow from "./DetailWorkflow"
import { util } from "@/plugins/util.js";
export default {
	components:{
		ListItems,
		DetailWorkflow
	},
	data(){
		let self = this
		return {
			containerHeight:null,
			selectedItem: null,
			apiUrl:'https://workflow-modeler.symper.vn/',
			customAPIResult: {
                reformatData(res){
					debugger
                   return{
						 listObject: res.data.listObject,
						 total: res.data.listObject.length,
                         columns: [
                            {name: "id", title: "id", type: "numeric"},
							{name: "processKey", title: "key", type: "text"},
							{name: "name", title: "name", type: "text"},
							{name: "description", title: "description", type: "text"},
							{name: "lastUpdateTime", title: "last_update_at", type: "date"},
                         ],
                   }
                }
			},
			tableContextMenu: {
               viewDetails: {
                    name: "View details",
                    text: "Xem chi tiết",
                    callback: (user, callback) => {
						 self.$refs.listWorkFlow.actionPanel = true;
                    },
                },
               stopProcess: {
                    name: "Dừng quy trình",
                    text: "Dừng quy trình",
                    callback: (user, callback) => {
                       
                    },
                },
             
            },
		}
	},
	mounted(){
		 this.containerHeight = util.getComponentSize(this).h
	},
	methods:{
		onRowSelected(item){
			this.selectedItem = item
		}
	}
}
</script>

<style>

</style>