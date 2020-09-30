<template>
   <div class="view-details-all-app h-100" style="display:flex">
       <div class="header-view-details-all-app">
            <h4 style="flex-grow:1"> Danh sách công việc của tôi </h4>
            <div style="width:500px;display:flex">
                <v-btn
                    class="button-add-task"
                    style="backgound-color:#F7F7F7;margin-8px"
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
                <v-icon @click="collapse">mdi-arrow-collapse-up</v-icon>  
                <v-icon @click="changeView">mdi-page-previous-outline</v-icon>  
            </div>
        </div>
        <VuePerfectScrollbar :style="{height: menuItemsHeight}">
        <div class="content-view-details-all-app h-100">
           
                <v-row no-gutters>
                    <template v-for="(item,i) in apps" >
                        <v-col cols="6" :key="i">
                        <v-expansion-panels
                            accordion 
                            v-model="panel"
                        >
                            <v-expansion-panel
                            >
                            <v-expansion-panel-header>
                                <v-icon v-if="item.iconType == 'icon'" style="font-size:16px;flex:unset;margin-left:0px;margin-right:0px">{{item.iconName}}</v-icon>
                                <img v-else-if="item.iconType == 'img'" :src="item.iconName" class="app-item-img"/>
                                <span style="padding-left:8px">
                                    {{item.name}}
                                </span>
                                
                                </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <!-- chi tiet tung app  -->
                            <v-row no-gutters>
                                    <template v-for="(childItem,n) in item.childrenAppReduce">
                                        <v-col cols="6" :key="n">
                                            <div>
                                                 <div>
                                                     <v-icon>{{ childItem.icon }}</v-icon>
                                                      {{ childItem.title }}
                                                 </div>
                                                 <div>
                                                    <ul v-for="(subChildItem,k) in childItem.item" :key="k"  class="app-child-item">
                                                            <li
                                                                v-on:contextmenu="rightClickHandler($event,subChildItem,childItem.name)"
                                                            >
                                                                <div style="position:relative">
                                                                    <v-tooltip bottom v-if="childItem.name == 'document_definition'">
                                                                        <template v-slot:activator="{ on, attrs }">
                                                                            <div class="title-document-enduser" 	
                                                                                v-bind="attrs"
                                                                                v-on="on" >
                                                                                <span v-on:click="rightClickHandler($event,childItem,childItem.name)">{{subChildItem.title}}</span> 
                                                                                
                                                                            </div>
                                                                        </template>
                                                                        <span style="font:13px roboto">{{subChildItem.title}}</span> 
                                                                        <span style="font:8px;opacity:0.4">{{subChildItem.name}}</span>
                                                                    </v-tooltip>
                                                                    <div v-else v-on:click="rightClickHandler($event,subChildItem,childItem.name)">{{subChildItem.name}}</div>
                                                                    <v-icon  @click="changeFavorite(subChildItem,childItem.name)" :class="{'icon-star-active' : subChildItem.favorite==true, 'icon-star': true}" >mdi-star</v-icon>	
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
                        </v-expansion-panels>
                        </v-col>
                    </template>
                </v-row>
        </div>
        </VuePerfectScrollbar>
        <ContextMenu ref="contextMenu"  />
    </div>
</template>

<script>
import {appManagementApi} from '@/api/AppManagement.js';
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import ContextMenu from './../ContextMenu.vue';
export default {
    components:{
        VuePerfectScrollbar,
        ContextMenu
    },
    methods:{
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
        changeView(){
            this.$store.commit('appConfig/changeTypeView')
        },
        collapse(){
            this.panel = []
        },
        getActiveapps(){
            let self = this
			appManagementApi.getActiveApp().then(res => {
				if (res.status == 200) {
                    for(let e of res.data.listObject){
                        e.childrenAppReduce = {}
                        self.$set( self.apps, e.id , e)
                        if(Object.keys(e.childrenApp).length > 0){
                            self.checkChildrenApp(e.childrenApp,e.id)   
                        }
                    }
				}
			}).catch((err) => {
			});
        },
        checkChildrenApp(data,idApp){
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
				this.getByAccessControl(dataOrg,'orgchart',idApp)
			}
			if(data.hasOwnProperty('document_definition')){
				data.document_definition.forEach(function(e){
					self.arrType.document_definition.push("document_definition:"+e.id);
					self.mapId.document_definition["document_definition:"+e.id] = e;
				})
				let dataDoc = self.arrType.document_definition
                this.getByAccessControl(dataDoc,'document_definition',idApp)
			}
			if(data.hasOwnProperty('workflow_definition')){
				data.workflow_definition.forEach(function(e){
					self.arrType.workflow_definition.push("workflow_definition:"+e.id);
					self.mapId.workflow_definition["workflow_definition:"+e.id] = e;
				})
				let dataW = self.arrType.workflow_definition
				this.getByAccessControl(dataW,'workflow_definition',idApp)
			}
			if(data.hasOwnProperty('dashboard')){
				data.dashboard.forEach(function(e){
					self.arrType.dashboard.push("dashboard:"+e.id);
					self.mapId.dashboard["dashboard:"+e.id] = e;
				})
				let dataRep = self.arrType.dashboard
				this.getByAccessControl(dataRep,'dashboard',idApp)
			}
        },

        updateChidrenItem(type,data,idApp){
            let obj = {}
            obj = this[type]
            obj.item = data
            // console.log()
            this.$set(this.apps[idApp].childrenAppReduce,type,obj)
            // this.apps[idApp].childrenAppReduce[type] = obj
            console.log(this.apps[idApp].childrenAppReduce,'this.apps[idApp].childrenAppReduce');
            
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
        // filterObj(value){
        //     this.apps.filter(function(e){
        //          if(e.childrenApp.document_definition.item.length > 0){
        //             e.childrenApp.document_definition.item.filter(function(item){
        //                 if(item.title.toLowerCase().includes(value.toLowerCase())){
        //                     self.objFilter.document_definition.item.push(item)
        //                 }
        //             })
		// 	    }
        //     })
        // },

		getByAccessControl(ids,type,idApp){
			let self = this
			appManagementApi.getListObjectIdentifier({
				pageSize:50,
				ids: ids
			}).then(res=>{
                
				if(type == 'orgchart'){
                    this.updateFavoriteItem(self.mapId.orgchart,res.data)
                    this.updateChidrenItem('orgchart',res.data,idApp)
				}
				if(type == 'document_definition'){
					this.updateFavoriteItem(self.mapId.document_definition,res.data)
                    this.updateChidrenItem('document_definition',res.data,idApp)
				}
				if(type == 'workflow_definition'){
					this.updateFavoriteItem(self.mapId.workflow_definition,res.data)
                    this.updateChidrenItem('workflow_definition',res.data,idApp)
				}
				if(type == 'dashboard'){
					this.updateFavoriteItem(self.mapId.dashboard,res.data)
                    this.updateChidrenItem('dashboard',res.data,idApp)
				}
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
             panel: [0,1,2,3],
             menuItemsHeight: 'calc(100vh - 125px)',
             searchItemKey: '',
             apps:{},
             currentAppId:0,
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
    },
    created(){
        this.getActiveapps()
    },
    mounted(){
        let self = this
        $(document).click(function(e){
            if(!$(e.target).is('.context-menu')){
                    self.$refs.contextMenu.hide()
            }
        })
    },
    watch:{
        searchItemKey(val){
            console.log(val);

                
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
.view-details-all-app .content-view-details-all-app{
    width:90%;
    margin-left:auto;
    margin-right:auto;
}
.view-details-all-app .content-view-details-all-app .app-item-img{
    width:16px;
    height:16px;
    flex:unset;
    
}
.view-details-all-app h4{
    float: left;
}
.view-details-all-app .button-add-task{
    margin:0px 12px;
    box-shadow: unset;
    height:30px;
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
    height: 30px;
    flex-grow:unset

}
.view-details-all-app >>> .v-input__control .v-input__slot{
    box-shadow: unset !important;
    width:250px;
    background-color: #f7f7f7;
    margin-right:20px
}
.view-details-all-app >>> .v-input__control .v-input__slot label{
    font:13px roboto;
    padding-top:3px
}
.view-details-all-app >>> .v-input__control #input-110{
    font:13px roboto
}
.view-details-all-app >>> .v-input__control .v-text-field__details{
    display: none;
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
	top:3px;
	right:0px;
}
.view-details-all-app >>> .icon-star-active{
	color: #F6BE4F;
	display: inline-block;
	position:absolute;
	top:3px;
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
}
.view-details-all-app >>>  li:hover .icon-remove{
	background-color:#f7f7f7;
	border-radius: 10px;
	display: inline-block;
}
.view-details-all-app >>> li:hover .icon-star{
	display: inline-block;
}
</style>