<template>
    <v-row>
        <v-app-bar dense flat color="white" class="notification-list-bar" fixed>
            <v-col :cols="4"> <v-toolbar-title class="nofitication-title-bar" style="font-weight:400">
                Notifications
            </v-toolbar-title>
            </v-col>
            <v-col :cols="8" class="text-right pt-1 pb-1 pr-0">
                <!-- Tìm kiếm -->
                <v-text-field dense
                    class="bg-grey sym-small-pad sym-small-size d-inline-block mr-2"
                    append-icon="mdi-magnify"
                    flat
                    solo
                    @input="searchNotification"
                    v-model="txtSearch"
                    :placeholder="$t('common.search')"
                ></v-text-field>
                <v-menu
                    z-index="162"
                    :max-width="200"
                    :min-width="200"
                    :max-height="500"
                    offset-y
                    >
                    <template v-slot:activator="{ on }">
                         <v-btn 
                            v-on="on" 
                            x-small 
                            solo
                            class="bg-grey h-30"
                            text
                        >
                            <v-icon size="18">mdi-dots-horizontal</v-icon>
                        </v-btn>
                    </template>
                    <v-list dense light nav>
                        <v-list-item dense flat>
                                <v-list-item-content class="pt-0 pb-0 notification-global-action" @click="markReadAll()">
                                    <v-chip>
                                        <v-icon size="15" >mdi-check-all</v-icon>
                                        <span> Mark all as read</span> 
                                    </v-chip>
                                </v-list-item-content>
                            
                        </v-list-item>     
                    </v-list>
                </v-menu>
            </v-col>
        </v-app-bar>
        <v-row class="ml-0 mr-0 pl-5 pr-5 list-notification bg-white" :z-index="99999">
            <v-row v-if="checkToday" class="w-100 fs-13 ml-3 mt-1" style="margin-bottom:-2px">
                <span style="color:orange; font-weight:430">{{$t('notification.today')}}</span>
            </v-row>
            <v-row v-if="checkToday" 
                v-for="item in listNotification.filter(x=>changeDate(x.createTime)==today)" 
                :key="item.id"
                class="text-left notification-item pt-0 pb-0"
            >
                <v-col cols="2">
                    <v-row> 
                         <v-list-item-avatar v-if="!item.icon">
                            <SymperAvatar  :userId="item.userRelatedId"/>
                        </v-list-item-avatar>
                        <v-list-item-avatar v-else>
                            <SymperAvatar  v-if="item.icon=='default.png'" />
                            <v-avatar v-else>
                                <!-- {{item.icon}} -->
                                <img v-if="!checkIcon(item.icon)" :src="setAvaOrIcon(item.icon)">
                                 <v-icon v-else >{{item.icon}}</v-icon>
                            </v-avatar>
                        </v-list-item-avatar>
                    </v-row>
                </v-col>
                <v-col cols="10" style="padding:6px!important" @click="openNotification(item)">
                    <v-row>
                        <span class="notification-item-title">
                            {{reNameContent(item.title)}}
                        </span>
                    </v-row>
                    <v-row class="notification-item-info mt-1">
                        <v-col cols="6" class="ellipsis">
                            <v-icon class="mr-2" size="12">{{$i('input.'+getScope(item.action))}}</v-icon>
                            <span >{{item.extraLabel?item.extraLabel:''}} {{item.extraValue?item.extraValue:''}}</span>
                        </v-col>
                        <v-col cols="6" class="text-right pr-3">
                            <span>{{$moment.unix(item.createTime).fromNow()}}</span>
                            <v-icon size="9" color="blue" class="ml-1" v-if="item.state=='0'">mdi-circle</v-icon>
                        </v-col>
                    </v-row>
                </v-col>
                   <!-- <v-divider style="width:95%" class="ml-2" ></v-divider> -->
                <v-menu
                    :close-on-content-click="true"
                    :open-on-hover="true"
                    :max-width="200"
                    :min-width="200"
                    :max-height="500"
                    offset-y
                    >
                    <template v-slot:activator="{ on }">
                        <v-btn depressed icon v-on="on" :absolute="true" :right="true" class="mt-3 notification-item-action">
                            <v-avatar color="#ffffff" size="30">
                                <v-icon>mdi-dots-horizontal</v-icon>
                            </v-avatar> 
                        </v-btn>
                    </template>
                    <v-list dense light nav>
                        <v-list-item dense flat
                            v-for="(actionItem, i) in item.actionMenu"
                            :key="i"
                        >
                            <template>
                                <v-list-item-content class="pt-0 pb-0" @click="actionNotification(item,actionItem.value)">
                                    <v-list-item-title class="font-weight-regular" v-text="actionItem.text"></v-list-item-title>
                                </v-list-item-content>
                            </template>
                        </v-list-item>    
                    </v-list>
                </v-menu>
            </v-row>
            <!-- older -->
            <v-row class="w-100 fs-13 ml-3 mt-1" style="margin-bottom:-3px"><span style="color:orange; font-weight:430">{{$t('notification.older')}}</span></v-row>
            <v-row
                v-for="item in listNotification.filter(x=>changeDate(x.createTime)!=today)" 
                :key="item.id"
                class="text-left notification-item  pt-0 pb-0"
            >
                <v-col cols="2">
                    <v-row>
                         <v-list-item-avatar v-if="!item.icon">
                            <SymperAvatar  :userId="item.userRelatedId"/>
                        </v-list-item-avatar>
                        <v-list-item-avatar v-else>
                            <SymperAvatar  v-if="item.icon=='default.png'" />
                            <v-avatar v-else>
                                <!-- {{item.icon}} -->
                                <img v-if="!checkIcon(item.icon)" :src="setAvaOrIcon(item.icon)">
                                 <v-icon v-else >{{item.icon}}</v-icon>
                            </v-avatar>
                        </v-list-item-avatar>
                    </v-row>
                </v-col>
                <v-col cols="10" style="padding:6px" @click="openNotification(item)">
                    <v-row v-if="getScope(item.action)=='comment'">
                        <span class="notification-item-title">
                            {{getName(item.userRelatedId)}} 
                        </span>
                         <span style="color:grey" class="fs-12 ml-1">
                             nhắc đến bạn trong bình luận
                        </span>
                    </v-row>
                    <v-row v-else>
                        <span class="notification-item-title">
                            {{item.title}} 
                        </span>
                    </v-row>
                    <v-row class="notification-item-info mt-1">
                        <v-col cols="6"  class="ellipsis">
                            <v-icon class="mr-2" size="12">{{$i('input.'+getScope(item.action))}}</v-icon>
                            <span>{{item.extraLabel}} {{item.extraValue}}</span>
                        </v-col>
                        <v-col cols="6" class="text-right pr-3">
                            <span>{{$moment.unix(item.createTime).fromNow()}}</span>
                            <v-icon size="9" color="blue" class="ml-1" v-if="item.state=='0'">mdi-circle</v-icon>
                        </v-col>
                    </v-row>
                </v-col>
                   <v-divider style="width:95%" class="ml-2" ></v-divider>
                <v-menu
                    :close-on-content-click="true"
                    :open-on-hover="true"
                    :max-width="200"
                    :min-width="200"
                    :max-height="500"
                    offset-y
                    >
                    <template v-slot:activator="{ on }">
                        <v-btn depressed icon v-on="on" :absolute="true" :right="true" class="mt-3 notification-item-action">
                            <v-avatar color="#ffffff" size="30">
                                <v-icon>mdi-dots-horizontal</v-icon>
                            </v-avatar> 
                        </v-btn>
                    </template>
                    <v-list dense light nav>
                        <v-list-item dense flat
                            v-for="(actionItem, i) in item.actionMenu"
                            :key="i"
                        >
                            <template>
                                <v-list-item-content class="pt-0 pb-0" @click="actionNotification(item,actionItem.value)">
                                    <v-list-item-title class="font-weight-regular" v-text="actionItem.text"></v-list-item-title>
                                </v-list-item-content>
                            </template>
                        </v-list-item>    
                    </v-list>
                </v-menu>
            </v-row>
            <!-- older -->
            <v-overlay :value="overlay">
                <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
        </v-row>
        <v-dialog v-model="dialogConfigNotification" width="600px" hide-overlay>
            <v-app-bar dense flat color="white" class="notification-list-bar" fixed>
                <slot name="header">
                    <v-toolbar-title class="nofitication-title-bar w-100">
                    <v-icon size="15">mdi-cog</v-icon> Config Notification
                     <v-icon
                            class="close-btn float-right"
                            @click="hideNotificationConfig()"
                        >mdi-close</v-icon>
                </v-toolbar-title>
                </slot>
            </v-app-bar>
            <v-row class="ml-0 mr-0 pl-5 pr-5 list-notification bg-white" :z-index="999">
                <slot name="body">
                    <v-row
                        class="text-left notification-item"
                    >
                    <v-col cols="1">
                        <v-row>
                            <v-icon size="30">mdi-file-document-outline </v-icon>
                        </v-row>
                    </v-col>
                    <v-col cols="11" @click="openSubcribeConfig('document')">
                        <v-row>
                            <span class="notification-subscribe-type-title">
                                Văn bản
                            </span>
                        </v-row>
                        <v-row class="mt-1">
                            <span class="notification-subscribe-type-description">
                                Cấu hình nhận thông báo khi có tác động đến document (bản ghi, sửa, xoá,...)
                            </span>
                        </v-row>
                    </v-col>
                    </v-row>
                </slot>
            </v-row>
        </v-dialog>
        <v-dialog v-model="dialogConfigNotificationSubscribe" width="600px" hide-overlay>
            <v-app-bar dense flat color="white" class="notification-list-bar" fixed>
                <slot name="header">
                    <v-toolbar-title class="notification-subscribe-type-title w-100">
                    {{dialogConfigNotificationSubscribeTitle}}<br/>
                    <span class="notification-subscribe-type-description">
                        {{dialogConfigNotificationSubscribeDescription}}
                    </span>
                     <v-icon
                            class="close-btn float-right"
                            @click="hideSubcribeConfig()"
                        >mdi-close</v-icon>
                </v-toolbar-title>
                </slot>
            </v-app-bar>
            <v-row class="ml-0 mr-0 pl-5 pr-5 list-notification bg-white" :z-index="999">
                <slot name="body">
                    <v-row
                        class="text-left notification-topic"
                        v-for="item in listTopic" 
                        :key="item.id"
                    >
                        <v-col cols="10" style="padding:6px!important">
                            <v-row>
                                <span class="notification-topic-title">{{item.name}}</span><br>
                                
                            </v-row>
                            <v-row>
                                <span class="notification-topic-description">{{item.description}}</span>
                            </v-row>
                        </v-col>
                
                        <v-col cols="2">
                            <v-row class="float-right">
                                <v-switch
                                class="p-0"
                                    v-model="item.subscribed"
                                    @change="changeSubcribedTopic(item.id,item.subscribed)"
                                    hide-details
                                    ></v-switch>
                            </v-row>
                        </v-col>
                    </v-row>
                </slot>
            </v-row>
        </v-dialog>
    </v-row>
</template>

<script>
import notificationApi from '../../api/settingNotification'
import Api from "../../api/api.js";
import icon from "../common/SymperIcon";
import listObject from "../../views/apps/singleObject";
import { appConfigs } from '../../configs';
import Vue from "vue";
import dayjs from 'dayjs';
import SymperAvatar from "@/components/common/SymperAvatar";
export default {
    name: "listApp",
    components: {
        icon,
        listObject,
        SymperAvatar
    },
    data: function() {
        return {
            img:'',
            listSource:{},
            overlay: true,
            checkToday: false,
            listNotification: [],
            txtSearch: '',
            dialogConfigNotification: false,
            dialogConfigNotificationSubscribe: false,
            dialogConfigNotificationSubscribeTitle: "",
            dialogConfigNotificationSubscribeDescription: "",
            dialogConfigNotificationSubscribeIcon: "",
            listTopic: []
        };
    },
    created() {
        this.$store.dispatch("app/getAllUsers");
        this.getListNoticication();
        this.getSource();
        //this.getAvatar();
      
    },
    mounted(){
        this.$evtBus.$on("app-receive-remote-msg", data => {
            this.getListNoticication();
        })
    },
    computed:{
        today:()=> dayjs().format('DD/MM/YYYY'),
    },
    methods: {
        checkIcon(icon){
            let check = true;
            if(icon.indexOf('user_avatar_')>-1){
                check = false;
            }
            return check
        },
        setAvaOrIcon(icon){
            if(icon){
                if(icon.indexOf('user_avatar_')>-1||icon=='default.png'){
                    return appConfigs.apiDomain.fileManagement+'readFile/'+icon ;}
            }       
        },
         reNameContent(des){
             let name = des;
             let nameModule = Object.keys(this.listSource);
             for(let j = 0;j<nameModule.length;j++){
                 for(let i = 0; i<this.listSource[nameModule[j]].parameter.length;i++){
                        let oldValue= new RegExp(this.listSource[nameModule[j]].parameter[i].value);
                        let newValue =this.listSource[nameModule[j]].parameter[i].text;
                    name = name.replace(oldValue,newValue);
                    }
             }
            return name
        },
        getSource(){
            const self = this;
            notificationApi.showAllModuleConfig().then(res=>{
                if(res.status==200){
                    self.listSource = res.data
                }
            })
        },
         getName(id){
            this.listUser = this.$store.state.app.allUsers;
            for(let i = 0; i<this.listUser.length;i++){
                if(this.listUser[i].id==id){
                    return this.listUser[i].userName;
                }
            }
        },
        getScope(action){
            if(action){
                return JSON.parse(action).module
            }
            
        },
        changeDate(value){
            return dayjs.unix(value).format('DD/MM/YYYY')
        },
        checkListToday(){
            for (let i = 0;i<this.listNotification.length;i++){
                let dayListNotification = dayjs.unix(this.listNotification[i].createTime).format('DD/MM/YYYY') ;
                let today = dayjs().format('DD/MM/YYYY') ;

                if(today==dayListNotification){
    
                    this.checkToday = true;
                }   
            }
            return this.checkToday
        },
        getListNoticication() { 
            let req = new Api(appConfigs.apiDomain.nofitication);
            req.get("/notifications",{'keyword':this.txtSearch})
            .then(res => {
                if (res.status == 200) {
                    this.overlay = false;
                    let tmp = res.data;
                    this.listNotification = tmp;
                    this.checkListToday();
                } else {
                    this.showError();
                }
            })
            .catch(err => {
                this.showError();
            })
        },
        openNotification(notificationItem){
            let extraParams = {
                openInNewTab: true
            };
            this.$evtBus.$emit('symper-app-call-action-handler', notificationItem.action, this, extraParams)
            this.markRead(notificationItem);
        },
        actionNotification(notificationItem,action){
            switch(action){
                case 'read':
                    this.markRead(notificationItem)
                    break;
                default:
                    var actionData=JSON.parse(notificationItem.action); 
                    actionData['action']=action;
                    console.log(actionData);
                    this.$evtBus.$emit('symper-app-call-action-handler', actionData, this, {openInNewTab: true})
                    this.markRead(notificationItem);
                    break;
            }
        },
        markRead(notificationItem){
            if(notificationItem.state=='0'){
                 let req = new Api(appConfigs.apiDomain.nofitication);
                req.post("/notifications/"+notificationItem.id+"/read")
                .then(res => {
                    if (res.status == 200) {
                        notificationItem.state = '1';
                        this.$store.state.app.unreadNotification -= 1;
                    } else {
                        this.showError();
                    }
                })
                .catch(err => {
                    this.showError();
                })
            }
        },
        deleteNotificationItem(notificationItem){
            if(notificationItem.state=='0'){
                 let req = new Api(appConfigs.apiDomain.nofitication);
                req.delete("/notifications/"+notificationItem.id)
                .then(res => {
                    if (res.status == 200) {
                        notificationItem.state = '1';
                        this.$store.state.app.unreadNotification -= 1;
                    } else {
                        this.showError();
                    }
                })
                .catch(err => {
                    this.showError();
                })
            }
        },
        showNotification(data){
            console.log('ok');
            console.log(data)
        },
        markReadAll(){
             let req = new Api(appConfigs.apiDomain.nofitication);
                req.post("/notifications/read")
                .then(res => {
                    if (res.status == 200) {
                        this.listNotification.map(function(item){
                            item.state = '1';
                            return item;
                        });
                        this.$store.state.app.unreadNotification = 0;
                    } else {
                        this.showError();
                    }
                })
                .catch(err => {
                    this.showError();
                })
        },
        searchNotification(){
            if(this.searchDebounce){
                clearTimeout(this.searchDebounce);
            }
            this.searchDebounce = setTimeout(this.getListNoticication,500);
            
        },
        showConfig(){
            this.dialogConfigNotification = true
        },
        hideNotificationConfig(){
            this.dialogConfigNotification = false
        },
        openSubcribeConfig(type){
            this.dialogConfigNotification = false;
            this.dialogConfigNotificationSubscribe = true;
            if(type=='document'){
                this.showSubcribesConfigDocument();
            }            
        },
        hideSubcribeConfig(){
            this.dialogConfigNotificationSubscribe = false;
             this.dialogConfigNotification = true;
        },
        showSubcribesConfigDocument() {
            this.dialogConfigNotificationSubscribeTitle = "Document" ;
            this.dialogConfigNotificationSubscribeDescription = "Cấu hình nhận thông báo từ việc thay đổi document" ;
            let req = new Api(appConfigs.apiDomain.nofitication);
            req.get("/channels",{})
            .then(res => {
                if (res.status == 200) {
                    this.overlay = false;
                    this.listTopic = res.data;
                } else {
                    this.showError();
                }
            })
            .catch(err => {
                this.showError();
            })
        },
        changeSubcribedTopic(id,state){
            let req = new Api(appConfigs.apiDomain.nofitication);
            req.post("/channels/"+id,{'state':state})
            .then(res => {
                if (res.status == 200) {
                    
                } else {
                    this.showError();
                }
            })
            .catch(err => {
                this.showError();
            })
        }
    }
}
</script>
<style scoped>
.v-card .list-app {
    max-height: 700px;
    overflow: auto;
}
.notification-item-title{
    font-size: 12px;
}
.notification-item-info .col{
    padding: 0;
    font-size: 11px;

}
.notification-item-info{
    color: #8E8E8E;
}
.notification-item{
    
    cursor: pointer;
    width: 100%;
    padding: 10px;
}
.notification-item:hover{
    background: #eeeeee!important;
}
.notification-topic{
    border-bottom: rgba(221,221,221,0.2) 1px solid;
    cursor: pointer;
    width: 100%;
    padding: 2px;
}
.notification-topic:hover{
    background: #eeeeee!important;
}
.notification-item-action{
    display: none;
}
.notification-item:hover .notification-item-action{
    display: block;
}
.v-list-item{
    cursor: pointer;
}
.v-list-item:hover{
    background: #eeeeee;
}
.notification-list-bar {
    position: sticky!important;
    padding: 0 5px;
}
.notification-list-bar >>> .v-toolbar__content{
    border-bottom: 1px solid #dddddd!important;
}
.notification-global-action{
    font-size: 12px;
    cursor: pointer;
}
.notification-global-action >>> .v-chip,.notification-global-action >>> .v-chip-content:hover{
    background: none;
    cursor: pointer;
}
.list-notification{
    width: 100%;
}
.notification-subscribe-type-title{
    font-size: 12px;
    font-weight: bold;
}
.notification-subscribe-type-description{
    font-size: 11px;
    color: #777777;
    font-weight: normal;
}
.notification-topic-title{
     font-size: 13px;
}
.notification-topic-description{
    font-size: 11px;
    color: #777777;
    font-weight: normal;
}
.v-list-item__avatar{
   margin-left:10px!important;
    margin-top:-8px!important;
}
.theme--light.v-divider {
    border-color: rgba(0, 0, 0, 0.05);
}
.ellipsis{
    overflow: hidden;
    white-space: nowrap; 
    text-overflow: ellipsis
}
</style>