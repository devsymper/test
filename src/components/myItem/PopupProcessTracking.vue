<template>
    <div class="wraper-tracking" :class="{'d-none':stask.statusPopupTracking==false}" >
        <div class="tracking-process" style="height:100%">
            <trackingProcessInstance
                v-if="taskInfo.action.parameter.processInstanceId"
                :instanceId="taskInfo.action.parameter.processInstanceId"
                :elementId="taskInfo.action.parameter.activityId"
                >
            </trackingProcessInstance>
        </div>
	</div>
</template>

<script>
import trackingProcessInstance from "@/views/process/TrackingProcessInstance.vue";

export default {
    components:{
		trackingProcessInstance,
    },
    data(){
		return {
		}
    },
    props:{
        taskInfo: {
			type: Object,
			default: () => {}
		},
    },
    methods:{
	},
	computed:{
		stask() {
			return this.$store.state.task;
		},
	}
}
</script>

<style scoped>
    .wraper-tracking{
		position: absolute;
		right:50px;
		width: 70%;
		height: 60%;
		background: white;
		z-index: 9999;
		padding: 12px 6px 6px 11px;
		transition: all ease-in-out 250ms;
		border: 1px solid #dedede;
    	box-shadow: 1px 1px #e0d9d9;
	}


</style>>
