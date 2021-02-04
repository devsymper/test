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
			this.customDataToTreeSql(this.nodeData.configs.condition)
			return this.nodeData.configs.condition
		},
	},
	methods:{
		customDataToTreeSql(conditions){
			let self = this
			if(conditions.length > 0){
				conditions.forEach(function(e){
					if(e.nodeType == 'group'){
						debugger
						if(e.id == "root"){
							e.root = true
							e.condition = true,
							e.name = e.label
						}else{
							e.condition = true
							e.name = e.label
						}
						self.customDataToTreeSql(e.children)
					}
				})
			}	
			return conditions
		},

	}	
};
</script>

<style></style>
