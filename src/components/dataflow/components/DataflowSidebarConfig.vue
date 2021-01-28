<template>
	<div class="ml-2 mr-2 d-flex flex-column">
		<FormTpl 
			:allInputs="allInputs"
		/>
		<div v-if="allInputs.saveAsDataset.value" class="ml-4 mr-4 d-flex flex-column">
			<FormTpl 
				:allInputs="formTplDataset"
			/>
			<div class="d-flex mt-2 align-center">
				<span class="fs-13 mr-2">
					Auto update period time 
				</span>
				<PeriodTimeConfig />
			</div>
		</div>
	</div>
</template>

<script>
import PeriodTimeConfig from '@/components/dataflow/components/PeriodTimeConfig'
import FormTpl from "@/components/common/FormTpl.vue";

export default {
	components:{
		FormTpl,
		PeriodTimeConfig
	},
	watch:{
		
	},
	data(){
		return {
			allInputs:{
				name: {
					"title": this.$t('common.name'),
					"type": "text",
					"value": "",
					"info": "",
				},
				description: {
					"title": this.$t('common.description'),
					"type": 'text',
					"value": "",
					"info": "",
				},
				saveAsDataset:{
					"title": 'Save result as dataset',
					"type": 'checkbox',
					"value": false,
				}
			},
			formTplDataset:{
				name: {
					"title": this.$t('bi.dataset.title-add'),
					"type": "text",
					"value": "",
					"info": "",
				},
				
			}
		}	
	}
}
</script>

<style>

</style>