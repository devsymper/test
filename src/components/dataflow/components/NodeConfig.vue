<template>
	<div class="dataflow-node-config">	
		<DatasetAutocomplete :isMultiple="false" :idDataset="configs.idDataset" @dataset-selector="handleDatasetSelector" />
		<div class="table-dataset-info d-flex flex-column">
			<div class="d-flex fs-13 mt-1" v-for="(item, i) in datasetInfor" :key="i">
				<span class="flex-grow-1">
					{{item.title}}
				</span>
				<span>
					{{item.content}}
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import DatasetAutocomplete from '@/components/dataset/DatasetAutocomplete'

export default {
	props:{
		configs:{
			type: Object,
			default(){
				return {}
			}
		}
	},
	components:{
		DatasetAutocomplete
	},
	methods:{
		handleDatasetSelector(params){
			this.$emit('dataset-selected' , params)
		}
	},
	data(){
		return {
			datasetInfor:{
				id:{
					title:"ID",
					content: this.configs.idDataset
				},
				name:{
					title:"Name",
					content: this.configs.wgName
				},
				title:{
					title:"Title",
					content: this.configs.title
				},
				docId:{
					title:"Doc id",
					content: this.configs.symperDocId
				},
			}
		}
	}
}
</script>

<style scoped>
.dataflow-node-config >>> .table-dataset-info{

}
</style>