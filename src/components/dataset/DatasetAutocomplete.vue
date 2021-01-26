<template>
	<div class="dataset-autocomplete">
		<v-autocomplete
			v-model="listDatasetSelected"
			:items="listDatasets"
			multiple
			solo
			hide-selected
			:placeholder="$t('common.searchPlaceholder')"
			@change="hanldeChange"
			item-text="aliasName"
			return-object
		>
			<template v-slot:item="data">
				<div class="d-flex flex-column mt-1">
					<div class="d-flex">
						<v-icon x-small>
							{{data.item.type == 'dataset_by_dataflow' ? 'mdi-database-arrow-right-outline': 'mdi-file-document-multiple-outline'}}
						</v-icon>
						<span class="fs-13 ml-2" v-if="data.item.symperId ">
							{{data.item.symperId + '-' + data.item.name ? data.item.name : "" }}
						</span>
					</div>
					<div class="fs-13 title-dataset-alias" v-if="data.item.aliasName" style="opacity: 0.5">
						{{data.item.aliasName}}
					</div>
				</div>
			</template>
		</v-autocomplete>
	</div>
</template>

<script>
import _debounce from "lodash/debounce";
import DashboardDatasetWorker from 'worker-loader!@/worker/dashboard/dashboard/DashboardDataset.Worker.js';

export default {
	props:{
		listDatasets:{
			type: Array, 
			default(){
				return []
			}
		}
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
				// self.$set(self , 'listDataset', data.data.res.data.listObject)
			}else if(action == 'handleGetAllDataset'){
				debugger
				self.$set(self, 'listDataset', data.res.data.listObject)
			}
		});
	},
	data(){
		return {
			isLoading: false,
			listDatasetSelected: [],
			searchKey: "",
			dashboardDatasetWorker:null,
			searchCache: {
				s:[]
			},
			listDataset:[]
		}
	},
	methods:{
		getAllDataset(){
			this.dashboardDatasetWorker.postMessage({
				action: 'getAllDataset',
			})
		},
		searchDataset(){
			// let val = this.searchKey
			// if(this.searchCache[val]){
			// 	this.$set(this, 'listDataset',  this.searchCache[val] )
			// }else{
			// 	this.dashboardDatasetWorker.postMessage({
			// 		action: 'searchDataset',
			// 		data:{
			// 			searchKey: val
			// 		}
			// 	})
			// }
			
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
.dataset-autocomplete >>> .v-select__selection{
	display: none
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