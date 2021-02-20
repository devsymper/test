<template>
	<FormTpl :allInput="allInput" />

</template>

<script>
import FormTpl from '@/components/common/FormTpl.vue';

export default {
	components:{
		FormTpl
	},
	props:{
		nodeData:{
			type: Object,
			default(){
				return {}
			}
		},
	},
	data(){
		return {
			allInput:{
				scriptRunner:{
					"title": "Script",
                    "type": "script",
                    "value":"",
                    "info": "",
				}
			}
		}
	}
}
</script>

<style>

</style>