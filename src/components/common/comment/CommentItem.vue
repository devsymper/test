<template>
	<div class="commnent-item">
		<div :item="item"  class="commnent-item-wrapper" :style="{width:width}">
		<v-icon v-if="item.parentId == '0' && item.status == 0" class="icon-check" @click="resolveComment(item)" style="float:right">mdi-check-outline</v-icon>
		<v-icon v-if="item.parentId == '0' && item.status == 1" class="icon-check" @click="unresolveComment(item)" style="float:right">mdi-comment-arrow-left-outline</v-icon>
				<SymperAvatar :size="30" :userId="item.userId" style="margin-left:12px;margin-top:4px" />
			<div class="comment-item-content">
				<div style="display:flex;height:16px;width:100%">
						<span style="color:#00000099">{{item.infor.fullName}}</span>
				</div>
				<div style="display:flex">
					<InputComment 
						:isEditing="item.isEditing" 
						:item="item" 
						:images="images"  
						:files="files"
						:isAdd="false"
						:contentEdit="contentEdit"
						@cancel-reply="cancelReply()"
						style="max-width:100%"
					/>
					<v-menu style="min-height:unset" v-if="sEnduser==item.userId" bottom left >
						<template  v-slot:activator="{ on, attrs }">
							<v-icon class="icon-menu" v-bind="attrs"
							v-on="on" >mdi-dots-horizontal</v-icon>
						</template>
						<v-list >
							<v-list-item
								@click="editComment(item)"
								style="height:30px"
							>
								<v-list-item-title style="font:13px roboto">Sửa Bình luận</v-list-item-title>
							</v-list-item>
							<v-list-item
								@click="confirmDelete(item)"
								style="height:30px"
							>
								<v-list-item-title style="font:13px roboto"> Xóa Bình luận</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
				</div>
				<div style="display:flex;font-size:11px"> 
					<span class="btn-reply-comment" @click="replyComment(item)"> {{ $t('comment.reply')}} </span>
					<span style="padding-left:8px">{{lassSeen(item.createdAt)}}</span>
					<span v-if="item.createdAt != item.updatedAt" style="padding-left:8px;cursor:pointer"> {{ $t('comment.edited')}}</span>
				</div>

			</div>
		</div>
		<div style="padding-left:30px;">
			<commentItem
				v-for="(child, i) in item.childrens"
				:key="i"
				:item="child"
				@reply-child="replyChild"
			>
			</commentItem>
			<div class="reply-comment"  v-if="item.reply && item.parentId == '0'">
				<SymperAvatar :size="30" :userId="userId" style="margin-left:14px" />
				<div style="padding-left:8px;width:98%">
					<InputComment  :isEditing="true" :images="[]" :files="[]" :isAdd="true" />
				</div>
			</div>
		</div>
		<SymperDialogConfirm 
			:showDialog="showDialog"
			:title="'Xóa bình luận'"
			:content="'Bạn có chắc muốn xóa bình luận này không'"
			@confirm="deleteComment"
		 />
	</div>
</template>
<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import InputComment from "./InputComment.vue"
import moment from 'moment';
import {commentApi} from '@/api/Comment.js'
import {fileManagementApi} from '@/api/FileManagement.js'
import SymperAvatar from '@/components/common/SymperAvatar.vue'
import DialogDelete from './DialogDelete.vue'
import SymperDialogConfirm from '@/components/common/SymperDialogConfirm.vue'
export default {
	name: 'commentItem',
	props:{
		item:{
			type: Object,
		},
		width:{
			type: String,
			default: '100%'
		},
		searchItem:{
			type: String,
			default: ''
		}
	},
	components: {
		VuePerfectScrollbar,
		InputComment,
		moment,
		SymperAvatar,
		DialogDelete,
		SymperDialogConfirm
	},
	data() {
		return {
			listCommentHeight:'500px',
			images:[],
			files:[],
			status,
			contentEdit: '',
			reply: false,
			showDialog: false,
			itemDeleting: null
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
		userId(){
			return  this.$store.state.app.endUserInfo.id
		}
	},
	created(){
	},
	mounted(){
		
	},
	watch:{
		item:{
			deep: true,
			immediate: true,
			handler(newValue){
					let thisCpn = this
					thisCpn.files = []
					thisCpn.images = []
				if(newValue.attachments.length > 0){
					fileManagementApi.getFileByList(newValue.attachments).then(res => {
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
					
			}
		}
	},
	methods:{
		confirmDelete(item){
			this.showDialog = true
			this.itemDeleting = item
		},
		editComment(item){
			item.isEditing = true
			this.contentEdit = item.content
		},
		deleteComment(){
			this.showDialog = false
			this.images = []
			this.files = []
			commentApi.deleteComment(this.itemDeleting.id).then(res => {
				if(this.sComment.uuid == "0"){
					this.getCommentId()
				}else{
					this.getCommentUuid()
				}
            });
		},
		getCommentUuid(){
			commentApi.getCommentByUuid(this.sComment.objectType,this.sComment.objectIdentifier,this.sComment.uuid).then(res => {
				this.$store.commit('comment/updateListAvtiveComment',this.addAvatar(res.data.listObject.comments))
				this.$store.commit('comment/updateListResolve',this.addAvatar(res.data.listObject.resolve))
				if(this.$store.state.comment.currentTab == 'comment'){
						this.$store.commit('comment/setComment')
				}else{
					this.$store.commit('comment/setResolve')
				}
			});
		},
		getCommentId(){
			commentApi.getCommentById(this.sComment.objectType,this.sComment.objectIdentifier).then(res => {
				this.$store.commit('comment/updateListAvtiveComment',this.addAvatar(res.data.listObject.comments))
				this.$store.commit('comment/updateListResolve',this.addAvatar(res.data.listObject.resolve))
					if(this.$store.state.comment.currentTab == 'comment'){
						this.$store.commit('comment/setComment')
				}else{
					this.$store.commit('comment/setResolve')
				}
			});
		},
		lassSeen(date){
			return moment(date).fromNow();
		},
		resolveComment(item){
			// this.images = []
			// this.files = []
			commentApi.changeStatus(item.id).then(res => {
				item.status = 1
				// this.$store.commit('comment/updateResolve',item)
				if(this.sComment.uuid == "0"){
					this.getCommentId()
				}else{
					this.getCommentUuid()
				}
            })
		},
		unresolveComment(item){
			this.images = []
			this.files = []
			commentApi.changeStatus(item.id).then(res => {
				// item.status = 0	
				// this.$store.commit('comment/updateUnResolve',item)
				if(this.sComment.uuid == "0"){
					this.getCommentId()
				}else{
					this.getCommentUuid()
				}
            })
		},
		cancelReply(){
			this.item.reply = false
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
		},
		addAvatar(data){
			let mapIdToUser = this.$store.getters['app/mapIdToUser'];
			if(typeof data !== 'undefined'){
				data.forEach(function(e){
					if(!isNaN(e.userId)){
						let itemInfor = mapIdToUser[e.userId];
						let infor = {}
						if(itemInfor.hasOwnProperty('avatar')){
							infor.avatar = itemInfor.avatar
						}
						if(itemInfor.hasOwnProperty('displayName')){
							infor.fullName = itemInfor.displayName
						}
						e.infor = infor	
					}
					if(e.hasOwnProperty('childrens') && e.childrens.length > 0){
						e.childrens.forEach(function(k){	
							if(!isNaN(k.userId)){
								let itemInforChild = mapIdToUser[k.userId];
								let inforChild = {}
								if(itemInforChild.hasOwnProperty('avatar')){
									inforChild.avatar = itemInforChild.avatar
								}
								if(itemInforChild.hasOwnProperty('displayName')){
									inforChild.fullName = itemInforChild.displayName
								}
								k.infor = inforChild
							}
						})
					}
				})
			}
			return data
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
	width: 100%	;
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
	height: 46px;
	width: 66px;
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
.commnent-item >>> .comment-item-content .btn-reply-comment{ 
	cursor: pointer;
	border-bottom: 1px solid white;
}
.commnent-item >>> .comment-item-content .btn-reply-comment:hover{ 
	cursor: pointer;
	color: blue;
	border-bottom: 1px solid blue;
}
.commnent-item >>> .reply-comment{ 
	width:100%;
	display: flex;
	margin-right:auto;
	margin-left:6px;
	margin-top: 8px;
}
.commnent-item >>> .commnent-item-wrapper:hover .icon-menu{
	display: inline-block;
}
.commnent-item >>> .v-menu__content{
	min-height:unset
}
</style>