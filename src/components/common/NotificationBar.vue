<template>
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
                        {{item.title}}x
                    </span>
                </v-row>
                <v-row class="notification-item-info mt-1">
                    <v-col cols="6">
                        <v-icon class="mr-2" size="12">mdi-cog</v-icon>
                        <span>{{item.relatedObjectTitle}}</span>
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
</template>

<script>
import Api from "../../api/api.js";
import icon from "./SymperIcon";
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
            listNotification: []
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
            req.get("/notifications")
            .then(res => {
                if (res.status == 200) {
                    
                    this.overlay = false;
                    let tmp = res.data;
                    // tmp.forEach(function(item,index0){
                    //     tmp[index0].actionMenu = [
                    //         {
                    //             value: 'delete',
                    //             text: $t("notificationItem.action.delete"),
                    //         },
                    //         {
                    //             value: 'unsubscribe',
                    //             text: $t("notificationItem.action.unsubscribe"),
                    //         }
                    //     ];
                    //     if(tmp[index0].state =='0'){
                    //         tmp[index0].actionMenu.unshift({
                    //             value: 'read',
                    //             text: $t("notificationItem.action.read"),
                    //         });
                    //     }
                    // });
                    this.listNotification = tmp;
                } else {
                    this.showError();
                }
            })
            .catch(err => {
                this.showError();
            })
        },
        configActionNotificationItem(notificationItem){
            notificationItem.actionMenu=[
                {
                    value: 'delete',
                    text: $t("notificationItem.action.delete"),
                },
                {
                    value: 'unsubscribe',
                    text: $t("notificationItem.action.unsubscribe"),
                }
            ];
            if(notificationItem.state =='0'){
                notificationItem.actionMenu.unshift({
                    value: 'read',
                    text: $t("notificationItem.action.read"),
                });
            }
        },
        openNotification(notificationItem){
            //
            //open new tab
            //
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
        showNotification(data){
            console.log('ok');
            console.log(data)
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
}
.notification-item-info{
    color: #8E8E8E;
}
.notification-item{
    border-bottom: rgba(221,221,221,0.2) 1px solid;
    cursor: pointer;
    width: 100%;
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
</style>