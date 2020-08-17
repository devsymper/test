<template>
  <div class="app-details">
	  	 <VuePerfectScrollbar :style="{height: menuItemsHeight}">
			<div v-for="(itemT,i) in sAppModule.listItemSelected" :key="i" class="app-item">
					<div class="title-app" v-if="itemT.item.length >0"><v-icon style="font-size:13px">{{itemT.icon}}</v-icon> <h4> {{ itemT.title }} <span> {{'('+itemT.item.length +')' }}</span> </h4></div>
					<ul v-for="(childItem,i) in itemT.item" :key="i"  class="app-child-item">
							<li v-on:contextmenu="rightClickHandler($event)">
								{{childItem.name}}
							<v-icon class="icon-remove" v-if="isEndUserCpn == true">mdi-star</v-icon>	
							<v-icon v-else class="icon-remove"  @click="removeItem(childItem.id,itemT.name)">mdi-delete-circle</v-icon>
							</li>
					</ul>
			</div>	
		</VuePerfectScrollbar>
		<context-menu ref="contextMenu"></context-menu>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import ContextMenu from './ContextMenu.vue';
export default {
	components:{
		'context-menu': ContextMenu,
	},
 data: function() {
        return {
			menuItemsHeight: '100%',
			contextMenus:
			[
				{name:'Thêm bản ghi',icon:'mdi-backup-restore',
					callback: (item)=>{
						
						}
				},
				{name:'Danh sách bản ghi',icon:'mdi-delete',
					callback: (item)=>{
						
					}
				},
				{name:'Yêu thích',icon:'mdi-delete',
					callback: (item)=>{
						
					}
				},
				{name:'Import dữ liệu',icon:'mdi-delete',
					callback: (item)=>{
						
					}
				},
			],
    	};
	},
	
	created(){
	},
	computed:{
		sAppModule(){
			return this.$store.state.appConfig
		}
	},
	props: {
        isEndUserCpn: {
            type: Boolean,
            default: false
        }
    },
	methods:{
		removeItem(id,type){
			this.$store.commit('appConfig/removeItemSelected',{id:id,type:type})
		},
		rightClickHandler(event){
			// this.currentSelected = item;
			event.stopPropagation();
			event.preventDefault();
			debugger
			this.$refs.contextMenu.setContextItem(this.contextMenus)
			this.$refs.contextMenu.show(event)
		}, 	
	},
	components: {
        VuePerfectScrollbar,
	},
}
</script>

<style scoped>
.app-details{
	font: 13px roboto;
}
.app-details >>> .app-item ul{
	list-style: none;
}
.app-details >>> .app-item .title-app{
	display: flex;
	cursor: pointer;
	padding:10px 15px;
	
}
.app-details >>> .app-item .title-app h4{
	padding-left:8px;
	font-weight: unset;
}
.app-details >>> .app-item .app-child-item .icon-remove{
	font-size:13px;
	float:right;
	padding-top:2px;
}
.app-details >>> .app-item li{
	cursor: pointer;
	padding: 8px;
	margin-right: 10px;
}
.app-details >>> .app-item li:hover{
	background-color:lightgray;
}
</style>