<template>
<div class="w-100">
     <list-items
        ref="listImport"
        :showImportHistory="false"
        :showButtonAdd="false"
        :headerPrefixKeypath="'timesheet'"
        :useDefaultContext="false"
        :pageTitle="$t('timesheet.table.category')"
        :containerHeight="containerHeight"
        :showExportButton="false"
        :customAPIResult="customAPIResult"
        :tableContextMenu="tableContextMenu"
        :getDataUrl="getListUrl">
    </list-items>
    </div>
</template>
<script>
import { documentApi } from "./../../api/Document.js";
import ActionPanel from "./../../views/import/Detail.vue";
import ListItems from "./../../components/common/ListItems.vue";
import importApi from "./../../api/ImportExcel";
import { util } from "./../../plugins/util.js";
import { appConfigs } from '../../configs';
import Handsontable from 'handsontable';

export default {
    components: {
        "list-items": ListItems,
        "action-panel": ActionPanel,
        Handsontable
    },
    data(){
        const self = this
        return {
            showDetailView:false,
            listRowUser:[],
            listUser:[],
            nameUser:[],
            importInfo:{},
            drawer:false,
            showImportUser:false,
            customAPIResult: {
                setStatus(status){
                    let nameStatus = '';
                    switch(status){
                        case '0':
                            nameStatus = "Dừng";
                            break;
                         case '1':
                            nameStatus = "Đang sử dụng";
                            break;
                    }
                    return nameStatus;
                },
                  reformatData(res){
                    let data={
                        listObject:[],
                        columns:[]
                    };
                    data.listObject = res.data.category;
                    data.columns.push(
                        {
                            name:'id',
                            title:'table.id',
                            type:"numeric"
                        },
                        {
                            name:'name',
                            title:'table.name',
                            type:"text"
                        },
                        {
                            name:'key',
                            title:'table.key',
                            type:"text"
                        },
                         {
                            name:'description',
                            title:'table.description',
                            type:"text"
                        },
                        {
                            name:'user_created',
                            title:'table.user_created',
                            type:"text"
                        },
                        {
                            name:'date_created',
                            title:'table.date_created',
                            type:"text"
                        },
                        {
                            name:'status',
                            title:'table.status',
                            type:"text"
                        },
                        {
                            name:'user_updated',
                            title:'table.user_updated',
                            type:"text"
                        },
                        {
                            name:'date_updated',
                            title:'table.date_updated',
                            type:"text"
                        },
                         
                      
                   );
                    data.listObject.map(x=>x.status=this.setStatus(x.status))
                    return  data;
                } 
            },
             tableContextMenu:{
                  view: {
                    name:"view",
                    text:this.$t('timesheet.table.view'),
                    callback: (cate, callback) => {
                        this.showDetail(cate);
                    }
                },
                 downloadExcel: {
                    name:"update",
                    text:this.$t('timesheet.table.update'),
                    callback: (cate, callback) => {
                        this.downloadExcel(cate);
                    }
                }
            },
            getListUrl: '',
            actionPanelWidth:800,
            containerHeight: 200,
            columns: [],
            totalPage: 6,
            listDocument: [],
        }
    },
    mounted() {
        this.calcContainerHeight();
    },
    created(){
        this.getListUrl = appConfigs.apiDomain.timesheet+'category';
    },
    methods:{
     
       
        refreshListUser(){
            this.$refs.listUser.refreshList();
        },
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        }
    }
}
</script>