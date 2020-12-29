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
		:headerPrefixKeypath="'admin.table'"
		:useActionPanel="true"
		@row-selected="getDetails"
		:actionPanelWidth="1000"
		:actionPanelType="'elastic'"
		:containerHeight="containerHeight"
		:showImportHistoryBtn="false"
		:showActionPanelInDisplayConfig="true"
	> 
		<template slot="right-panel-content">  
			<DetailWorkflow 
				v-if="showPanel"
				:itemData="selectedItem"
			/>
		</template>
	</ListItems>
</template>

<script>
import ListItems from "@/components/common/ListItems.vue"
import DetailWorkflow from "./DetailWorkflow"
import { util } from "@/plugins/util.js";
import {adminApi} from '@/api/Admin.js'
import {
    appConfigs
} from "@/configs";
import {taskApi} from '@/api/task.js'

import AdminWorker from 'worker-loader!@/worker/admin/Admin.Worker.js';

export default {
	components:{
		ListItems,
		DetailWorkflow
	},
	data(){
		let self = this
		return {
			containerHeight:null,
			showPanel:false,
			selectedItem: null,
			apiUrl: appConfigs.apiDomain.bpmne.models,
			adminWorker: null,
			customAPIResult: {
                reformatData(res){
					let listKey = self.getListKey(res.data.listObject);
					let listWork = res.data
					taskApi.countInstant({keys:JSON.stringify(listKey)}).then(res=>{
                         if (res.status === 200) {
                              for(let i = 0; i< listWork.listObject.length; i++){
                                  for(let j =0; j< res.data.length;j++){
                                      if(listWork.listObject[i].processKey == res.data[j].key){
										  listWork.listObject[i].number_instance = res.data[j].number_of_process_instance
                                      }
                                  }
                            }
							self.$refs.listWorkFlow.rerenderTable();
                         }
                    })
                    return{
						 listObject: listWork.listObject,
						 total: listWork.listObject.length,
                         columns: [
                            {name: "id", title: "id", type: "numeric"},
							{name: "processKey", title: "key", type: "text"},
							{name: "name", title: "name", type: "text"},
							{name: "description", title: "description", type: "text"},
							{name: "lastUpdateTime", title: "last_update_at", type: "date"},
							{name: "number_instance", title: "number_instance", type: "text"},
                         ],
                   }
                }
			},
			tableContextMenu: {
               viewDetails: {
                    name: "View details",
                    text: "Xem chi tiết",
                    callback: (obj, callback) => {
						self.getDetails(obj)
                    },
                },
            },
		}
	},
	mounted(){
		this.containerHeight = util.getComponentSize(this).h
		this.adminWorker = new AdminWorker();
		let self = this
        this.adminWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'getDetailWorkflow':
					self.$store.commit('admin/setProcessDefination', data.dataAfter.processDefination);
					self.$store.commit('admin/setProcessId', data.dataAfter.processId);
					self.$store.commit('admin/setCurrentTrackingProcess', data.dataAfter.currentTrackingProcess);
					self.$store.commit('admin/setCurrentAggregateWorkflow', data.dataAfter.aggregateWorkflow);
					break;
                default:
                    break;
            }
        });
	},
	methods:{
		onRowSelected(item){
			this.selectedItem = item
		},
		getListKey(res){
			let listKey = [];
			res.map(x=>listKey.push(x.processKey));
			return listKey
		},
		getDetails(obj){
			let self = this
			this.adminWorker.postMessage(
				{
					action:'getDetailWorkflow',
					data:{processKey: obj.processKey}
				}
			);
			self.$refs.listWorkFlow.actionPanel = true;
			self.$store.commit('admin/setProcessKey', obj.processKey)
			self.$store.commit('admin/setProcessId', obj.id);
			self.showPanel = true;
		}
	}
}
</script>

<style>

</style>