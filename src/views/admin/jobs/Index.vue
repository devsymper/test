<template>
	<div class="h-100 w-100">
		<ListItems
			ref="listWork"
			:pageTitle="'Danh sách công việc'"
			:getDataUrl="apiUrl"
			:showButtonAdd="false"
			:showExportButton="false"
			:showImportButton="false"
			:customAPIResult="customAPIResult"
			:tableContextMenu="tableContextMenu"
			:useDefaultContext="false"
			:headerPrefixKeypath="'admin.table'"
			:useActionPanel="true"
			:actionPanelWidth="700"
			:containerHeight="containerHeight"
			:showImportHistoryBtn="false"
			:showActionPanelInDisplayConfig="false"
		> 
		<template slot="right-panel-content">  
			<JobDetail />
		</template>
	</ListItems>
	</div>
</template>

<script>
import ListItems from "@/components/common/ListItems.vue"
import { util } from "@/plugins/util.js";
import JobDetail from "./JobDetail"
export default {
	components:{
		ListItems,
		JobDetail
	},
	mounted(){
		 this.containerHeight = util.getComponentSize(this).h
	},
	data(){
		let self = this
		return { 
			containerHeight:null,
			apiUrl:'https://workflow-modeler.symper.vn/',
			customAPIResult: {
                reformatData(res){
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
                    callback: (obj, callback) => {
						self.$refs.listWork.actionPanel = true;
                    },
                },
                runWork: {
                    name: "runWork",
                    text: "Chạy công việc",
                    callback: (obj, callback) => {
						self.$refs.listWork.actionPanel = true;
                    },
                },
                stopWork: {
                    name: "stopWork",
                    text: "Dừng công việc",
                    callback: (obj, callback) => {
						self.$refs.listWork.actionPanel = true;
                    },
                },
		}
	}
	}
}

</script>

<style>

</style>