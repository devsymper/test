<template>
	<div class="list-comment">
		<VuePerfectScrollbar :style="{height: listCommentHeight}">
			 <div :v-if="listItemFilter.length > 0" v-for="(item,i) in listItemFilter	" :key="i"  class="comment-item"> 
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
		},
		searchItem:{
			type: String,
			default: ''
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
			listCommentHeight:'400px',
			resItem: [],
		}
	},
	computed:{
		listItemFilter(){
			if(this.searchItem == ''){
				return this.listComment
			}else{
				this.filterItem()
				return this.resItem
			}
		}
	},
	methods:{
		filterItem(){
			let self = this	
			self.resItem = []
			if(this.listComment.length > 0){
					this.listComment.filter(function(item){
						if(item.content.toLowerCase().includes(self.searchItem.toLowerCase())){
							self.resItem.push(item)
						}
					})
			}
		}
	},
	watch:{
		searchItem(val){
		}
	}
}	
</script>

<style scoped>

</style>