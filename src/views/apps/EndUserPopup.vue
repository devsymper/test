<template>
  <div class="end-user-popup"> 
	<v-card>
		<v-tabs
			v-model="tab"
			v-show="false"
		>
		</v-tabs>
      <!-- -->
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
								<li v-for="i in 10" :key="i">Document demo ne ahihi <v-icon color="yellow" style="float:right;font-size:13px">mdi-star</v-icon></li>
							</VuePerfectScrollbar>
						</ul>
					</div>
				
				<!-- <hr> -->
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
				></v-text-field>
			  <AppDetail :isEndUserCpn="isEndUserCpn" />
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
		//  sAppModule:{
		//  }
		 apps:{},
		 title:{
		 }

		 }
	},
	created(){
		appManagementApi.getActiveApp().then(res => {
			if (res.status == 200) {
				// debugger
				this.apps = res.data.listObject
				console.log(res.data.listObject,"resdataaaaaaaaaaaaaa");
			}
			}).catch((err) => {
		});
	},
	components: {
		VuePerfectScrollbar,
		AppDetail,
	},
	methods:{
		clickDetails(item){
			this.title.icon = item.iconName;
			this.title.name = item.name;
			appManagementApi.getAppDetails(item.id).then(res => {
			if (res.status == 200) {
				console.log(res.data.listObject,"resdataaaaaaaaaaaaaa");
				this.checkChildrenApp(res.data.listObject.childrenApp)
				// debugger
			}
			}).catch((err) => {
		});
			this.tab = 'tab-2'
		},
		clickBack(){
			this.tab = 'tab-1'
		},
		checkChildrenApp(data){
			if(data.hasOwnProperty('orgchart')){
						let dataOrg = data.orgchart;
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
							console.log(resOrg.data.listObject);
							this.$store.commit('appConfig/updateChildrenApps',{obj:resOrg.data.listObject,type:'orgcharts'});
						});
			}
			if(data.hasOwnProperty('document')){
						let dataDoc = data.document;
								
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
							this.$store.commit('appConfig/updateChildrenApps',{obj:resDoc.data.listObject,type:'documents'});
							
						});
			}
			if(data.hasOwnProperty('workflow')){
						let dataW = data.workflow;
						debugger
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
							this.$store.commit('appConfig/updateChildrenApps',{obj:resW.data.listObject,type:'workflows'});
							debugger
						});
			}
			if(data.hasOwnProperty('report')){
						let dataRep = data.report;
						dashboardApi.searchDashboard({
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
							this.$store.commit('appConfig/updateChildrenApps',{obj:resRp.data.listObject,type:'reports'});
						});
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
.end-user-popup >>> .title-list-app{
	display: flex;
	margin: 10px 15px;
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
	background-color: lightgray;
	cursor: pointer;
	
}
.end-user-popup >>> .list-app-cointaner .list-app-item{
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-right:auto;
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
    background-color: lightgray;
    min-height: unset;
    height: 30px;
	box-shadow: unset;
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