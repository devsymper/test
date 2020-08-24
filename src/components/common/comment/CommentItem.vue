<template>
	<div class="commnent-item" >
		<div :item="item" class="commnent-item-wrapper">
				<v-avatar>
					<img
					src="https://cdn.vuetifyjs.com/images/john.jpg"
					alt="John"
					style="width:30px;height:30px;margin-top: -10px;margin-right: -8px;"
					>
				</v-avatar>
			<div class="comment-item-content">
				<div style="display:flex">
						<span style="color:#262626;width:330px">Đào Mạnh Khá</span> <br>
						<v-btn class="icon-check" icon><v-icon >mdi-check</v-icon></v-btn>
				</div>
				<div style="display:flex">
					<InputComment 
						:isEditing="item.isEditing" 
						:item="item" 
						:images="images"  
						:files="files"
					/>
					<v-menu bottom left class="icon-menu">
						<template  v-slot:activator="{ on, attrs }">
							<v-btn
							icon
							v-bind="attrs"
							v-on="on"
							>
							<v-icon v-if="sEnduser==item.userId" >mdi-dots-horizontal</v-icon>
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
					<span class="btn-reply-comment">Trả lời </span>
					<span style="padding-left:8px">{{lassSeen(item.updatedAt)}}</span>
				</div>
			</div>
		</div>
		<div style="padding-left:35px;width:100%">
			<commentItem
				v-for="(child, i) in item.childrens"
				:key="i"
				:item="child"
			>
			</commentItem>
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
		}
	},
	mounted(){
		if(this.item.attachments.length > 0){
			let thisCpn = this
			fileManagementApi.getFileByList(this.item.attachments).then(res => {
				console.log(res);
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
				console.log(res,'resssssss');
            });
		},
		addComment(data){
			console.log(data);
		},
		lassSeen(date){
			return moment(date).fromNow();
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
		}
	},
	computed:{
		sEnduser(){
			return this.$store.state.app.endUserInfo.id
		},
		sComment(){
			return this.$store.state.comment
		}
	},
}	
</script>
<style scoped>
.commnent-item {
	padding: 8px;
	width:400px;
	margin-left: auto;
	margin-right: auto;
}
.commnent-item >>> .commnent-item-wrapper {
	display: flex;
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
</style>