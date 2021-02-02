<template>
	<div>
		<TreeSqlConfig :defaultData="defaultData" :listColumn="Object.keys(nodeData.configs.allColumns)" />
	</div>
</template>

<script>
import TreeSqlConfig from '@/views/document/sideright/items/TreeSqlConfig';
export default {
	components: {
		TreeSqlConfig,
	},
	props: {
		nodeData: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	computed: {
		listColumn() {
			let arr = [];
			for (let i in this.nodeData.configs.allColumns) {
				arr.push(this.nodeData.configs.allColumns[i]);
			}
			return arr;
		},
		defaultData() {
			return [
				{
					id: 1,
					nodeType: 'group',
					name: 'AND',
					root: true,
					condition: true,
					children: this.nodeData.configs.condition
				},
			];
			
		},
	},
};
</script>

<style></style>
