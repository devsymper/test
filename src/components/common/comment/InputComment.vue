<template>
	<div class="content-comment">
		<div v-if="images.length > 0" class="content-comment-img">
			<div  class="commnet-img-item" v-for="(item,i) in images" :key="i">
				<v-img
           			 :src="'http://file.symper.vn/readFile/'+item.serverPath"
         		>
				 <v-icon  v-if="isEditing == true" class="icon-remove-img"  @click="removeImage(item)">mdi-close-circle-outline</v-icon>
				</v-img> 
			</div>
		</div>	
		<div v-if="files.length > 0" class="content-comment-file">
			<div class="commnet-file-item" v-for="(item,i) in files" :key="i">
				<v-icon>{{icon[item.type]}}</v-icon>
				<span class="file-item-title">{{item.name+'.'+item.type}}</span>
				<v-icon class="icon-remove-file" v-if="isEditing == true" @click="removeFile(item)">mdi-close-circle-outline</v-icon>
			</div>	
		</div>
		<div class="content-comment-input">
			<span v-if="isEditing == false" >
				<span>{{item.content}}</span>
			</span>
			 <!-- <v-text-field
				v-else
				clear-icon="mdi-close-circle"
				v-model="inputComment"
				clearable
				type="text"
				v-on:keyup.50="tagUser($event)"
				>
					<template slot="append">
						<v-icon>mdi-attachment</v-icon>
						<v-icon @click="addComment">mdi-send-circle-outline</v-icon>
					</template>
			</v-text-field> -->
			<div class="text-area-wrapper" v-else>
				 <Mentionable
					:keys="['@']"
					:items="itemsTag"
					offset="6"
					>
					<textarea v-model="inputComment"  v-on:keyup.enter="addComment" class="text-area">
					</textarea>
				</Mentionable>
				<UploadFile style="position:absolute;right: 12px;bottom: 0px;" @uploaded-file="uploadInfo"/>
				<v-btn style="position:absolute;right: 0px;bottom: 0px;" icon @click="addComment">
					<v-icon >mdi-send-circle-outline</v-icon>
				</v-btn>
			</div>
		</div>
		<MenuTagUser ref="menuTagUser" @selected-item="tagged" :keyWord="keyWord" />
	</div>
</template>
<script>
import MenuTagUser from './MenuTagUser.vue'
import { Mentionable } from 'vue-mention'
import At from 'vue-at'
import UploadFile from '@/components/common/UploadFile.vue';
import {commentApi} from '@/api/Comment.js'
export default {
	props:{
		isEditing:{
			type: Boolean,
			default: false
		},
		item:{
			type: Object
		},
		images:{
			type: Array,
		},
		files:{
			type: Array,
		},
		isAdd:{
			type: Boolean,
			default: true
		},
		parentId:{
			type:Number,
		},
		isReply:{
			type: Boolean,
			default: false
		}
	},
	components:{
		MenuTagUser,
		Mentionable,
		UploadFile
	},
	created(){
	},
	methods:{
		removeFile(item){
			this.attachments.splice(this.attachments.indexOf(item.id),1)
			this.files.splice(this.files.indexOf(item),1)
		},
		removeImage(item){
			this.attachments.splice(this.attachments.indexOf(item.id),1)
			this.images.splice(this.images.indexOf(item),1)
		},
		tagUser(event){
			let $target = $(event.target);
			var x = $target.offset().left;
     		var y = $target.offset().top + 23;
			this.$refs.menuTagUser.show(x,y);
		},
		tagged(data){
			let character = this.inputComment.charAt(this.inputComment.length - 1)
			let res = this.inputComment.replace(character,data.name);
			this.inputComment = res
		},
		addComment(){
			this.dataPostComment = this.sComment
			this.dataPostComment.content = this.inputComment
			this.dataPostComment.attachments = this.attachments
			if(this.isAdd == true){
			let data = JSON.stringify(this.dataPostComment)
				commentApi.addComment(data).then(res => {
					this.$store.commit('comment/updateParentCommentTarget',0)
					this.updateComment()
					this.inputComment = ''
				});
			}
			else{
				this.dataPostComment.id = this.item.id
				let dataEdit = JSON.stringify(this.dataPostComment)
				commentApi.editComment(dataEdit).then(res => {
					this.$store.commit('comment/updateParentCommentTarget',0)
					this.updateComment()
				});
			}
			this.$store.commit('comment/updateReplyStatus',false)
		},
		editComment(){
		},
		uploadInfo(data){
			if(typeof data === 'string'){
				alert(data)
			}else{
				this.attachments.push(data.id)
				if(data.type == 'jpg' || data.type == 'png' || data.type == 'jpeg'){
					this.images.push(data)
				}else{
					this.files.push(data)
				}
			}
		},
		updateComment(){
			if(this.sComment.uuid == "0"){
				commentApi.getCommentById(this.sComment.objectType,this.sComment.objectIdentifier).then(res => {
					this.$store.commit('comment/updateListComment',res.data.listObject.comments)
					this.$store.commit('comment/updateListAvtiveComment',res.data.listObject.comments)
					this.$store.commit('comment/updateListResolve',res.data.listObject.resolve)
				});
			}else{
				commentApi.getCommentByUuid(this.sComment.objectType,this.sComment.objectIdentifier,this.sComment.uuid).then(res => {
					this.$store.commit('comment/updateListComment',res.data.listObject.comments)
					this.$store.commit('comment/updateListAvtiveComment',res.data.listObject.comments)
					this.$store.commit('comment/updateListResolve',res.data.listObject.resolve)
				});
			}
		}
	},
	computed:{
		sEnduser(){
			return this.$store.state.app
		},
		sComment(){
			return this.$store.state.comment.commentTarget
		}
	},
	data() {
		return {
			inputComment: '',
			keyWord: '',
			attachments:[],
			
			icon:{
				xlxs: 'mdi-file-excel-box',
				xls: 'mdi-file-excel-box',
				docx: 'mdi-file-word-box',
				doc: 'mdi-file-word-box',
				pdf: 'mdi-file-pdf-box',
				default: 'mdi-file'
			},
			itemsTag:[
				{
					value: 'cat',
					label: 'Mr Cat',
				},
				{
					value: 'dog',
					label: 'Mr Dog',
				},
			],
			dataPostComment:{
			}
		}
	},
	watch:{
		// inputComment(val){
		// 	if(val.includes('@')){
		// 		this.keyWord = val.slice(val.indexOf('@')+1)
		// 	}
		// }
	}
}	
</script>

<style scoped>
.content-comment{
	display:flex;
	flex-direction: column;
	width: 100%;
}
.content-comment >>> .v-icon{
	font-size:13px;	
}
.content-comment >>> .content-comment-img{
	display:flex;
}
.content-comment >>> .commnet-img-item{
	width: 30px;
	height: 30px;
	margin: 0px 4px 0px 0px;
}
.content-comment >>> .commnet-img-item .icon-remove-img{
	font-size: 13px;
	float: right;
	top:0px;
}
.content-comment >>> .content-comment-file{
	display: flex;
	flex-direction: column;
}
.content-comment >>> .content-comment-file .commnet-file-item{
	padding: 0px 0px 4px 0px;
	display: flex;
}
.content-comment >>> .content-comment-file .commnet-file-item .file-item-title{
	padding: 0px 0px 4px 4px;
	flex-grow: 1;
	cursor: pointer;
	
}
.content-comment >>> .content-comment-file .commnet-file-item .file-item-title:hover{
	color: blue;
	border-bottom: 1px solid blue;
}
.content-comment >>> .content-comment-file .commnet-file-item .icon-remove-file{
	float: right;
}
.content-comment >>>  .content-comment-input{
	padding: 0px 0px 4px 0px;
}
.content-comment >>> .content-comment-file .v-icon{
	font-size: 13px;
}
.content-comment >>> .text-area-wrapper{
	display: flex;
	position: relative;
	background-color: #f7f7f7;
}
.content-comment >>> .text-area-wrapper .mentionable {
	flex-grow: 1;
}
.content-comment >>> .text-area-wrapper .mentionable .text-area{
	width: 100%;
}
.content-comment >>> .text-area-wrapper .mention-item {
	padding: 4px 10px;
	border-radius: 4px;
}
.content-comment >>>  .text-area-wrapper .mention-selected {
    background: rgb(192, 250, 153);
}
</style>