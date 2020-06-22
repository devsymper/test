<template>
    <v-row>
        <v-app-bar dense flat color="white" class="notification-list-bar" fixed>
            <v-toolbar-title class="nofitication-title-bar">
                Notification
            </v-toolbar-title>
            <v-col :cols="10" class="text-right pt-1 pb-1 pr-0">
                <!-- Tìm kiếm -->
                <v-text-field dense
                    class="bg-grey sym-small-pad sym-small-size d-inline-block mr-2"
                    append-icon="mdi-magnify"
                    flat
                    solo
                    v-on:keyup="searchNotification"
                    v-model="txtSearch"
                    :placeholder="$t('common.search')"
                ></v-text-field>
               
                <v-menu
                    :close-on-content-click="true"
                    :open-on-hover="true"
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
                        <v-list-item dense flat>
                            <v-list-item-content class="pt-0 pb-0  notification-global-action" @click="showConfig()">
                                <v-chip>
                                    <v-icon size="15">mdi-cog</v-icon>
                                        Config notification
                                </v-chip>
                                    
                                                                    
                            </v-list-item-content>
                        </v-list-item>    
                    </v-list>
                </v-menu>
            </v-col>
        </v-app-bar>
        <v-row class="ml-0 mr-0 pl-5 pr-5 list-notification bg-white" :z-index="99999">
            <v-row
                v-for="item in listNotification" 
                :key="item.id"
                class="text-left notification-item"
            >
                <v-col cols="1">
                    <v-row>
                        <v-icon size="35">mdi-account</v-icon>
                    </v-row>
                </v-col>
                <v-col cols="11" @click="openNotification(item)">
                    <v-row>
                        <span class="notification-item-title">
                            {{item.title}}
                        </span>
                    </v-row>
                    <v-row class="notification-item-info mt-1">
                        <v-col cols="6">
                            <v-icon class="mr-2" size="12">mdi-cog</v-icon>
                            <span>{{item.extraLabel}} {{item.extraValue}}</span>
                        </v-col>
                        <v-col cols="6" class="text-right pr-3">
                            <span>{{$moment.unix(item.createTime).fromNow()}}</span>
                            <v-icon size="9" color="blue" class="ml-1" v-if="item.state=='0'">mdi-circle</v-icon>
                        </v-col>
                    </v-row>
                </v-col>
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
            <v-overlay :value="overlay">
                <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
        </v-row>
        
        <v-dialog v-model="dialogConfigNotification" width="600px">
            <v-app-bar dense flat color="white" class="notification-list-bar" fixed>
                <v-toolbar-title class="nofitication-title-bar w-100">
                    <v-icon size="15">mdi-cog</v-icon> Config Notification
                     <v-icon
                            class="close-btn float-right"
                            @click="hideNotificationConfig()"
                        >mdi-close</v-icon>
                </v-toolbar-title>
                
            </v-app-bar>
            <v-row class="ml-0 mr-0 pl-5 pr-5 list-notification bg-white" :z-index="99999">
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
                
            </v-row>
        </v-dialog>
        <v-dialog v-model="dialogConfigNotificationSubscribe" width="600px">
            <v-app-bar dense flat color="white" class="notification-list-bar" fixed>
                <v-toolbar-title class="nofitication-title-bar w-100">
                    <v-row>
                        <v-col cols="1">
                            <v-icon size="15">{{dialogConfigNotificationSubscribeIcon}}</v-icon>
                        </v-col>
                        <v-col cols="10">
                            <v-row>
                                {{dialogConfigNotificationSubscribeTitle}}
                            </v-row>
                            <v-row>
                                <span>{{dialogConfigNotificationSubscribeDescription}}</span>
                            </v-row>
                        </v-col>
                     <v-icon
                            class="close-btn float-right"
                            @click="hideSubcribeConfig()"
                        >mdi-close</v-icon>
                        </v-row>
                </v-toolbar-title>
                
            </v-app-bar>
            
        </v-dialog>
    </v-row>
</template>

<script>
import Api from "../../api/api.js";
import icon from "../common/SymperIcon";
import listObject from "../../views/apps/singleObject";
import { appConfigs } from '../../configs';
import Vue from "vue";
export default {
    name: "listApp",
    components: {
        icon,
        listObject
    },
    data: function() {
        return {
            overlay: true,
            listNotification: [],
            txtSearch: '',
            dialogConfigNotification: false,
            dialogConfigNotificationSubscribe: false,
            dialogConfigNotificationSubscribeTitle: "",
            dialogConfigNotificationSubscribeDescription: "",
            dialogConfigNotificationSubscribeIcon: "",
        };
    },
    created() {
        this.getListNoticication();
    },
    mounted(){
        this.$evtBus.$on("app-receive-remote-msg", data => {
            this.getListNoticication();
        }
        )
    },
    methods: {
        getListNoticication() { 
            let req = new Api(appConfigs.apiDomain.nofitication);
            req.get("/notifications",{'keyword':this.txtSearch})
            .then(res => {
                if (res.status == 200) {
                    
                    this.overlay = false;
                    let tmp = res.data;
                    this.listNotification = tmp;
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
            this.$evtBus.$emit('symper-app-call-action-handeler', notificationItem.action, this, extraParams)
            this.markRead(notificationItem);
            
        },
        actionNotification(notificationItem,action){
            switch(action){
                case 'read':
                    this.markRead(notificationItem)
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
        searchNotification(event){
            this.getListNoticication()
        },
        showConfig(){
            this.dialogConfigNotification = true
        },
        hideNotificationConfig(){
            this.dialogConfigNotification = false
        },
        openSubcribeConfig(type){
            // this.dialogConfigNotification = false;
            // this.dialogConfigNotificationSubscribeTitle = "document" ;
            // this.dialogConfigNotificationSubscribeDescription = "document" ;
            // this.dialogConfigNotificationSubscribe = true;
        },
        hideSubcribeConfig(){
            this.dialogConfigNotificationSubscribe = false;
             this.dialogConfigNotification = true;
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
    border-bottom: rgba(221,221,221,0.2) 1px solid;
    cursor: pointer;
    width: 100%;
    padding: 10px;
}
.notification-item:hover{
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
}


</style>