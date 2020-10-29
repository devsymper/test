<template>
    <div class="w-100 mr-10">
        <v-row class="header ml-3">
            <v-col class="col-md-8 col-sm-8 ">
                  <!-- <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        color="primary"
                        dark
                        v-bind="attrs"
                        v-on="on"
                    >
                        Dropdown
                    </v-btn>
                    </template> -->
               <!-- <NotificationPopUp :objId="483" :objType="'document_definition'" style="background:white" /> -->
                <!-- </v-menu> -->
                <span class="fs-15 fw-430" v-if="showFollow">Danh sách đối tượng đang theo dõi</span>
                <span class="fs-15 fw-430" v-if="showUnfollow">Danh sách đối tượng không theo dõi</span>
            </v-col >
            <v-col class="col-md-4 col-sm-4 d-flex justify-end" style="margin-right:-10px">
                  <v-text-field  v-if="!showMain"
                        solo
                        flat
                        hide-details
                        class=" sym-small-size sym-style-input"
                        single-line
                        v-model="search">
                    </v-text-field>
                 <v-btn @click="isShowMain()" v-if="!showMain" text class="ml-3 fw-400 font-normal color-red">
                   <i class="mdi-24px mdi mdi-home-outline mdi-dark"></i>
                </v-btn>
                <v-btn @click="isShowUnFollow()" v-if="!showUnfollow" text class="fw-400 font-normal color-red">
                    Không theo dõi
                </v-btn>
                <v-btn @click="isShowFollow()" v-if="!showFollow" text class="fw-400 font-normal color-green">
                    Theo dõi
                </v-btn>
                    
            </v-col >
        </v-row>
        <SettingNotification v-if="showMain" :type="type" :listItems="items" :allListChanel="allListChanel" />
        <SettingNotification v-if="showFollow" :type="type" :listItems ="listSubcribed"/>
        <SettingNotification v-if="showUnfollow" :type="type" :listItems ="listUnsubcribed"/>
    </div>
</template>
<script>
import _ from 'lodash';
import NotificationPopUp from "./../../components/notification/DetailPopPup.vue"
import { documentApi } from "./../../api/Document.js";
import UserPopUp from "./../../components/user/UserPopUp";
import notification from "./../../api/settingNotification";
import SettingNotification from "./../../components/notification/setting/main.vue"
export default {
  watch: {
      search(){
          this.searchList();
      }
  },
    components:{
        SettingNotification,
        UserPopUp,
        NotificationPopUp
    },
  created () {
      this.getSource();
      this.getAllListChanel();
      //this.getListFollowed();
  },
  data () {
    return {
        type:'main',
        search:'',
        isSearchSuscribed:false,
        listSubcribed:[],
        showMain:true,
        listUnsubcribed:[],
        listModules:[],
        listSource:[],
        allListChanel:[],
        listNameModules:[],
        showUnfollow:false,
        showFollow:false,
        items: [],
    }
  },
  methods: {
      searchList(){
        this.listSubcribed = [];
        this.listUnsubcribed=[];
        const self= this;
        let subscribe = this.showFollow?true:false;
        let dataSend={
            subcribed:subscribe,
            keyword:this.search,
        }
        notification.showListsSubcribed(dataSend).then(res=>{
            if(res.status==200){
            let format = [];
             let listModules = res.data;
                for(let i = 0; i<listModules.length;i++){
                    if(listModules[i].objectType){
                        format.push(listModules[i])
                    }
                }
                let formatListModules = _.groupBy(format, 'objectIdentifier');
                let name = Object.keys(formatListModules);
                for(let i=0;i<name.length;i++){
                    if(subscribe){
                        self.listSubcribed.push({
                            title: name[i],
                            items: [],
                        })  
                    }else{
                        self.listUnsubcribed.push({
                            title: name[i],
                            items: [],
                        })  
                    }
                    for(let j=0; j<formatListModules[name[i]].length;j++){
                        if(subscribe){
                            self.listSubcribed[i].items.push({
                                title: formatListModules[name[i]][j].event,
                                name: formatListModules[name[i]][j].event,
                                id:formatListModules[name[i]][j].id,
                                active:formatListModules[name[i]][j].subscribed
                            });
                        }else{listUnsubcribed
                            self.listUnsubcribed[i].items.push({
                                title: formatListModules[name[i]][j].event,
                                name: formatListModules[name[i]][j].event,
                                id:formatListModules[name[i]][j].id,
                                active:formatListModules[name[i]][j].subscribed
                            });
                        }
                    }
                }
             }
            });
      },
     async getAllListChanel(){
        this.items=[];
        const self= this;
        let res = await notification.showAllLists();
           if(res.status==200){
            let format = [];
             let listModules = res.data;
             self.allListChanel = res.data;
             for(let i = 0; i<listModules.length;i++){
                 if(listModules[i].objectType){
                     format.push(listModules[i])
                 }
             }
             let formatListModules = _.groupBy(format, 'objectType');
             let name = Object.keys(formatListModules);
             for(let i=0;i<name.length;i++){
                 let a = name[i];
                self.items.push({
                title: name[i],
                items: [],
                icon:name[i]
            })      
            let groupByEvent= Object.keys(_.groupBy(formatListModules[name[i]], 'event'));
                for(let k=0;k<groupByEvent.length;k++){
                    self.items[i].items.push({
                        title: groupByEvent[k],
                        name:self.rename(name[i],groupByEvent[k]),
                        active: self.checkSubcribe(name[i],groupByEvent[k])
                    });
                }
            }
        }
    },
    checkSubcribe(objectType,event){
        let check=false;
        for(let i=0; i<this.allListChanel.length;i++){
            if(this.allListChanel[i].objectType==objectType&&this.allListChanel[i].event==event&&this.allListChanel[i].subscribed){
                check=true
            }
        }
        return check;
    },
    getSource(){
        const self = this;
        notification.showAllModuleConfig().then(res=>{
            if(res.status==200){
                self.listSource = res.data;
            }
        })
    },
    rename(nameModule,event){
        let name = event;
        for(let i = 0; i<this.listSource[nameModule].event.length;i++){
            if(this.listSource[nameModule].event[i].value==event){
               name = this.listSource[nameModule].event[i].text;
            }
        }
        return name

    },
    // findName(objId){
    //     let name = ' ';
    //     if(objId.indexOf(':')>0){
    //            debugger
    //           let nameModule = objId.split(':')[0];
    //           let id = objId.split(':')[1];
    //          if(nameModule=='document_definition'){
    //           documentApi.getBatchDocument({ids:JSON.stringify(id)}).then(res => {
    //                 if(res.status==200){
    //                     name="Có kq"
    //                 }else{
    //                     name = "Lỗi"
    //                 }
    //           })
    //         }   
    //     }else{
    //       name=objId
    //     }
    //     return name
    // },
    getListFollowed(){
        this.listSubcribed = []
        const self= this;
        let isSubcribed = true;
        notification.showListsSubcribed({subscribed:isSubcribed}).then(res=>{
            if(res.status==200){
             let listSubcribed = res.data;
              let grouplistByObjId = _.groupBy(listSubcribed, 'objectIdentifier');
              let objId = Object.keys(grouplistByObjId);
                for(let j = 0; j<objId.length;j++){
                    self.listSubcribed.push({
                        items:[],
                        title: objId[j],
                        icon:objId[j].indexOf(':')>0?objId[j].split(':')[0]:objId[j]
                    })
                    for(let i = 0; i<grouplistByObjId[objId[j]].length;i++){
                        self.listSubcribed[j].items.push({
                            title: grouplistByObjId[objId[j]][i].event,
                            name: self.rename(objId[j],grouplistByObjId[objId[j]][i].event),
                            active: true

                        })
                     }
                }
            }
        })
    },
      getListUnFollowed(){
        this.listUnsubcribed = []
        const self= this;
        let isSubcribed = false;
        notification.showListsSubcribed({subscribed:isSubcribed}). then(res=>{
            if(res.status==200){
             let listSubcribed = res.data;
              let grouplistByObjId = _.groupBy(listSubcribed, 'objectIdentifier');
              let objId = Object.keys(grouplistByObjId).filter(x=>x!=''&&x!='null');
                for(let j = 0; j<objId.length;j++){
                    self.listUnsubcribed.push({
                        items:[],
                        title: self.findName(objId[j]),
                        icon:objId[j].indexOf(':')>0?objId[j].split(':')[0]:objId[j]
                    })
                    for(let i = 0; i<grouplistByObjId[objId[j]].length;i++){
                        self.listUnsubcribed[j].items.push({
                            title: grouplistByObjId[objId[j]][i].event,
                            name: self.rename(objId[j],grouplistByObjId[objId[j]][i].event),
                            active: true
                        })
                     }
                }
            }
        })
         

    },
    isShowMain(){
        this.type="main";
        this.showFollow=false;
        this.showUnfollow=false;
        this.showMain=true;
        this.getAllListChanel();
    },
    isShowUnFollow(){
        this.type="unfollow";
        this.showFollow=false;
        this.showUnfollow=true;
        this.showMain=false;
        this.getListUnFollowed();
    },
    isShowFollow(){
        this.type="follow";
        this.showFollow=true;
        this.showUnfollow=false;
        this.showMain=false;
        this.getListFollowed();
    }
  },
}
</script>
<style scoped>
    .sym-small-size{
        border:none!important;
        margin-top:3px
    }
</style>