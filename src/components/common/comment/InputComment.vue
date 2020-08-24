<template>
	<div class="content-comment">
		<div :v-if="attackmentsRender.images.length > 0" class="content-comment-img">
			<div  class="commnet-img-item" v-for="(item,i) in attackmentsRender.images" :key="i">
				<v-img
           			 src="https://taiwebs.com/upload/images/Img-Converter-2018.png"
         		>
				 <v-icon  v-if="isEditing == true" class="icon-remove-img"  @click="removeImage(item)">mdi-close-circle-outline</v-icon>
				</v-img> 
			</div>
		</div>	
		<div :v-if="attackmentsRender.files.length > 0" class="content-comment-file">
			<div class="commnet-file-item" v-for="(item,i) in attackmentsRender.files" :key="i">
				<v-icon>{{icon[item.type]}}</v-icon>
				<span class="file-item-title">{{item.name}}</span>
				<v-icon class="icon-remove-file" v-if="isEditing == true" @click="removeFile(item)">mdi-close-circle-outline</v-icon>
			</div>	
		</div>
		<div class="content-comment-input">
			<span v-if="isEditing == false" >
			<span>{{item.content}}</span>
			</span>
			 <!-- <v-text-field
				v-else
				clear-icon="mdi-close-circle"
				v-model="inputComment"
				clearable
				type="text"
				v-on:keyup.50="tagUser($event)"
				>
					<template slot="append">
						<v-icon>mdi-attachment</v-icon>
						<v-icon @click="addComment">mdi-send-circle-outline</v-icon>
					</template>
			</v-text-field> -->
			<div class="text-area-wrapper" v-else>
				 <Mentionable
					:keys="['@']"
					:items="itemsTag"
					offset="6"
					>
					<textarea v-model="inputComment" class="text-area">
					</textarea>
				</Mentionable>
				<UploadFile @uploaded-file="uploadInfo"/>
				<v-icon @click="addComment">mdi-send-circle-outline</v-icon>
			</div>
		</div>
		<MenuTagUser ref="menuTagUser" @selected-item="tagged" :keyWord="keyWord" />
	</div>
</template>
<script>
import MenuTagUser from './MenuTagUser.vue'
import { Mentionable } from 'vue-mention'
import At from 'vue-at'
import UploadFile from '@/components/common/UploadFile.vue'
export default {
	props:{
		isEditing:{
			type: Boolean,
			default: false
		},
		item:{
			type: Object
		},
	},
	components:{
		MenuTagUser,
		Mentionable,
		UploadFile
	},
	methods:{
		removeFile(item){
			this.attackmentsRender.files.splice(this.attackmentsRender.files.indexOf(item),1)
		},
		removeImage(item){
			this.attackmentsRender.images.splice(this.attackmentsRender.images.indexOf(item),1)
		},
		tagUser(event){
			let $target = $(event.target);
			var x = $target.offset().left;
     		var y = $target.offset().top + 23;
			this.$refs.menuTagUser.show(x,y);
		},
		tagged(data){
			let character = this.inputComment.charAt(this.inputComment.length - 1)
			let res = this.inputComment.replace(character,data.name);
			this.inputComment = res
		},
		addComment(){
			delete this.item.attackments;
			this.item.attackments = this.attackments
			this.item.isEditing = false;
			console.log(this.item);
		},
		uploadInfo(data){
			// if(typeof(data) == Object){
			// 	this.attackments.push(data);
			// 	if(data.type == 'png' || data.type == 'jqeg' || data.type == 'jgp'){
			// 		console.log('file anh');
			// 	}else{
			// 		console.log('file doc');
			// 	}
			// }else{
			// 	alert(data);
			// }
			if(typeof data === 'string'){
				alert(data)
			}else{
				if(data.type == 'jpg' || data.type == 'png' || data.type == 'jpeg'){
					this.attackmentsRender.images.push(data)
				}else{
					this.attackmentsRender.files.push(data)
				}
			}
		}
	},
	computed:{
		sEnduser(){
			return this.$store.state.app.endUserInfo
		}
	},
	data() {
		return {
			inputComment: '',
			keyWord: '',
			attackments:[],
			attackmentsRender:{
				images:[
				],
				files:[
				],
			},
			icon:{
				xlxs: 'mdi-file-excel-box',
				xls: 'mdi-file-excel-box',
				docx: 'mdi-file-word-box',
				doc: 'mdi-file-word-box',
				pdf: 'mdi-file-pdf-box',
				default: 'mdi-file'
			},
			itemsTag:[
				{
					value: 'cat',
					label: 'Mr Cat',
				},
				{
					value: 'dog',
					label: 'Mr Dog',
				},
			],
		}
	},
	watch:{
		inputComment(val){
			if(val.includes('@')){
				this.keyWord = val.slice(val.indexOf('@')+1)
			}
		}
	}
}	
</script>

<style scoped>
.content-comment{
	display:flex;
	flex-direction: column;
	width: 330px;
}
.content-comment >>> .v-icon{
	font-size:13px;	
}
.content-comment >>> .content-comment-img{
	display:flex;
}
.content-comment >>> .commnet-img-item{
	width: 40px;
	height: 40px;
	margin: 0px 4px 0px 0px;
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
	padding: 4px 0px;
	display: flex;
}
.content-comment >>> .content-comment-file .commnet-file-item .file-item-title{
	padding-left: 4px;
	flex-grow: 1;
	cursor: pointer;
}
.content-comment >>> .content-comment-file .commnet-file-item .file-item-title:hover{
	color: blue;
	border-bottom: 1px solid blue;
}
.content-comment >>> .content-comment-file .commnet-file-item .icon-remove-file{
	float: right;
}
.content-comment >>>  .content-comment-input{
	padding: 4px 0px;
}
.content-comment >>> .content-comment-file .v-icon{
	font-size: 13px;
}
.content-comment >>> .text-area-wrapper {
	display: flex;
	background-color: #f7f7f7;
}
.content-comment >>> .text-area-wrapper .mentionable {
	flex-grow: 1;
}
.content-comment >>> .text-area-wrapper .mentionable .text-area{
	width: 100%;
}
.content-comment >>> .text-area-wrapper .mention-item {
	padding: 4px 10px;
	border-radius: 4px;
}
.content-comment >>>  .text-area-wrapper .mention-selected {
  background: rgb(192, 250, 153);
}
</style>