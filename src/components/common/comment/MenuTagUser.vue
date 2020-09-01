<template>
   <v-card class="context-menu" v-show="isShowMenu" :style="{top:top+'px',left:left+'px'}">
			<div class="item" v-for="item in listUser" :key="item.name" @click="clickRow(item)">
				{{item.displayName}}
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
		listUserFilter: [],
	}),
	created(){
		// let self = this
	},
	computed:{
		listUser(){
			if(this.keyWord == ''){
				return this.$store.state.app.allUsers
			}
			else{
				this.filterItem()
				return this.listUserFilter
			}
		},
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
		filterItem(){
			let self = this	
			self.listUserFilter = []
			let data = this.$store.state.app.allUsers
			if(data.length > 0){
				data.filter(function(item){
					if(item.displayName.toLowerCase().includes(self.keyWord.toLowerCase())){
						self.listUserFilter.push(item)
					}
				})
			}
		}
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
	background: #f7f7f7;
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