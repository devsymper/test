<template>
	<div class="dialog-deploy">
		<v-dialog
			v-model="showDialog"
			persistent
			max-width="400"
		>
			<v-card>
			<v-card-title class="fs-15">
				Upgrade version
			</v-card-title>
			<v-card-text>
				<div class="content-deploy-dialog d-flex flex-column ml-2 fs-13">
					<div class="fs-13 mb-2 mt-2 ">
						Chọn version mà bạn muốn upgrade
					</div>
					<v-autocomplete
						v-model="verId"
						:items="allVer"
						item-text="versionName"
						item-value="id"
						solo-inverted
						class="fs-13"
					></v-autocomplete>
					<div class="text-wrap">
						Nhấn Đòng ý để upgrade version này
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
					@click="deloyVersion"
				>
					Upgrade
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
		currentInstance:{
			type: Object,
			default(){
				return {

				}
			},
		}
	},
	data(){
		return{
			selected:"",
			verId:""
		}
	},
	created(){
		this.$store.dispatch('environmentManagement/getAllEnvirontment')
	},
	computed:{
		allVer(){
			let envStore = this.$store.state.environmentManagement
			return envStore.allVersionOfService[envStore.currentServiceType]
		}
	},
	methods:{
		cancel(){
			this.$emit('cancel')
		},
		deloyVersion(){
			let self = this
			let formData = {
				serverId: this.currentInstance.serverId,
				versionId: this.verId,
				environmentId: this.currentInstance.environmentId
			}
			environmentManagementApi.deloy(formData).then(res=>{
				if(res.status == 200){
					self.$emit('cancel')
					self.$snotify({
						type: 'success',
						title: "Thành công . Đang deploy.... "
					})
				}else{
					self.$snotify({
						type: 'error',
						title: "Có lỗi xảy ra"
					})
				}
			}).catch(
			)
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
</style>