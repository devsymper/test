<template>
		<div>
				<UploadFile :autoUpload="true" @selected-file="selectedFile" :fileName="'adn100198'" :objectType="'document'" :objectIdentifier="'1dasdadasd'"/>
				<!-- :pickAvatar="true"  -->
				<img :src="src" alt="">
		</div>	
</template>

<script>
import comment from "@/components/common/comment/Comment.vue"
import UploadFile from "@/components/common/UploadFile.vue"

export default {
	components:{
		comment,
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