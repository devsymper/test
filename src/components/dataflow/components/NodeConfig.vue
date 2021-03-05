<template>
	<div class="dataflow-node-config mt-2">	
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
			this.$set(this.datasetInfor.id, 'content', params.id)
			this.$set(this.datasetInfor.name, 'content', params.name)
			this.$set(this.datasetInfor.title, 'content', params.aliasName)
			this.$set(this.datasetInfor.docId, 'content', params.symperId)
			this.$emit('dataset-selected' , params)
		}
	},
	computed: {
		datasetInfor(){
			return {
				id:{
					title:"ID",
					content: this.configs.idDataset
				},
				name:{
					title:"Name",
					content: this.configs.name
				},
				title:{
					title:"Title",
					content: this.configs.title
				},
				docId:{
					title:"Doc id",
					content: this.configs.symperDocId
				}
			}
		}
	},
	data(){
		return {
			
		}
	}
}
</script>

<style scoped>
.dataflow-node-config >>> .table-dataset-info{

}
</style>