<template>
	<div class="commnent-item">
		<div :item="item" class="commnent-item-wrapper" :style="{width:width}">
				<v-avatar>
					<img
					src="https://cdn.vuetifyjs.com/images/john.jpg"
					alt="John"
					style="width:30px;height:30px;margin-top: -10px;margin-right: -8px;"
					>
				</v-avatar>
			<div class="comment-item-content">
				<div style="display:flex;height:20px;width:100%">
						<span style="color:#262626">Đào Mạnh Khá</span>
						<v-btn  icon @click="resolveComment(item)"><v-icon class="icon-check" style="float:right">mdi-check</v-icon></v-btn>
				</div>
				<div style="display:flex">
					<InputComment 
						:isEditing="item.isEditing" 
						:item="item" 
						:images="images"  
						:files="files"
						:isAdd="false"
					/>
					<v-menu v-if="sEnduser==item.userId" bottom left class="icon-menu">
						<template  v-slot:activator="{ on, attrs }">
							<v-btn
							icon
							v-bind="attrs"
							v-on="on"
							>
							<v-icon >mdi-dots-horizontal</v-icon>
							</v-btn>
						</template>
						<v-list>
							<v-list-item
								@click="editComment(item)"
							>
								<v-list-item-title>Sửa Bình luận</v-list-item-title>
							</v-list-item>
							<v-list-item
								@click="deleteComment(item)"
							>
								<v-list-item-title> Xóa Bình luận</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
				</div>
				<div style="display:flex;font-size:11px"> 
					<span class="btn-reply-comment" @click="replyComment(item)">Trả lời </span>
					<span style="padding-left:8px">{{lassSeen(item.updatedAt)}}</span>
				</div>

			</div>
		</div>
		<div style="padding-left:40px;">
			<commentItem
				v-for="(child, i) in item.childrens"
				:key="i"
				:item="child"
				:width="'350px'"
			>
			</commentItem>
			<div class="reply-comment"  v-if="item.reply">
				<v-avatar>
						<img
						src="https://cdn.vuetifyjs.com/images/john.jpg"
						alt="John"
						style="width:30px;height:30px;margin-top: -18px;margin-right: -10px;"
						>
				</v-avatar>
				<div style="padding-left:8px;width:100%">
					<InputComment  :isEditing="true" :images="[]" :files="[]" :isAdd="true" />
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import InputComment from "./InputComment.vue"
import moment from 'moment';
import {commentApi} from '@/api/Comment.js'
import {fileManagementApi} from '@/api/FileManagement.js'
export default {
	name: 'commentItem',
	props:{
		item:{
			type: Object,
		},
		width:{
			type: String,
			default: '380px'
		}
	},
	mounted(){
		if(this.item.attachments.length > 0){
			let thisCpn = this
			fileManagementApi.getFileByList(this.item.attachments).then(res => {
				res.data.forEach(function(e){
					if(e.type == "png" || e.type == "jpg" || e.type == "jpeg"){
						thisCpn.images.push(e)
					}
					else{
						thisCpn.files.push(e)
					}
				})
			});
		}
		
	},
	methods:{
		editComment(item){
			item.isEditing = true
		},
		deleteComment(item){
			commentApi.deleteComment(item.id).then(res => {
				if(this.sComment.uuid == "0"){
					this.getCommentId()
					debugger
				}else{
					this.getCommentUuid()
				}
            });
		},
		getCommentUuid(){
			commentApi.getCommentByUuid(this.sComment.objectType,this.sComment.objectIdentifier,this.sComment.uuid).then(res => {
				this.$store.commit('comment/updateListComment',res.data.listObject.comments)
				this.$store.commit('comment/updateListAvtiveComment',res.data.listObject.comments)
				this.$store.commit('comment/updateListResolve',res.data.listObject.resolve)
			});
		},
		getCommentId(){
			debugger
			commentApi.getCommentById(this.sComment.objectType,this.sComment.objectIdentifier).then(res => {
				this.$store.commit('comment/updateListComment',res.data.listObject.comments)
				this.$store.commit('comment/updateListAvtiveComment',res.data.listObject.comments)
				this.$store.commit('comment/updateListResolve',res.data.listObject.resolve)
			});
		},
		lassSeen(date){
			return moment(date).fromNow();
		},
		resolveComment(item){
			console.log(item);
			commentApi.changeStatus(item.id).then(res => {
				   console.log(res);
				   debugger
				   this.$store.commit('comment/updateResolve',item)
			  	// if(this.sComment.uuid == "0"){
				// 	this.getCommentId()
				// }else{
				// 	this.getCommentUuid()
				// }
            })
		},
		replyComment(item){	
			this.item.reply = true;
			this.$store.commit('comment/updateParentCommentTarget',item.id)
		}
	},
	components: {
		VuePerfectScrollbar,
		InputComment,
		moment
	},
	data() {
		return {
			listCommentHeight:'500px',
			images:[],
			files:[],
			status,
			reply: false,
		}
	},
	computed:{
		sEnduser(){
			return this.$store.state.app.endUserInfo.id
		},
		sComment(){
			return this.$store.state.comment.commentTarget
		},
		sReply(){
			return this.$store.state.comment.isReply
		},
	},
}	
</script>
<style scoped>
.commnent-item {
	padding: 8px;
	width:100%;
	margin-left: auto;
	margin-right: auto;
}
.commnent-item >>> .v-sheet .v-toolbar {
	height: unset !important;
}
.commnent-item >>> .commnent-item-wrapper {
	display: flex;
	margin-left: auto;
	margin-right: auto;
}
.commnent-item >>> .comment-item-content{
	display: flex;
	flex-direction: column;
	margin-left: 8px;
}
.commnent-item>>>  .icon-menu,
.commnent-item>>> .icon-check{
	display: inline-block;
	flex-grow: 1;
	font-size: 15px;
}
.commnent-item >>>.v-btn{
	height: 25px;
	width: 25px;
}
.commnent-item >>>  .v-btn__content .v-icon{
	font-size: 15px;
}
.commnent-item >>> .icon-menu .v-btn__content{
	display: none;
}
.commnent-item >>> icon-menu .v-list-item__title{
	font: 13px roboto;
}
.commnent-item>>>  .icon-check{
	color: green;
}
.commnent-item >>> .comment-item-content{
	display: flex;
	flex-direction: column;
	margin-left: 8px;
}
.commnent-item >>> .comment-item-content .btn-reply-comment:hover{ 
	cursor: pointer;
	color: blue;
	border-bottom: 1px solid blue;
}
.commnent-item >>> .reply-comment{ 
	width:340px;
	display: flex;
	margin-right:auto;
	margin-left:auto
}
</style>