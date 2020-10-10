<template>
<div class="w-100">
     <list-items
        @cancel-import="cancelImport()"
        ref="listImport"
        :headerPrefixKeypath="'import.table'"
        :useDefaultContext="false"
        :pageTitle="$t('import.import_history')"
        :containerHeight="containerHeight"
        :customAPIResult="customAPIResult"
        :tableContextMenu="tableContextMenu"
        :getDataUrl="'https://io.dev.symper.vn/history/document'"
        :commonActionProps="commonActionProps">
    </list-items>
    </div>
</template>
<script>
import { userApi } from "./../../api/user.js";
import ListItems from "./../../components/common/ListItems.vue";
import ActionPanel from "./../../views/users/ActionPanel.vue";
import { util } from "./../../plugins/util.js";
import { appConfigs } from '../../configs';

export default {
    components: {
        "list-items": ListItems,
    },
    data(){
        return {
            showDetailView:false,
            listRowUser:[],
            showImportUser:false,
            customAPIResult: {
                reformatData(res){
                    let data = res.data;
                    return data;
                } 
            },
             tableContextMenu:{
                view: {
                    name:"viewDetail",
                    text:this.$t('import.table.contextMenu.viewDetail'),
                    callback: (importEx, callback) => {
                        this.showViewSetingPassword(importEx);
                    
                    }
                }
            },
            commonActionProps: {
                "module": "account",
                "resource": "account",
                "scope": "account",
            },
            getListUrl: {},
            actionPanelWidth:800,
            containerHeight: 200,
            columns: [],
            data: [],
            totalPage: 6,
            actionType:'',
            isSettingPasswordView : false,
            showViewInfo: false
        }
    },
    mounted() {
        this.calcContainerHeight();
    },
    created(){
        debugger
          this.$refs.listImport.showExportButton=false;
          this.$refs.listImport.showButtonAdd=false;
        this.getListUrl = appConfigs.apiDomain.importExcel+'history?page=1&pageSize=20';
    },
    watch:{
        
    },
    methods:{
        cancelImport(){
            alert('Hello')
        },
        refreshListUser(){
            this.$refs.listUser.refreshList();
        },
        changePage(page){
            alert('ok');
        },
        calcContainerHeight() {
            debugger
            this.containerHeight = util.getComponentSize(this).h;
        }
    }
}
</script>
<style >
    /* .v-navigation-drawer{
        width: 1200px!important
    } */
</style>
