<template>
	<div class="symper-comment">
		<v-card 
			 v-show="showComment"
			 :width="widthComment"
			:height="heightComment"
			:style="{top:top+'px',left:left+'px'}"
		>
			<v-toolbar
				flat
				style="height:auto"
			>
				<v-toolbar-title>Bình luận</v-toolbar-title>
					<v-icon>mdi-comment-text-outline</v-icon>
				<template v-slot:extension>
				<v-tabs
					v-model="tab"
					align-with-title
				>
					<v-tabs-slider color="yellow"></v-tabs-slider>
					<v-tab v-for="item in itemsTab" :key="item.value" >
						<v-icon v-if="isSearching == true" @click="isSearching = false" style="font-size:18px">{{item.icon}}</v-icon>
						<span v-else> <span style="font:13px roboto !important;text-transform:none"> {{ item.title }} </span> <span style='padding-left:4px'>{{ '('+sComment[item.store].length+')'}}</span></span>
					</v-tab>
				</v-tabs>
				<v-spacer></v-spacer>
				  <v-text-field
						solo
						v-if="isSearching"
						label="Search..."
						append-icon="mdi-close-circle-outline"
						v-model="searchItem"
						@click:append="clickClose"
					></v-text-field>
					<v-icon v-else  @click="clickSearch" style="font-size:13px">mdi-magnify</v-icon>
				</template>
			</v-toolbar>
			<v-tabs-items v-model="tab">
				<v-tab-item
				v-for="item in itemsTab"
				:key="item.value"
				>
				<v-card flat>
					<list-comment  :listComment="listComment" :searchItem="searchItem"/>
				</v-card>
				</v-tab-item>
			</v-tabs-items>
			 <div class="input-comment" v-if="tabComment == true">
					<SymperAvatar :userId="userId" :size="30"  />
					<InputComment style="margin-left:8px" :isEditing="true" :images="[]" :files="[]" :isAdd="true"/>
				 </div>
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
import SymperAvatar from '@/components/common/SymperAvatar.vue'
export default {
	 data() {
        return {
            tab: null,
			isSearching:false,
			showSpan:true,
			showMagnity:true,
			showTargetArea:false,
			resolveComment:[],
			commentTarget:{},
			comment:[],
			tabComment : true,
			searchItem:'',
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
	components:{
		TargetArea,
		ListComment,
		CommentItem,
		InputComment,
		SymperAvatar
	},
	created(){
		if(this.uuid == "0"){
			this.getCommentById()
		}else{
			this.getCommentByUuid()
		}
	},

	computed:{
		listComment(){
			return this.$store.state.comment.listComment
		},
		sComment(){
			return this.$store.state.comment
		},
		userId(){
			return  this.$store.state.app.endUserInfo.id
		}
	},
	mounted(){
		
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
        widthComment: {
            type: String,
            default: "100%"
		},
		 /**
		  * truyen vao height comment hay ko
		  */
        heightComment: {
            type: String,
            default: "800px"
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
			default:0
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
			type: String,
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
      		this.isSearching = true
  		},
		clickClose(){
			this.isSearching = false
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
		getCommentById(){
			commentApi.getCommentById(this.objectType,this.objectIdentifier).then(res => {
				this.$store.commit('comment/updateListComment',this.addAvatar(res.data.listObject.comments))
				this.$store.commit('comment/updateListAvtiveComment',this.addAvatar(res.data.listObject.comments))
				this.$store.commit('comment/updateListResolve',this.addAvatar(res.data.listObject.resolve))
			});
			this.commentTarget.objectIdentifier = this.objectIdentifier;
			this.commentTarget.objectType = this.objectType;
			this.commentTarget.uuid = this.uuid;
			this.commentTarget.targetArea = this.targetArea;
			this.commentTarget.parentId = 0;
			this.$store.commit('comment/updateCommentTarget',this.commentTarget)	
		},
		getCommentByUuid(){
			commentApi.getCommentByUuid(this.objectType,this.objectIdentifier,this.uuid).then(res => {
				this.$store.commit('comment/updateListComment',this.addAvatar(res.data.listObject.comments))
				this.$store.commit('comment/updateListAvtiveComment',this.addAvatar(res.data.listObject.comments))
				this.$store.commit('comment/updateListResolve',this.addAvatar(res.data.listObject.resolve))
			});
			this.commentTarget.objectIdentifier = this.objectIdentifier;
			this.commentTarget.objectType = this.objectType;
			this.commentTarget.uuid = this.uuid;
			this.commentTarget.targetArea = this.targetArea;
			this.commentTarget.parentId = 0;
			this.$store.commit('comment/updateCommentTarget',this.commentTarget)
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
	watch:{
		objectIdentifier:function(val){
			debugger
			this.getCommentById()
		},
		uuid:function(val){
			if(val == "0"){
				this.getCommentById()
			}else{
				this.getCommentByUuid()
			}
				
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
	font:13px roboto;
	position: relative;
}
.symper-comment  >>>.v-btn{
	height: 25px;
	width: 25px;
}
.symper-comment  >>>.v-tabs-bar__content span{

}
.symper-comment  >>> .v-input__control{
	background-color:#f7f7f7;
	min-height:unset
}
.symper-comment  >>> .v-input__control .v-text-field__details{
	display: none;
}
.symper-comment  >>> .v-input__control .v-input__slot{
	box-shadow: unset !important;
	background-color:#f7f7f7;
	border-radius: 5px;
	margin:unset;
	width: 200px;
	padding: 0px 8px !important;
	font: 12px roboto;
}
.symper-comment  >>> .v-input__control .v-input__slot .v-text-field__slot label{
	font-size: 13px ;
}
.symper-comment  >>> .v-input__control .v-input__slot .v-icon{
	font-size: 15px;
	margin-right: -8px;
}
.symper-comment  >>> .v-input__control .v-input__slot #input-4358{
	
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
	width: 98%;
	margin-left: 12px;
	margin-right:12px;
	flex-direction: row;
	justify-content: center;
	position: absolute;
	bottom:0px;
	
}
</style>