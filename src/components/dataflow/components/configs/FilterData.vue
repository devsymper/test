<template>
	<div>
		<TreeSqlConfig 
			:defaultData="defaultData" 
			:customAutocomplete="true" 
			:itemValue="'uid'" 
			:listColumn="listColumn" 
			:customCss="true"	
		/>
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
			this.nodeData.configs.condition.forEach(function(e){
				if(e.id == "root"){
					e.root = true
					e.condition = true,
					e.name = e.label
				}
			})
			return this.nodeData.configs.condition
		},
	},
	
};
</script>

<style></style>
