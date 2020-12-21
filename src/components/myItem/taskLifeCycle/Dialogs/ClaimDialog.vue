<template>
	<div class="dialog-assign">
		<v-dialog
			v-model="showDialog"
			persistent
			max-width="400"
		>
			<v-card>
			<v-card-title class="fs-15">
				Nhận công việc
			</v-card-title>
			<v-card-text>
				<div class="content-assign-dialog d-flex flex-column ml-2 fs-13">
					<div class="text-wrap">
						Khi nhận công việc bạn sẽ có quyền sở hữu trường hợp này 
					</div>
					<div class="text-wrap   d-flex align-center">
						Trạng thái hiện tại
						<v-chip
							small
							label
							class="ma-2"
							color="#ED6A5E"
							text-color="white"
						>
							<span class="fs-13">
								Chưa được giao 
							</span>
						</v-chip>
					</div>
					<div class="text-wrap   d-flex align-center">
						Trạng thái mới
						<v-chip
							small
							label
							class="ma-2"
							color="orange"
							text-color="white"
						>
							<span class="fs-13">
								Đã giao
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
					@click="claimTask"
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
		taskId: {
			type : String,
			default: ""
		}
	},
	data(){
		return{
			selected:"",
			verId:""
		}
	},
	created(){
	},
	
	methods:{
		cancel(){
			this.$emit('cancel')
		},
		claimTask(){
			let userId = this.$store.state.app.endUserInfo.id
			let data = {
				owner: userId,
				assignee: userId
			}
			let self = this
			workFlowApi.updateTask(this.taskId, data).then(res=>{
				self.$snotify({
					type: "success",
					title: "Nhận công việc thành công"
				})
				self.$emit('success')
			}).catch(err=>{

			})
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
}
.content-assign-dialog >>> input{
	font-size: 13px !important;
}
.content-assign-dialog >>> .v-menu{
	font-size: 13px !important;
}
</style>