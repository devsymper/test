<template>
   <div class="view-side-by-side-apps h-100">
       <div class="list-apps h-100">
				<div class="d-flex">
					 <h4>Ứng dụng</h4>
				<v-btn icon tile style="position:absolute;top:2px;right:12px;font-size:13px" >
					<v-icon @click="changeView" style="font-size:13px" >mdi-page-previous-outline</v-icon>  
				</v-btn>
				 <!-- <MenuConfigTypeView   :currentTypeView="1" :titleTypeView="'hellooo'" /> -->
				</div>
            <div class="mt-4">
                <div :class="{'favorite-area': true , 'active': showFavorite == true}" @click="showListFavorite">
                    <v-icon style="font-size:16px" color="#F6BE4F"> mdi-star</v-icon>
                    <span style="font:13px roboto;padding-left:8px">Yêu thích</span>
                </div>
				<VuePerfectScrollbar :style="{height:heightListApp}"  >
					<div v-for="(item,i) in listApps" :key="i" 
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
                <AppDetail 
					ref="appDetail"  
					:isMyApplication="true" 
					:isEndUserCpn="true" 
					:searchKey="searchKey" 
					:sideBySide="true"
					:loadingApp="loadingApp"	
				/>
          </div>
         <div v-else class="favorite-area-item">
              <h4>Danh sách yêu thích</h4>
					<VuePerfectScrollbar :style="{height:heightListFavorite}"  >
						<ul style="margin:0px 0px 0px -24px" v-if="sFavorite.length > 0">
							<li  v-for="(item,i) in sFavorite" :key="i" v-on:click="rightClickHandler($event,item,item.type)" v-on:contextmenu="rightClickHandler($event,item,item.type)" style="cursor:pointer" :class="{'child-item-active': item.objectIdentifier == activeIndexChild}" > 
								<div style="position:relative;display:flex" >
									<v-icon style="font-size:13px;margin-right:8px">{{listIcon[item.type]}}</v-icon>
									<div class=" d-flex flex-column">
										<div class="title-item-favorite">
											{{item.type == 'document_definition' ? item.title : item.name}}
											</div>
										<span style="font:12px roboto; font-weight:200"> {{item.appName}}</span>
									</div>
									<v-icon  color="#F6BE4F" style="float:right;font-size:13px;position:absolute;top:10px;right:4px">mdi-star</v-icon>
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
import AppDetail from './AppDetail.vue'
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import ContextMenu from './../ContextMenu.vue'
import SymperActionView from '@/action/SymperActionView.vue'
import MyApplicationWorker from 'worker-loader!@/worker/application/MyApplication.Worker.js';
import {util} from '@/plugins/util'
import MenuConfigTypeView from './MenuConfigTypeView'
    export default {
    created(){
		this.myApplicationWorker = new MyApplicationWorker()
		this.getFavorite()
		this.getActiveApp()
    },
    components:{
        AppDetail,
        VuePerfectScrollbar,
        ContextMenu,
		SymperActionView,
		MenuConfigTypeView
	},
	mounted(){
		this.widthActionArea = "calc(100% - 520px)"
		let self = this
		this.myApplicationWorker.addEventListener("message", function (event) {
			let data = event.data;
			switch (data.action) {
				case 'getFavorite':
					self.handleGetFavorite(data.dataAfter)
					break;
				case 'getActiveApp':
					self.handleGetActiveApp(data.dataAfter)
					break;
				case 'getAppDetails':
					self.handlerGetAppDetals(data.dataAfter)
					break;
				case 'getItemByType':
					self.handlerGetObjectSuccess(data.dataAfter.type,data.dataAfter.res)
					break;
			
				default:
					break;
			}
		});
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
		getActiveApp(){
			this.myApplicationWorker.postMessage({
				action: "getActiveApp"
			})
		},
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
		handleGetActiveApp(res){
			if(res.status == 200){
				this.listApps = res.data.listObject
			}else{
				this.$snotify({
					type: "error",
					title: "Không thể lấy danh sách application"
				})
			}
		},
		handleGetFavorite(res){
			let self = this
			if (res.status == 200) {
				res.data.listObject.forEach(function(e){
					let arr = ['document_definition', 'orgchart', 'workflow_definition', 'dashboard']
					arr.forEach(function(k){
						if(e.objectType == k){
							self.mapIdFavorite[k][k + ":" + e.objectIdentifier] = e
						}  
					})
				})
				this.checkTypeFavorite(res.data.listObject)
				this.$store.commit('appConfig/updateListFavorite',self.listFavorite)
			}
		},
        getFavorite(){
			this.listFavorite = []
			let userId = this.$store.state.app.endUserInfo.id
			this.myApplicationWorker.postMessage({
				action: "getFavorite",
				data:{
					userId: userId
				}
			})
        },
        checkTypeFavorite(data){
			let self = this
			for(let i in self.arrType){
				self.arrType[i] = []
			}
			data.forEach(function(e){
				let arr = ['document_definition', 'orgchart', 'dashboard', 'workflow_definition']
				arr.forEach(function(j){
					if(e.objectType == j){
						self.arrType[j].push(j + ":" + e.objectIdentifier)
					}
				})
			});
			for(let i in self.arrType){
				if(self.arrType[i].length > 0){
					let dataGet = self.arrType[i]
					self.getFavoriteByAccessControl(dataGet,i)
				}
			}
		},
        getFavoriteByAccessControl(ids,type){
			let self = this
			appManagementApi.getListObjectIdentifier({
				pageSize:50,
				ids: ids
			}).then(res=>{
				self.handlerGetObjectFavorite(type, res)
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
						item.appName = value.appName
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
        clickDetails(item){
			this.activeIndex = item.id
			this.loadingApp = true
			this.showFavorite = false
			let self = this
			this.$store.commit("appConfig/updateCurrentAppId",item.id);
			this.$store.commit("appConfig/updateCurrentAppName",item.name);
			this.$store.commit('appConfig/showDetailAppArea')
			this.$store.commit('appConfig/emptyItemSelected')
			let appStore = this.$store.state.appConfig
			if(!appStore.listAppsSideBySide[appStore.currentAppId]){
				this.myApplicationWorker.postMessage({
					action: 'getAppDetails',
					data:{
						id: item.id
					}
				})
			}else{
				this.loadingApp = false
			}

			
        },
        checkChildrenApp(data){
			let self = this 
			for(let i in self.arrType){
				self.arrType[i] = []
			}
			for(let i in data){
				data[i].forEach(function(e){
					self.arrType[i].push(i + ":"+e.id);
					self.mapId[i][i + ":"+e.id] = e;
				})
				let dataGet = self.arrType[i];
				self.getItemByAccessControl(dataGet,i)
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
		getItemByAccessControl(ids,type){
			let self = this
			this.myApplicationWorker.postMessage({
				action: 'getItemByType',
				data:{
					ids: ids,
					type: type
				}
			})
		},
		handlerGetAppDetals(res){
			if (res.status == 200) {
				if(Object.keys(res.data.listObject.childrenApp).length > 0){
					this.checkChildrenApp(res.data.listObject.childrenApp)
				}else{
					this.$store.commit('appConfig/emptyItemSelected')
				}
			}
			this.loadingApp = false
		},
		handlerGetObjectSuccess(type,res){
			let self = this
			this.updateFavoriteItem(self.mapId[type],res.data)
			if(type == 'document_definition'){
				let arrCategory = []
				let arrMajor = []
				res.data.forEach(function(e){
					if(e.objectType == "1"){
						arrMajor.push(e)
					}else if(e.objectType == "2"){
						arrCategory.push(e)
					}
				})
				this.$store.commit('appConfig/updateChildrenAppsSBS',{obj: arrMajor, type:'document_major'});
				this.$store.commit('appConfig/updateChildrenAppsSBS',{obj: arrCategory, type:'document_category'});
			}else{
				this.$store.commit('appConfig/updateChildrenAppsSBS',{obj: res.data, type: type});
			}
		},
		handlerGetObjectFavorite(type,res){
			let self = this
			if(res.data.length > 0){
				this.updateActionItem(self.mapIdFavorite[type], res.data, type)
				res.data.forEach(function(e){
					self.listFavorite.push(e)
				})
			}
		}
		
     },
    data(){
        return { 
            apps: [],
            listApps: [],
			activeIndex: '',
			loadingApp: true,
			showDetailDiv:false,
			myApplicationWorker: null,
            searchKey: '',
            listFavorite:[],
            showFavorite:false,
            activeFavorite:false,
			heightListFavorite: 'calc(100vh - 110px)',
			heightListApp: 'calc(100vh - 130px)',
			widthActionArea:null,
			widthActionArea: '',
			listIcon:{
				document_definition: 'mdi-file-document-outline',
				workflow_definition: 'mdi-lan',
				orgchart: 'mdi-widgets-outline',
				dashboard: 'mdi-view-dashboard'
			},
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
	cursor: pointer;
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

.view-side-by-side-apps >>> .favorite-area-item .title-item-favorite{
   	white-space: nowrap; 
	font:13px roboto;
	width: 220px; 
	overflow: hidden;
	text-overflow: ellipsis; 
	padding:4px 0px;
}

</style>