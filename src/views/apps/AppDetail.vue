<template>
  <div class="app-details">
	  	 <VuePerfectScrollbar :style="{height: listItemHeight}">
			<div v-for="(itemT,i) in sAppModule" :key="i" class="app-item">
					<div class="title-app" v-if="itemT.item.length >0"><v-icon style="font-size:13px">{{itemT.icon}}</v-icon> <h4> {{ itemT.title }} <span> {{'('+itemT.item.length +')' }}</span> </h4></div>
					<ul v-for="(childItem,i) in itemT.item" :key="i"  class="app-child-item">
							<li  v-if="isEndUserCpn == true" v-on:contextmenu="rightClickHandler($event,childItem,itemT.name)">
								<span v-if="itemT.name == 'documents'">{{childItem.title}} <span style="font:10px;opacity:0.4">{{childItem.name}}</span></span>
								<span v-else>{{childItem.name}}</span>
							<v-icon  @click="changeFavorite(childItem,itemT.name)" :class="{'icon-star-active' : childItem.favorite==true, 'icon-star': true}" >mdi-star</v-icon>	
							<!-- <v-icon  @click="changeFavorite(childItem,itemT.name,1)"  class="icon-star" >mdi-star</v-icon> -->
							<!-- <v-icon v-if="isEndUserCpn == false" class="icon-remove"  @click="removeItem(childItem.id,itemT.name)">mdi-delete-circle</v-icon> -->
							</li>
							<li v-else>
								<span v-if="itemT.name == 'documents'">{{childItem.title}} <span style="font:10px;opacity:0.4">{{childItem.name}}</span></span>
								<span v-else>{{childItem.name}}</span>
							<!-- <v-icon class="icon-star" v-if="isEndUserCpn == true && childItem.favorite==true">mdi-star</v-icon>	 -->
							<v-icon  class="icon-remove"  @click="removeItem(childItem,itemT.name)">mdi-delete-circle</v-icon>
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
	mounted(){
	//   let thisCpn = this;
	//  		// $(document).click(function(e){
	// 		// 	if(!$(e.target).is('.menu') && !$(e.target).is('.menuItem')){
	// 		// 		$('.menu').hide()		
	// 		// 	}
	// 		// });
	// 		$(document).click(function(e){
	// 			if(!$(e.target).is('.context-menu')){
	// 				thisCpn.$refs.contextMenu.hide()		
	// 			}
	// 		})
	// 		$(document).click(function(e){
	// 			if(!$(e.target).is('.context-menu')){
	// 				thisCpn.$refs.contextMenu.hide()		
	// 			}
	// 		})
  },
	computed:{
		sAppModule(){
				if(this.searchKey == ""){
					return this.$store.state.appConfig.listItemSelected
				}
				else{
					this.filterItem();
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
		removeItem(item,type){
			this.$store.commit('appConfig/removeItemSelected',{item:item,type:type})
			console.log(this.$store.state.appConfig.listItemSelected);
		},
		filterItem(){
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
		},
		rightClickHandler(event,item,type){
			// this.currentSelected = item;
			// this.typeSelected = type;
			event.stopPropagation();
			event.preventDefault();
			this.$refs.contextMenu.setContextItem(item.actions)
			this.$refs.contextMenu.show(event)
			this.$refs.contextMenu.setItem(item)
			this.$refs.contextMenu.setType(type)
		}, 
		hideContextMenu(){
			this.$refs.contextMenu.hide()
		},	
		changeFavorite(item,type){
			if(type == 'documents'){
				type = 'document'
			}
			if(type == 'orgcharts'){
				type = 'orgchart'
			}
			if(type == 'reports'){
				type = 'report'
			}
			if(type== 'workflows'){
				type = 'workflow'
			}
			let userId = this.$store.state.app.endUserInfo.id
			if(item.favorite == false){
				appManagementApi.addFavoriteItem(userId,item.id,type,1).then(res => {
					if (res.status == 200) {
						item.favorite = true;
					}
				});
			}else{
				appManagementApi.addFavoriteItem(userId,item.id,type,0).then(res => {
					if (res.status == 200) {
						item.favorite = false;
					}
				});
			}
				
			
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
	padding:8px 15px;
}
.app-details >>> .app-item .title-app h4{
	padding-left:8px;
	/* padding-top: -2px; */
	font-weight: unset;
}
.app-details >>> .app-item .app-child-item .v-icon{
	font-size:13px;
	float:right;
	/* padding-top: 2px; */
	line-height:unset;

}
.app-details >>> .app-item .app-child-item .icon-remove{
	 display: none;
}
.app-details >>> .app-item .app-child-item .icon-star{
	/* color: yellow; */
	display: none;
}
.app-details >>> .app-item .app-child-item .icon-star-active{
	color: yellow;
}
.app-details >>> .app-item li{
	cursor: pointer;
	padding:8px 12px;
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
.app-details >>> .app-item li:hover .icon-star{
	/* background-color:#f7f7f7; */
	/* border-radius: 10px; */
	display: inline-block;
}
</style>