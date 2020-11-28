<template>
  <div>
	<h4 class="mb-4">
		Tạo mới service
	</h4>
	<FormTpl
		:labelWidth="'60px'"
		:allInputs="allInputs"
		:single-line="true"
	/>
	 <v-btn
            small
            color="primary"
			style="margin-bottom:24px"
            class="btn-fixed-bottom update-btn"
            @click="addService"
        >
            <v-icon class="mr-2">mdi-content-save-outline</v-icon>
            {{$t('common.add') }}
        </v-btn>
  </div>
</template>

<script>
import FormTpl from "@/components/common/FormTpl";
import {environmentManagementApi} from '@/api/EnvironmentManagement'
export default {
	components:{
		FormTpl
	},
	data(){
		return {
			allInputs:{
				name: {
                    title: "Tên service",
                    type: "text",
                    value: "",
                    info: ""
                },
				identifier: {
                    title: "Identifier",
                    type: "text",
                    value: "",
                    info: ""
                },
				description: {
                    title: "Mô tả",
                    type: "text",
                    value: "",
                    info: ""
                },
				lastVersion: {
                    title: "Version ",
                    type: "text",
                    value: "",
                    info: ""
                },
				useSql: {
                    title: "Use sql",
                    type: "text",
                    value: "",
                    info: ""
                },
               
				language: {
                    title: "Ngôn ngữ",
                    type: "text",
                    value: "",
                    info: ""
                },
				webServer: {
                    title: "Web Server",
                    type: "text",
                    value: "",
                    info: ""
                },
				status: {
                    title: "Trạng thái",
                    type: "text",
                    value: "",
                    info: ""
                },
				pingUrl: {
                    title: "Ping Url",
                    type: "text",
                    value: "",
                    info: ""
                },
				git: {
                    title: "Link git",
                    type: "text",
                    value: "",
                    info: ""
                },
               
			}
		}
	},
	methods:{
		
		addService(){
			let self = this
			let formData = {
			}
			for(let i in this.allInputs){
				formData[i] = this.allInputs[i].value
			}
			environmentManagementApi.addService(formData).then(res=>{
				if(res.status == 200){
					self.$emit('add-success')
					self.$snotify({
						type: "success",
						title: " Thêm service thành công"
					})
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
	}
}
</script>

<style>

</style>