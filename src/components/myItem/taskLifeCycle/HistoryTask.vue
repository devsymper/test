<template>
  <div class="d-flex flex-column mt-2">
	  <div class="d-flex flex-column mb-2 pt-1 mr-1 ml-1 " v-for="(item,i) in allHistory" :key="i">
		  <div class="d-flex align-center"> 
			  <!-- <SymperAvatar :userId="item.userCreateActionId"/> -->
			  <v-icon small> {{ item.userCreateActionType == 'owner' ? 'mdi-account-tie-outline' : 'mdi-account-check-outline'  }}</v-icon>
			 <span class="flex-grow-1  ml-1">
				  {{item.userCreateAction}}
			 </span>
			  <span>
				  {{item.date}} 
			  </span>
		  </div>
		  <div class="d-flex mt-1"> 
			 <span v-html="reduce(item.startStatus,item.endStatus)"></span> <span style="color: blue" class="ml-1"> {{item.userReceiveAction}} </span>
		  </div>
		  <div class="d-flex align-center">
			  Status 
			  <v-chip
				x-small
				label
				:color="taskStatus[item.startStatus].color"
				class="ma-2"
				text-color="white"
			>

				<span class="fs-11">
					{{taskStatus[item.startStatus].title}}
				</span>
			</v-chip>
			<v-icon x-small>
				mdi-chevron-triple-right
			</v-icon>
			<v-chip
					x-small
					label
					class="ma-2"
					:color="taskStatus[item.endStatus].color"
					text-color="white"
				>
					<span class="fs-11">
						{{taskStatus[item.endStatus].title}}
					</span>
				</v-chip>
		  </div>
	  </div>
  </div>
</template>

<script>
import SymperAvatar from "@/components/common/SymperAvatar";
export default {
	components:{
		SymperAvatar
	},
	computed:{
		historyTask(){
			let sData =  this.$store.state.task
			let data = []
			if(sData.currentTaskHistory.length > 0){
				sData.currentTaskHistory.forEach(function(e){
					if(e.logAction == 'update' || e.logAction == 'create'){
						data.push(e)
					}
				})
			}
			return data
		},
		allHistory(){
			let data = this.historyTask
			let mapIdToUser = this.$store.getters['app/mapIdToUser'];
			let newData = []
			let self = this
			if(data.length > 1){
				for(let i = 0; i < data.length - 1 ; i++){
					if(data[i].delegationState == 'PENDING'){
						if(data[i+1].delegationState == "RESOLVED"){
							let obj = self.createHistoryTask(data[i],data[i+1],"delegate","assign",'assigne')
							obj.userCreateAction  = mapIdToUser[data[i].assignee].displayName
							let arr = data[i+1].assignee.split(":")
							obj.userReceiveAction  = mapIdToUser[arr[0]].displayName
							newData.push(obj)
						}
					}
					else if(data[i].delegationState == 'RESOLVED'){
						if(data[i+1].delegationState == "PENDING"){
							let obj = self.createHistoryTask(data[i],data[i+1],"assign","delegate",'owner')
							let arr = data[i].assignee.split(":")
							obj.userCreateAction  = mapIdToUser[arr[0]].displayName
							obj.userReceiveAction  = mapIdToUser[data[i+1].assignee].displayName
							newData.push(obj)
						}else if(data[i+1].deleted){
							let obj = self.createHistoryTask(data[i],data[i+1],"assign","complete",'owner')
							let arr = data[i].assignee.split(":")
							obj.userCreateAction  = mapIdToUser[arr[0]].displayName
							newData.push(obj)
						}else if(data[i].assignee != data[i+1].assignne){
							let obj = self.createHistoryTask(data[i],data[i+1],"assign","assign",'owner')
							let arr = data[i].assignee.split(":")
							obj.userCreateAction  = mapIdToUser[arr[0]].displayName
							obj.userReceiveAction  = mapIdToUser[data[i+1].assignee].displayName
						}else if(!data[i+1].assignee && !data[i+1].owner){
							let obj = self.createHistoryTask(data[i],data[i+1],"assign","unAssign",'owner')
							let arr = data[i].assignee.split(":")
							obj.userCreateAction  = mapIdToUser[arr[0]].displayName
						}
					}
					else if(!data[i].deleted && data[i+1].deleted){
						let obj = self.createHistoryTask(data[i],data[i+1],"assign","delegate",'owner')
						let arr = data[i].assignee.split(":")
						obj.userCreateAction  = mapIdToUser[arr[0]].displayName
						obj.userReceiveAction  = mapIdToUser[data[i+1].assignee].displayName
						newData.push(obj)
					}else if(!data[i].owner && ! data[i].assignee && data[i+1].assignee && data[i+1].owner){
						let obj = self.createHistoryTask(data[i],data[i+1],"unAssign","assign",'assigne')
						let arr = data[i].assignee.split(":")
						obj.userCreateAction  = mapIdToUser[arr[0]].displayName
						obj.userReceiveAction  = mapIdToUser[data[i+1].assignee].displayName
					}
				}
			}
			return newData
		}
	},
	data(){
		return{
			taskStatus:{
				delegate:{
					color: "primary",
					title: "Ủy quyền"
				},
				unAssign:{
					color: "red",
					title: "Chưa được giao"
				},
				assign:{
					color: "orange",
					title: "Đã giao"
				},
				complete:{
					color: "success",
					title: "Đã hoàn thành"
				},
				new:{
					color: "primary",
					title: "Mới"
				},
			}
		}
	},
	methods:{
		reduce(startStatus, endStatus){
			if(startStatus == 'delegate' && endStatus == "assign"){
				return "Trả lại công việc cho"
			}
			if(startStatus == 'assign' && endStatus == "delegate"){
				return "Thực hiện giao việc cho"
			}
			if(startStatus == 'assign' && endStatus == "assign"){
				return "Giao lại công việc cho"
			}
			if(startStatus == 'assign' && endStatus == "unAssign"){
				return "Hủy nhận công việc"
			}
			if(startStatus == 'unAssign' && endStatus == "assign"){
				return "Nhận công việc"
			}
			if(endStatus == "complete"){
				return "Hoàn thành công việc"
			}
		},
		createHistoryTask(x,y,startStatus,endStatus,userCreateActionType){
			let self = this
			let obj = {}
			obj.startStatus = startStatus
			obj.endStatus = endStatus
			obj.date = self.$moment(y.createTime).format('YYYY-MM-DD')
			obj.userCreateActionType  = userCreateActionType

			return obj
		}
	}
}
</script>

<style>

</style>