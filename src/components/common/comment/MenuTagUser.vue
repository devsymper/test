<template>
   <v-card class="context-menu" v-show="isShowMenu" :style="{top:top+'px',left:left+'px'}">
			<div class="item" v-for="item in listUser" :key="item.name" @click="clickRow(item)">
				{{item.name}}
			</div>
   </v-card>
</template>
<script>
  export default {
	props:{
		keyWord:{
			type: String,
			default: ''
		}
	},
    data: () => ({
		isShowMenu:false,
		top:0,
		left:0,
		// listUser:[
		// 	{
		// 		id:1,
		// 		name:'anh dung ngo'
		// 	},
		// 	{
		// 		id:2,
		// 		name:'anh dung ngo2'
		// 	},
		// 	{
		// 		id:3,
		// 		name:'anh dung ngo3'
		// 	},
		// ]
	}),
	created(){
		// let self = this
	},
	computed:{
		listUser(){
			if(this.keyWord == ''){
				return [
					{
						id:1,
						name:'anh dung ngo'
					},
					{
						id:2,
						name:'anh dung ngo2'
					},
					{
						id:3,
						name:'anh dung ngo3'
					},
				]
			}
			else{
			}
		}
	},
	methods:{
		clickRow(item){
			this.$emit('selected-item',item)
			this.isShowMenu = false;
		},
		show(x,y){
			this.isShowMenu = true;
			this.top = y;
			this.left = x;
		},
	}
	}
</script>
<style scoped>
.context-menu{
	position: fixed;
	z-index: 10000;
	width: 170px;
	background-color: #fff;
}
.context-menu >>> .item{
	padding: 8px 10px;
	font-size: 13px;
	cursor: pointer;
	color: black;
	text-align: left;
}
.context-menu >>> .item:hover{
	background: lightsteelblue;
}
.context-menu >>> .v-icon {
	font-size: 13px;
}
 .mention-item {
  padding: 4px 10px;
  border-radius: 4px;
}

.mention-selected {
  background: rgb(192, 250, 153);
}
</style>