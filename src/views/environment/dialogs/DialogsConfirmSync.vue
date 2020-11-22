<template>
	<div class="dialog-deploy">
		<v-dialog
			v-model="showDialog"
			persistent
			max-width="400"
		>
			<v-card>
			<v-card-title class="fs-15">
				Đồng bộ dữ liệu về domain hiện tại
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
						v-model="selected"
						label="Ghi đè dữ liệu nếu có trùng lặp"
						value="overideConfligData"
						class="fs-13"
					></v-checkbox>
					<v-checkbox
						v-model="selected"
						class="fs-13"
						label="CHỉ đồng bộ dữ liệu không bị trùng lặp"
						value="onlySyncDataNotConflig"
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
		}
	},
	data(){
		return{
			selected:"",
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