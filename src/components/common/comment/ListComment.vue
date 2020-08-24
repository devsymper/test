<template>
	<div class="list-comment">
		<VuePerfectScrollbar :style="{height: listCommentHeight}">
			 <div :v-if="listComment.length > 0" v-for="(item,i) in listComment" :key="i"  class="comment-item"> 
				<CommentItem :item="item" />
			</div>
		 </VuePerfectScrollbar>
	</div>
</template>
<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import InputComment from "./InputComment.vue";
import CommentItem from './CommentItem.vue'
export default {
	name: 'ListComment',
	props:{
		listComment:{
			type: Array
		}
	},
	methods:{
		editComment(item){
			console.log('edititng');
			item.isEditting = true
		},
		deleteComment(item){
			this.listComment.splice(this.listComment.indexOf(item),1)
		},
	},
	components: {
		VuePerfectScrollbar,
		InputComment,
		CommentItem
	},
	data() {
		return {
			listCommentHeight:'500px',
		}
	}
}	
</script>

<style scoped>
.list-comment >>> .comment-item{
	display: flex;
	padding: 8px;
	width:420px;
	margin-left: auto;
	margin-right: auto;
}
.list-comment >>> .comment-item .comment-item-content{
	display: flex;
	flex-direction: column;
	margin-left: 8px;
}
/* .list-comment >>> .comment-item .v-list-item__title{
	font:13px roboto
} */
.list-comment >>> .comment-item .icon-menu,
.list-comment >>> .comment-item .icon-check{
	display: inline-block;
	flex-grow: 1;
	font-size: 15px;
}
.list-comment >>> .comment-item .v-btn{
	height: 25px;
	width: 25px;
}
.list-comment >>> .comment-item .v-btn__content .v-icon{
	font-size: 15px;
}
.list-comment >>> .comment-item .icon-menu .v-btn__content{
	display: none;
}
.list-comment >>> .comment-item .icon-menu .v-list-item__title{
	font: 13px roboto;
}
.list-comment >>> .comment-item .icon-check{
	color: green;
}
.list-comment >>> .comment-item .comment-item-content{
	display: flex;
	flex-direction: column;
	margin-left: 8px;
}
.list-comment >>> .comment-item .comment-item-content .btn-reply-comment:hover{ 
	cursor: pointer;
	color: blue;
	border-bottom: 1px solid blue;
}
/* .list-comment >>> .comment-item:hover .v-btn__content{
	display: inline-block;
} */
</style>