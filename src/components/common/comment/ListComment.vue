<template>
	<div class="list-comment">
		<VuePerfectScrollbar :style="{height: listCommentHeight}">
			 <div :v-if="listComment.length > 0" v-for="(item,i) in listComment" :key="i"  class="comment-item"> 
				<CommentItem
					 :item="item"
				 />
			</div>
		 </VuePerfectScrollbar>
	</div>
</template>
<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import InputComment from "./InputComment.vue";
import CommentItem from './CommentItem.vue';
import {commentApi} from '@/api/Comment.js'
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
			commentApi.deleteComment(item.id).then(res => {
				// if(sComment.)
				console.log(res);
            });
			// this.listComment.splice(this.listComment.indexOf(item),1)

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
	},
	computed:{
		sComment(){
			return this.$store.state.comment
		}
	}
}	
</script>

<style scoped>

/*  */
</style>