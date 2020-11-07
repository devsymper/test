<template>
	<div class="w-100" >
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
			workInfo: {},
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
				 if(data.data[0]){
					this.workInfo = data.data[0]
				 }else{
					this.workInfo = {}
				 }
			
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