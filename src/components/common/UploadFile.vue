<template>
	<div>
		<v-btn icon
			:loading="isSelecting"
			@click="onButtonClick"
				> 
			<v-icon>mdi-upload</v-icon>
			<input
				ref="uploader"
				class="d-none"
				type="file"
				@change="onFileChanged"
			>
		</v-btn>
	</div>
</template>

<script>
import {fileManagementApi} from '@/api/FileManagement.js'
export default {
	props:{
		fileName:{
			type:String,
			default: ''
		},
		autoUpload:{
			type: Boolean,
			default: true
        }
	},
	data() {
	   return {
                isSelecting: false,
                formDatas:{
			}
		}
	},
	methods:{
		onButtonClick() {
			this.isSelecting = true
			window.addEventListener('focus', () => {
				this.isSelecting = false
			}, { once: true })
			this.$refs.uploader.click()
		},
		onFileChanged(e) {
			this.selectedFile = e.target.files[0]
			let formData = new FormData()
			formData.append('file',this.selectedFile)
			formData.append('user',this.$store.state.app.endUserInfo.displayName)
            this.formDatas = formData;
            this.$emit('selected-file', window.URL.createObjectURL(e.target.files[0]))
			if(this.autoUpload == true){
				this.uploadFile()
			}
		},
		uploadFile(){
            if(this.fileName != ''){
				this.formDatas.append('fileName',this.fileName)
            }
            debugger
			fileManagementApi.uploadFileSymper(this.formDatas,
			{
				dataType: 'text',
				contentType: false,
				processData: false,
			}).then(res => {
			if(res.status == 200){
					this.$emit('uploaded-file',res.data)
				}
				else{
					this.$emit('upload-error',res.message)
				}
			});
		}
	},
}
</script>

<style>

</style>
