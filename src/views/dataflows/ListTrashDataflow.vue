<template>
	<div>
		<ListItems
			ref="listServer"
			:pageTitle="$t('bi.dataflow.title-show-list-trash')"
			:containerHeight="containerHeight"
			:getDataUrl="getListUrl"
			:headerPrefixKeypath="'table'"
			:showExportButton="false"
			:useDefaultContext="false"
			:tableContextMenu="tableContextMenu"
			:actionPanelWidth="550"
			:customAPIResult="customAPIResult"
			:showButtonAdd="false"
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
				restore: {
					name: 'restore',
					text: self.$t('common.restore'),
					callback: (row, callback) => {},
				},
			},
			customAPIResult: {
				reformatData(res) {
						return {
						columns: res.data.columns,
						listObject: res.data.listObject,
						total: res.total,
					};
				},
			},
			getListUrl: appConfigs.apiDomain.biService+"/dataflows/trash",
		};
	},
};
</script>

<style></style>
