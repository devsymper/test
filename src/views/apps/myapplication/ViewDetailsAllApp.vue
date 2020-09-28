<template>
   <div class="view-details-all-app h-100" style="display:flex">
       <div class="header-view-details-all-app">
            <h4 style="flex-grow:1;font:15px roboto"> Danh sách công việc của tôi </h4>
            <div style="width:470px;display:flex">
                <v-btn
                    class="button-add-task"
                    style="backgound-color:#F7F7F7;margin-8px"
                    @click="createTask"
                    >
                    <v-icon left dark style="padding-right:8px">mdi-plus</v-icon>
                    <span style="font:13px roboto"> Tạo task </span>
                </v-btn>

                <v-text-field
                        :label="$t('apps.search')"
                        single-line
                        solo
                        append-icon="mdi-magnify"
                        v-model="searchItemKey"
                    ></v-text-field>
                   <div class="button-header">
                        <v-btn icon tile style="width:32px;height:32px;margin:0px 4px" >
                         <v-icon @click="collapse" >mdi-arrow-collapse-up</v-icon>  
                        </v-btn>
                        <v-btn icon tile  style="width:32px;height:32px;margin:0px 4px">
                            <v-icon @click="changeView">mdi-page-previous-outline</v-icon>  
                        </v-btn>
                   </div>
            </div>
        </div>
        <VuePerfectScrollbar :style="{height: menuItemsHeight}">
        <div class="content-view-details-all-app h-100 w-100">
                <v-skeleton-loader
                        ref="skeleton"
                        v-if="loadingApp"
                        type="table-tbody"
                        class="mx-auto w-100 h-100"
                 ></v-skeleton-loader>
               
                    <template v-else  >
                        <v-expansion-panels
                             v-model="panel"
                            multiple
                            style="display:flex"
                        >
                                <div
                                     v-for="(item,i) in listApp"
                                    :key="i"
                                    style="width:50%"
                                >
                                     <v-expansion-panel
                                     >
                                    <v-expansion-panel-header>
                                    <div class="app-title">
                                            <v-icon v-if="item.iconType == 'icon'" style="font-size:16px;flex:unset;margin-left:0px;margin-right:0px;padding-top:2px">{{item.iconName}}</v-icon>
                                            <img v-else-if="item.iconType == 'img'" :src="item.iconName" class="app-item-img"/>
                                            <span style="padding-left:8px">
                                                {{item.name}}
                                            </span>
                                    </div>
                                        </v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <!-- chi tiet tung app  -->
                                        <v-row no-gutters>
                                            <template v-for="(childItem,n) in item.childrenAppReduce">
                                                <v-col cols="6" :key="n">
                                                    <div style="margin-left:9px;margin-top:6px">
                                                        <div style="margin-bottom:6px">
                                                            <v-icon style="margin-top:-2px">{{ childItem.icon }}</v-icon>
                                                            <span style="font-weight:300;font:13px;margin-top:1px">
                                                                {{ childItem.title  ? childItem.title : childItem.name}}
                                                            </span>
                                                             <span  style="font-weight:300;font:13px;padding-left:2px;margin-top:1px"> {{'('+ reduce(childItem.item) +')' }}</span>
                                                        </div>
                                                        <div>
                                                            <ul v-for="(subChildItem,k) in childItem.item" :key="k"  class="app-child-item">
                                                                    <li
                                                                        v-if="subChildItem.show == true"
                                                                        v-on:contextmenu="rightClickHandler($event,subChildItem,childItem.name,item)"
                                                                        v-on:click="rightClickHandler($event,subChildItem,childItem.name,item)"
                                                                    >
                                                                        <div style="position:relative">
                                                                            <v-tooltip bottom v-if="childItem.name == 'document_definition'">
                                                                                <template v-slot:activator="{ on, attrs }">
                                                                                    <div class="title-document-enduser" 	
                                                                                        v-bind="attrs"
                                                                                        v-on="on" >
                                                                                        <span v>{{subChildItem.title}}</span> 
                                                                                        
                                                                                    </div>
                                                                                </template>
                                                                                <span style="font:13px roboto">{{subChildItem.title}}</span> 
                                                                                <span style="font:8px;opacity:0.4">{{subChildItem.name}}</span>
                                                                            </v-tooltip>
                                                                            <div v-else >{{subChildItem.title ? subChildItem.title : subChildItem.name }}</div>
                                                                            <v-icon  @click="changeFavorite(subChildItem,childItem.name,item)" :class="{'icon-star-active' : subChildItem.favorite , 'icon-star': true}" >mdi-star</v-icon>	
                                                                        </div>
                                                                    </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                
                                                </v-col>
                                                <v-responsive
                                                v-if="n === 2"
                                                :key="`width-${n}`"
                                                width="100%"
                                                ></v-responsive>
                                            </template>
                                        </v-row>
                                    </v-expansion-panel-content>
                                  </v-expansion-panel>
                                </div>
                                   

                        </v-expansion-panels>
                    </template>
        </div>
        </VuePerfectScrollbar>
        <ContextMenu ref="contextMenu"  :allAppMode="true" />
        <DialogCreateTask :showCreateTask="showCreateTask" @close-dialog="showCreateTask = false" />
    </div>
</template>

<script>
import {appManagementApi} from '@/api/AppManagement.js';
import {util} from './../../../plugins/util'
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import ContextMenu from './../ContextMenu.vue';
import DialogCreateTask from '@/components/myItem/work/DialogCreateTask.vue'
export default {
    components:{
        VuePerfectScrollbar,
        ContextMenu,
        DialogCreateTask
    },
    computed:{
        listApp(){
            return this.$store.state.appConfig.listApps
        }
    },
    methods:{
        createTask(){
            this.showCreateTask = true
        },
        hideContextMenu(){
            this.$refs.contextMenu.hide()	
        },
        rightClickHandler(event,item,type,app){
			event.stopPropagation();
			event.preventDefault();
			this.$refs.contextMenu.setContextItem(item.actions)
			this.$refs.contextMenu.show(event)
            this.$refs.contextMenu.setItem(item)
            this.$refs.contextMenu.setAppId(app.id)
            if(type == 'document_category' || type == "document_major"){
				type = "document_definition"
			}
			this.$refs.contextMenu.setType(type)
		}, 
		hideContextMenu(){
			this.$refs.contextMenu.hide()
		},	
        changeView(){
            this.hideContextMenu()
            this.$store.commit('appConfig/changeTypeView')
        },
        collapse(){
			let panels = this.panel.length == 0 ?  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25] : []
			this.panel = panels
        },
        reduce(item){
            let i = 0
            item.forEach(function(e){
                if(e.show == true){
                    i++
                }
            })
            return i
        },
         getActiveapps(){
            let self = this
			appManagementApi.getActiveApp().then(res => {
				if (res.status == 200) {
                    for(let e of res.data.listObject){
                        e.childrenAppReduce = {}
                        self.$set( self.apps, e.id , e)
                        self.$set( self.mapIdApp, e.id , {})
                        if(Object.keys(e.childrenApp).length > 0){
                            self.checkChildrenApp(e.childrenApp,e.id)   
                        }
                    }
                     this.getByAccessControl(self.listIds)
                    this.$store.commit('appConfig/setListApps', this.apps)
                    setTimeout(function(e){
                        self.loadingApp = false
                    },1000)
                }
			}).catch((err) => {
			});
        },
        checkChildrenApp(data,idApp){
            let self = this
            this.listType.forEach(function(k){
                self.mapIdApp[idApp][k] = []
                 if(data.hasOwnProperty(k)){
                    data[k].forEach(function(e){
                        let str = k +':'+ e.id
                        if(self.listIds.includes(str) == false){
                            self.listIds.push(str);
                        }
                        self.mapIdApp[idApp][k].push(
                           k + ":" + e.id 
                        )
                        self.$set(self.mapIdItem, k+':'+e.id, e)
                    })
                }
            })
        },

        updateChidrenItemToApp(data){
            data.forEach(function(e){
                e.show = true
			})
			let self = this
            for(let app in this.mapIdApp){
                for(let typeT in this.mapIdApp[app]){

                    if(this.mapIdApp[app][typeT].length > 0){
                        let  obj = {}
                        let arr = []
                        let arrCategory = []
                        let arrMajor = []
                        data.forEach(function(t){
                            if(self.mapIdApp[app][typeT].includes(t.objectIdentifier)){
                                 if(t.hasOwnProperty('objectType') && t.objectIdentifier.includes('document')){
                                    if(t.objectType == "2"){
                                        obj =  util.cloneDeep(self.document_category);
                                        arrCategory.push(t)
                                        obj.item = arrCategory
                                        let types = "document_category"
                                        self.apps[app].childrenAppReduce[types] = obj
                                    }
                                    if(t.objectType == "1"){
                                        obj =  util.cloneDeep(self.document_major);
                                        arrMajor.push(t)
                                        obj.item = arrMajor
                                        let types = "document_major"
                                        self.apps[app].childrenAppReduce[types] = obj
                                    }
                                  
                                }else{
                                    obj = util.cloneDeep(self[typeT]);
                                    arr.push(t)
                                    obj.item = arr
                                    self.apps[app].childrenAppReduce[typeT] = obj
                                }
								
                            }
						})
                        
                    }
                }
            }
        },
      
        updateFavoriteItem(array){
            let self = this 
            this.listType.forEach(function(e){
                for( let [key,value] of Object.entries(self.mapIdItem)){
                    array.forEach(function(item){
                        if(item.objectIdentifier == key){
                            item.favorite = value.isFavorite
                            item.actions = value.actions
                        } 
                    })
			    }
            })
			return array
        },
        changeFavorite(item,type,app){
            event.stopPropagation()
            let self = this
            self.$store.commit('appConfig/updateSelectingItemType',type)
            if(type == "document_major" || type == "document_category"){
				type = "document_definition"
			}
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
					if (res.status == 200){
                        self.$store.commit('appConfig/insertFavorite',item)
                        self.$store.commit('appConfig/updateFavoriteMyAppItem',{appId:app.id,itemId:item.objectIdentifier,value:true})
					}
				});
			}else{
				appManagementApi.addFavoriteItem(userId,item.id,type,0).then(res => {
					if (res.status == 200) {
						item.type = type;
                        self.$store.commit('appConfig/delFavorite',item)
                         self.$store.commit('appConfig/updateFavoriteMyAppItem',{appId:app.id,itemId:item.objectIdentifier,value:false})
					}
				});
            }
        },
        filterObj(value){
           for(let e in this.apps){
                this.filterItemInApp(e,"document_category",value)
                this.filterItemInApp(e,"document_major",value)
                this.filterItemInApp(e,"orgchart",value)
                this.filterItemInApp(e,"dashboard",value)
                this.filterItemInApp(e,"workflow_definition",value) 
           }
        },
        filterItemInApp(e, type, value){
             let self = this
             if(self.apps[e].childrenAppReduce.hasOwnProperty(type)){
                self.apps[e].childrenAppReduce[type].item.forEach(function(k){
                    if(value == ""){
                        k.show = true
                    }
                    let text = k.title ? k.title : k.name
                    if(text.toLowerCase().includes(value.toLowerCase())){
                        k.show = true
                    }else{
                        k.show = false
                    }
                })
            }
        },

		async getByAccessControl(ids){
			let self = this
			await appManagementApi.getListObjectIdentifier({
				pageSize:1000,
				ids: ids
			}).then(res=>{
                    self.updateFavoriteItem(res.data)
                    self.updateChidrenItemToApp(res.data)
			}).catch(err=>{
			})
		},
        
    },
    data(){
        return {
            document_definition: {
                icon: 'mdi-file-edit-outline',
                title: 'Documents',
                name: 'document_definition',
                item: []
            },
            document_category:{
                icon : 'mdi-file-document-outline',
                title: this.$t('apps.listType.documentCategory'),
                name:  'document_category',
            },
            document_major:{
                icon : 'mdi-file-edit-outline',
                title:  this.$t('apps.listType.documentMajor'),
                name:  'document_major',
            },
            orgchart: {
                icon: 'mdi-widgets-outline',
                title:  this.$t('apps.listType.orgchart'),
                name: 'orgchart',
            },
            dashboard: {
                icon: 'mdi-view-dashboard',
                title: this.$t('apps.listType.dashboard'),
                name: 'dashboard',
            },
            workflow_definition: {
                icon: 'mdi-lan',
                title:  this.$t('apps.listType.workflow'),
                name: 'workflow_definition',
            },
            panel: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
            listIds: [],
			mapIdApp:[],
			childItemReduce:{

			},
            listType : ['orgchart', 'document_definition', 'workflow_definition', 'dashboard'],
            mapIdItem:{
                orgchart:{
                },
                document_definition:{
                },
                dashboard:{
                },
                workflow_definition:{
                }
             },
             loadingApp: true,
             menuItemsHeight: 'calc(100vh - 125px)',
             searchItemKey: "",
             apps:{},
             showCreateTask:false,
        }
    },
    created(){
        debugger
        if(Object.keys(this.listApp).length == 0 ){
           this.getActiveapps()
        }else{
            this.loadingApp = false
        }
    },
  
    watch:{
        searchItemKey(val){
                this.filterObj(val)
        }
    }
}
</script>

<style scoped>
.view-details-all-app {
    display: flex;
    flex-direction: column;
}
.view-details-all-app .header-view-details-all-app {
    display: flex;
    margin:8px 16px 8px 8px;
}
.view-details-all-app >>> .header-view-details-all-app .button-header {
    display:flex;
    margin-left:4px;
}
.view-details-all-app >>> .header-view-details-all-app .button-header .v-btn {
    margin:unset;
    margin-top: -2px;
}
.view-details-all-app  >>>.header-view-details-all-app .v-icon::after{
	display:none
}
.view-details-all-app  >>>.header-view-details-all-app .v-icon:hover{
    background-color:unset !important;
}
.view-details-all-app  >>> button{
    margin:8px
}
.view-details-all-app .content-view-details-all-app{
    width:95%;
    margin-left:auto;
    margin-right:auto;
    font:13px roboto
}
.view-details-all-app >>> .content-view-details-all-app .v-expansion-panel-header{
    margin:0px 32px 0px 16px;
    min-height:unset;
    height:50px;
}
.view-details-all-app >>> .content-view-details-all-app .v-expansion-panel-header.v-expansion-panel-header--active{
    /* border-bottom: 1px solid #FF8003; */
}
.view-details-all-app >>> .content-view-details-all-app .v-expansion-panel-header__icon{
    margin-right:12px;
}
.view-details-all-app .content-view-details-all-app .app-item-img{
    width:16px;
    height:16px;
    flex:unset;
    padding-top:2px
    
}
.view-details-all-app h4{
    float: left;
}
.view-details-all-app .button-add-task{
    margin:0px 12px;
    box-shadow: unset;
    height:32px;
    min-width: unset;
    padding:unset;
    width: 110px;

}  
.view-details-all-app >>> .button-add-task .v-icon{
     margin:0px 0px 0px 8px;
}
.view-details-all-app >>> .v-input{
   flex:unset

}
.view-details-all-app >>> .v-icon {
    font-size:13px;
    margin:0px 8px;
}
.view-details-all-app >>> .v-input__control{
    min-height:unset;
    width:250px !important;
    min-width:unset;
    height: 50px;
    flex-grow:unset

}
.view-details-all-app >>> .v-input__control .v-input__slot{
    box-shadow: unset !important;
    width:250px;
    background-color: #f7f7f7;
    margin-right:20px;
}
.view-details-all-app >>> .v-input__control .v-input__slot .v-text-field__slot{
    font:13px roboto;
}
.view-details-all-app >>> .v-input__control .v-input__slot label{
    font:13px roboto;
    padding-top:2px

}
.view-details-all-app >>> .v-input__control #input-110{
    font:13px roboto
}
.view-details-all-app >>> .v-input__control .v-text-field__details{
    display: none;
}
.view-details-all-app >>> .app-child-item{
    margin-left:-4px
}
.view-details-all-app >>> .title-document-enduser{
	white-space: nowrap; 
	width: 90%; 
	overflow: hidden;
	text-overflow: ellipsis; 
}
.view-details-all-app >>>  .icon-star{
	display: none;
	position:absolute;
	top:0px;
	right:0px;
}
.view-details-all-app >>> .icon-star-active{
	color: #F6BE4F;
	display: inline-block;
	position:absolute;
	top:0px;
	right:0px;
}
.view-details-all-app >>>  li{
	cursor: pointer;
	padding:8px 12px;
     list-style:none;   
	margin-right: 10px;
}
.view-details-all-app >>> li:hover {
	background-color:#f7f7f7;
	border-radius: 5px;
}v-expansion-panel-header
.view-details-all-app >>>  li:hover .icon-remove{
	background-color:#f7f7f7;
	border-radius: 10px;
	display: inline-block;
}
.view-details-all-app >>> li:hover .icon-star{
	display: inline-block;
}
.view-details-all-app >>> .v-expansion-panel{
    box-shadow: unset;
}
.view-details-all-app >>> .v-expansion-panel::before{
    box-shadow: unset;
}
.view-details-all-app >>> .v-expansion-panel-header--active .app-title {
    border-bottom: 0.5px solid #FF8003;
    padding-bottom:4px;
}
.view-details-all-app >>> .v-expansion-panel-header--active .v-expansion-panel-header__icon {
    border-bottom: 0.5px solid #FF8003;
    padding-bottom:10px;
}
.view-details-all-app >>> .v-expansion-panel-header::before .app-title {
    border-bottom: 0.5px solid #ffffff;
}
</style>