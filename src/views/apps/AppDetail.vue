<template>
  <div class="app-details">
	  	 <VuePerfectScrollbar :style="{height: listItemHeight}">
			<div v-for="(itemT,i) in sAppModule" :key="i" class="app-item">
					<div class="title-app" v-if="itemT.item.length >0"><v-icon style="font-size:13px">{{itemT.icon}}</v-icon> <h4> {{ itemT.title }} <span> {{'('+itemT.item.length +')' }}</span> </h4></div>
					<ul v-for="(childItem,i) in itemT.item" :key="i"  class="app-child-item">
							<li v-on:contextmenu="rightClickHandler($event,childItem,itemT.name)">
								{{childItem.name}}
							<v-icon class="icon-star" v-if="isEndUserCpn == true">mdi-star</v-icon>	
							<v-icon v-else class="icon-remove"  @click="removeItem(childItem.id,itemT.name)">mdi-delete-circle</v-icon>
							</li>
					</ul>
			</div>	
		</VuePerfectScrollbar>
		<ContextMenu ref="contextMenu" />	
  </div>
</template>
<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import ContextMenu from './ContextMenu.vue';
import {appManagementApi} from './../../api/AppManagement.js'
export default {
 data: function() {
        return {
			listItemHeight: '400px',
			currentSelected:null,
			typeSelected:null,
			contextMenus:
			[
				{name:'Thêm bản ghi',icon:'mdi-backup-restore',
					callback: (item)=>{
						console.log(this.currentSelected,'cureenttttttttttttttttttttttttttt');
					}
				},
				{name:'Danh sách bản ghi',icon:'mdi-format-list-bulleted',
					callback: (item)=>{
						console.log(self.currentSelected);
					}
				},
				{name:'Yêu thích',icon:'mdi-star',
					callback: (item)=>{
						console.log(this.currentSelected);
						console.log(this.typeSelected);
						let userId = this.$store.state.app.endUserInfo.id
						console.log(userId);
						// appManagementApi.addFavoriteItem(userId,item)
					}
				},
				{name:'Import dữ liệu',icon:'mdi-file-outline',
					callback: (item)=>{
						console.log(item);
					}
				},
			],
			objFilter:{
				documents: {
					icon: 'mdi-file-document',
					title: 'Documents',
					name: 'documents',
					item: [
					]
				},
				orgcharts: {
					icon: 'mdi-view-dashboard',
					title: 'Orgcharts',
					name: 'orgcharts',
					item: []
				},
				reports: {
					icon: 'mdi-folder',
					title: 'Reports',
					name: 'reports',
					item: []
				},
				workflows: {
					icon: 'mdi-lan',
					title: 'Workflows',
					name: 'workflows',
					item: []
				},
			}
    	};
	},
	
	created(){
		let self = this
	},
	components:{
		ContextMenu,
		VuePerfectScrollbar
	},
	computed:{
		sAppModule(){
				if(this.searchKey == ""){
					return this.$store.state.appConfig.listItemSelected
				}
				else{
					let self = this
					let listItem = this.$store.state.appConfig.listItemSelected;
					self.objFilter.documents.item = []
					self.objFilter.orgcharts.item = []
					self.objFilter.reports.item = []
					self.objFilter.workflows.item = []
					if(listItem.documents.item.length > 0){
						 listItem.documents.item.filter(function(item){
							if(item.name.includes(self.searchKey)){
								self.objFilter.documents.item.push(item)
							}
						})
					}

					if(listItem.orgcharts.item.length > 0){
						 listItem.orgcharts.item.filter(function(item){
							if(item.name.includes(self.searchKey)){
								self.objFilter.orgcharts.item.push(item)
							}
						})
					}
					if(listItem.reports.item.length > 0){
						 listItem.reports.item.filter(function(item){
							if(item.name.includes(self.searchKey)){
								self.objFilter.reports.item.push(item)
							}
						})
					}
					if(listItem.workflows.item.length > 0){
						 listItem.workflows.item.filter(function(item){
							if(item.name.includes(self.searchKey)){
								self.objFilter.workflows.item.push(item)
							}
						})
					}
					return this.objFilter
				}
		}
	},
	props: {
        isEndUserCpn: {
            type: Boolean,
            default: false
		},
		searchKey:{
			type: String,
			default:"",
		}
    },
	methods:{
		removeItem(id,type){
			this.$store.commit('appConfig/removeItemSelected',{id:id,type:type})
		},
		rightClickHandler(event,item,type){
			this.currentSelected = item;
			this.typeSelected = type;

			event.stopPropagation();
			event.preventDefault();
			// debugger
			this.$refs.contextMenu.setContextItem(this.contextMenus)
			this.$refs.contextMenu.show(event)
		}, 	
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
.app-details >>> .app-item .app-child-item .v-icon{
	font-size:13px;
	float:right;
}
.app-details >>> .app-item .app-child-item .icon-remove{
	 display: none;
}
.app-details >>> .app-item .app-child-item .icon-star{
	color: yellow;
}
.app-details >>> .app-item li{
	cursor: pointer;
	padding: 8px 10px;
	margin-right: 10px;
}
.app-details >>> .app-item li:hover {
	background-color:#f7f7f7;
	border-radius: 5px;
}
.app-details >>> .app-item li:hover .icon-remove{
	background-color:#f7f7f7;
	border-radius: 10px;
	display: inline-block;
}
</style>