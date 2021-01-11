<template>
	<v-dialog>
		<trackingProcessInstance
			class="popup-model-diagram"
			v-if="workInfo.id"
			@node-clicked="handlerNodeCLicked"
			:instanceId="workInfo.id"
			>  
		</trackingProcessInstance>
	</v-dialog>
</template>

<script>
import trackingProcessInstance from "@/views/process/TrackingProcessInstance.vue";
export default {	
	components:{
		trackingProcessInstance,
	},
	props:{
		showDialog:{
			type: Boolean,
			default: true
		}
	},
	data(){
		return{
			workInfo: {},
		}
	}

}
</script>

<style>

</style>