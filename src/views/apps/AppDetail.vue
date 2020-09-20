<template>
  <div class="app-details">
	  	 <VuePerfectScrollbar :style="{height: listItemHeight}">
			<div v-for="(itemT,i) in sAppModule" :key="i" class="app-item">
					<div class="title-app" v-if="itemT.item.length >0"><v-icon style="font-size:13px">{{itemT.icon}}</v-icon> <h4> {{ itemT.title }} <span> {{'('+itemT.item.length +')' }}</span> </h4></div>
					<ul v-for="(childItem,i) in itemT.item" :key="i"  class="app-child-item">
							<li  v-if="isEndUserCpn == true" 
								v-on:contextmenu="rightClickHandler($event,childItem,itemT.name)"
							>
								<div style="position:relative">
									<v-tooltip bottom v-if="itemT.name == 'document_definition'">
										<template v-slot:activator="{ on, attrs }">
											<div class="title-document-enduser" 	
												v-bind="attrs"
												v-on="on" >
												<span v-on:click="rightClickHandler($event,childItem,itemT.name)">{{childItem.title}}</span> 
												
											</div>
										</template>
										<span style="font:13px roboto">{{childItem.title}}</span> 
										<span style="font:8px;opacity:0.4">{{childItem.name}}</span>
									</v-tooltip>
									<div v-else v-on:click="rightClickHandler($event,childItem,itemT.name)">{{childItem.name}}</div>
									<v-icon  @click="changeFavorite(childItem,itemT.name)" :class="{'icon-star-active' : childItem.favorite==true, 'icon-star': true}" >mdi-star</v-icon>	
								</div>
							</li>
							<li v-else>
								<div style="position:relative">
									<v-tooltip bottom v-if="itemT.name == 'document_definition'">
									<template v-slot:activator="{ on, attrs }">
										<div class="title-document" 	
											v-bind="attrs"
											v-on="on" >
											<span>{{childItem.title}}</span> 
											<span style="font:10px;opacity:0.4">{{childItem.name}}</span>
										</div>
									</template>
										<span style="font:13px roboto">{{childItem.title}}</span> 
										<span style="font:8px;opacity:0.4">{{childItem.name}}</span>
									</v-tooltip>
									<div v-else>{{childItem.name}}</div>
									<v-icon  class="icon-remove"  @click="removeItem(childItem,itemT.name)">mdi-delete-empty-outline</v-icon>
								</div>
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
			
			
			currentSelected:null,
			typeSelected:null,
			objFilter:{
				document_definition: {
					icon: 'mdi-file-edit-outline',
					title: 'Documents',
					name: 'document_definition',
					item: [
					]
				},
				orgchart: {
					icon: 'mdi-widgets-outline',
					title: 'Orgcharts',
					name: 'orgchart',
					item: []
				},
				dashboard: {
					icon: 'mdi-view-dashboard',
					title: 'Reports',
					name: 'dashboard',
					item: []
				},
				workflow_definition: {
					icon: 'mdi-lan',
					title: 'Workflows',
					name: 'workflow_definition',
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
		},
		listItemHeight(){
			if(this.isMyApplication == true){
				return 'calc(100vh - 125px)'
			}else{
				return  'calc(100vh - 380px)'
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
		},
		isMyApplication:{
			type: Boolean,
			default: false
		}
    },
	methods:{
		removeItem(item,type){
			this.$store.commit('appConfig/removeItemSelected',{item:item,type:type})
		},
		setHeight(){
			this.listItemHeight = '400px'
		},
		filterItem(){
			let self = this
			let listItem = this.$store.state.appConfig.listItemSelected;
			self.objFilter.document_definition.item = []
			self.objFilter.orgchart.item = []
			self.objFilter.dashboard.item = []
			self.objFilter.workflow_definition.item = []
			if(listItem.document_definition.item.length > 0){
				listItem.document_definition.item.filter(function(item){
						if(item.title.toLowerCase().includes(self.searchKey.toLowerCase())){
							self.objFilter.document_definition.item.push(item)
						}
				})
			}
			if(listItem.orgchart.item.length > 0){
				listItem.orgchart.item.filter(function(item){
					if(item.name.toLowerCase().includes(self.searchKey.toLowerCase())){
						self.objFilter.orgchart.item.push(item)
					}
				})
			}
			if(listItem.dashboard.item.length > 0){
				listItem.dashboard.item.filter(function(item){
					if(item.name.toLowerCase().includes(self.searchKey.toLowerCase())){
						self.objFilter.dashboard.item.push(item)
					}
				})
			}
			if(listItem.workflow_definition.item.length > 0){
				listItem.workflow_definition.item.filter(function(item){
					if(item.name.toLowerCase().includes(self.searchKey.toLowerCase())){
						self.objFilter.workflow_definition.item.push(item)
					}
				})
			}
		},
		rightClickHandler(event,item,type){
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
			let userId = this.$store.state.app.endUserInfo.id
			if(item.objectIdentifier.includes("document_definition:")){
				item.id = item.objectIdentifier.replace("document_definition:","")
			}
			if(item.objectIdentifier.includes("orgchart:")){
				item.id = item.objectIdentifier.replace("orgchart:","")
			}
			if(item.objectIdentifier.includes("dashboard:")){
				item.id = item.objectIdentifier.replace("dashboard:","")
			}
			if(item.objectIdentifier.includes("workflow_definition:")){
				item.id = item.objectIdentifier.replace("workflow_definition:","")
			}
			if(item.favorite == false){
				appManagementApi.addFavoriteItem(userId,item.id,type,1).then(res => {
					if (res.status == 200) {
						this.$store.commit('appConfig/insertFavorite',item)
						item.favorite = true;
					}
				});
			}else{
				appManagementApi.addFavoriteItem(userId,item.id,type,0).then(res => {
					if (res.status == 200) {
						item.type = type;
						this.$store.commit('appConfig/delFavorite',item)
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
	font-weight: 500;
}
.app-details >>> .app-item .title-document{
	white-space: nowrap; 
	width: 450px; 
	overflow: hidden;
	text-overflow: ellipsis; 
}
.app-details >>> .app-item .title-document-enduser{
	white-space: nowrap; 
	width: 90%; 
	overflow: hidden;
	text-overflow: ellipsis; 
}
.app-details >>> .app-item .title-app h4{
	padding-left:8px;
	font-weight: unset;
}
.app-details >>> .app-item .app-child-item .v-icon{
	font-size:13px;
	float:right;
	line-height:unset;

}
.app-details >>> .app-item .app-child-item .icon-remove{
	 display: none;
	 position:absolute;
	 top:-2px;
	 right:0px;
}
.app-details >>> .app-item .app-child-item .icon-star{
	display: none;
	position:absolute;
	top:-2px;
	right:0px;
}
.app-details >>> .app-item .app-child-item .icon-star-active{
	color: #F6BE4F;
	display: inline-block;
	position:absolute;
	top:-2px;
	right:0px;
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
	display: inline-block;
}
</style>