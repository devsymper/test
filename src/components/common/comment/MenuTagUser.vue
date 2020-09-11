<template>
   <v-card class="context-menu" v-show="isShowMenu" :style="{top:top+'px',left:left+'px'}">
	   <div  v-for="(item, idx) in listUser" :key="item.name" @click="clickRow(item)">
		   <div :class="{'active': idx == activeIndex,'item':true}">
					<SymperAvatar :size="25" :userId="item.id" />
					<span v-on:keyup.down="down"  v-on:keyup.up="up" v-on:keyup.enter="clickRow(item)" style="padding-left:8px"> {{item.displayName}}</span>
			</div>
	   </div>
			
   </v-card>
</template>
<script>
import SymperAvatar from '@/components/common/SymperAvatar.vue'
  export default {
	components:{
		SymperAvatar
	},
	props:{
		keyWord:{
			type: String,
			default: ''
		}
	},
	 data: function() {
        return {
            isShowMenu:false,
			top:0,
			left:0,
			activeIndex: 0,
			listUserFilter: [],
			itemSelected: null,
			listUserReduce:null,
        };
    },
	created(){
	},
	computed:{
		listUser(){
			if(this.keyWord == ''){
				 let data = this.$store.state.app.allUsers.slice(0,3)
				 return data
			}
			else{
				this.filterItem()
				return this.listUserFilter.slice(0,3)
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
			// this.activeIndex = 0
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
		},
		selectedUser(){
			this.$emit('selected-item',this.itemSelected)
			this.isShowMenu = false;
		},
		down(){
			// this.listUserReduce = this.listUser 
			// if(this.i>0){
			// 	this.listUser[this.i-1]['active'] = false
			// }
			// if(this.listUser.length-1 >= this.i){
			// 	this.listUser[this.i]['active'] = true
			// 	this.itemSelected = this.listUser[this.i]
			// 	this.i++;
			// }
			this.activeIndex = this.activeIndex == this.listUser.length ? 0 : (this.activeIndex + 1);
			this.itemSelected = this.listUser[this.activeIndex]
		},
		up(){
			this.activeIndex = this.activeIndex == this.listUser.length ? 0 : (this.activeIndex - 1);
			this.itemSelected = this.listUser[this.activeIndex]
		}


	},
	watch:{
	
	}
}
</script>
<style scoped>
.context-menu{
	position: fixed;
	z-index: 10000;
	width: 200px;
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
.context-menu >>> .active {
	background-color: #EEEEEE;
}
 .mention-item {
  padding: 4px 10px;
  border-radius: 4px;
}

.mention-selected {
  background: rgb(192, 250, 153);
}
</style>