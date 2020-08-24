<template>
	<div class="content-comment">
		<div :v-if="attackments.images.length > 0" class="content-comment-img">
			<div  class="commnet-img-item" v-for="(item,i) in attackments.images" :key="i">
				<v-img
           			 :src="item.src"
         		>
				 <v-icon  v-if="isEditting == true" class="icon-remove-img"  @click="removeImage(item)">mdi-close-circle-outline</v-icon>
				</v-img> 
			</div>
		</div>	
		<div :v-if="attackments.files.length > 0" class="content-comment-file">
			<div class="commnet-file-item" v-for="(item,i) in attackments.files" :key="i">
				<v-icon>{{icon[item.type]}}</v-icon>
				<span class="file-item-title">{{item.name}}</span>
				<v-icon class="icon-remove-file" v-if="isEditting == true" @click="removeFile(item)">mdi-close-circle-outline</v-icon>
			</div>	
		</div>
		<div class="content-comment-input">
			<span v-if="isEditting == false" >
			<span style="color:black">Đào Mạnh Khá</span> Lorem issum Lorem issum Lorem issum Lorem issum
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
				<v-icon>mdi-attachment</v-icon>
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
export default {
	props:{
		isEditting:{
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
	},
	methods:{
		removeFile(item){
			this.attackments.files.splice(this.attackments.files.indexOf(item),1)
		},
		removeImage(item){
			this.attackments.images.splice(this.attackments.images.indexOf(item),1)
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
			this.item.isEditting = false;
			console.log(this.item);
		}
	
	},
	data() {
		return {
			inputComment: '',
			keyWord: '',
			attackments:{
				images:[
					{
						id: 1,
						src: 'https://cdn.iconscout.com/icon/free/png-256/facebook-social-media-fb-logo-square-44659.png'
					},
					{
						id: 2,
						src: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Icon-notepad.svg'
					},
					{
						id: 3,
						src: 'https://cdn.iconscout.com/icon/free/png-256/facebook-social-media-fb-logo-square-44659.png'
					},
					{
						id: 4,
						src: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Icon-notepad.svg'
					},
				],
				files:[
					{
						id: 1,
						name: 'Quản lí thu chi',
						type:'xlxs'
					},
					{
						id: 1,
						name: 'Quản lí thu chi nữa nè',
						type:'docx'
					},
				],
			},
			icon:{
				xlxs: 'mdi-file-excel-box',
				xls: 'mdi-file-excel-box',
				docx: 'mdi-file-word-box',
				doc: 'mdi-file-word-box',
				pdf: 'mdi-file-pdf-box',
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
			 members: ['Roxie Miles', 'grace.carroll', '小浩']

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