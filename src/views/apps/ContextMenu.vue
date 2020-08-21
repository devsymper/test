<template>
   <v-card class="context-menu" v-show="isShowContext" :style="{top:top+'px',left:left+'px'}">
		<div class="item" v-for="(action,i) in listAction" :key="i" @click="clickAction(action)">
				{{action}}
		</div>
   </v-card>
</template>
<script>
  export default {
    data: () => ({
		isShowContext:false,
		top:0,
		left:0,
		listAction:[],
		targetItem:{},
		type:'',
		defineAction:{
			documents:{
				 "module": "document",
  				 "resource": "document_definition",
				 "scope": "document",
			},
			workflows:{
				"module": "workflow",
				"resource": "workflow_definition",
				"scope": "workflow",
			},
			reports:{
				"module": "dashboard",
				"resource": "dashboard",
				"scope": "dashboard",
			},
			orgcharts:{
				 "module": "orgchart",
				 "resource": "orgchart",
				 "scope": "orgchart",
			},
		}
	}),
	created(){
		let self = this
	},
	methods:{
		clickRow(item){
			item.callback(item);
		},
		show(e){
			this.isShowContext = true;
			this.top = event.pageY;
			this.left = event.pageX;
			$('#symper-app').append(this.$el);
			// this.calPosition(e)
		},
		hide(){
			this.isShowContext = false;
		},
		calPosition(event){
				
		},
		setContextItem(ctx){
			this.listAction = ctx;
		},
		setItem(item){
			this.targetItem = item
		},
		setType(type){
			this.type = type
		},
		clickAction(action){
			this.defineAction[this.type].action = action;
			console.log(this.defineAction[this.type]);
			console.log(this.targetItem);
			let targetItem = this.targetItem
			this.$evtBus.$emit('symper-app-call-action-handler', this.defineAction[this.type], this, {id:targetItem.id,name:targetItem.name,title:targetItem.title});

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
</style>