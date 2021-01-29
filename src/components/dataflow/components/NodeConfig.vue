<template>
	<div class="dataflow-node-config">	
		<DatasetAutocomplete :isMultiple="false" @dataset-selector="handleDatasetSelector" />
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
	components:{
		DatasetAutocomplete
	},
	methods:{
		handleDatasetSelector(params){
			this.datasetInfor.id.content = params.id
			this.datasetInfor.name.content = params.name
			this.datasetInfor.title.content = params.aliasName
			this.$emit('dataset-selected' , params)
		}
	},
	data(){
		return {
			datasetInfor:{
				id:{
					title:"ID",
					content: ""
				},
				name:{
					title:"Name",
					content: ""
				},
				title:{
					title:"Title",
					content: ""
				},
				docId:{
					title:"Doc id",
					content: ""
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