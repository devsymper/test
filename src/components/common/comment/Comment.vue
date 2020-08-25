<template>
	<div class="symper-comment">
		<v-card 
			 v-show="showComment"
			 width="410px"
			:height="heightComment"
			:style="{top:top+'px',left:left+'px'}"
		>
			<v-toolbar
				flat
				style="height:auto"
			>
				<v-toolbar-title>Bình luận</v-toolbar-title>
					<v-icon>mdi-comment-text-outline</v-icon>
					<v-spacer></v-spacer>
					<v-icon  @click="hide()">mdi-close</v-icon>
				<template v-slot:extension>
				<v-tabs
					v-model="tab"
					align-with-title
				>
					<v-tabs-slider color="yellow"></v-tabs-slider>
					<v-tab v-for="item in itemsTab" :key="item.value" >
						<span> {{ item.title }} </span> <!--<span style='padding-left:4px'>{{ '('+sComment[item.store].length+')'}}</span> -->
					</v-tab>
				</v-tabs>
				<v-spacer></v-spacer>
				<!-- <v-text-field
					solo
					v-if="showInput"
					label="Append"
					append-icon="mdi-close"
					@click:append="clickClose"
					></v-text-field> -->
					<v-icon   @click="clickSearch" style="font-size:13px">mdi-magnify</v-icon>
				</template>
			</v-toolbar>
			<v-tabs-items v-model="tab">
				<v-tab-item
				v-for="item in itemsTab"
				:key="item.value"
				>
				<v-card flat>
					<list-comment :listComment="listComment"/>
				</v-card>
				</v-tab-item>
				 <div class="input-comment" v-if="tabComment == true">
					 <v-avatar>
						<img
						src="https://cdn.vuetifyjs.com/images/john.jpg"
						alt="John"
						style="width:30px;height:30px;margin-top: -18px;margin-right: -8px;"
						>
					</v-avatar>
					<InputComment :isEditing="true" :images="[]" :files="[]" :isAdd="true"/>
				 </div>
			</v-tabs-items>
			</v-card>
	</div>
</template>
<script>
import TargetArea from './TargetArea.vue';
import ListComment from './ListComment.vue';
import CommentItem from './CommentItem.vue'
import InputComment from './InputComment.vue';
import {commentApi} from '@/api/Comment.js'
import {fileManagementApi} from '@/api/FileManagement.js'
export default {
	components:{
		TargetArea,
		ListComment,
		CommentItem,
		InputComment,
	},
	created(){
	},
	computed:{
		listComment(){
			return this.$store.state.comment.listComment
		},
		sComment(){
			return this.$store.state.comment
		}
	},
	mounted(){
	},
	 data() {
        return {
            tab: null,
			showInput:false,
			showSpan:true,
			showMagnity:true,
			showTargetArea:false,
			resolveComment:[],
			commentTarget:{},
			comment:[],
			tabComment : true,
			itemsTab: [
				{
					title:'Comment',
					value:'comment',
					store: 'listAvtiveComment',
					icon: 'mdi-comment-processing-outline'
				},
				{
					title: 'Resolve',
					value:'resolve',
					store: 'listResolve',
					icon: 'mdi-comment-check'
				}
			],
        };
    },
	 props: {
		 /**
		  * truyen vao show comment hay ko
		  */
        showComment: {
            type: Boolean,
            default: false
		},
		 /**
		  * truyen vao width comment
		  */
        // widthComment: {
        //     type: String,
        //     default: "410px"
		// },
		 /**
		  * truyen vao height comment hay ko
		  */
        heightComment: {
            type: String,
            default: "1000px"
		},
		 /**
		  * truyen vao vi tri comment
		  */
		top:{
			type: Number,
			default:0
		},
		 /**
		  * truyen vao vi tri comment
		  */
		left:{
			type: Number,
			default:600
		},
		/**
		  * truyen vao vi tri comment
		*/
		targetArea:{
			type: String,
			default:''
		},
		/**
		  * truyen vao vi tri comment
		*/
		objectIdentifier:{
			type: Number,
		},
		/**
		  * truyen vao vi tri comment
		*/
		objectType:{
			type: String,
		},
		/**
		  * truyen vao vi tri comment
		*/
		uuid:{
			type:String,
			default:"0"
		}
	},
	methods:{
		clickSearch(){
      		this.showInput = true
  		},
		clickClose(){
			this.showInput = false
		},
		hide(){
			this.showComment = false
		},
		tagUser(event){
			console.log(event);
		},
		clickTab(item){
			console.log(item);
		},
	},
	watch:{
		objectIdentifier:function(val){
			commentApi.getCommentById(this.objectType,val).then(res => {
				this.$store.commit('comment/updateListComment',res.data.listObject.comments)
				this.$store.commit('comment/updateListAvtiveComment',res.data.listObject.comments)
				this.$store.commit('comment/updateListResolve',res.data.listObject.resolve)
			});
			this.commentTarget.objectIdentifier = val;
			this.commentTarget.objectType = this.objectType;
			this.commentTarget.uuid = this.uuid;
			this.commentTarget.targetArea = this.targetArea;
			this.commentTarget.parentId = 0;
			this.$store.commit('comment/updateCommentTarget',this.commentTarget)	
		},
		uuid:function(val){
			if(val == "0"){
				commentApi.getCommentById(this.objectType,this.objectIdentifier).then(res => {
					this.$store.commit('comment/updateListComment',res.data.listObject.comments)
					this.$store.commit('comment/updateListAvtiveComment',res.data.listObject.comments)
					this.$store.commit('comment/updateListResolve',res.data.listObject.resolve)
				});
			}else{
				commentApi.getCommentByUuid(this.objectType,this.objectIdentifier,val).then(res => {
					this.$store.commit('comment/updateListComment',res.data.listObject.comments)
					this.$store.commit('comment/updateListAvtiveComment',res.data.listObject.comments)
					this.$store.commit('comment/updateListResolve',res.data.listObject.resolve)
				});
			}
				this.commentTarget.objectIdentifier = this.objectIdentifier;
				this.commentTarget.objectType = this.objectType;
				this.commentTarget.uuid = this.uuid;
				this.commentTarget.targetArea = this.targetArea;
				this.commentTarget.parentId = 0;
				this.$store.commit('comment/updateCommentTarget',this.commentTarget)
		},
		tab:function(val){
			if(val === 0){
				this.$store.commit('comment/setComment')
				this.$store.commit('comment/updateCurrentTab','comment')
				this.tabComment = true
			}
			else{
				this.$store.commit('comment/setResolve')
				this.$store.commit('comment/updateCurrentTab','resolve')
				this.tabComment = false
			}
		}
	}
}
</script>

<style scoped>
.symper-comment{
	font:13px roboto
}
.symper-comment  >>>.v-btn{
	height: 25px;
	width: 25px;
}

.symper-comment >>> .v-toolbar__title{
	text-transform: uppercase;
	font:15px roboto
}
.symper-comment >>> .v-toolbar__content {
	height: 32px !important;
}
.symper-comment >>> .v-toolbar__content .v-icon{
	font-size:13px;
	padding-left:8px
}
.symper-comment >>> .v-tab {
	margin-left:0px !important;
	height:32px;
}
.symper-comment >>> .v-slide-group__wrapper{
	margin-left:20px !important;
	height: 32px;
}
.symper-comment >>> .v-toolbar__extension{
	height: 32px !important;
}
.symper-comment >>> .v-slide-group__wrapper .v-tabs-slider{
	display:none;
}
.symper-comment >>> .target-area{
	width: 100%;
}
.symper-comment >>> .input-comment{
	display: flex;
	width: 400px;
	margin-left: auto;
	margin-right:auto;
	flex-direction: row;
	justify-content: center;
}
</style>