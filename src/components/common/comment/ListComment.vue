<template>
	<div class="list-comment" :style="{height:heightListComment+'px'}" >
		<VuePerfectScrollbar style="height:inherit">
			 <div :v-if="listItemFilter.length > 0" v-for="(item,i) in listItemFilter" :key="i"  class="comment-item"> 
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
		},
		heightListComment:{
			type: Number,
		}
	},
	methods:{
	},
	mounted(){
		console.log(this.heightListComment,'heightListCommentheightListComment');
	},
	components: {
		VuePerfectScrollbar,
		InputComment,
		CommentItem
	},
	data(){
		return {
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
		},
		// calc(){
		// 	this.heightListComment = 100%-'120px'
		// }
	},
	watch:{
		searchItem(val){
		}
	}
}	
</script>

<style scoped>
.list-comment{
	height:500px
}
.list-comment >>> .ps__rail-x{
	display: none;
}
</style>