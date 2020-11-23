<template>
	<div class="dialog-deploy">
		<v-dialog
			v-model="showDialog"
			persistent
			max-width="400"
		>
			<v-card>
			<v-card-title class="fs-15">
				Đồng bộ dữ liệu 
			</v-card-title>
			<v-card-text>
				<div class="content-deploy-dialog d-flex flex-column ml-2 fs-13">
					<div class="fs-13 mb-2 mt-2 ">
						Đồng bộ dữ liện qua domain
					</div>
					<v-autocomplete
						v-model="envId"
						:items="allEnv"
						item-text="frontendDomain"
						item-value="id"
						solo-inverted
						class="fs-13"
					></v-autocomplete>
					<div class="mt-1">
						Các dữ liệu liên quan sẽ được đồng bộ cùng dữ liệu chính 
					</div>

					<div class="text-wrap">
						Nhấn OK để  đồng bộ dữ liệu 
					</div>
					<v-checkbox
						v-model="override"
						label="Ghi đè dữ liệu nếu có trùng lặp"
						value="1"
						class="fs-13"
					></v-checkbox>
					<v-checkbox
						v-model="override"
						class="fs-13"
						label="CHỉ đồng bộ dữ liệu không bị trùng lặp"
						value="0"
					></v-checkbox>
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
					@click="syncData"
				>
					Đồng bộ
				</v-btn>
			</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import {environmentManagementApi} from '@/api/EnvironmentManagement'
export default {
	props:{
		showDialog:{
			type: Boolean,
			default: false,
		},
		listItemSelected:{
			type: Object,
			default(){
				return {
					
				}
			}
		},
		currentObjectType:{
			type: String
		},
	},
	data(){
		return{
			override:null,
			envId:""
		}
	},
	created(){
		this.$store.dispatch('environmentManagement/getAllEnvirontment')
	},
	computed:{
		allEnv(){
			return this.$store.state.environmentManagement.allEnvironment
		}
	},
	methods:{
		cancel(){
			this.$emit('cancel')
		},
		syncData(){
			let self = this
			let sourceInstanceId = this.$store.state.environmentManagement.sourceInstanceId
			let currentServiceId = this.$store.state.environmentManagement.currentServiceId
			let currentEnvId = this.envId
			environmentManagementApi.getServerId({
				serviceId: currentServiceId,
				environmentId: currentEnvId
			}).then(res=>{
				if(res.data[0]){
					let targetInstanceId = res.data[0].id
					let type = self.currentObjectType
					for(let i in self.listItemSelected){
						let ids = []
						if(self.listItemSelected[i].title == "document_definition"){
							ids = {
								ids: self.listItemSelected[i].arr
							}
						}else{
							let arr = []
							arr.push( self.listItemSelected[i].arr)
							ids = {
								ids: arr
							}
						}
						let data = {
							[self.listItemSelected[i].title]:ids
						}
						environmentManagementApi.migrateData({
							sourceInstanceId:sourceInstanceId,
							targetInstanceId:targetInstanceId,
							data: JSON.stringify(data),
							override: self.override
						}).then(res=>{
							debugger
							if(res.status == 200){
								self.$emit('cancel')
								self.$snotify({
									type: "success",
									title: "Đang chuyển dữ liệu "+self.listItemSelected[i].title
								})
							}else if( res.status == 400){
								self.$snotify({
									type: "error",
									title: "Nguồn và target không được trùng nhau"
								})
							}
						}).catch(err=>{
							self.$snotify({
								type: "error",
								title: "Có lỗi xảy ra"
							})
						})	
					}
				}
			}).catch(err=>{})
			
		}
	},
}
</script>

<style scoped>
.content-deploy-dialog >>>  .v-text-field__details{
	display: none !important;
}
.content-deploy-dialog >>> .v-input__slot{
	box-shadow: unset !important;
	min-height: unset !important;
}
.content-deploy-dialog >>> input{
	font-size: 13px !important;
}
.content-deploy-dialog >>> .v-menu{
	font-size: 13px !important;
}
.content-deploy-dialog >>> label{
	font-size: 13px !important;
}
.content-deploy-dialog >>> .v-messages{
	display:none !important;
}
.content-deploy-dialog >>> .v-input__control{
	margin-bottom:-12px !important;
}
</style>