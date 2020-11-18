<template>
	<div class="h-100 w-100">
		<ListItems
			ref="listWork"
			:pageTitle="'Danh sách các dịch vụ hệ thống'"
			:getDataUrl="apiUrl"
			:showButtonAdd="false"
			:showExportButton="false"
			:showImportButton="false"
			:customAPIResult="customAPIResult"
			:tableContextMenu="tableContextMenu"
			:useDefaultContext="false"
			:headerPrefixKeypath="'admin.table'"
			:useActionPanel="true"
			:useWorkFlowHeader="true"
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
import {adminApi} from '@/api/Admin.js'
import Handsontable from 'handsontable';
import {
    appConfigs
} from "@/configs";
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
			apiUrl: appConfigs.apiDomain.bpmne.timerJob,
			customAPIResult: {
                reformatData(res){
					res.data.forEach(function(e){
						adminApi.getProcessDefinationDetail(e.processDefinitionId).then(resI=>{
							e.suspended = resI.suspended
							e.nameProcess = resI.name
							e.type = "Event timer"
							self.$refs.listWork.rerenderTable()
						}).catch(err=>{
						})
					})
                   return{
						 listObject: res.data,
						 total: res.data.length,
                         columns: [
                            {name: "id", title: "id", type: "numeric"},
							{name: "nameProcess", title: "nameProcess", type: "text"},
							{name: "type", title: "type", type: "text"},
							{name: "suspended", title: "suspended", type: "text",
								renderer:  function(instance, td, row, col, prop, value, cellProperties) {
									Handsontable.dom.empty(td);
									let span;
									span = document.createElement('span');	
									if(value === null || value == ""){
										$(span).text("Đang chạy")
										$(span).css('color', 'green')
										td.appendChild(span);
										return td;
									}
									if(value == true){
										$(span).text("Tạm dừng ")
										$(span).css('color', 'orange')
										td.appendChild(span);
										return td;
									}
								},
							},
							{name: "dueDate", title: "dueDate", type: "date"},
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
						adminApi.getTimerJobDetail(obj.id).then(res=>{
							self.$store.commit('admin/setTimerJobDetail', res)
						}).catch(err=>{

						})
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