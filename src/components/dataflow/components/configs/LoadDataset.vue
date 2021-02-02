<template>
    <div>
		<NodeConfig
			@dataset-selected="handleDatasetSelected"
		/>
		<DatasetColumnSelector  :rowData="rowData" />
    </div>
</template>

<script>
import NodeConfig from '@/components/dataflow/components/NodeConfig'
import DatasetColumnSelector from '@/components/dataset/DatasetColumnSelector'
import DashboardDatasetWorker from 'worker-loader!@/worker/dashboard/dashboard/DashboardDataset.Worker.js';

export default {
    data(){
        return {
			currentId: 0,
        }
    },
    computed: {
		rowData(){
			if(this.allDatasetColumn[this.currentId]){
				return this.allDatasetColumn[this.currentId]
			}else{
				return []
			}
		},
    },
	created(){
		this.dashboardDatasetWorker = new DashboardDatasetWorker()
		this.listenFromWorker()
	},
    methods: {
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
		},
		handleGetDatasetColumns(data){
			if(data.status == 200){
				this.$set(this.allDatasetColumn, this.currentId, data.data.columns[this.currentId])
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