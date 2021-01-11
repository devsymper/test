<template>
	<div class="dialog-assign">
		<v-dialog
			v-model="showDialog"
			persistent
			max-width="400"
		>
			<v-card>
			<v-card-title class="fs-15">
				Hoàn thành công việc
			</v-card-title>
			<v-card-text>
				<div class="content-assign-dialog d-flex flex-column ml-2 fs-13">
					
					<div class="text-wrap">
						Nhấn áp dụng để hoàn thành công việc này 
					</div>
					<div class="text-wrap   d-flex align-center">
						Trạng thái hiện tại
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
					<div class="text-wrap   d-flex align-center">
						Trạng thái mới
						<v-chip
							small
							label
							class="ma-2"
							color="success"
							text-color="white"
						>
							<span class="fs-13">
								Hoàn thành
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
					@click="completeTask"
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
import { getVarsFromSubmitedDoc } from '@/components/process/processAction';
import {documentApi} from "@/api/Document.js";
export default {
	props:{
		showDialog:{
			type: Boolean,
			default: false,
		},
		taskId:{
			type: String,
			default: ""
		},
		taskInfo:{
			type: Object,
			default(){
				return {}
			}
		},
		varsForBackend:{
			type: Object,
			default(){
				return {}
			}
		}
		
	},
	data(){
		return{
			
		}
	},
	created(){
	},
	
	methods:{
		cancel(){
			this.$emit('cancel')
		},
		async completeTask(){
			let elId = this.taskInfo.action.parameter.activityId;
			let docId = this.taskInfo.action.parameter.documentId;

			let dataDoc
			let varsForBackend 
			let flag = true
			if(Object.keys(this.varsForBackend).length > 0){
				varsForBackend = this.varsForBackend
			}else{
				let docObjId = this.taskInfo.action.parameter.documentObjectId;

				let res = await documentApi.detailDocumentObject(docObjId)
				if(res.status == 200){
					dataDoc = res.data
				}else{
					this.$snotify(
						{
							type: 'error',
							title: "Bạn phải submit doc trước khi hoàn thành"
						}
					)
					flag = false
				}
				varsForBackend = await getVarsFromSubmitedDoc(dataDoc, elId, docId);

			}
			if(flag){
				if(varsForBackend){
					let data = {
						action: 'complete',
						outcome: 'submit',
						variables: varsForBackend.vars
					}
					workFlowApi.changeTaskAction(this.taskId, data).then(res=>{

					}).catch(err=>{

					})
					this.$snotify({
						type: "success",
						title: "Hoàn thành công việc thành công"
					})
					this.$emit('success')
				}else{
					this.$snotifyError("Không thể lấy variable")
				}
			}else{
				this.$emit('cancel')
			}
		
		
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