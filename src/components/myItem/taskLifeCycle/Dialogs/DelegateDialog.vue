<template>
	<div class="dialog-assign">
		<v-dialog
			v-model="showDialog"
			persistent
			max-width="400"
		>
			<v-card>
			<v-card-title class="fs-15">
				Ủy quyền công việc
			</v-card-title>
			<v-card-text>
				<div class="content-assign-dialog d-flex flex-column ml-2 fs-13">
					<div class="text-wrap">
						Công việc sẽ được giao cho người khác thực hiện nhưng không có quyền hoàn thành
					</div>
					<div class="text-wrap d-flex align-center">
						Trạng thái hiện tại 
						<v-chip
							small
							label
							class="ma-2"
							:color="taskStatus.color"
							text-color="white"
						>
							<span class="fs-13">
								{{taskStatus.title}}
							</span>
						</v-chip>
					</div>
					<div class="text-wrap font-weight-light">
						Công việc đã được giao cho {{ $store.state.app.endUserInfo.displayName}}
					</div>
					<div class="text-wrap d-flex align-center mt-2">
						<div class="mb-4 mr-2">
							Người được ủy quyền
						</div>
						<div>
							<v-autocomplete
								solo
								v-model="userInforId"
								:items="$store.state.app.allUsers"
								item-text="displayName"
								item-value="id"
							></v-autocomplete>
						</div>
					</div>
					<div class="text-wrap font-weight-light">
						Người được giao có quyền xem và thực thi công việc 
					</div>
					<div class="text-wrap   d-flex align-center">
						Công việc sẽ được chuyển trạng thái 
						<v-chip
							small
							label
							class="ma-2"
							color="#8E2D8C"
							text-color="white"
						>
							<span class="fs-13">
								Ủy quyền
							</span>
						</v-chip>
					</div>

				</div>

			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					color="red darken-1"
					text
					@click="cancel"
				>
					Hủy
				</v-btn>
					<v-btn
					color="green darken-1"
					text
					@click="delegateTask"
				>
					Áp dụng
				</v-btn>
			</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import workFlowApi  from "@/api/BPMNEngine.js";
 
export default {
	props:{
		showDialog:{
			type: Boolean,
			default: false,
		},
		taskStatus:{
			type: Object,
			default(){
				return {

				}
			}
		},
		taskId:{
			type: String,
			default: ""
		}
	},
	data(){
		return{
			userInforId: ""
		}
	},
	watch:{
		showDialog(val){
			this.userInforId  = ""
		}
	},
	
	methods:{
		cancel(){
			this.$emit('cancel')
		},
		delegateTask(){
			let data = {
				action: "delegate",
				assignee: this.userInforId
			}
			workFlowApi.changeTaskAction(this.taskId , data).then(res=>{
			}).catch(err=>{
			})
			this.$snotify({
				type: "success",
				title: "Ủy quyền thành công "
			})
			this.$emit('cancel')
		}
		
	},
}
</script>

<style scoped>
.content-assign-dialog >>>  .v-text-field__details{
	display: none !important;
}
.content-assign-dialog >>> .v-input__slot{
	box-shadow: unset !important;
	min-height: unset !important;
	border: 1px solid lightgray;
}
.content-assign-dialog >>> input{
	font-size: 13px !important;
}
.content-assign-dialog >>> .v-menu{
	font-size: 13px !important;
}

</style>
<style >
 .v-list-item__title{
	font-size: 13px !important;
}
</style>