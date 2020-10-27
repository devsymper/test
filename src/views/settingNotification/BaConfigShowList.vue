<template>
<div class="w-100">
     <list-items
        ref="listNotification"
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
        :actionPanelWidth="actionPanelWidth">
        <div slot="right-panel-content" class="h-100" style="overflow:hidden!important">
           <configNotification 
            @refreshList="refreshListNotification()"
           />
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
import notificationApi from './../../api/settingNotification'

export default {
    components: {
        "list-items": ListItems,
        configNotification
    },
    data(){
        const self = this;
        return {
            customAPIResult: {
                reformatData(res){
                    let data={
                        listObject:[],
                        columns:[]
                    };
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
                            name:'state',
                            title:'table.state',
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
                        data.listObject[i].state = self.renameStatus(data.listObject[i].state);
                        data.listObject[i].objectType = self.$t('objects.'+data.listObject[i].objectType);
                        
                    }
                    return  data;
                } 
            },
            getListUrl: {},
            listSource:{},
            actionPanelWidth:520,
            tableContextMenu:{
                delete: {
                    name:"delete",
                    text:this.$t('user.table.contextMenu.delete'), 
                    callback: (notification, callback) => {
                        this.deleteNotification(notification);
                    }
                }
            },
            containerHeight: 100,
        }
    },
    mounted() {
        this.calcContainerHeight();
    },
    created(){
        this.getSource();
    },
    methods:{
        getSource(){
            const self = this;
            notificationApi.showAllModuleConfig().then(res=>{
                if(res.status==200){
                    self.listSource = res.data
                }
            })
        },
        renameEvent(nameModule,event){
            let name = ' ';
            if(nameModule&&event){
               for(let i = 0; i<this.listSource[nameModule].event.length;i++){
                    if(this.listSource[nameModule].event[i].value==event){
                        name =  this.listSource[nameModule].event[i].text;
                        return name;
                   }else{
                       return event
                   }
                }
            }else{
                return event
            }
        },
         renameStatus(status){
            let nameStatus = '';
            switch(status){
                case '0':
                    nameStatus = "Bỏ theo dõi";
                    break;
                
                    case '1':
                    nameStatus = "Theo dõi";
                    break;
            }
            return nameStatus;
        },
        refreshListNotification(){
            this.$refs.listNotification.refreshList();
        },
        deleteNotification(notification){
            const self = this;
            notificationApi.deleteNotification(notification[0].id).then(res=>{
                if(res.status==200){
                    self.$snotify({
                        type: "success",
                        title: "Xóa thông báo thành công",
                    });
                     this.$refs.listNotification.refreshList();
                }else{
                    self.$snotify({
                        type: "error",
                        title: "Xóa thông báo không thành công",
                    });
                }
      
            })
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