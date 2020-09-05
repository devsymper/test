<template>
	<div class="content-comment">
		<div v-if="images.length > 0"  class="content-comment-img">
			<div  class="commnet-img-item" v-for="(item,i) in images" :key="i">
				<v-img
           			 :src="item.serverPath"
					style="margin-top:auto;margin-bottom:auto;max-height:50px"
					@click="previewImage(item)"
         		>
					<v-icon  v-if="isEditing == true" class="icon-remove-img" @click="removeImage(item)">mdi-close-circle-outline</v-icon>
				</v-img> 
			</div>
		</div>
		<div v-if="files.length > 0" class="content-comment-file">
			<div class="commnet-file-item" v-for="(item,i) in files" :key="i">
				<v-icon>{{icon[item.type]}}</v-icon>
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
						v-on:keyup.enter="addComment"
						class="text-area"
						style="width:100%"
						v-on:keyup.down="chooseUser"
						>
					</textarea>
				<UploadFile style="position:absolute;right:16px;bottom: 0px;" @uploaded-file="uploadInfo" />
				<v-btn style="position:absolute;right: 0px;bottom: 0px;" icon @click="addComment">
					<v-icon >mdi-send-circle-outline</v-icon>
				</v-btn>
			</div>
		</div>
		<MenuTagUser ref="menuTagUser" @selected-item="tagged" :keyWord="keyWord" />
		 <v-dialog
			v-model="dialog"
			max-width="80%"
			max-height="80%"
			style="overflow-x: hidden"
		>
			<v-card>
				<v-icon @click="dialog = false" style="float:right">mdi-close</v-icon>
				<v-img
					:src="srcImg"
					style="width:100%;height:100%"
				>
				</v-img>		
			</v-card>
		</v-dialog>
	</div>
</template>
<script>
import MenuTagUser from './MenuTagUser.vue'
import UploadFile from '@/components/common/UploadFile.vue';
import {commentApi} from '@/api/Comment.js'
export default {
	data(){
		return {
			inputComment: '',
			keyWord: '',
			attachments:[],
			srcImg:'',
			dialog:false,	
			tags:[],
			icon:{
				xlxs: 'mdi-file-excel-box',
				xls: 'mdi-file-excel-box',
				docx: 'mdi-file-word-box',
				doc: 'mdi-file-word-box',
				pdf: 'mdi-file-pdf-box',
				default: 'mdi-file'
			},
			dataPostComment:{
			}
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
		}
	},
	components:{
		MenuTagUser,
		UploadFile
	},
	created(){
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
			let $target = $(event.target);
			var x = $target.offset().left;
     		var y = $target.offset().top+28;
			this.$refs.menuTagUser.show(x,y);
		},
		tagged(data){
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
		previewImage(item){
			this.dialog = true
			this.srcImg = item.serverPath
		},
		reduce(content){
			let tags = this.item.tags
			if(tags.length == 1){
				let name = content.slice(tags[0].tagInfo.offset,tags[0].tagInfo.offset+tags[0].tagInfo.length)
				let span;
				span = `<span style="color:red">${name}</span>`
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
					debugger
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
						name = `<span style="color:red">${name}</span>`
					}
					arr.push(name)
				}
				console.log(arr);
				content = arr.join(' ')
				debugger
			}
			return content
		},
		cancel(){
			this.$emit('cancel-reply')
		},
		addComment(){
			this.dataPostComment = this.sComment
			this.dataPostComment.content = this.inputComment
			this.dataPostComment.attachments = this.attachments
			this.dataPostComment.tags = this.tags
			if(this.isAdd == true){
				let data = JSON.stringify(this.dataPostComment)
				commentApi.addComment(data).then(res => {
					setTimeout(function(){}, 1000);
					this.$store.commit('comment/updateParentCommentTarget',0)
					this.updateComment()
					this.inputComment = ''
					this.attachments = []
				});
			}
			else{
				this.dataPostComment.id = this.item.id
				let dataEdit = JSON.stringify(this.dataPostComment)
				commentApi.editComment(dataEdit).then(res => {
					this.$store.commit('comment/updateParentCommentTarget',0)
					this.updateComment()
					this.attachments = []
				});
			}
			this.$store.commit('comment/updateReplyStatus',false)
		},
		uploadInfo(data){
			if(typeof data === 'string'){
				alert(data)
			}else{
				this.attachments.push(data.id)
				if(data.type == 'jpg' || data.type == 'png' || data.type == 'jpeg'){
					this.images.push(data)
				}else{
					this.files.push(data)
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
		chooseUser(){
			this.$refs.menuTagUser.chooseUser()
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
		}
	}
}	
</script>

<style scoped>
.content-comment{
	display:flex;
	flex-direction: column;
	width: 100% !important;
}
.content-comment >>> .v-icon{
	font-size:13px;	
}
.content-comment >>> .content-comment-img{
	display:flex;
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
	float: right;
	top:0px;
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
</style>