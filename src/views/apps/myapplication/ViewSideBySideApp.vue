<template>
   <div class="view-side-by-side-apps h-100">
       <div class="list-apps h-100">
             <h4>Ứng dụng</h4>
             <v-icon @click="changeView" style="position:absolute;top:12px;right:6px;font-size:13px" >mdi-page-previous-outline</v-icon>  
            <div style="margin:20px 0px 0px 8px">
                 <div  v-for="(item,i) in apps" :key="i" 
                    :class="{'list-app-item': true,'active': item.id == activeIndex}"
                    @click="clickDetails(item)"

                    >
                        <v-icon v-if="item.iconType == 'icon'" style="font-size:16px">{{item.iconName}}</v-icon>
                        <img v-else-if="item.iconType == 'img'" :src="item.iconName" class="app-item-img"/>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <h5 v-bind="attrs"
                            v-on="on">{{item.name}}</h5>
                        </template>
                        <span>{{item.name}}</span>
                    </v-tooltip>
                </div>
            </div>
       </div>
       <div class="detail-app" v-show="showDetailDiv">
           <h4>Chi tiết ứng dụng</h4>
           <v-text-field
                :label="$t('apps.search')"
                single-line
                solo
                append-icon="mdi-magnify"
                v-model="searchKey"
            ></v-text-field>
           <AppDetail ref="appDetail"  :isMyApplication="true" :isEndUserCpn="true" :searchKey="searchKey" />

       </div>
   </div>
</template>

<script>
import {appManagementApi} from '@/api/AppManagement.js';
import AppDetail from './../AppDetail.vue'
    export default {
    created(){
        this.getActiveapps()
    },
    components:{
        AppDetail,
    },
    mounted(){ 
            let self = this
        	$(document).click(function(e){
				if(!$(e.target).is('.context-menu')){
                    self.$refs.appDetail.hideContextMenu()		
				}
			})
    },
    methods:{
        changeView(){
            this.$store.commit('appConfig/changeTypeView')
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
            debugger
            this.$store.commit("appConfig/updateCurrentAppId",item.id);
            this.showDetailDiv = true
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
					this.$store.commit('appConfig/updateChildrenApps',{obj:res.data,type:'document_definition'});
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
        }
    }
}
</script>

<style scoped>
.view-side-by-side-apps {
    display: flex;
}
.view-side-by-side-apps .list-apps{
    padding-top:12px;
    width:170px;
    border-right:1px solid lightgray;
    position: relative;
}

.view-side-by-side-apps .list-apps h4{
   flex-grow:1;
   padding-left:8px;
   font:15px roboto;
}
.view-side-by-side-apps .list-apps .active{
    background-color: #f7f7f7;
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
    padding:12px 0px;
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
</style>