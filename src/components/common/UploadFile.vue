<template>
	<div class="symper-upload-file">
		<v-btn icon
			:loading="isSelecting"
			@click="onButtonClick"
				> 
			<v-icon>mdi-attachment</v-icon>
			<input
				ref="uploader"
				class="d-none"
				type="file"
				@change="onFileChanged"
				:multiple="uploadMultyFile"
			>
		</v-btn>
		 <v-dialog
			v-model="dialog"
			width="500"
     	 >
			<v-card>
			<v-card-title >
				Chọn avatar
			</v-card-title>
			 <clipper-basic v-if="spliting" class="my-clipper" ref="clipper" :ratio="1/1" :src="previewImg" >
				<div class="placeholder" slot="placeholder">No image</div>
			</clipper-basic>
			<img  v-else class="result" :src="previewImg" alt="" style="width:450px;height:450px;margin-left:25px;margin-right:auto">
			<v-divider></v-divider>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
				color="primary"
				text
				@click="splitImg"
				>
				Cắt
				</v-btn>
				<v-btn
				color="success"
				text
				@click="selectImg"
				>
				Chọn
				</v-btn>
				<v-btn
				color="danger"
				text
				@click="dialog = false"
				>
				Hủy
				</v-btn>
			</v-card-actions>
			</v-card>
      </v-dialog>
	</div>
</template>

<script>
import {fileManagementApi} from '@/api/FileManagement.js'
import { clipperBasic } from 'vuejs-clipper'

let formData = new FormData()
export default {
	components:{
		clipperBasic
	},
	props:{
		fileName:{
			type:String,
			default: ''
		},
		autoUpload:{
			type: Boolean,
			default: true
		},
		pickAvatar:{
			type: Boolean,
			default: false
		},
		objectType:{
			type:String,
			default: ''
		},
		objectIdentifier:{
			type:String,
			default: ''
		},
		objectContext:{
			type: String,
			default: ''
		},
		uploadMultyFile:{
			type: Boolean,
			default: false
		}
	},
	data() {
	   return {
			isSelecting: false,
			dialog: false,
			previewImg: '',
			spliting: true,
			formDatas:{}
		}
	},
	mounted(){
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
			if(this.uploadMultyFile == true){
				let self = this
				e.target.files.forEach(function(k){
					self.formDatas = {}
					let form = new FormData()
					form.append('user',self.$store.state.app.endUserInfo.displayName)
					form.append('objectType',self.objectType)
					form.append('objectIdentifier',self.objectIdentifier)
					form.append('file',k)
					self.formDatas = form;
					self.uploadFile()
				})
			}else{
				this.selectedFile = e.target.files[0]
				formData.append('user',this.$store.state.app.endUserInfo.displayName)
				formData.append('objectType',this.objectType)
				formData.append('objectIdentifier',this.objectIdentifier)
				if(this.pickAvatar == true){
					if(this.selectedFile.type == 'image/jpeg' || this.selectedFile.type == 'image/jpg' || this.selectedFile.type == 'image/png'){
						this.dialog = true
						this.previewImg = window.URL.createObjectURL(e.target.files[0])
					}
				}else{
					formData.append('file',this.selectedFile)
					this.formDatas = formData;
					this.$emit('selected-file', window.URL.createObjectURL(e.target.files[0]))
					if(this.autoUpload == true){
						this.uploadFile()
					}
				}
			}
			
		},
		splitImg() {
			const canvas = this.$refs.clipper.clip();
			this.previewImg = canvas.toDataURL("image/jpeg", 1);
			this.spliting = false
		},
		selectImg(){
			this.spliting = true
			this.dialog = false
			let file = this.dataURItoBlob(this.previewImg)
			formData.append('file',file)
			this.formDatas = formData
			this.$emit('selected-file', this.previewImg)
			if(this.autoUpload == true){
				this.uploadFile()
			}
		},
		dataURItoBlob(dataURI){
			var byteString = atob(dataURI.split(',')[1]);
			var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
			var ab = new ArrayBuffer(byteString.length);
			var ia = new Uint8Array(ab);
			for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}
			return new Blob([ab], {type: mimeString});
		},
		uploadFile(){
            if(this.fileName != ''){
				this.formDatas.append('fileName',this.fileName)
            }
			fileManagementApi.uploadFileSymper(this.formDatas,
			{
				dataType: 'text',
				contentType: false,
				processData: false,
			}).then(res => {
				let resObj = JSON.parse(res);
				if(resObj.status == 200){
						this.$emit('uploaded-file',resObj.data)
					}
					else{
						this.$emit('upload-error',resObj.message)
					}
				});
		},
	},
}
</script>

<style>
.vuejs-clipper-basic__zoom-area {
	border-radius: 50%
}
</style>
