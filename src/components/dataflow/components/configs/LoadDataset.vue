<template>
    <div class="h-100">
		<NodeConfig
			@dataset-selected="handleDatasetSelected"
			:configs="nodeData.configs"
		/>
		<DatasetColumnSelector  :rowData="nodeData.configs.allColumns" @change-configs="handleChangeConfigs" />
    </div>
</template>

<script>
import NodeConfig from '@/components/dataflow/components/NodeConfig'
import DatasetColumnSelector from '@/components/dataset/DatasetColumnSelector'
import DashboardDatasetWorker from 'worker-loader!@/worker/dashboard/dashboard/DashboardDataset.Worker.js';

export default {
	props:{
		nodeData:{
			type: Object,
			default(){
				return {}
			}
		},
	},
    data(){
        return {
			currentId: 0,
			allDatasetColumn:{}
        }
	},
	created(){
		this.dashboardDatasetWorker = new DashboardDatasetWorker()
		this.listenFromWorker()
	},
    methods: {
		handleChangeConfigs(){
			this.$emit('change-configs', {})
		},
		handleDatasetSelected(params){
			this.$emit('change-configs', {})
			setTimeout(self=>{
				self.changeNodeInfor(params)
			},200, this)
			this.currentId = params.id
			if(!this.allDatasetColumn[params.id]){
				this.dashboardDatasetWorker.postMessage({
					action: 'getDatasetColumns',
					data:{
						id: params.id
					}
				})
			}else{
				this.$set(this.nodeData.configs, 'allColumns', this.allDatasetColumn[params.id])
			}
		},
		changeNodeInfor(params){
			this.$set(this.nodeData.configs, 'idDataset', params.id)
			this.$set(this.nodeData.configs, 'title', params.aliasName)
			this.$set(this.nodeData.configs, 'name', params.aliasName)
		},
		handleGetDatasetColumns(data){
			if(data.status == 200){
				this.$set(this.allDatasetColumn, this.currentId, data.data.columns[this.currentId])
				this.$set(this.nodeData.configs, 'allColumns', data.data.columns[this.currentId])
			}else{
				this.$snotifyError("Không thể lấy danh sách column")
			}
        },
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
		}
    },
    components: {
		NodeConfig,
		DatasetColumnSelector
    }
}
</script>

<style>

</style>