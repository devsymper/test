<template>
	<div class="d-flex relation-editor w-100 h-100">
		<div class="relation-dataset-selector" v-if="action != 'view'">
			<div class="d-flex flex-column ml-3 mt-2 mr-2">
				<span class="mb-2 fs-13">
					{{ $t('bi.relation.selector') }}
				</span>
				<DatasetAutocomplete @dataset-selector="handleDatasetSelected" :listDatasets="listDatasets" :listDatasetSelected="listDatasetSelected" />
				<VuePerfectScrollbar class="mt-2 " :style="{ height: listHeight + 'px' }" v-if="listDatasetSelected.length > 0">
					<dataset-selected-item  v-for="(item, i) in listDatasetSelected" :key="i" class="dataset-selected-item" :item="item" :showRemove="true" @remove-item="removeItem" />
				</VuePerfectScrollbar>
			</div>
		</div>
		<div class="relation-workspace flex-grow-1 d-flex flex-column">
			<div class="d-flex  justify-content-center">
				<div class="d-flex " style="width: 150px" :class="{'flex-grow-1': dialogMode}">
					<v-icon small>
						mdi-pencil-box-outline
					</v-icon>
					<span class="fs-13 mt-2 ml-2 mr-8">
						{{relationName}}
					</span>
				</div>
				<div class="flex-grow-1" style="margin-right: auto; margin-left: auto">
					<v-tooltip bottom v-for="(item, key) in headerActions" :key="key">
						<template v-slot:activator="{ on }">
							<v-btn small @click="handleHeaderAction(key)" icon tile class="mr-2 mt-1" style="position:relative; top: -3px;">
								<v-icon small v-on="on">{{ item.icon }}</v-icon>
							</v-btn>
						</template>
						<span>{{ $t(item.text) }}</span>
					</v-tooltip>
				</div>
				<div class="ml-auto" style="margin-top: 2px">
					<v-btn small class="mr-2" @click="saveRelations" v-if="action != 'view'">
						<v-icon small>
							mdi-check
						</v-icon>
						<span class="ml-1">
							{{ $t('common.save') }}
						</span>
					</v-btn>
				</div>
			</div>
			<RelationWorkspace 
				:action="action"
				ref="relationWorkspace"
			 	style="height: calc(100% - 41px)"
				:wrapper="wrapper"
				:width="width"
				:height="height"
			 />
		</div>
		<div class="relation-link" v-if="action != 'view'">
			<RelationLink
				:allLinks="allLinks"
				:listDatasetSelected="listDatasetSelected"
			/>
		</div>
	</div>
</template>

<script>
import RelationWorkspace from '@/components/relation/RelationWorkspace';
import DatasetAutocomplete from '@/components/dataset/DatasetAutocomplete';
import DatasetSelectedItem from '@/components/dataset/DatasetSelectedItem.vue';
import RelationLink from '@/components/relation/RelationLink.vue';
import RelationEditorWorker from 'worker-loader!@/worker/relation/RelationEditor.Worker.js';
import { util } from '@/plugins/util.js';
import VuePerfectScrollbar from "vue-perfect-scrollbar";
export default {
	props: {
		action: {
			type: String,
			default: 'edit',
		},
		relationId:{
			type: String,
			default: ""
		},
		dialogMode:{
			type: Boolean,
			default: false
		},
		wrapper:{
			type: Object,
			default(){
				return {
					height: '300px',
					width: '500px',
				}
			}
		},
		width:{
			type: Number,
			default: 800
		},
		height:{
			type: Number,
			default: 600
		},
	},
	data() {
		return {
			listDatasetSelected: [],
			listHeight: 0,
			relationEditoWorker: null,
			headerActions: {
				zoomIn: {
					icon: 'mdi-plus-circle-outline',
					text: 'process.header_bar.zoom_out',
				},
				zoomOut: {
					icon: 'mdi-minus-circle-outline',
					text: 'process.header_bar.zoom_in',
				},
				zoomToFit: {
					icon: 'mdi-image-filter-center-focus',
					text: 'process.header_bar.focus',
				},
			},

			selectingNode: null,
			listDatasets: null,
			selectedDatasetIds: null,
			relationName: "",
			allLinks: null
		};
	},
	components: {
		RelationWorkspace,
		DatasetAutocomplete,
		DatasetSelectedItem,
		VuePerfectScrollbar,
		RelationLink
	},
	created(){
		this.relationEditoWorker = new RelationEditorWorker()
        this.listenFromWorker();
		if(this.action == 'edit'){
			this.getRelationConfigs()
		}
	},	
	mounted(){
		this.listHeight = util.getComponentSize(this).h - 200
	},
	watch:{
		relationId(val){
			this.getRelationConfigs()
		}
	},
	methods: {
		getRelationConfigs(){
			let id = this.relationId != "" ? this.relationId : this.$route.params.id
			this.relationEditoWorker.postMessage({
				action: 'getRelationConfigs',
				data:{
					id: id
				}
			})
		},
		getAllDataset(){
			this.relationEditoWorker.postMessage({action: 'getAllDataset'})
		},
		handleGetAllDataset(data){
			let self = this
			this.listDatasets = data.data.listObject
			if(self.selectedDatasetIds && self.selectedDatasetIds.length > 0){
				self.listDatasets.forEach(function(e){
					if(self.selectedDatasetIds.includes(e.id)){
						self.listDatasetSelected.push(e)
					}
				})
			}	
			
		},
		handleSaveRelation(data){
			if(data.status == 200){
				this.$snotifySuccess("Lưu thành công")
			}else{
				this.$snotifyError("Có lỗi xảy ra")
			}
		},
		saveRelations(){
			let info = this.$refs.relationWorkspace.getWorkspaceInfo()
			info.dtss.forEach(function(e){
				if(e.dataset.id.includes(":symper")){
					let arr = e.dataset.id.split(":")
					e.dataset.id = arr[0]
				}
			})
			let data = {
				links: info.links,
				relation:{
					name: this.relationName,
					id: this.$route.params.id,
					action: this.action
				},
				datasets: info.dtss
			};
			this.relationEditoWorker.postMessage({
				action: 'saveRelations',
				data: data
			})
		},
		handleRelationConfig(data){
			this.allLinks = data.links
			this.datasets = data.datasetsMap
			this.selectedDatasetIds = data.selectedDatasetIds 
			this.relationName = data.relationName
			this.getAllDataset()
			this.$refs.relationWorkspace.loadRelations(data.originDataset , data.items , data.links)
		},	
		listenFromWorker(){
			let self = this;
            this.relationEditoWorker.addEventListener("message", function (event) {
                let data = event.data;
                let action = data.action;
                if(self[action]){
                    self[action](data.data);
                } else {
                    console.error(` action ${action} not found `);
                }
            });
		},
		handleDatasetSelected(arr){
			debugger
			this.handleChangeSelectDataset(arr[arr.length - 1],true);
			this.listDatasetSelected = arr;
		},
		removeItem(item) {
			this.listDatasetSelected.splice(this.listDatasetSelected.indexOf(item), 1);
			this.$refs.relationWorkspace.removeDataset(item, true)
		},
		handleHeaderAction(action){
			 this.$refs.relationWorkspace.handleHeaderAction(action);
		},
		handlerDatasetSelected(dataset){
			this.$refs.relationWorkspace.updateDatasetColumns(dataset.datasets)
		},
		handleChangeSelectDataset(node, isSelected){
			if(isSelected){
				this.$refs.relationWorkspace.addDataset(JSON.parse(JSON.stringify(node)))
				this.relationEditoWorker.postMessage({action: 'handleChangeSelectDataset' , data:{
					node: node
				}})
			}
		},
	},
};
</script>

<style scoped>
.relation-editor >>> .relation-dataset-selector {
	width: 15%;
}
.relation-editor >>> .relation-link {
	width: 20%;
}
.relation-editor >>> .button-save-relation:hover {
	background-color: #f5f5f5;
}
.relation-editor >>> .v-btn{
	box-shadow: unset !important;
}
</style>
