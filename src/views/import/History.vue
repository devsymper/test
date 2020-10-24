<template>
<div class="w-100">
     <list-items
        ref="listImport"
        :showImportHistory="false"
        :showButtonAdd="false"
        :headerPrefixKeypath="'import.table'"
        :useDefaultContext="false"
        :pageTitle="$t('import.import_history')"
        :containerHeight="containerHeight"
        :showExportButton="false"
        :customAPIResult="customAPIResult"
        :tableContextMenu="tableContextMenu"
        :getDataUrl="'https://io.dev.symper.vn/history/document'">
    </list-items>
     <v-navigation-drawer
        width="500"
        v-model="drawer"
        absolute
        temporary
        right
      >
       <action-panel :importInfo="importInfo" />
      </v-navigation-drawer>
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
                setObjectType(obj){
                    let name = '';
                    switch(obj){
                        case '1':
                            name = "Doc nghiệp vụ";
                            break;
                        case '3':
                            name = "Doc hệ thống";
                            break;
                        
                        case '2':
                            name = "Doc danh mục";
                            break;
                        case null:
                            name = "Để trống";
                     }
                return name;
                },
                setStatusImport(status){
                    let nameStatus = '';
                    switch(status){
                        case '0':
                            nameStatus = "Chưa import";
                            break;
                        case '-1':
                            nameStatus = "Lỗi";
                            break;
                         case '1':
                            nameStatus = "Đang xử lý";
                            break;
                            
                        case '2':
                            nameStatus = "Hoàn thành";
                            break;
                        default:
                            nameStatus = "Hoàn thành" 
                    }
                    return nameStatus;
                },
                setNameDocument(){
                    let listDoc = this.listDocument;
                },
                reformatData(ress){
                    let data = ress.data;
                    let listIdDoc = [];
                    for(let i = 0; i<data.listObject.length; i++){
                        if(data.listObject[i].objId){
                            listIdDoc.push(Number(data.listObject[i].objId));
                        }
                        data.listObject[i].status = this.setStatusImport(data.listObject[i].status);
                        data.listObject[i].subObjType = this.setObjectType(data.listObject[i].subObjType);
                    }
                    let listDocName = [];
                    listIdDoc=listIdDoc.filter((item, index) => listIdDoc.indexOf(item) === index);
                    documentApi.getBatchDocument({ids:JSON.stringify(listIdDoc)}).then(res => {
                        if (res.status === 200) {
                            listDocName.push(res.data);
                            for(let i = 0; i<data.listObject.length; i++){
                                for(let j = 0; j<listDocName[0].length;j++){
                                    if(listDocName[0][j].id==data.listObject[i].objId){
                                        data.listObject[i].objId = listDocName[0][j].title;
                                    }
                                }
                            }
                            self.$refs.listImport.rerenderTable();
                        }
                    })
                    .catch(console.log);
                     data.columns[7].renderer = function(instance, td, row, col, prop, value, cellProperties){
                         let span;
                        Handsontable.dom.empty(td);
                        let div = document.createElement('div')
                        span = document.createElement('span')
                        if(value === "Lỗi"){
                            $(span).css("color",'red');
                            $(span).text('Lỗi')
                        }
                        else if(value === "Chưa import"){
                            $(span).css("color",'orange');
                            $(span).text('Chưa import')
                        }
                        else if(value === "Đang xử lý"){
                            $(span).css("color",'blue');
                            $(span).text('Chưa import')
                        }
                        else{
                            $(span).css("color",'green');
                            $(span).text('Hoàn thành')
                        }
                        td.appendChild(span);
                        return td
                     }
                    return  data;
                } 
            },
             tableContextMenu:{
                view: {
                    name:"viewDetail",
                    text:this.$t('import.table.contextMenu.viewDetail'),
                    callback: (importEx, callback) => {
                        this.showDetail(importEx);
                    }
                },
                 downloadExcel: {
                    name:"downloadExcel",
                    text:this.$t('import.table.contextMenu.download'),
                    callback: (importEx, callback) => {
                        this.downloadExcel(importEx);
                    }
                }
            },
            getListUrl: {},
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
        this.getListUrl = appConfigs.apiDomain.importExcel+'history?page=1&pageSize=20';
    },
    methods:{
        downloadExcel(importEx){
            let fileName = importEx.fileName;
            window.location.href = "https://io.dev.symper.vn/download/"+fileName
        },
        showDetail(importEx){
             this.importInfo = importEx;
             this.drawer =!this.drawer
        },
        refreshListUser(){
            this.$refs.listUser.refreshList();
        },
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        }
    }
}
</script>