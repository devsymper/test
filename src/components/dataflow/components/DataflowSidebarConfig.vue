<template>
	<div class="ml-2 mr-2 d-flex flex-column">
		<FormTpl 
			:allInputs="allInputs"
		/>
		<div v-if="allInputs.saveAsDataset.value" class="ml-4 mr-4 d-flex flex-column">
			<FormTpl 
				:allInputs="formTplDataset"
			/>
			<div class="d-flex mt-2 align-center">
				<span class="fs-13 mr-2">
					Auto update period time 
				</span>
				<PeriodTimeConfig />
			</div>
		</div>
		<NodeConfig
			@dataset-selected="handleDatasetSelected"
		/>
		<DatasetColumnSelector  :rowData="rowData" />
	</div>
</template>

<script>
import DatasetColumnSelector from '@/components/dataset/DatasetColumnSelector'
import NodeConfig from '@/components/dataflow/components/NodeConfig'
import PeriodTimeConfig from '@/components/dataflow/components/PeriodTimeConfig'
import FormTpl from "@/components/common/FormTpl.vue";
import DashboardDatasetWorker from 'worker-loader!@/worker/dashboard/dashboard/DashboardDataset.Worker.js';

export default {
	components:{
		FormTpl,
		PeriodTimeConfig,
		NodeConfig,
		DatasetColumnSelector
	},
	created(){
		this.dashboardDatasetWorker = new DashboardDatasetWorker()
		this.listenFromWorker()
	},
	computed:{
		rowData(){
			if(this.allDatasetColumn[this.currentId]){
				debugger
				return this.allDatasetColumn[this.currentId]
			}else{
				return []
			}
		}
	},
	data(){
		return {
			dashboardDatasetWorker: null,
			allDatasetColumn:{},
			currentId:0,
			allInputs:{
				name: {
					"title": this.$t('common.name'),
					"type": "text",
					"value": "",
					"info": "",
				},
				description: {
					"title": this.$t('common.description'),
					"type": 'text',
					"value": "",
					"info": "",
				},
				saveAsDataset:{
					"title": 'Save result as dataset',
					"type": 'checkbox',
					"value": false,
				}
			},
			formTplDataset:{
				name: {
					"title": this.$t('bi.dataset.title-add'),
					"type": "text",
					"value": "",
					"info": "",
				},
				
			}
		}	
	},
	methods:{
		listenFromWorker(){
			let self = this;
            this.dashboardDatasetWorker.addEventListener("message", function (event) {
                let data = event.data;
                let action = data.action;
                if(self[action]){
                    self[action](data.data);
                } else {
                    console.error(` action ${action} not found `);
                }
            });
		},
		handleGetDatasetColumns(data){
			if(data.status == 200){
				this.$set(this.allDatasetColumn, this.currentId, data.data.columns[this.currentId])
			}else{
				this.$snotifyError("Không thể lấy danh sách column")
			}
		},
		handleDatasetSelected(params){
			this.currentId = params.id
			if(!this.allDatasetColumn[params.id]){
				this.dashboardDatasetWorker.postMessage({
					action: 'getDatasetColumns',
					data:{
						id: params.id
					}
				})
			}
			
		}
	}
}
</script>

<style>

</style>