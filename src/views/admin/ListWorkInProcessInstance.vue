<template>
	<div class="w-100" style="position:absolute;margin-top:-24px">
		<span class="ml-3" style="position:relative; top:34px;left:0"> Chi tiết công việc : {{title}}</span>
		<workDetail
			class="workDetail"
			:workInfo="workInfo"
		>
		
		</workDetail>
	</div>
	
</template>

<script>
import workDetail from "@/components/myItem/work/WorkDetail.vue"
import BPMNEngine from "@/api/BPMNEngine.js";
export default {	
	components:{
		workDetail
	},
	data(){
		return {
			workInfo: [],
			title: "",
		}
	},
	created(){
		this.getTaskCurrent()
	},
	methods:{
		 async getTaskCurrent(){
			let processInstanceId = this.$route.params.processInstanceId
            let self=this;
            try {
			 	let data = await BPMNEngine.getProcessInstanceHistory({processInstanceId:processInstanceId, includeProcessVariables: true});
				this.workInfo = data.data
				this.title = data.data[0].name
            } catch (error) {
                self.$snotifyError(error, "Get task process current failed");
            }
        },
	}
}
</script>

<style scoped>
.workDetail{
	position:absolute;
}
</style>