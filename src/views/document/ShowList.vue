<template>
<div style="width:100%">
    <list-items
        ref="listDocument"
        :getDataUrl="'https://sdocument-management.symper.vn/documents'"  
        :useDefaultContext="false"
        :tableContextMenu="tableContextMenu"
        :pageTitle="$t('document.title')"
        :containerHeight="containerHeight"
        :actionPanelWidth="actionPanelWidth"
        @after-open-add-panel="addDocument"
        :headerPrefixKeypath="'document'"
        :commonActionProps="commonActionProps"
    >
        <div slot="right-panel-content" class="h-100">
            <submit-view 
                ref="submitView" 
                :isQickSubmit="true" 
                :action="'submit'" 
                @submit-document-success="aftersubmitDocument" 
                :docId="documentId"/>
        </div> 
    </list-items>
         <ImportExcelPanel
            :options="options"
            :nameRows="listRowDocument"
            :open="showImportPanel" />

</div>
</template>
<script>

import ImportExcelPanel from "./../../components/document/ImportExelPanel";
import { documentApi } from "./../../api/Document.js";
import ListItems from "./../../components/common/ListItems.vue";
import ActionPanel from "./../../views/users/ActionPanel.vue";
import ChangePassPanel from "./../../views/users/ChangePass.vue";
import Submit from './submit/Submit'
import { util } from "./../../plugins/util.js";
export default {
    components: {
        ImportExcelPanel: ImportExcelPanel,
        "list-items": ListItems,
        "action-panel": ActionPanel,
        'submit-view':Submit
    },
    data(){
        return {
            documentId:0,
            options:{
            },
            propertyDocument:[],
            listRowDocument:[],
            commonActionProps: {
                "module": "document",
                "resource": "document_definition",
                "scope": "document",
            },
            showImportPanel:false,
            actionPanelWidth:830,
            containerHeight: 200,
            tableContextMenu:{
                edit: {
                    name: "editdoc",
                    text: function() {
                        return " <i class= 'mdi mdi-file-document-edit-outline' > </i>&nbsp; Sửa";
                    },
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/editor/edit',document.title);
                    },
                },
               
                clone: {
                    name: "cloneDoc",
                    text: function() {
                        return " <i class= 'mdi mdi-file-document-multiple-outline' > </i>&nbsp; Nhân bản";
                    },
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/editor/clone',"Nhân bản "+document.title);
                    },
                },
                submit: {
                    name: "submit",
                    text: function() {
                        return " <i class= 'mdi mdi-file-document-outline' > </i>&nbsp; Nhập liệu";
                    },
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/submit',document.title);
                    },
                },
                quick_submit :{
                    name: "quickSubmit",
                    text: function() {
                        return " <i class= 'mdi mdi-text-box-plus-outline' > </i>&nbsp; Nhập liệu nhanh";
                    },
                    callback: (document, callback) => {
                        this.$refs.listDocument.openactionPanel();
                        this.documentId = parseInt(document.id)
                    },
                },
                list: {
                    name: "listObject",
                    text: function() {
                        return " <i class= 'mdi mdi-format-list-checkbox' > </i>&nbsp; Danh sách bản ghi";
                    },
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/objects',"Danh sách bản ghi");
                    },
                },
                list_draft: {
                    name: "listDraftObject",
                    text: function() {
                        return " <i class= 'mdi mdi-playlist-edit' > </i>&nbsp; Danh sách bản nháp";
                    },
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/draft-objects',"Danh sách bản nháp");
                    },
                },
                 print_config: {
                    name: "printConfig",
                    text: function() {
                        return " <i class= 'mdi mdi-printer-3d-nozzle-outline' > </i>&nbsp; Cấu hình in";
                    },
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/editor/print-config',document.title);
                    },
                },
                list_print_config: {
                    name: "listPrintConfig",
                    text: function() {
                        return " <i class= 'mdi mdi-format-list-checkbox' > </i>&nbsp; Danh sách bản in";
                    },
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/print-config',"Danh sách bản in");
                    },
                },
                // drop: {
                //     name:"delete",
                //     text:function() {
                //         return " <i class= 'mdi mdi-delete-outline' > </i>&nbsp; Xóa";
                //     },
                //     callback: (document, callback) => {
                //         let ids = document.reduce((arr,obj)=>{
                //             arr.push(obj.id);
                //             return arr;
                //         },[]);
                //         let thisCpn = this;
                //         documentApi
                //         .deleteDocument({ids:ids.join()})
                //         .then(res => {
                //             if (res.status == 200) {
                //                 thisCpn.$snotify({
                //                     type: "success",
                //                     title: "Delete document success!"
                //                 });  
                //                 thisCpn.$refs.listDocument.refreshList();
                //             }
                //             else{
                //                 thisCpn.$snotify({
                //                     type: "error",
                //                     title: res.messagr
                //                 });  
                //             }
                //         })
                //         .catch(err => {
                //             console.log("error from delete document api!!!", err);
                //         })
                //         .always(() => {});
                //     },
                // },
                trash:{
                    name:"remove",text:
                    function() {
                        return " <i class= 'mdi mdi-delete-outline' > </i>&nbsp; Xóa";
                    },
                    callback: (document, callback) => {
                        let ids = document.reduce((arr,obj)=>{
                            arr.push(obj.id);
                            return arr;
                        },[]);
                        let thisCpn = this;
                        documentApi
                        .moveToTrash({ids:ids.join()})
                        .then(res => {
                            if (res.status == 200) {
                                thisCpn.$snotify({
                                    type: "success",
                                    title: "Delete document success!"
                                });  
                                thisCpn.$refs.listDocument.refreshList();
                            }
                            else{
                                thisCpn.$snotify({
                                    type: "error",
                                    title: res.messagr
                                });  
                            }
                        })
                        .catch(err => {
                            console.log("error from delete document api!!!", err);
                        })
                        .always(() => {});
                    },
                },
                importExcel:{
                    name: "importExcel",
                    text: function() {
                        return " <i class= 'mdi mdi-file-upload-outline' > </i>&nbsp; Import Excel";
                    },
                    callback: (document, callback) => {
                        const self = this;
                        self.showImportPanel = !self.showImportPanel; 
                        self.documentId = Number(document.id);
                       // this.documentId = 1729;
                    },
                },
            },
        }
    },
    mounted() {
        this.calcContainerHeight();
    },
    created(){
        let thisCpn = this;
        this.$evtBus.$on('change-user-locale',(locale)=>{
            thisCpn.tableContextMenu = [
                {name:"passwordsetting",text:this.$t('user.table.contextMenu.passwordSetting')},
                {name:"edit",text:this.$t('user.table.contextMenu.edit')}
            ]
        });
    },
    watch:{
        documentId(){
            this.getApiDocument();
        }
    },
    methods:{
        getApiDocument(){
            const self = this;
            documentApi.detailDocument(this.documentId)
            .then(res => {
                if (res.status === 200) {
                   self.options.objId =self.documentId;
                   self.options.objType = 'document';
                   self.options.subObjType = res.data.document.type;
                  
                   self.options.nameObj = res.data.document.title;
                   self.propertyDocument = Object.values(res.data.fields);
                    // lưu tên của các property từ API document vào mảng  
                    let tableNames = [];
                    let tableTitle = [];
                    for (let i = 0; i < self.propertyDocument.length; i++) {
                        if (this.propertyDocument[i].type === 'table') {
                            tableNames.push(self.propertyDocument[i].properties.name);
                            tableTitle.push(self.propertyDocument[i].properties.title);
                        };
                    };
                    // khởi tạo mảng lưu các giá trị của table document
                       self.createTable(tableNames, tableTitle);
                }
            })
            .catch(err => {
               // console.log(err)
            })
        },
        getDataType(controlType) {
            let typeMap = {
                number: 'number',
                month: 'number',
                percent: 'number',
                date: 'date',
                time: 'time',
                datetime: 'datetime',
                table: 'table'
            }
            if (typeMap[controlType]) {
                return typeMap[controlType];
            } else {
                return 'text';
            }
        },
        createTable(tableNames,tableTitle) {
            // general
            let controls = [];
            for (let i = 0; i < this.propertyDocument.length; i++) {
                if(['submit','approvalHistory','reset','draft'].includes(this.propertyDocument[i].type)){
                    continue
                }
                controls.push({
                    name: this.propertyDocument[i].properties.name,
                    title: this.propertyDocument[i].properties.title,
                    isKeyControl: false,
                    isNull:this.checkIsRequired(this.propertyDocument[i].properties.isRequired),
                    dataColumn: null,
                    dataType: this.getDataType(this.propertyDocument[i].type)
                });
             
            };
            let tables = [{
                sheetMap: '',
                name: 'Thông tin chung',
                title: 'Thông tin chung',
                controls,
            }]
            // tables
            for (let i = 0; i < tableNames.length; i++) {
                tables.push({
                    sheetMap: '',
                    title:tableTitle[i],
                    keyColumn: {
                        index: -1,
                        name: ''
                    },
                    name: tableNames[i],
                    controls: this.findControlsForTable(tableNames[i]),
                 })
            }
            this.listRowDocument = tables;
        },
        checkIsRequired(isRequired){
            if(isRequired==0){
                return true
            }else{
                return false
            }
        },
         findControlsForTable(nameTable) {
            let controls = [];
            let property = this.propertyDocument.filter(p => p.listFields && p.properties.name == nameTable);
            for (let i = 0; i < property.length; i++) {
                let list = Object.values(property[i].listFields);
                for (let j = 0; j < list.length; j++) {
                    controls.push({
                        name: list[j].properties.name,
                        title:list[j].properties.title,
                        isKeyControl: false,
                        isNull:this.checkIsRequired(list[j].properties.isRequired),
                        dataColumn: null,
                        dataType: this.getDataType(list[j].type)
                    });
                }
            }
            return controls;
        },
        addDocument(){
            this.$router.push('/document/editor');
        },
     
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        },
        aftersubmitDocument(){
            this.$refs.listDocument.closeactionPanel();
        }
    }
}
</script>

