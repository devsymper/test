<template>
	<div>
		<ListItems
			ref="listServer"
			:pageTitle="$t('bi.dataflow.title-show-list')"
			:containerHeight="containerHeight"
			:getDataUrl="getListUrl"
			:headerPrefixKeypath="'table'"
			:showExportButton="false"
			:useDefaultContext="false"
			:tableContextMenu="tableContextMenu"
			:flexMode="true"
			:actionPanelWidth="550"
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
	methods: {
		handleAddSuccess() {
			this.showDialog = false;
			this.$refs.listService.refreshList();
		},
	},
	props: {
		containerHeight: {
			type: Number,
			default: 0,
		},
	},
	data() {
		let self = this;
		return {
			showDialog: false,
			tableContextMenu: {
				update: {
					name: 'edit',
					text: this.$t('apps.contextMenu.edit'),
					callback: (obj, callback) => {
						self.$goToPage("/dataflows/" + obj.id + "/edit",
                            self.$t('common.edit')+ " " + (obj.name ? obj.name : "")
						)
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
					return {
						columns: res.data.columns,
						listObject: res.data.listObject,
						total: res.total,
					};
				}
			},	
			getListUrl: appConfigs.apiDomain.biService+"/dataflows",
		};
	},
};
</script>

<style></style>
