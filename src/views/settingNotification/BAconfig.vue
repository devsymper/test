<template>
<div class="w-100">
     <list-items
        ref="listUser"
        :headerPrefixKeypath="'notificationConfig'"
        :useDefaultContext="false"
        :showExportButton="false"
        :showImportHistory="false"
        :pageTitle="'Thông báo'"
        :tableContextMenu="tableContextMenu"
        :containerHeight="containerHeight"
        :customAPIResult="customAPIResult"
        :showImportButton="false"
        :getDataUrl="'https://notifi.symper.vn/channels'"
        :actionPanelWidth="actionPanelWidth"
        :commonActionProps="commonActionProps">
        <div slot="right-panel-content" class="h-100" style="overflow:hidden!important">
           <configNotification />
        </div>
        </list-items>
    </div>
</template>
<script>
import { userApi } from "./../../api/user.js";
import ListItems from "./../../components/common/ListItems.vue";
import configNotification from "./../../components/notification/setting/BAconfig";
import { util } from "./../../plugins/util.js";
import { appConfigs } from '../../configs';

export default {
    components: {
        "list-items": ListItems,
        configNotification
    },
    data(){
        return {
            customAPIResult: {
                renameStatus(status){
                    let nameStatus = '';
                    switch(status){
                        case false:
                            nameStatus = "Bỏ theo dõi";
                            break;
                      
                         case true:
                            nameStatus = "Theo dõi";
                            break;
                    }
                    return nameStatus;
                },
                reformatData(res){
                    let data={listObject:[],columns:[]};
                    data.listObject = res.data;

                   data.columns.push(
                    {
                       name:'id',
                       title:'table.id',
                       type:"numeric"
                   },
                   {
                       name:'objectType',
                       title:'table.objectType',
                       type:"text"
                   },
                   {
                       name:'event',
                       title:'table.event',
                       type:"text"
                   },
                   {
                       name:'defaultUser',
                       title:'table.defaultUser',
                       type:"text"
                   },
                   {
                       name:'description',
                       title:'table.description',
                       type:"text"
                   },
                   {
                       name:'subscribed',
                       title:'table.subscribed',
                       type:"text"
                   },
                   {
                       name:'userCreate',
                       title:'table.userCreate',
                       type:"text"
                   },
                   {
                       name:'createAt',
                       title:'table.createAt',
                       type:"text"
                   },
                    {
                       name:'userUpdate',
                       title:'table.userUpdate',
                       type:"text"
                   },
                    {
                       name:'updateAt',
                       title:'table.updateAt',
                       type:"text"
                   },
                   {
                       name:'subscribedAt',
                       title:'table.subscribedAt',
                       type:"text"
                   },
                   )
                     for(let i = 0; i<data.listObject.length; i++){
                        data.listObject[i].subscribed = this.renameStatus(data.listObject[i].subscribed);
                    }
                   
                    return  data;
                } 
            },
            getListUrl: {},
            actionPanelWidth:520,
            containerHeight: 100,
        }
    },
    mounted() {
        this.calcContainerHeight();
    },
    created(){
    },
    methods:{
        refreshListUser(){
            this.$refs.listUser.refreshList();
        },
        showViewDetailInfo(user){
            this.showDetailView=!this.showDetailView;
            this.showViewInfo = true;
            this.$refs.panel.setDetailInfo(user);
            this.$refs.listUser.openactionPanel();

        },
        closePanel(){
            this.isSettingPasswordView = false;
            this.$refs.listUser.closeactionPanel();
        },
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        }
    }
}
</script>