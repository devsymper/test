<template>
   <v-card class="context-menu" v-show="isShowContext" :style="{top:top+'px',left:left+'px'}">
			<div class="item" v-for="item in contextMenu" :key="item.name" @click="clickRow(item)">
				<v-icon> {{item.icon}} </v-icon> {{item.name}}
			</div>
   </v-card>
</template>
<script>
  export default {
    data: () => ({
		isShowContext:false,
		top:0,
		left:0,
		contextMenu:[],
	}),
	created(){
		let self = this
	},
	methods:{
		clickRow(item){
			item.callback(item);
			// debugger
		},
		show(e){
			this.isShowContext = true;
			// debugger
			this.calPosition(e);
		},
		hide(){
			this.isShowContext = false;
		},
		calPosition(event){
			// debugger
			this.top = event.pageY;
			this.left = event.pageX-200;
		},
		setContextItem(ctx){
			this.contextMenu = ctx;
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
	background: lightsteelblue;
}
.context-menu >>> .v-icon {
	font-size: 13px;
}
</style>