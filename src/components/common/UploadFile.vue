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
		}
	},
	data() {
	   return {
			isSelecting: false,
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
			if(this.fileName != ''){
				formData.append('fileName',this.fileName)
			}
			let thisCpn = this
			fileManagementApi.uploadFileSymper(formData,
			{
				dataType: 'text',
				contentType: false,
				processData: false,
			}).then(res => {
               if(res.status == 200){
					thisCpn.$emit('uploaded-file',res.data)
				}
				else{
					thisCpn.$emit('upload-error',res.message)
				}
            });
		}
	}
}
</script>

<style>

</style>