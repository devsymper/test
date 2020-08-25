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
import {commentApi} from '@/api/Comment.js';
export default {
	name: 'ListComment',
	props:{
		listComment:{
			type: Array
		}
	},
	methods:{
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
	}
}	
</script>

<style scoped>

</style>