<template>
	<div>
		<TreeSqlConfig 
			:defaultData="defaultData" 
			:customAutocomplete="true" 
			:itemValue="'uid'" 
			:listColumn="listColumn" 
			:customCss="true"
			@change-config="handleChangeConfig"
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
		condition:{
			type: Array,
			default(){
				return []
			}
		},
		useConditionProps:{
			type: Boolean,
			default: false,
		}
	},
	computed: {
		listColumn() {
			let arr = [];
			for (let i in this.nodeData.configs.allColumns) {
				arr.push(this.nodeData.configs.allColumns[i]);
			}
			return arr;
		},
		defaultData(){
			debugger
			if (this.useConditionProps) {
				this.$set(this.nodeData.configs,'condition',this.condition)
			}
			this.customDataToTreeSql(this.nodeData.configs.condition)
			return this.nodeData.configs.condition
		},
	},
	methods:{
		handleChangeConfig(){
			this.$emit('change-configs', {})
		},
		customDataToTreeSql(conditions, parentId = false){
			let self = this
			if(conditions.length > 0){
				conditions.forEach(function(e){
					e.parent = parentId
					if(e.nodeType == 'group'){
						if(e.id == "root"){
							e.root = true
						}	
						e.condition = true,
						e.name = e.label
						self.customDataToTreeSql(e.children, e.id)
					}
				})
			}	
			return conditions
		},

	}	
};
</script>

<style></style>
