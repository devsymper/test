<template>
    <div class="wraper-tracking" :class="{'d-none':stask.statusPopupTracking==false}" >
        <div class="tracking-process" style="height:100%" v-if="showType=='work'">
            <trackingProcessInstance
                v-if="workInfo.id"
				:instanceId="workInfo.id"
				:definitionName="definitionName"
                >
            </trackingProcessInstance>
        </div>
		<div class="tracking-process" style="height:100%" v-else-if="showType==''">
            <trackingProcessInstance
                v-if="taskInfo.action.parameter.processInstanceId"
                :instanceId="taskInfo.action.parameter.processInstanceId"
                :elementId="taskInfo.action.parameter.activityId"
				:definitionName="definitionName"
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
		workInfo: {
			type: Object,
			default: () => {}
		},
		definitionName:{
            type:String,
            default:'',
		},
		showType:{
			type:String,
            default:'',
		}
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
		position: fixed;
		top:50%;
		left:50%;
		transform: translate(-50%,-50%);
		width: 70%;
		height: 60%;
		background: white;
		z-index: 9999;
		padding: 12px 6px 6px 11px;
		transition: all ease-in-out 250ms;
		border: 1px solid #dedede;
    	box-shadow: 1px 1px  #e0d9d9;
		border-radius: 4px;
	}
</style>>
