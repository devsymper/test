<template>
	<div>
		<ListItems
			ref="listOutput"
			:pageTitle="$t('bi.dataflow.title-show-list')"
			:containerHeight="contentRunningHeight - 60"
			:getDataUrl="getListUrl"
			:showExportButton="false"
			:useDefaultContext="false"
			:tableContextMenu="tableContextMenu"
			:flexMode="true"
			:apiMethod="'POST'"
			:actionPanelWidth="550"
			:showButtonAdd="false"
			:showDisplayConfig="false"
			:customDataForApi="customDataForApi"
			:customHeaderBtn="customHeaderBtn"
			:customContentType="true"
			@data-loaded="handleDataloaded"
			:customAPIResult="customAPIResult"
		>
			<template slot="right-panel-content" slot-scope="{}"> </template>
		</ListItems>
	</div>
</template>

<script>
import ListItems from '@/components/common/ListItems';
import { appConfigs } from '@/configs.js';
export default {
	components: {
		ListItems,
	},
	computed: {
		selectingNode(){
			return this.$store.state.dataflow.allDataflow[this.instanceKey].selectedWidget;
		}
	},
	methods: {
		handleAddSuccess() {
			this.showDialog = false;
			this.$refs.listService.refreshList();
		},
		getData(dataPost){
			this.dataPost = dataPost;
			this.$refs.listOutput.getData()
		},
		handleDataloaded(){
			this.$emit('data-loaded')
		}
	},
	props: {
		containerHeight: {
			type: Number,
			default: 300,
		},
        action: {
            default: 'create'
        },
        instanceKey: {
            default: ''
		},
		contentRunningHeight:{
			type: Number,
			default: 0
		}
	},
	data() {
		let self = this;
		return {
			showDialog: false,
			dataPost: {},
			customDataForApi() {
				return self.dataPost;
			},
			customHeaderBtn:{
				exportExcel:{
					icon: 'mdi-microsoft-excel',
					title: self.$t('common.export_excel'),
					callback(){
					}
				}
			},
			tableContextMenu: {
				update: {
					name: 'edit',
					text: this.$t('apps.contextMenu.edit'),
					callback: (obj, callback) => {
						self.$goToPage('/dataflows/' + obj.id + '/edit', self.$t('common.edit') + ' ' + (obj.name ? obj.name : ''));
					},
				},
				remove: {
					name: 'remove',
					text: this.$t('apps.contextMenu.remove'),
					callback: (app, callback) => {},
				},
			},
			customAPIResult: {
				reformatData(res) {
					let cols = self.selectingNode.output;
					cols.forEach(function(e){
						e.name = e.columnName
					})
					return {
						columns: cols,
						listObject: res.data.data,
						total: res.data.total,
					};
				},
			},
			getListUrl: appConfigs.apiDomain.biService + '/dataflow/run-node-without-save',
		};
	},
};
</script>

<style scope>


</style>
