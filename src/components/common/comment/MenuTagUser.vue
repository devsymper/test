<template>
   <v-card class="context-menu" v-show="isShowMenu" :style="{top:top+'px',left:left+'px'}">
			<div class="item" v-for="item in listUser" :key="item.name" @click="clickRow(item)">
				<div>
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
			listUserFilter: [],
        };
    },
	created(){
	},
	computed:{
		listUser(){
			if(this.keyWord == ''){
				return this.$store.state.app.allUsers.slice(0,3)
			}
			else{
				this.filterItem()
				return this.listUserFilter.slice(0,4)
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
		},
		chooseUser(){
		},
		down(){
			console.log('down');
		},
		up(){
			console.log('up');
		}


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
 .mention-item {
  padding: 4px 10px;
  border-radius: 4px;
}

.mention-selected {
  background: rgb(192, 250, 153);
}
</style>