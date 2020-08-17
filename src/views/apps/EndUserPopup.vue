<template>
  <div class="end-user-popup"> 
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
							{{$t('apps.title')}}
					</v-toolbar-title>
					<v-spacer></v-spacer>
				</v-app-bar>
					<div class="list-favorite">
						<div class="title-favorite"><v-icon >mdi-star</v-icon><h4>{{$t('apps.favorite')}}</h4></div>
						<ul style="margin:0 10px;">
							<VuePerfectScrollbar :style="{height: listFavoriteHeight}"  >
								<li v-for="(item,i) in listFavorite[0]" :key="i">{{item.name}}<v-icon color="yellow" style="float:right;font-size:13px">mdi-star</v-icon></li>
							</VuePerfectScrollbar>
						</ul>
					</div>
					<div class="title-list-app"> <v-icon>mdi-playlist-play</v-icon><h4>{{$t('apps.listApp')}}</h4></div>
					<div class="list-app-cointaner">
						<VuePerfectScrollbar :style="{height: listAppHeight}"  class="d-flex flex-wrap" >
							<div v-for="(item,i) in apps" :key="i" 
								class="list-app-item"
								@click="clickDetails(item)"
								>
								<v-icon>mdi-folder</v-icon>
								<h5>{{item.name}}</h5>
							</div>
						</VuePerfectScrollbar>	
					</div>
			</v-card>
        </v-tab-item>
        <v-tab-item
         value='tab-2'
        >
          <v-card flat class="tab-detail">
			  <v-card-title> <v-btn  @click="clickBack" icon><v-icon>mdi-keyboard-backspace</v-icon></v-btn> <v-icon>{{title.icon}}</v-icon> <h4>{{title.name}}</h4></v-card-title>
				<v-text-field
					:label="$t('apps.search')"
					single-line
					solo
					append-icon="mdi-magnify"
					v-model="searchKey"
				></v-text-field>
			  <AppDetail :isEndUserCpn="isEndUserCpn" :searchKey="searchKey" />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
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
export default {
	data: function() {
        return {
		 listAppHeight: '200px',
		 listFavoriteHeight:'150px',
		 tab: 'tab-1',
		 isEndUserCpn:true,
		 searchKey:"",
		 apps:{},
		 listFavorite:[],
		 arrType:{
			 document:[],
			 orgchart:[],
			 report:[],
			 workflow:[],
		 },
		 title:{
		 },
		 mapId:{
			 orgchart:{

			 },
			 document:{

			 },
			 report:{

			 },
			 workflow:{

			 }
		 },
		 }
	},
	created(){
		appManagementApi.getActiveApp().then(res => {
			if (res.status == 200) {
				this.apps = res.data.listObject
			}
			}).catch((err) => {
		});
		let userId = this.$store.state.app.endUserInfo.id
		appManagementApi.getItemFavorite(userId).then(res => {
			if (res.status == 200) {
				this.checkTypeFavorite(res.data.listObject)
			}
			}).catch((err) => {
		});
	},
	components: {
		VuePerfectScrollbar,
		AppDetail,
	},
	computed:{
		sAppManagement(){
			return this.$store.state.appConfig.listItemSelected
		}
	},
	methods:{
		clickDetails(item){
			this.title.icon = item.iconName;
			this.title.name = item.name;
			appManagementApi.getAppDetails(item.id).then(res => {
				if (res.status == 200) {
					this.checkChildrenApp(res.data.listObject.childrenApp)
				}
			}).catch((err) => {
			});
			this.tab = 'tab-2'
		},
		getDocumentsApi(dataDoc,type=''){
			documentApi.searchListDocuments(
					{
						search:'',
						pageSize:50,
						filter: [
						{
							column: 'id',
							valueFilter: {
								operation: 'IN',
								values: dataDoc						
							}
						}
						]
					}
				).then(resDoc => {
					if(type == 'listFavorite'){
						this.listFavorite.push(resDoc.data.listObject)
					}
					else{
						debugger
						this.$store.commit('appConfig/updateChildrenApps',{obj:resDoc.data.listObject,type:'documents'});
					}
				});
		},
		getOrgchartApi(dataOrg,type=''){
			orgchartApi.getOrgchartList({
								search:'',
								pageSize:50,
								filter: [
								{
									column: 'id',
									valueFilter: {
										operation: 'IN',
										values: dataOrg						
									}
								}
				]}).then(resOrg => {
					if(type == 'listFavorite'){
						this.listFavorite.push(resDoc.data.listObject)
					}
					else{
						this.$store.commit('appConfig/updateChildrenApps',{obj:resOrg.data.listObject,type:'orgcharts'});
					}
				});
		},
		getDashBoardApi(dataRep,type =''){
			dashboardApi.getDashboards({
								search:'',
								pageSize:50,
								filter: [
								{
									column: 'id',
									valueFilter: {
										operation: 'IN',
										values: dataRep						
									}
								}
				]}).then(resRp => {
					if(type == 'listFavorite'){
						this.listFavorite.push(resDoc.data.listObject)
					}
					else{
						this.$store.commit('appConfig/updateChildrenApps',{obj:resRp.data.listObject,type:'reports'});
					}
				});
		},
		getWorkFlowApi(dataW,type=''){
				BpmnEngine.getListModels({
								search:'',
								pageSize:50,
								filter: [
								{
									column: 'id',
									valueFilter: {
										operation: 'IN',
										values: dataW						
									}
								}
				]}).then(resW => {
					if(type == 'listFavorite'){
						this.listFavorite.push(resDoc.data.listObject)
					}
					else{
						this.$store.commit('appConfig/updateChildrenApps',{obj:resW.data.listObject,type:'workflows'});
					}
				});
		},
		checkTypeFavorite(data){
			let self = this
			data.forEach(function(e){
				if(e.objectType == 'document'){
					self.arrType.document.push(e.id)
				}
				if(e.objectType == 'orgchart'){
					self.arrType.orgchart.push(e.id)
				}
				if(e.objectType == 'report'){
					self.arrType.report.push(e.id)
				}
				if(e.objectType == 'workflow'){
					self.arrType.workflow.push(e.id)
				}
			});
			if(self.arrType.document.length > 0){
				let dataDoc = self.arrType.document
				this.getDocumentsApi(dataDoc,'listFavorite')
				console.log(this.listFavorite,'list favoriteeeeeeeeeeeee');
			}
			if(self.arrType.orgchart.length > 0){
				let dataOrg = self.arrType.orgchart
				this.getOrgchartApi(dataOrg,'listFavorite')
			}
			if(self.arrType.report.length > 0){
				let dataRep = self.arrType.report
				this.getDashBoardApi(dataRep,'listFavorite')
			}
			if(self.arrType.workflow.length > 0){
				let dataRep = self.arrType.workflow
				this.getWorkFlowApi(dataRep,'listFavorite')
			}
		},
		clickBack(){
			this.tab = 'tab-1'
		},
		checkChildrenApp(data){
			let self = this 
			if(data.hasOwnProperty('orgchart')){
				data.orgchart.forEach(function(e){
					self.arrType.orgchart.push(e.id);
					self.mapId.orgchart[e.id] = e;
				})
				let dataOrg = self.arrType.orgchart;
				this.getOrgchartApi(dataOrg)
				console.log(self.mapId,'mapId');
				console.log(this.sAppManagement,'dataStoredataStore');
				for( let [key,value] of Object.entries(self.mapId.orgchart)){
					console.log(key,value,'mapID');
					this.sAppManagement.orgcharts.item.forEach(function(item,index){
						console.log(item,index,'storeee');
						if(item.id == key){
							item.favorite = value.isFavorite
							debugger
						} 
					})
					console.log(this.sAppManagement.orgcharts.item);
					
				}
				// console.log(this.sAppManagement,'dataStoredataStore');
			}	
			if(data.hasOwnProperty('document')){
				data.document.forEach(function(e){
					self.arrType.document.push(e.id);
					self.mapId.document[e.id] = e;
				})
				let dataDoc = self.arrType.document
				this.getDocumentsApi(dataDoc);
				console.log(self.mapId,'mapId');
				console.log(this.sAppManagement,'dataStoredataStore');
			}
			if(data.hasOwnProperty('workflow')){
				data.workflow.forEach(function(e){
					self.arrType.workflow.push(e.id);
					self.mapId.workflow[e.id] = e;
				})
				let dataW = self.arrType.workflow
				this.getWorkFlowApi(data)
			}
			if(data.hasOwnProperty('report')){
				data.report.forEach(function(e){
					self.arrType.report.push(e.id);
					self.mapId.report[e.id] = e;
				})
				let dataRep = self.arrType.report
				this.getDashBoardApi(dataRep);
			}
		}
	}

}
</script>
<style scoped>
.end-user-popup {
	font: 13px Roboto;
	overflow: hidden;
}
.end-user-popup >>> .list-favorite ul{
	list-style: none;
}
.end-user-popup >>> .list-favorite li{
	padding: 5px 10px;
}
.end-user-popup >>> .title-favorite,
.end-user-popup >>> .title-list-app {
	display: flex;
	margin: 10px 15px;
}
.end-user-popup >>> .title-list-app {
	border-top: 1px solid lightgrey;
	padding-top: 8px;
}
.end-user-popup >>> .title-favorite .v-icon,
.end-user-popup >>> .title-list-app .v-icon{
	font-size: 13px;
	padding: 3px 8px ;
}
.end-user-popup >>> .title-favorite h4,
.end-user-popup >>> .title-list-app h4{
	padding-left: 2px;
	padding-top: 2px;
	font-weight: unset;
}
.end-user-popup >>> .list-app-cointaner{
	display: flex;
    flex-wrap: wrap;
	width: 350px;
	margin-right:auto;
	margin-left:auto;
}
.end-user-popup >>> .list-app-cointaner .list-app-item:hover{
	background-color: #f7f7f7;
	cursor: pointer;
}
.end-user-popup >>> .list-app-cointaner .list-app-item{
	display: flex;
	flex-direction: column;
	align-items: center;
	/* margin-right:8px; */
	/* margin-left:auto; */
	margin-bottom: 12px;
}
.end-user-popup >>> .list-app-cointaner .list-app-item .v-icon{
	font-size:60px;
	padding:10px
}
.end-user-popup >>> .list-app-cointaner .list-app-item h5{
	margin-top: -12px;
}
.end-user-popup >>> .tab-detail .v-card__title{
	font: 13px Roboto;
	padding: unset;
}
.end-user-popup >>> .tab-detail .v-card__title .v-icon{
	font-size: 13px;
}
.end-user-popup >>> .tab-detail .v-card__title h4{
	padding-left: 8px;
	font-size: 15px;
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