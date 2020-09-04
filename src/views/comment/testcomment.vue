<template>
		<div>
				<UploadFile :autoUpload="true" :pickAvatar="true" @selected-file="selectedFile" :fileName="'adn100198'"/>
				<img :src="src" alt="">
		</div>	
</template>

<script>
import comment from "@/components/common/comment/Comment.vue"
import UploadAvatar from "@/components/common/UploadAvatar.vue"
import UploadFile from "@/components/common/UploadFile.vue"

export default {
	components:{
		comment,
		UploadAvatar,
		UploadFile
	},
	methods:{
		selectedFile(data){
			this.src = data
		}
	
	},
	 data: function() {
        return {
            isShowDialog: false,
			isShowDialogNotification: false,
			showComment: false,
			heightComment: '',
			top: null,
			left:null,
			idItem:null,
			uuidArea:'0',
			contentTargetArea:'',
			objType:'',
			src: '',
			commentTarget:{}
        };
    }
}
</script>

<style>

</style>