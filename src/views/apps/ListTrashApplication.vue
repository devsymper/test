<template>
    <v-container fluid>
        <ListItems
            ref="listApp"
            :getDataUrl="apiUrl"
            :headerPrefixKeypath="'apps.header'"
            :pageTitle="$t('apps.titleTrashApplication')"
            :containerHeight="tableHeight"
            :tableContextMenu="tableContextMenu"
            :useDefaultContext="false"
            :customAPIResult="customAPIResult"
            :showActionPanelInDisplayConfig="false"
        >
        </ListItems>
    </v-container>
</template>
<script>
import Api from "./../../api/api.js";
import ListItems from "../../components/common/ListItems";
import {appManagementApi} from './../../api/AppManagement.js'
import Handsontable from 'handsontable';
import { appConfigs } from "@/configs.js";

export default {
    name: "listApps",
    components: {
        ListItems,
    },
    
    created(){
    },
    data: function() {
         let self = this;
        return {
            apiUrl: appConfigs.apiDomain.trash+'/items?type=application_definition',
            customAPIResult: {
                reformatData(res){
                     let mapIdToUser = self.$store.getters['app/mapIdToUser'];
                     res.data.forEach(function(e){
                         if(e.data != ""){
                            let newData = JSON.parse(e.data)
                            e.appId = newData.id
                            e.appName = newData.name
                            e.userDeletedName = mapIdToUser[e.userDeleted].displayName
                         }
                     })
                   return{
                       columns:[
                            {name: "appId", title: "id", type: "numeric", noFilter: true},
                            {name: "appName", title: "name", type: "text", noFilter: true},
                            {name: "userDeletedName", title: "userDeletedName", type: "text", noFilter: true,},
                            {name: "userAgent", title: "userAgent", type: "text",noFilter: true},
                            {name: "roleDeleted", title: "roleDeleted", type: "date",noFilter: true},
                            {name: "deletedAt", title: "deletedAt", type: "date",noFilter: true}
                       ],
                       listObject:res.data,
                       total: res.data.length
                   }
                }
            },
            tableContextMenu: {
               restore: {
                    name: "restore",
                    text: this.$t("common.restore"),
                    callback: (row, refreshList) => {
                          appManagementApi.restore(row.appId).then(res=>{
                           if(res.status == 200){
                               appManagementApi.deleteTrashItem(row.appId).then(resA=>{
                                   if(resA.status == 200){
                                     refreshList();
                                     self.$snotify({
                                        type: "success",
                                        title: "Restore success",
                                    });
                                   }
                               })
                           }
                       }).catch(err=>{})
                    },
                },
               
            },
			tableHeight: 0,
      };
    },
    mounted() {
        this.tableHeight = document.body.clientHeight - 0;
    },
    methods: {
        showError(){
            this.$snotify({
                type: 'error',
                title: this.$t('notification.errorTitle'),
                text: this.$t('notification.error')
            })
        },
    },
};
</script>