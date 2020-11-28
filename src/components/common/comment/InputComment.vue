<template>
	<div class="content-comment">
		<div v-if="listImage.length > 0"  class="content-comment-img">
				<v-tabs
					show-arrows
				>
				<v-tab
				v-for="(item,i) in listImage"
				:key="i"
				:href="'#tab-' + i"
				style="position:relative"
				>
					<v-img 
						:src="item.serverPath" 
						aspect-ratio="1.7" 
						style="width:100px;height:100px"  
						@click="previewImage(item)"
					>
					</v-img>
					<v-icon 
						class="icon-remove-img" 
						style="position:absolute;top:0;right:0" 
						v-if="isEditing == true" 
						@click="removeImage(item)"
					>mdi-close-circle-outline</v-icon>
				</v-tab>
			</v-tabs>
		</div>
		<div v-if="listFile.length > 0" class="content-comment-file">
			<div class="commnet-file-item" v-for="(item,i) in listFile" :key="i">
				<v-icon v-if="icon[item.type]">{{icon[item.type]}}</v-icon>
				<v-icon v-else>{{icon.default}}</v-icon>
				<span class="file-item-title" @click="download(item.id)">{{item.name+'.'+item.type}}</span>
				<v-icon class="icon-remove-file" v-if="isEditing == true" @click="removeFile(item)">mdi-close-circle-outline</v-icon>
			</div>	
		</div>
		<div class="content-comment-input">
			<span v-if="isEditing == false" >
				 <h5 v-if="item.tags.length == 0">{{item.content}}</h5>
				 <h5 v-else v-html="reduce(item.content)"></h5>
			</span>
			<div class="text-area-wrapper" v-else>
					<textarea v-model="inputComment"  
						v-on:keyup.50="tagUser($event)"
						v-on:keyup.esc="cancelComment"
						v-on:keyup.enter="enterClick"
						class="text-area"
						style="width:100%"
						v-on:keyup.down="chooseUserDown($event)"
						v-on:keyup.up="chooseUserUp($event)"
						>
					</textarea>
				<UploadFile 
					style="position:absolute;right:20px;bottom:0px;" 
					@uploaded-file="uploadInfo" 
					:uploadMultyFile="true" 
					@upload-error="showError" 
				/>
				<v-btn 
					small 
					style=" position:absolute;right: 0px;bottom: 0px;" 
					icon 
					@click="debounceAddCommnent">
					<v-icon small >mdi-send-circle-outline</v-icon>
				</v-btn>
				<MenuTagUser style="position:absolute;left:0;bottom:45px" ref="menuTagUser" @selected-item="tagged" :keyWord="keyWord" />
			</div>
		</div>
		 <v-dialog
			v-model="dialog"
			max-width="80%"
			max-height="80%"
			style="overflow:hidden !important;z-index:1000"
			:content-class="'dialog-preview-image-comment'"
		>
			<v-card style="display:flex;flex-direction:column">
				<div>
					<v-icon @click="dialog = false" style="float:right;font-size:18px;padding-top:2px">mdi-close</v-icon>
					<v-icon @click="downloadImg" style="float:right;padding-right:8px;font-size:18px;padding-top:4px">mdi-download</v-icon>
				</div>
				<div class="preview-image-wrapper">
					<v-img
					:src="srcImg"
					style="height: 200%;
							width: 200%; 
							vertical-align: bottom; "
					>
					</v-img>	
				</div>		
			</v-card>
		</v-dialog>
	</div>
</template>
<script>
import MenuTagUser from './MenuTagUser.vue'
import UploadFile from '@/components/common/UploadFile.vue';
import {commentApi} from '@/api/Comment.js'
import { util } from '../../../plugins/util';

export default {
	data(){
		return {
			inputComment: '',
			keyWord: '',
			attachments:[],
			srcImg:'',
			dialog:false,	
			tags:[],
			isSelectingUser:false,
			idImg:null,
			icon:{
				xlxs: 'mdi-file-excel-box',
				xls: 'mdi-file-excel-box',
				docx: 'mdi-file-word-box',
				doc: 'mdi-file-word-box',
				pdf: 'mdi-file-pdf-box',
				default: 'mdi-file'
			},
			dataPostComment:{
			},
			listImage:[],
			listFile:[],
			
		}
	},
	props:{
		isEditing:{
			type: Boolean,
			default: false
		},
		item:{
			type: Object
		},
		images:{
			type: Array,
		},
		files:{
			type: Array,
		},
		isAdd:{
			type: Boolean,
			default: true
		},
		parentId:{
			type:Number,
		},
		isReply:{
			type: Boolean,
			default: false
		},
		contentEdit:{
			type: String,
			default: ''
		},
		
	},
	components:{
		MenuTagUser,
		UploadFile,
	},
	created(){
	},
	mounted(){
		 let thisCpn = this;
			$(document).click(function(e){
				if(!$(e.target).is('.context-menu')){
					if(thisCpn.$refs.menuTagUser){
						thisCpn.$refs.menuTagUser.hide()
					}
				}
			})
			$(document).keydown(function(e){
				if(e.keyCode == 38 || e.keyCode == 40){
					event.preventDefault()
				}
			})
	},
	methods:{
		removeFile(item){
			this.attachments.splice(this.attachments.indexOf(item.id),1)
			this.files.splice(this.files.indexOf(item),1)
		},
		removeImage(item){
			this.attachments.splice(this.attachments.indexOf(item.id),1)
			this.images.splice(this.images.indexOf(item),1)
		},
		tagUser(event){
			this.isSelectingUser = true
			let $target = $(event.target);
			var x = $target.offset().left;
     		var y = $target.offset().top+28;
			this.$refs.menuTagUser.show(x,y);
		},
		tagged(data){
			this.isSelectingUser = false
			if(this.item){
				 this.tags = this.item.tags 
			}
			let item = {} 
			item.objectIdentifier = data.id
			item.objectType = 'user'
			let tagInfo = {}
			tagInfo.offset = this.inputComment.indexOf('@')
			tagInfo.length = data.displayName.length
			item.tagInfo = tagInfo
			this.tags.push(item)
			let substr = this.inputComment.slice(0,this.inputComment.indexOf('@'))
			this.inputComment = substr.concat(data.displayName)
		},
		download(id){
			commentApi.download(id)
		},
		downloadImg(){
			commentApi.download(this.idImg)
		},
		previewImage(item){
			this.dialog = true
			this.srcImg = item.serverPath
			this.idImg = item.id
		},
		reduce(content){
			let tags = this.item.tags
			if(tags.length == 1){
				let name = content.slice(tags[0].tagInfo.offset,tags[0].tagInfo.offset+tags[0].tagInfo.length)
				let span;
				span = `<span style="color:#e67e00">${name}</span>`
				let res = content.replace(name,span)
				content = res
			}else if(tags.length >1){
				let offSet = []
				let lengthTag = []
				let offSetOrigin = []
				tags.forEach(function(e){
					offSet.push(e.tagInfo.offset)
					offSet.push(e.tagInfo.offset + e.tagInfo.length )
					offSetOrigin.push(e.tagInfo.offset)
					lengthTag.push(e.tagInfo.length)
				})
				if(!offSet.includes(0)){
					offSet.unshift(0)	
				}
				offSet.push(lengthTag[lengthTag.length - 1]+offSet[offSet.length-1]+1)
				offSet.push(content.length)
				let arr = []
				for(let i =0 ; i< offSet.length-1;i++){
					let name = content.slice(offSet[i],offSet[i+1] )
					if(offSetOrigin.includes(offSet[i])){
						name = `<span style="color:#e67e00">${name}</span>`
					}
					arr.push(name)
				}
				content = arr.join(' ')
			}
			return content
		},
		cancel(){
			this.$emit('cancel-reply')
		},
		cancelComment(){
			this.$refs.menuTagUser.hide()
		},
		showError(){
			this.$snotify({
                type: 'error',
                title: "FILE UPLOAD ERROR",
                text: this.$t('notification.error')
            })
		},
		debounceAddCommnent: _.debounce(function(e){
			this.addComment()
		}, 200,this),
		addComment(){
			this.dataPostComment = this.sComment
			this.dataPostComment.content = this.inputComment
			this.dataPostComment.attachments = this.attachments
			this.dataPostComment.tags = this.tags
			let emptyCheck = this.dataPostComment.content.trim().length == 0 &&  this.dataPostComment.attachments.length == 0
			if(this.isAdd == true){
				if(emptyCheck == false){
					let data = JSON.stringify(this.dataPostComment)
					commentApi.addComment(data).then(res => {
						this.$store.commit('comment/updateParentCommentTarget',0)
						this.updateComment()
						this.inputComment = ''
						this.attachments = []
						this.tags = []
						this.$store.commit('comment/setWaitingCommentCountPerObj', this.sComment.objectType+':'+this.sComment.objectIdentifier);
					});
				}
			} else {
				if(emptyCheck == false){
					this.dataPostComment.id = this.item.id
					let dataEdit = JSON.stringify(this.dataPostComment)
					commentApi.editComment(dataEdit).then(res => {
						this.$store.commit('comment/updateParentCommentTarget',0)
						this.updateComment()
						this.attachments = []
						this.tags = []
					});
				}
			}
			this.$store.commit('comment/updateReplyStatus',false)
		},
		uploadInfo(data){
			if(typeof data === 'string'){
				alert(data)
			}else{
				this.attachments.push(data.id)
				if(data.type == 'jpg' || data.type == 'png' || data.type == 'jpeg' || data.type == 'jfif'){
					this.listImage.push(data)
					console.log(this.listImage,'this.listImage');
				}else{
					this.listFile.push(data)
				}
			}
		},
		updateComment(){
			if(this.sComment.uuid == "0"){
				commentApi.getCommentById(this.sComment.objectType,this.sComment.objectIdentifier).then(res => {
					this.$store.commit('comment/updateListAvtiveComment',this.addAvatar(res.data.listObject.comments))
					this.$store.commit('comment/updateListResolve',this.addAvatar(res.data.listObject.resolve))
					if(this.$store.state.comment.currentTab == 'comment'){
						this.$store.commit('comment/setComment')
					}else{
						this.$store.commit('comment/setResolve')
					}
				});
			}else{
				commentApi.getCommentByUuid(this.sComment.objectType,this.sComment.objectIdentifier,this.sComment.uuid).then(res => {
					this.$store.commit('comment/updateListAvtiveComment',this.addAvatar(res.data.listObject.comments))
					this.$store.commit('comment/updateListResolve',this.addAvatar(res.data.listObject.resolve))
					if(this.$store.state.comment.currentTab == 'comment'){
						this.$store.commit('comment/setComment')
					}else{
						this.$store.commit('comment/setResolve')
					}
				});
			}
		},
		chooseUserDown(){
			this.isSelectingUser = true
			this.$refs.menuTagUser.down()
		},
		chooseUserUp(){
			this.$refs.menuTagUser.up()
		},
		selectedUser(){
			this.$refs.menuTagUser.selectedUser()
			this.isSelectingUser = false
		},
		enterClick(){
			if(this.isSelectingUser == true){
				this.selectedUser()
			}else{
				this.debounceAddCommnent()
			}
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
	computed:{
		itemTags(){
			let resItem = []
			let item = {}
			let thisCpn = this
			this.$store.state.app.allUsers.forEach(function(e){
				item.value = e.id
				item.label = e.displayName
				resItem.push(item)
				item = {}
			});
			return resItem
		},
		sComment(){
			return this.$store.state.comment.commentTarget
		}
	},
	watch:{
		inputComment(val){
			if(val.includes('@')){
				this.keyWord = val.slice(val.indexOf('@')+1)
			}
		},
		contentEdit(val){
			if(val != ''){
				this.inputComment = val
			}
		},
		isEditing(val){
			if(val == true){
				if(this.item){
					 this.tags = this.item.tags 
				}
			}
		},
		images:{
			deep:true,
			immediate:true,
			handler(after){
				this.listImage = after;
			}
		},
		
		files:{
			deep:true,
			immediate:true,
			handler(after){
				this.listFile = after;
			}
		}
	}
}	
</script>

<style scoped>
.content-comment{
	display:flex;
	flex-direction: column;
	width: 100% !important;
	max-width: unset;
}
.content-comment >>> .v-icon{
	font-size:19px;	
}
.content-comment >>> .content-comment-img{
	display:flex;	
	width: 300px;
	margin-bottom:20px;
	margin-top:4px;
}
.content-comment >>> .commnet-img-item{
	width: 80px;
	height: 50px;
	margin: 0px 4px 0px 0px;
	display: flex;
    align-items: center;
}
.content-comment >>> .commnet-img-item .icon-remove-img{
	font-size: 13px;
	position:absolute !important;
	top: 0;
	right: 0;
}
.content-comment >>> .splide__arrow svg{
	width: 0.6em;
    height: 0.6em;
}
.content-comment >>> .content-comment-file{
	display: flex;
	flex-direction: column;


}
.content-comment >>> .content-comment-file .commnet-file-item{
	padding: 0px 0px 4px 0px;
	display: flex;
}
.content-comment >>> .content-comment-file .commnet-file-item .file-item-title{
	padding: 2px 0px 4px 4px;
	flex-grow: 1;
	cursor: pointer;
}
.content-comment >>> .content-comment-file .commnet-file-item .file-item-title:hover{
	color: #E88F15CC;
}
.content-comment >>> .content-comment-file .commnet-file-item .icon-remove-file{
	float: right;
	margin-right:8px
}
.content-comment >>>  .content-comment-input{
	padding: 0px 0px 4px 0px;
	width: 100%;
}
.content-comment >>>  .content-comment-input h5{
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 20;
	-webkit-box-orient: vertical;
	width:94%;
	font:13px roboto
}
.content-comment >>>  .v-tab{
	padding:0px 4px !important;	
}
.content-comment >>>  .v-slide-group__prev,
.content-comment >>>  .v-slide-group__next{
	min-width: unset;
}

.content-comment >>> .content-comment-file .v-icon{
	font-size: 13px;
}
.content-comment >>> .text-area-wrapper{
	display: flex;
	position: relative;
	background-color: #EEEEEE;
	width: 100% !important;
}
.content-comment .text-area-wrapper textarea:focus{
	outline: none;
}
.content-comment .text-area-wrapper textarea{
	padding: 8px;
}
.dialog-preview-image{
	overflow: hidden;
	z-index:1000;
	overflow-y:hidden
}
.preview-image-wrapper{
	overflow: auto; /* adds scrollbars */
    height: 800px;
    background-color: blue;
    position: relative;
}
.preview-image-wrapper .v-image{
	height: 200%; /* probably looks neater if auto */
    width: 200%; /* double width image to show only first quarter */
    vertical-align: bottom; 
}
</style>