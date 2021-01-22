<template>
	<div class="dataset-autocomplete">
		<v-autocomplete
			v-model="model"
			:items="listDataset"
			:search-input.sync="searchKey"
			multiple
			solo
			:placeholder="$t('common.searchPlaceholder')"
			return-object
			@change="hanldeChange"
		>
			<template v-slot:item="data">
				<div class="d-flex flex-column">
					<div class="d-flex">
						<v-icon x-small>
							{{data.item.type == 'dataset_by_dataflow' ? 'mdi-folder': 'mdi-file'}}
						</v-icon>
						<span class="fs-13 ml-2">
							{{data.item.symperId + '-' + data.item.name }}
						</span>
					</div>
					<div class="fs-13 title-dataset-alias" >
						{{data.item.aliasName}}
					</div>
				</div>
			</template>
			<template v-slot:selection="data">
               
              </template>
		</v-autocomplete>
	</div>
</template>

<script>
import _debounce from "lodash/debounce";
import DashboardDatasetWorker from 'worker-loader!@/worker/dashboard/dashboard/DashboardDataset.Worker.js';

export default {
	props:{
	},
	computed:{
		listDatasetCpt(){
			return this.listDataset
		}
	},
	created(){
		let self = this
		this.dashboardDatasetWorker = new DashboardDatasetWorker()
		this.dashboardDatasetWorker.addEventListener("message", function (event) {
			let data = event.data;
			let action = data.action;
			if(action == 'searchDatasetRes'){
				self.searchCache[data.data.searchKey] = data.data.res.data.listObject
				self.$set(self , 'listDataset', data.data.res.data.listObject)
			}
		});
		this.searchDataset()
	},
	data(){
		return {
			isLoading: false,
			model: [],
			searchKey: "",
			dashboardDatasetWorker:null,
			searchCache: {
				s:[]
			},
			listDataset:[]
		}
	},
	methods:{
		searchDataset(){
			let val = this.searchKey
			if(this.searchCache[val]){
				this.$set(this, 'listDataset',  this.searchCache[val] )
			}else{
				this.dashboardDatasetWorker.postMessage({
					action: 'searchDataset',
					data:{
						searchKey: val
					}
				})
			}
			
		},
		hanldeChange(value){
			this.$emit('dataset-selector', value)
		},
		debounceSearch: _debounce(function(e){
			this.searchDataset()
		}, 300,this),
	},

	watch:{
		searchKey(val){
			this.debounceSearch()
		}
	}
}
</script>

<style scoped>
.dataset-autocomplete >>> .v-text-field__details{
	display: none !important;
}
.dataset-autocomplete >>> .v-input__control{
	min-height: unset !important;
}
.dataset-autocomplete >>> .v-input__slot{
	box-shadow: unset !important;
	border: 1px solid lightgray
}
.dataset-autocomplete >>> input{
	font-size: 13px !important;
}
</style>
<style >
.title-dataset-alias{
	white-space: nowrap; 
	width: 160px; 
	overflow: hidden;
	text-overflow: ellipsis; 
}
</style>