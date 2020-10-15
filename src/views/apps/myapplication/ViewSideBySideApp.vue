<template>
   <div class="view-side-by-side-apps h-100">
       <div class="list-apps h-100">
				 <h4>Ứng dụng</h4>
				<v-btn icon tile style="position:absolute;top:2px;right:6px;font-size:13px" >
					<v-icon @click="changeView" style="font-size:13px" >mdi-page-previous-outline</v-icon>  
				</v-btn>
            <div style="margin:20px 0px 0px 0px">
                <div :class="{'favorite-area': true , 'active': showFavorite == true}" @click="showListFavorite">
                    <v-icon style="font-size:16px" color="#F6BE4F"> mdi-star</v-icon>
                    <span style="font:13px roboto;padding-left:8px">Yêu thích</span>
                </div>
				<VuePerfectScrollbar :style="{height:heightListApp}"  >
					<div v-for="(item,i) in listApp" :key="i" 
						:class="{'list-app-item': true,'active': item.id == activeIndex}"
						@click="clickDetails(item)"
						>
							<v-icon v-if="item.iconType == 'icon'" style="font-size:16px">{{item.iconName}}</v-icon>
							<img v-else-if="item.iconType == 'img'" :src="item.iconName" class="app-item-img"/>
						<v-tooltip bottom>
							<template v-slot:activator="{ on, attrs }">
								<div v-bind="attrs" class="title-app-sbs"
								v-on="on">{{item.name}}</div>
							</template>
							<span>{{item.name}}</span>
						</v-tooltip>
					</div>
				</VuePerfectScrollbar>

            </div>
       </div>
       <div class="detail-app" v-show="showDetailArea">
          <div v-if="showFavorite == false">
               <h4>Chi tiết ứng dụng</h4>
                <v-text-field
					:label="$t('apps.search')"
					single-line
					solo
					append-icon="mdi-magnify"
					v-model="searchKey"
				></v-text-field>
                <AppDetail ref="appDetail"  :isMyApplication="true" :isEndUserCpn="true" :searchKey="searchKey" :sideBySide="true" />
          </div>
         <div v-else class="favorite-area-item">
              <h4>Danh sách yêu thích</h4>
					<VuePerfectScrollbar :style="{height:heightListFavorite}"  >
						<ul style="margin:0px 0px 0px -24px" v-if="sFavorite.length > 0">
							<li v-for="(item,i) in sFavorite" :key="i" v-on:click="rightClickHandler($event,item,item.type)" v-on:contextmenu="rightClickHandler($event,item,item.type)" style="cursor:pointer" :class="{'child-item-active': item.objectIdentifier == activeIndexChild}" > 
								<div style="position:relative" >
									<div v-if="item.type == 'document_definition'" class="title-item-favorite">{{item.title}}</div>
									<div v-else  class="title-item-favorite">{{item.name}}</div> 
									<v-icon  color="#F6BE4F" style="float:right;font-size:13px;position:absolute;top:4px;right:4px">mdi-star</v-icon>
								</div>
							</li>
						</ul>
					</VuePerfectScrollbar>
         </div>
        <ContextMenu ref="contextMenu" :sideBySide="true" />
       </div>
       <div class="action-area h-100 " style="width:calc(100% - 520px)" >
            <SymperActionView :actionDef="actionDef"  :param="param" />
       </div>
   </div>
</template>

<script>
import {appManagementApi} from '@/api/AppManagement.js';
import AppDetail from './../AppDetail.vue'
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import ContextMenu from './../ContextMenu.vue'
import SymperActionView from '@/action/SymperActionView.vue'
import {util} from './../../../plugins/util'
    export default {
    created(){
        this.getFavorite()
    },
    components:{
        AppDetail,
        VuePerfectScrollbar,
        ContextMenu,
        SymperActionView
	},
	mounted(){
		this.widthActionArea = "calc(100% - 520px)"
	},
    computed:{
        sFavorite(){
			return this.$store.state.appConfig.listFavorite
        },
        actionDef(){
             return this.$store.state.appConfig.actionDef
        },
        param(){
             return this.$store.state.appConfig.param
		},
		showDetailArea(){
			return this.$store.state.appConfig.showDetailArea
		},
		listApp(){
            return this.$store.state.appConfig.listApps
		},
		activeIndexChild(){
			return this.$store.state.appConfig.activeChildItem
		},
		
    },
    methods:{
        rightClickHandler(event,item,type){
			event.stopPropagation();
			event.preventDefault();
			this.$store.commit('appConfig/updateActiveChildItem', item.objectIdentifier )
			if(!item.actions.includes('unfavorite')){
				item.actions.push('unfavorite')
			}
			this.$refs.contextMenu.setContextItem([...new Set(item.actions)])
			this.$refs.contextMenu.show(event)
			this.$refs.contextMenu.setItem(item)
			this.$refs.contextMenu.setType(type)
		},
        showListFavorite(){
            this.showFavorite = true
            this.activeIndex = '000'
			this.$store.commit('appConfig/showDetailAppArea')
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
                    this.$store.commit('appConfig/updateListFavorite',self.listFavorite)
x				}
			}).catch((err) => {
			});
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
        changeView(){
            this.$store.commit('appConfig/changeTypeView')
        },
        hideContextMenu(){
            if(this.$refs.appDetail){
                 this.$refs.appDetail.hideContextMenu()	
            }
            if(this.$refs.contextMenu){
                 this.$refs.contextMenu.hide()	
            }
        },
        getActiveapps(){
			appManagementApi.getActiveApp().then(res => {
				if (res.status == 200) {
					this.apps = res.data.listObject
				}
			}).catch((err) => {
			});
        },
        clickDetails(item){
            this.activeIndex = item.id
            this.showFavorite = false
            this.$store.commit("appConfig/updateCurrentAppId",item.id);
			// this.showDetailDiv = true
			this.$store.commit('appConfig/showDetailAppArea')
			this.$store.commit('appConfig/emptyItemSelected')
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
		
     },
    data(){
        return { 
            apps: [],
			activeIndex: '',
            showDetailDiv:false,
            searchKey: '',
            listFavorite:[],
            showFavorite:false,
            activeFavorite:false,
			heightListFavorite: 'calc(100vh - 110px)',
			heightListApp: 'calc(100vh - 130px)',
			widthActionArea:null,
			widthActionArea: '',
            arrType:{
                document_definition:[],
                orgchart:[],
                dashboard:[],
                workflow_definition:[],
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
    watch:{
         actionDef: {
            deep: true,
            immediate: true,
            handler(newValue){
            }
        }
    }
}
</script>

<style scoped>
.view-side-by-side-apps {
    display: flex;
}
.view-side-by-side-apps .favorite-area{
   cursor: pointer;
   display: flex;
   align-items: center;
   height:40px;
   padding-left:10px
}
.view-side-by-side-apps .favorite-area .active{
    background-color: active;
}

.view-side-by-side-apps .list-apps{
    padding-top:12px;
    width:220px;
    border-right:1px solid lightgray;
    position: relative;
}
.view-side-by-side-apps >>> .list-apps .v-icon{
	background-color:unset !important;
}
.view-side-by-side-apps .list-apps .title-app-sbs{
    white-space: nowrap; 
	width: 200px; 
	overflow: hidden;
	text-overflow: ellipsis; 
	font:13px roboto;
	padding-left:8px;
}

.view-side-by-side-apps .list-apps h4{
   flex-grow:1;
   padding-left:8px;
   font:15px roboto;
}
.view-side-by-side-apps .list-apps .active{
    background-color: #E9E9E9;
}
.view-side-by-side-apps .detail-app h4{
   padding-left:8px;
   margin:12px 0px;
   width:300px;
   font:15px roboto;
}


.view-side-by-side-apps .list-apps .list-app-item {
    display:flex;
    width: inherit;
    padding:12px 0px 12px 10px;
}
.view-side-by-side-apps .list-apps .list-app-item  h5{
    font:13px roboto;
    padding-left:8px;
}
.view-side-by-side-apps .list-apps .list-app-item .app-item-img{
    width:16px;
    height:16px
}
.view-side-by-side-apps .detail-app {
    border-right:1px solid lightgray;
    width:300px;
}
.view-side-by-side-apps .detail-app h4{
    font:15px roboto
}

.view-side-by-side-apps >>> .detail-app .v-input__control {
    min-height: unset;
}
.view-side-by-side-apps  >>> .detail-app .v-input__control .v-input__slot{
    box-shadow: unset;
    background-color: #f7f7f7;
    margin:0px 8px;
    width:95%
}
.view-side-by-side-apps  >>> .detail-app .v-input__control .v-input__slot label{
    font:13px roboto
}
.view-side-by-side-apps  >>> .detail-app .v-input__control .v-input__slot .v-icon{
    font-size:13px
}
.view-side-by-side-apps  >>> .detail-app .v-input__control .v-input__slot #input-147{
    font:13px roboto
}
.view-side-by-side-apps >>> .detail-app .v-input__control .v-text-field__details {
    display: none;
}
.view-side-by-side-apps >>> .detail-app .ps__rail-x{
    display: none;
}
.view-side-by-side-apps >>> .favorite-area-item li{
    list-style: none;    
    padding:6px 20px;
}
.view-side-by-side-apps >>> .favorite-area-item {
	overflow-x: hidden;
}
.view-side-by-side-apps >>> .favorite-area-item .child-item-active{
	background-color: #E9E9E9
}
.view-side-by-side-apps >>> .favorite-area-item li:hover{
}
.view-side-by-side-apps >>> .favorite-area-item .title-item-favorite{
   	white-space: nowrap; 
	font:13px roboto;
	width: 90%; 
	overflow: hidden;
	text-overflow: ellipsis; 
	padding:4px 0px;
}

</style>