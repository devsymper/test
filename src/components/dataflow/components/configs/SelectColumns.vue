<template> 
	<DatasetColumnSelector :rowData="nodeData.configs.columns" @change-configs="handleChangeConfigs" />
</template>

<script>
import DatasetColumnSelector from '@/components/dataset/DatasetColumnSelector';
export default {
	props: {
		nodeData:{
			type: Object,
			default(){
				return {}
			}
		},
	},
	components: {
		DatasetColumnSelector,
	},
	methods:{
		handleChangeConfigs(){
			this.$emit('change-configs', {})
		}
	}
};
</script>

<style></style>
