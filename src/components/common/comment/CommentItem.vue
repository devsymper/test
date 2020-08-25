<template>
	<div class="commnent-item">
		<div :item="item"  class="commnent-item-wrapper" :style="{width:width}">
		<v-icon v-if="item.parentId == '0' && item.status == 0" class="icon-check" @click="resolveComment(item)" style="float:right">mdi-check</v-icon>
		<v-icon v-if="item.parentId == '0' && item.status == 1" class="icon-check" @click="unresolveComment(item)" style="float:right">mdi-comment-arrow-left-outline</v-icon>
				<v-avatar>
					<img
					src="https://cdn.vuetifyjs.com/images/john.jpg"
					alt="John"
					style="width:30px;height:30px;margin-top: -10px;margin-right: -8px;"
					>
				</v-avatar>
			<div class="comment-item-content">
				<div style="display:flex;height:16px;width:100%">
						<span style="color:#00000099">Đào Mạnh Khá</span>
				</div>
				<div style="display:flex">
					<InputComment 
						:isEditing="item.isEditing" 
						:item="item" 
						:images="images"  
						:files="files"
						:isAdd="false"
						:contentEdit="contentEdit"
					/>
					<v-menu style="min-height:unset" v-if="sEnduser==item.userId" bottom left >
						<template  v-slot:activator="{ on, attrs }">
							<v-icon class="icon-menu" v-bind="attrs"
							v-on="on" >mdi-dots-horizontal</v-icon>
						</template>
						<v-list >
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
				:width="'340px'"
				@reply-child="replyChild"
			>
			</commentItem>
			<div class="reply-comment"  v-if="item.reply && item.parentId == '0'">
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
import { mapGetters } from 'vuex';
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
			// let mapIdToUser = this.$store.getters['app/mapIdToUser'];
			// let itemInfor = mapIdToUser[this.item.userId];
			// let infor = {}
			// infor.avatar = itemInfor.avatar,
			// infor.fullName = itemInfor.displayName
			// this.item.infor = infor
			// if(this.item.childrens.length > 0){
			// 	this.item.childrens.forEach(function(e){	
			// 		itemInfor = mapIdToUser[e.id];
			// 		let inforChild = {}
			// 		inforChild.avatar = itemInfor.avatar,
			// 		inforChild.fullName = itemInfor.displayName
			// 		e.infor = inforChild
			// 	})
			// }
			// console.log(this.item,'itemavatarrrrr');
	},
	methods:{
		editComment(item){
			item.isEditing = true
			this.contentEdit = item.content
		},
		deleteComment(item){
			commentApi.deleteComment(item.id).then(res => {
				if(this.sComment.uuid == "0"){
					this.getCommentId()
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
			commentApi.changeStatus(item.id).then(res => {
				   item.status = 1
				   this.$store.commit('comment/updateResolve',item)
			  
            })
		},
		unresolveComment(item){
			commentApi.changeStatus(item.id).then(res => {
					item.status = 0
				   this.$store.commit('comment/updateUnResolve',item)
            })
		},
		replyComment(item){	
			if(item.parentId == '0'){	
				this.item.reply = true;
				this.$store.commit('comment/updateParentCommentTarget',item.id)
			}else{
				this.$emit('reply-child',item)
			}
		},
		replyChild(data){
			this.item.reply = true;
			this.$store.commit('comment/updateParentCommentTarget',data.parentId)
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
			contentEdit: '',
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
	position: relative;
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
.commnent-item>>> .icon-menu{
	position: absolute;
	top:10;
	right:0;
	display: none;
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
	position: absolute;
	top:0;
	right:0;
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
	margin-left:auto;
	margin-top: 8px;
}
.commnent-item >>> .commnent-item-wrapper:hover .icon-menu{
	display: inline-block;
}
.commnent-item >>> .v-menu__content{
	min-height:unset
}
</style>