<template>
  <div class="end-user-popup" > 
	<v-card> 
		<v-tabs
			v-model="tab"
			v-show="false"
		>
		</v-tabs>
       <v-tabs-items v-model="tab">
        <v-tab-item
         value='tab-1'
        >
         	<v-card >
				<v-app-bar dense flat color="white">
					<v-toolbar-title>
						<v-icon>mdi-apps</v-icon>
							<span class="tittle">{{$t('apps.title')}}</span>
					</v-toolbar-title>
					<v-spacer></v-spacer>
				</v-app-bar>
					<div class="list-favorite">
						<div class="title-favorite"><v-icon >mdi-playlist-star</v-icon><h4>{{$t('apps.favorite')}}</h4></div>
						  <v-skeleton-loader
						 		v-if="loadingFavorite == true"
								type="table-tbody"
								class="mx-auto"
								height="200"
							></v-skeleton-loader>
						<ul style="margin:0 10px;" v-else-if="loadingFavorite == false && sFavorite.length > 0">
							<VuePerfectScrollbar style="max-height:200px"  >
								<li v-for="(item,i) in sFavorite" :key="i" v-on:click="rightClickHandler($event,item,item.type)" v-on:contextmenu="rightClickHandler($event,item,item.type)" style="cursor:pointer"> 
									<div style="position:relative">
										<div v-if="item.type == 'document_definition'" class="title-item-favorite">{{item.title}}</div>
										<div v-else  class="title-item-favorite">{{item.name}}</div> 
										<v-icon  color="#F6BE4F" style="float:right;font-size:13px;position:absolute;top:0px;right:0px">mdi-star</v-icon>
									</div>
								</li>
							</VuePerfectScrollbar>
						</ul>
						<div v-else>
							<div style="padding-left:180px">
								<div style="margin-right:auto;margin-left:auto;opacity:0.3"> {{$t('apps.emptyFavorite')}} </div>
								<v-icon style="font-size:60px;padding-left:40px;margin-top:8px;opacity:0.3">
									mdi-star-off
								</v-icon>
								<!-- <v-img
								:src="urlEmptyApp">
								</v-img> -->
							</div>
						</div>
					</div>
					<div class="title-list-app"> <v-icon>mdi-playlist-play</v-icon><h4>{{$t('apps.listApp')}}</h4></div>
					<div class="list-app-cointaner">
						<v-skeleton-loader
						 		v-if="loadingApp == true"
								type="table-tbody"
								class="mx-auto"
								height="200"
						></v-skeleton-loader>
						<VuePerfectScrollbar v-else-if="loadingApp == false && apps.length > 0" style="max-height:330px"  class="d-flex flex-wrap" >
							<div  v-for="(item,i) in apps" :key="i" 
								class="list-app-item"
								@click="clickDetails(item)"
								>
								<div class="app-item-icon" searchKey
								>
									<v-icon v-if="item.iconType == 'icon'">{{item.iconName}}</v-icon>
									<img v-else-if="item.iconType == 'img'" :src="item.iconName" class="app-item-img"/>
									<v-icon v-else>mdi-star</v-icon>
								</div>
								  <v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
									<div class="app-active-title">
										<h5 v-bind="attrs"
										v-on="on">{{item.name}}</h5>
									</div>
									</template>
									<span>{{item.name}}</span>
								 </v-tooltip>
							</div>
							
						</VuePerfectScrollbar>	
						<div v-else>
							<div style="padding-left:150px">
								<div style="margin-right:auto;margin-left:auto;opacity:0.3"> {{$t('apps.emptyApp')}} </div>
								
								<v-img
								:src="urlEmptyApp" style="width:60px;height:60px;margin-left:38px;margin-bottom:12px;margin-top:8px">
								</v-img>
							</div>
						</div>
					</div>
			</v-card>
        </v-tab-item>
        <v-tab-item
         value='tab-2'
        >
          <v-card flat class="tab-detail">
			  <v-card-title> <v-btn  @click="clickBack" icon><v-icon class="tab-detail-icon-title">mdi-keyboard-backspace</v-icon></v-btn> <v-icon v-if="title.iconType == 'icon'">{{title.iconName}}</v-icon> <img v-else :src="title.iconName" style="width:20px;height:20px"> <h4>{{title.name}}</h4></v-card-title>
				<v-text-field
					:label="$t('apps.search')"
					single-line
					solo
					append-icon="mdi-magnify"
					v-model="searchKey"
				></v-text-field>
			  <AppDetail ref="appDetails" :isEndUserCpn="isEndUserCpn" :searchKey="searchKey" />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
	<ContextMenu ref="contextMenu" />
  </div>
</template>
<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import AppDetail from './AppDetail.vue';
import {appManagementApi} from './../../api/AppManagement.js';
import {documentApi} from './../../api/Document';
import {orgchartApi} from './../../api/orgchart';
import {dashboardApi} from './../../api/dashboard';
import BpmnEngine from './../../api/BPMNEngine';
import ContextMenu from './ContextMenu.vue'
import emptyApp from "@/assets/image/empty_app.png";
export default {
	data: function() {
        return {
		 listAppHeight: '200px',
		 listFavoriteHeight:'100%',
		 tab: 'tab-1',
		 isEndUserCpn:true,
		 searchKey:"",
		 apps:{},
		 listFavorite:[],
		 testListFavorite:[],
		 loadingFavorite: true,
		 loadingApp: true,
		 urlEmptyApp: emptyApp,
		 arrType:{
			 document_definition:[],
			 orgchart:[],
			 dashboard:[],
			 workflow_definition:[],
		 },
		 title:{
		 },
		 mapId:{
			 orgchart:{
			 },
			 document_definition:{
			 },
			 dashboard:{
			 },
			 workflow_definition:{
			 }
		 },
		 mapIdFavorite:{
			 orgchart:{
			 },
			 document_definition:{
			 },
			 dashboard:{
			 },
			 workflow_definition:{
			 }
		 },
		 }
	},
	created(){
            this.getActiveapps()
			this.getFavorite()
	},
	mounted(){
		 let thisCpn = this;
	 		$(document).click(function(e){
				if(!$(e.target).is('.menu') && !$(e.target).is('.menuItem')){
					$('.menu').hide()		
				}
			});
			$(document).click(function(e){
				if(!$(e.target).is('.context-menu')){
					$(".context-menu").css("display", "none")
					if(thisCpn.tab == 'tab-1'){
						thisCpn.$refs.contextMenu.hide()
					}else{
						thisCpn.$refs.appDetails.hideContextMenu()		
					}
				}
			})
	},
	components: {
		VuePerfectScrollbar,
		AppDetail,
		ContextMenu
	},
	computed:{
		sAppManagement(){
			return this.$store.state.appConfig.listItemSelected
		},
		sFavorite(){
			return this.$store.state.appConfig.listFavorite
		},
		listApp(){
            return this.$store.state.appConfig.listApps
		},
		showPopup(){
			 return this.$store.state.appConfig.showPopup
		}
		
	},
	
	methods:{
		getActiveapps(){
			appManagementApi.getActiveApp().then(res => {
				this.loadingApp = false
				if (res.status == 200) {
					this.apps = res.data.listObject
					// this.$store.commit('appConfig/setListApps', res.data.listObject)
				}
			}).catch((err) => {
			});
		},
		getFavorite(){
			this.listFavorite= []
			let self = this 
			let userId = this.$store.state.app.endUserInfo.id
			appManagementApi.getItemFavorite(userId).then(res =>{
				if (res.status == 200) {
					res.data.listObject.forEach(function(e){
						if(e.objectType == 'document_definition'){
							self.mapIdFavorite.document_definition["document_definition:"+e.objectIdentifier] = e
						}  
						if(e.objectType == 'orgchart'){
							self.mapIdFavorite.orgchart["orgchart:"+e.objectIdentifier] = e
						}  
						if(e.objectType == 'workflow_definition'){
							self.mapIdFavorite.workflow_definition["workflow_definition:"+e.objectIdentifier] = e
						}  
						if(e.objectType == 'dashboard'){
							self.mapIdFavorite.dashboard["dashboard:"+e.objectIdentifier] = e
						}  
					})
					this.checkTypeFavorite(res.data.listObject)
					this.$store.commit('appConfig/updateListFavorite',this.listFavorite)
					this.loadingFavorite = false
				}
			}).catch((err) => {
			});
		},
		clickDetails(item){
			this.$refs.contextMenu.hide()
			this.$store.commit('appConfig/emptyItemSelected')
			this.title.iconName = item.iconName;
			this.title.iconType = item.iconType;
			this.title.name = item.name;
			this.$store.commit("appConfig/updateCurrentAppId",item.id);
			appManagementApi.getAppDetails(item.id).then(res => {
				if (res.status == 200) {
					if(Object.keys(res.data.listObject.childrenApp).length > 0){
						this.checkChildrenApp(res.data.listObject.childrenApp)
					}else{
						this.$store.commit('appConfig/emptyItemSelected')
					}
				}
			}).catch((err) => {
			});
			this.tab = 'tab-2'
		},
		checkTypeFavorite(data){
			let self = this
			self.arrType.document_definition = []
			self.arrType.orgchart = []
			self.arrType.dashboard = []
			self.arrType.workflow_definition = []
			data.forEach(function(e){
				if(e.objectType == 'document_definition'){
					self.arrType.document_definition.push("document_definition:"+e.objectIdentifier)
				}
				if(e.objectType == 'orgchart'){
					self.arrType.orgchart.push("orgchart:"+e.objectIdentifier)
				}
				if(e.objectType == 'dashboard'){
					self.arrType.dashboard.push("dashboard:"+e.objectIdentifier)
				}
				if(e.objectType == 'workflow_definition'){
					self.arrType.workflow_definition.push("workflow_definition:"+e.objectIdentifier)
				}
			});
			if(self.arrType.document_definition.length > 0){
				let dataDoc = self.arrType.document_definition
				this.getFavoriteByAccessControl(dataDoc,'document_definition')
			}
			if(self.arrType.orgchart.length > 0){
				let dataOrg = self.arrType.orgchart
				this.getFavoriteByAccessControl(dataOrg,'orgchart')
			}
			if(self.arrType.dashboard.length > 0){
				let dataRep = self.arrType.dashboard
				this.getFavoriteByAccessControl(dataRep,'dashboard')
			}
			if(self.arrType.workflow_definition.length > 0){
				let dataW = self.arrType.workflow_definition
				this.getFavoriteByAccessControl(dataW,'workflow_definition')
			}
		},
		clickBack(){
			this.tab = 'tab-1'
			this.$refs.contextMenu.hide()
			this.getActiveapps()
		},
		updateFavoriteItem(mapArray,array){
			for( let [key,value] of Object.entries(mapArray)){
				array.forEach(function(item){
					if(item.objectIdentifier == key){
						item.favorite = value.isFavorite
						item.actions = value.actions
					} 
				})
			}
			return array
		},
		updateActionItem(mapArray,array,type){
			for( let [key,value] of Object.entries(mapArray)){
				array.forEach(function(item){
					if(item.objectIdentifier == key){
						item.favorite = 1
						item.actions = value.actions
						item.type = type
					} 
				})
			}
			return array
		},
		rightClickHandler(event,item,type){
			event.stopPropagation();
			event.preventDefault();
			if(!item.actions.includes('unfavorite')){
				item.actions.push('unfavorite')
			}
			this.$refs.contextMenu.setContextItem([...new Set(item.actions)])
			this.$refs.contextMenu.show(event)
			this.$refs.contextMenu.setItem(item)
			this.$refs.contextMenu.setType(type)
		},
		checkChildrenApp(data){
			let self = this 
			self.arrType.orgchart = []
			self.arrType.document_definition = []
			self.arrType.dashboard = []
			self.arrType.workflow_definition = []
			if(data.hasOwnProperty('orgchart')){
				data.orgchart.forEach(function(e){
					self.arrType.orgchart.push("orgchart:"+e.id);
					self.mapId.orgchart["orgchart:"+e.id] = e;
				})
				let dataOrg = self.arrType.orgchart;
				this.getByAccessControl(dataOrg,'orgchart')
			}
			if(data.hasOwnProperty('document_definition')){
				data.document_definition.forEach(function(e){
					self.arrType.document_definition.push("document_definition:"+e.id);
					self.mapId.document_definition["document_definition:"+e.id] = e;
				})
				let dataDoc = self.arrType.document_definition
				this.getByAccessControl(dataDoc,'document_definition')
			}
			if(data.hasOwnProperty('workflow_definition')){
				data.workflow_definition.forEach(function(e){
					self.arrType.workflow_definition.push("workflow_definition:"+e.id);
					self.mapId.workflow_definition["workflow_definition:"+e.id] = e;
				})
				let dataW = self.arrType.workflow_definition
				this.getByAccessControl(dataW,'workflow_definition')
			}
			if(data.hasOwnProperty('dashboard')){
				data.dashboard.forEach(function(e){
					self.arrType.dashboard.push("dashboard:"+e.id);
					self.mapId.dashboard["dashboard:"+e.id] = e;
				})
				let dataRep = self.arrType.dashboard
				this.getByAccessControl(dataRep,'dashboard')
			}
		},
		getByAccessControl(ids,type){
			let self = this
			appManagementApi.getListObjectIdentifier({
				pageSize:50,
				ids: ids
			}).then(res=>{
				if(type == 'orgchart'){
					this.updateFavoriteItem(self.mapId.orgchart,res.data)
					this.$store.commit('appConfig/updateChildrenApps',{obj:res.data,type:'orgchart'});
				}
				if(type == 'document_definition'){
					this.updateFavoriteItem(self.mapId.document_definition,res.data)
					let arrCategory = []
					let arrMajor = []
					res.data.forEach(function(e){
						if(e.objectType == "1"){
							arrMajor.push(e)
						}else if(e.objectType == "2"){
							arrCategory.push(e)
						}
					})
					this.$store.commit('appConfig/updateChildrenApps',{obj:arrMajor,type:'document_major'});
					this.$store.commit('appConfig/updateChildrenApps',{obj:arrCategory,type:'document_category'});
				}
				if(type == 'workflow_definition'){
					this.updateFavoriteItem(self.mapId.workflow_definition,res.data)
					this.$store.commit('appConfig/updateChildrenApps',{obj:res.data,type:'workflow_definition'});
				}
				if(type == 'dashboard'){
					this.updateFavoriteItem(self.mapId.dashboard,res.data)
					this.$store.commit('appConfig/updateChildrenApps',{obj:res.data,type:'dashboard'});
				}
			}).catch(err=>{
			})
		},
		getFavoriteByAccessControl(ids,type){
			let self = this
			appManagementApi.getListObjectIdentifier({
				pageSize:50,
				ids: ids
			}).then(res=>{
				if(type == 'orgchart'){
					if(res.data.length > 0){
						this.updateActionItem(self.mapIdFavorite.orgchart,res.data,'orgchart')
						res.data.forEach(function(e){
							self.listFavorite.push(e)
						})
					}
				}
				if(type == 'document_definition'){
						if(res.data.length > 0){
						this.updateActionItem(self.mapIdFavorite.document_definition,res.data,'document_definition')
						res.data.forEach(function(e){
							self.listFavorite.push(e)
						})
					}
				}
				if(type == 'workflow_definition'){
					if(res.data.length > 0){
						this.updateActionItem(self.mapIdFavorite.workflow_definition,res.data,'workflow_definition')
						res.data.forEach(function(e){
							self.listFavorite.push(e)
						})
					}
				}
				if(type == 'dashboard'){
					if(res.data.length > 0){
						this.updateActionItem(self.mapIdFavorite.dashboard,res.data,'dashboard')
						res.data.forEach(function(e){
							self.listFavorite.push(e)
						})
					}
				}
			}).catch(err=>{
			})
		}
	}

}
</script>
<style scoped>
.v-menu__content{
	z-index:1000
}
.end-user-popup {
	font: 13px Roboto;
	overflow: hidden;
	width:500px;
}
.end-user-popup >>> .tittle{
	font: 15px Roboto;
	padding-left:8px;
	font-weight:400

}
.end-user-popup >>> .list-favorite ul{
	list-style: none;
}
.end-user-popup >>> .list-favorite .title-item-favorite{
	white-space: nowrap; 
	width: 410px; 
	overflow: hidden;
	text-overflow: ellipsis; 
	
}
.end-user-popup >>> .list-favorite li{
	padding: 5px 10px;
}
.end-user-popup >>> .title-favorite,
.end-user-popup >>> .title-list-app {
	display: flex;
	margin: 8px 15px;
}
.end-user-popup >>> .title-list-app {
	padding-top: 8px;
}
.end-user-popup >>> .title-list-app .app-active-title{
	display: flex;
}
.end-user-popup >>> .title-favorite .v-icon
{
	font-size: 15px;
	padding: 0px 8px ;
}
.end-user-popup >>> .title-list-app .v-icon{
	font-size: 13px;
	padding: 0px 8px ;
}
.end-user-popup >>> .title-favorite h4,
.end-user-popup >>> .title-list-app h4{
	padding-left: 2px;
	font-weight: unset;
}
.end-user-popup >>> .list-app-cointaner{
	display: flex;
    flex-wrap: wrap;
	width: 460px;
	margin-right:auto;
	margin-left: 30px;
}
.end-user-popup >>> .list-app-cointaner .ps__rail-x{
}
.end-user-popup >>> .list-app-cointaner .list-app-item:hover{
	background-color: #f7f7f7;
	cursor: pointer;
}
.end-user-popup >>> .list-app-cointaner .list-app-item{
	display: flex;
	flex-direction: column;
	align-items: center;
	padding:0px 8px;
	margin-bottom: 12px;
}
.end-user-popup >>> .list-app-cointaner .list-app-item .app-item-icon { 
	
	width: 70px;
}
.end-user-popup >>> .list-app-cointaner .list-app-item .app-item-icon .v-icon { 
	font-size:45px;
}
.end-user-popup >>> .list-app-cointaner .list-app-item .app-item-icon .app-item-img{
	 width:40px;
	 height:40px;
	 margin:12px 8px 14px 16px;
	 /* padding: 4px; */
	 /* margin:13px 5px 0px 5px;padding:4px */
}
.end-user-popup >>> .list-app-cointaner .list-app-item .v-icon{
	font-size:45px;
	padding:12px;
	opacity: 0.7;
}
/* .end-user-popup >>> .list-app-cointaner .list-app-item .v-icon {

} */
.end-user-popup >>> .list-app-cointaner .list-app-item h5{
	margin-top: -12px;
	font: 13px roboto;
	font-weight: 400;
	width: 70px; 
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	text-align: center;
}
.end-user-popup >>> .list-app-cointaner .list-app-item {
	padding-top: 2px;
}
.end-user-popup >>> .tab-detail .v-card__title{
	font: 13px Roboto;
	padding: unset;
}
.end-user-popup >>> .tab-detail .v-card__title .v-icon{
	font-size: 13px;
}
.end-user-popup >>> .tab-detail .v-card__title .v-icon .tab-detail-icon-title{
	padding-top: 2px;
}
.end-user-popup >>> .tab-detail .v-card__title h4{
	padding-left: 8px;
	/* font-size: 15px; */
	font: 15px roboto;
	font-weight: 400;
}
.end-user-popup >>> .tab-detail .v-input__control{
	text-shadow: unset;
	margin: 0px 6px;
}
.end-user-popup >>> .tab-detail .v-input__control .v-input__slot{
    background-color: #f7f7f7;
    min-height: unset;
    height: 30px;
	box-shadow: unset;
	margin: 8px;
	width: unset;
}
.end-user-popup >>> .tab-detail .v-input__control .v-input__slot .v-label{
    font: 12px Roboto !important;
	padding-top:2px
}
.end-user-popup >>> .tab-detail .v-input__control .v-icon{
	font-size:13px
}
.end-user-popup >>> .tab-detail .v-input__control .v-text-field__details{
	display: none;
}
</style>