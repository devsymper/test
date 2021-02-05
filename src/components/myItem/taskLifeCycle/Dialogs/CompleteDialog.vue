<template>
	<div class="dialog-assign">
		<v-dialog
			v-model="showDialog"
			persistent
			max-width="400"
		>
			<v-card>
			<v-card-title class="fs-15">
				{{$t("myItem.taskLifeCycle.dialog.complete.header")}}
			</v-card-title>
			<v-card-text>
				<div class="content-assign-dialog d-flex flex-column ml-2 fs-13">
					
					<div class="text-wrap">
						{{$t("myItem.taskLifeCycle.dialog.complete.description")}}
					</div>
					<div class="text-wrap   d-flex align-center">
						{{$t("myItem.taskLifeCycle.currentStatus")}}
						<v-chip
							small
							label
							class="ma-2"
							color="orange"
							text-color="white"
						>
							<span class="fs-13">
								{{$t("tasks.assign")}}
							</span>
						</v-chip>
					</div>
					<div class="text-wrap   d-flex align-center">
						{{$t("myItem.taskLifeCycle.newStatus")}}
						<v-chip
							small
							label
							class="ma-2"
							color="success"
							text-color="white"
						>
							<span class="fs-13">
								{{$t("tasks.complete")}}
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
					{{$t("myItem.taskLifeCycle.cancel")}}
				</v-btn>
					<v-btn
					color="green darken-1"
					text
					:loading="loading"
					@click="completeTask"
				>
					{{$t("myItem.taskLifeCycle.corfirm")}}
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
			loading:false,
		}
	},
	created(){
	},
	
	methods:{
		cancel(){
			this.$emit('cancel')
		},
		async completeTask(){
			let self = this;
			this.loading = true;
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
					dataDoc = res.data;
					docId = res.data.documentId;
				}else{
					this.$snotify(
						{
							type: 'error',
							title: this.$t("myItem.taskLifeCycle.notify.notSubmit") 
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
					let res = await self.postTask(data);
				}else{
					this.$snotifyError("Không thể lấy variable")
				}
			}else{
				this.$emit('cancel')
			}
			this.loading = false;
		},
		async postTask(taskData) {
			let self = this;
			return new Promise(async (resolve, reject) => {
				try {
					let result = await workFlowApi.actionOnTask(self.taskId, taskData);
					self.$snotify({
						type: "success",
						title: self.$t("myItem.taskLifeCycle.notify.complete")
					})
					self.$emit('success')
					resolve(result);
				} catch (error) {
					let detail = '';
					if (error.responseText) {
						detail = JSON.parse(error.responseText);
						detail = detail.exception;
					}
					self.$snotifyError(error, 'Can not submit task!', detail);
					reject(error);
				}
			});
		},
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