<template>
	<v-dialog
		v-model="showDialog"
		persistent
		max-width="290"
	>
		<v-card>
		<v-card-title class="fs-15 ">
			Thêm version
		</v-card-title>
		<v-card-text>
			<FormTpl
				:labelWidth="'60px'"
				:allInputs="allInputs"
				:single-line="true"
			/>
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
				@click="addVersion"
			>
				Thêm
			</v-btn>
		</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import FormTpl from "@/components/common/FormTpl";
import {environmentManagementApi} from '@/api/EnvironmentManagement'
export default {
	components:{
		FormTpl
	},
	props:{
		showDialog:{
			type: Boolean,
			default: false
		}
	},
	methods:{
		cancel(){
			this.$emit('cancel')
		},
		addVersion(){
			let self = this
			let serviceId = this.$store.state.environmentManagement.currentServiceId
			let formData = {
			}
			for(let i in this.allInputs){
				formData[i] = this.allInputs[i].value
			}
			environmentManagementApi.addVersion({
				serviceId:serviceId,
				formData:formData
			}).then(res=>{
				debugger
				if(res.status == 200){
					self.$snotify({
						type: "success",
						title: " Thêm version thành công"
					})
					self.$emit('cancel')
				}else{
					self.$snotify({
						type: "error",
						title: " Có lỗi xảy ra"
					})
				}
			}).catch(err=>{
					self.$snotify({
						type: "error",
						title: " Có lỗi xảy ra"
					})
			})
		}
	},
	data(){
		return{
			allInputs:{
				versionName: {
                    title: "Version",
                    type: "text",
                    value: "",
                    info: ""
                },
				status: {
                    title: "Status",
                    type: "text",
                    value: "",
                    info: ""
				},
				releaseAt: {
                    title: "Release at",
                    type: "text",
                    value: "",
                    info: ""
				},
				git:{
                    title: "Git",
                    type: "text",
                    value: "",
                    info: ""
				},
			}
		}
	}
}
</script>

<style>

</style>