<template>
		<div>
			<div class="mt-1 highlighter-context mce-content-body mce-content-readonly" id="myeditablediv" spellcheck="false" contenteditable="false"><p>Mô tả : Tài liệu hướng dẫn cách đặt tên cho các component và các chức năng của core version 2</p><p>Thư mục chứa các document : <span style="color: rgb(230, 126, 35);" data-mce-style="color: #e67e23;">Version-SDD</span> (system design document)</p><p>Mỗi thư mụ <span data-v-b388fd9a="" data-timestamp="1600073186024" data-highlighted="true" uuid="7f4db98e-9771-47e5-8662-ccfd255c10bd" class="highlighted-text-t" style="background-color: rgba(255, 212, 0, 0.14); border-bottom: 2px solid rgb(246, 142, 53);">ocume</span>c <span class="highlighted-text">adn1001</span> sẽ chứa các document là <span data-v-b388fd9a="" data-timestamp="1600073186024" data-highlighted="true" uuid="7f4db98e-9771-47e5-8662-ccfd255c10bd" class="highlighted-text-te" style="background-color: rgba(255, 212, 0, 0.14); border-bottom: 2px solid rgb(246, 142, 53);">ocume</span> các component của hệ thống (tương ứng các zone trong phase 1)</p>
			<p>* Quy ước đặt tên cho các chức năng như sau:</p><p><span style="color: rgb(230, 126, 35);" data-mce-style="color: #e67e23;">Version-FDD-zone-task</span></p><ul><li>Version: V2</li><li>FDD: kí hiệu functional design document</li><li>zone: tên zone trong phase 1</li><li>task: task đang thực hiện trong phase 1<br></li></ul><p>-Tất các các child task thực cần được note lại trong d<span class="highlighted-text" data-timestamp="1600073186024" style="background-color: rgba(255, 212, 0, Mỗi thư mụ ocumec adn1001 sẽ chứa các document là các component của hệ thống (tương ứng các zone trong phase 1)
0.14); border-bottom: 2px solid rgb(246, 142, 53);" data-highlighted="true" uuid="7f4db98e-9771-47e5-8662-ccfd255c10bd">ocume</span>nt của task tương ứng<br>&nbsp; &nbsp;+ Mỗi child task tương ứng là heading 1<br>&nbsp; &nbsp;+ Quy ước đặt tên:<br>&nbsp; &nbsp; &nbsp;<span style="color: rgb(230, 126, 35);" data-mce-style="color: #e67e23;">ID_task-Tên task</span><br>&nbsp; &nb$('.hihighlighlighted-text-t').click(function(e){
			console.log("saasdsad",e);
			self.showComment = !self.showComment
			self.uuid = '12312ddjjdjqwjeqeqwdddddddddddddddddddheh123'
			self.contentTargetArea = '<span>asdasdasdad test</span>'

			self.top = e.clientY-440
			self.left= e.clientX-550
		})sp; &nbsp;vd: F.1.1-Design uml</p></div>
				<comment :showComment="showComment" :top="top" :left="left" :heightComment="heightComment" :widthComment="'600px'" :objectIdentifier="'djasdjajdsj12312u31u2d12e'" :objectType="'documentssss'" :uuid="uuid" :contentTargetArea="contentTargetArea" />
				<UploadFile :objectIentifier="'ádasdadadasdasd12131'" :objectType="'document'"  @selected-file="selected" /> 
				<v-img :src="srcImg">
					
				</v-img>
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
			showComment:  false,
			heightComment: '',
			top: null,
			left:null,
			idItem:null,
			srcImg: '',
			uuidArea:'0',
			contentTargetArea:'',
			objType:'',
			uuid: null,
			src: '',
			showComment: false,
			commentTarget:{},
			top:null,
			left:null,
			span: '<span style="color:red">tesst spannnn</span>',
			img: '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Russian_Air_Force_Mikoyan-Gurevich_MiG-29S_Naumenko-1.jpg/1200px-Russian_Air_Force_Mikoyan-Gurevich_MiG-29S_Naumenko-1.jpg" alt="Girl in a jacket" width="100" height="100">'
        };
	},
	methods:{
		showCommentUuid(uuid,height,width,contentTargetArea){
			this.uuid = uuid
			this.showComment = !this.showComment
			this.heightComment = height
			this.widthComemnt = width
			this.contentTargetArea = contentTargetArea
		},
		selected(data){
			this.srcImg = data
		}
	},
	mounted(){
		let self = this
		$('.highlighted-text').click(function(e){
			self.showComment = !self.showComment
			self.uuid = '12312ddjjdjqwjeqeqwheh123'
			self.top = e.clientY-480
			self.contentTargetArea = self.img
			self.left= e.clientX
		})	
		$('.highlighted-text-t').click(function(e){
			console.log("saasdsad",e);
			self.showComment = !self.showComment
			self.uuid = '12312ddjjdjqwjeqeqwdddddddddddddddddddheh123'
			self.contentTargetArea = '<span>asdasdasdad adhsadhsahdashdahdahdtest</span>'

			self.top = e.clientY-480
			self.left= e.clientX
		})
		$('.highlighted-text-te').click(function(e){
			console.log("saasdsad",e);
			self.showComment = !self.showComment
			self.uuid = '12312ddjjdjqwjeqeqwdddddddddddddddddddheh1sdsdsdsdsd23'
			self.contentTargetArea = '<span>asdasdasdad test</span>'

			self.top = e.clientY-480
			self.left= e.clientX
		})
	}
}
</script>

<style scoped>
.v-card__title{
	font:15px roboto
}

</style>