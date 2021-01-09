<template>
    <div style="width:100%">
        <list-items
            ref="listDocument"
            :customAPIResult="customAPIResult"
            :getDataUrl="sDocumentManagementUrl+'documents'"  
            :useDefaultContext="false"
            :tableContextMenu="tableContextMenu"
            :pageTitle="$t('document.title')"
            :containerHeight="containerHeight"
            :actionPanelWidth="actionPanelWidth"
            :showExportButton="false"
            :showImportButton="false"
            @after-open-add-panel="addDocument"
            @close-panel="closePanel"
            :headerPrefixKeypath="'document'"
            :commonActionProps="commonActionProps"
        >
            <div slot="right-panel-content" class="h-100">
                <submit-view 
                    v-if="isShowQuickSubmit"
                    ref="submitView" 
                    :isQickSubmit="true" 
                    :action="'submit'" 
                    @submit-document-success="aftersubmitDocument" 
                    :docId="documentId"/>
                
                <div v-if="isDocumentIndex" class="h-100">
                    <div class="header-panel">
                        Lựa chọn cột muốn đánh chỉ mục
                    </div>
                        <VuePerfectScrollbar class="listControl">
                            <v-expansion-panels
                                multiple
                                >
                                <v-expansion-panel class="m-0" v-for="(doc,index) in listControlInDoc" :key="index">
                                    <v-expansion-panel-header class="v-expand-header">
                                        <div class="d-flex">
                                            <div>
                                                {{doc.name + '-' + doc.title}}
                                            </div>
                                            <div class="ml-auto">
                                                <span class="fs-13">Tên index</span>
                                                <input @keyup.stop.prevent @click.stop.prevent type="text" 
                                                v-model="doc.indexName" 
                                                :style="{
                                                    border:(doc.isNotValidName) ? '1px solid red !important' : ''
                                                }"
                                                class="sym-small-size sym-style-input index-name">
                                            </div>
                                        </div>

                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content class="sym-v-expand-content">
                                        <div class="control" v-for="control in doc.control" :key="control.name" @click="onClickControl(doc,control)">
                                            <div>
                                                {{control.name}} - {{control.title}}                            
                                            </div>
                                            <v-icon v-if="control.checked" size="16" color="green">mdi-check-bold</v-icon>
                                        </div>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                                
                            </v-expansion-panels>
                            </VuePerfectScrollbar>
                    <div class="footer-action">
                        <v-btn depressed @click="onSaveIndex">
                            Lưu
                        </v-btn>
                    </div>
                </div>
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
import { appConfigs } from '../../configs';
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
    components: {
        ImportExcelPanel: ImportExcelPanel,
        "list-items": ListItems,
        "action-panel": ActionPanel,
        'submit-view':Submit,
        VuePerfectScrollbar
    },
    data(){
        return {
            sDocumentManagementUrl:appConfigs.apiDomain.sdocumentManagement,
            documentId:0,
            rowActive:null,
            options:{
            },
            isDocumentIndex:false,
            allIndexSelected:[],
            listControlInDoc:{},
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
            isShowQuickSubmit:false,
            tableContextMenu:{
                edit: {
                    name: "editdoc",
                    text:  "<i class= 'mdi mdi-file-document-edit-outline' > </i>&nbsp; Sửa",
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/editor/edit',document.title);
                    },
                },
               
                clone: {
                    name: "cloneDoc",
                    text: " <i class= 'mdi mdi-file-document-multiple-outline' > </i>&nbsp; Nhân bản",
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/editor/clone',"Nhân bản "+document.title);
                    },
                },
                submit: {
                    name: "submit",
                    text:  " <i class= 'mdi mdi-file-document-outline' > </i>&nbsp; Nhập liệu",
                    callback: (document, callback) => {
                        const self = this;
                             self.$goToPage('/documents/'+document.id+'/submit',document.title);
                        // }else{
                        //     self.$snotify({
                        //         type: "error",
                        //         title: "Không cho phép nhập liệu"
                        //     })
                        // }
                       
                    },
                },
                quick_submit :{
                    name: "quickSubmit",
                    text:  "<i class= 'mdi mdi-text-box-plus-outline' > </i>&nbsp; Nhập liệu nhanh",
                    callback: (document, callback) => {
                        this.isShowQuickSubmit = true
                        this.$refs.listDocument.openactionPanel();
                        this.documentId = parseInt(document.id)
                    },
                },
                list: {
                    name: "listObject",
                    text:" <i class= 'mdi mdi-format-list-checkbox' > </i>&nbsp; Danh sách bản ghi",
                    callback: (document, callback) => {
						this.$goToPage('/documents/'+document.id+'/objects',"Danh sách bản ghi");
						this.$store.commit('document/setCurrentTitle',document.title)
                    },
                },
                list_draft: {
                    name: "listDraftObject",
                    text: " <i class= 'mdi mdi-playlist-edit' > </i>&nbsp; Danh sách bản nháp",
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/draft-objects',"Danh sách bản nháp");
                    },
                },
                 print_config: {
                    name: "printConfig",
                    text:  " <i class= 'mdi mdi-printer-3d-nozzle-outline' > </i>&nbsp; Cấu hình in",
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/editor/print-config',document.title);
                    },
                },
                list_print_config: {
                    name: "listPrintConfig",
                    text:" <i class= 'mdi mdi-format-list-checkbox' > </i>&nbsp; Danh sách bản in",
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
                //         .finally(() => {});
                //     },
                // },
                trash:{
					name:"remove",
					text:" <i class= 'mdi mdi-delete-outline' > </i>&nbsp; Xóa",
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
                                    title: res.message
                                });  
                            }
                        })
                        .catch(err => {
                            console.log("error from delete document api!!!", err);
                        })
                        .finally(() => {});
                    },
                },
                templateExcel:{
                    name: "templateExcel",
                    text:  " <i class= 'mdi mdi-file-upload-outline' > </i>&nbsp; Lấy mẫu Import Excel",
                    callback: (document, callback) => {
                        this.documentId = Number(document.id);
                        let exportUrl = this.sDocumentManagementUrl+'documents/'+this.documentId+'/export-excel?isTemplate="1"'
                        if(!exportUrl){
                            if(this.getDataUrl[this.getDataUrl.length - 1] == '/'){
                                exportUrl = this.getDataUrl+'export';
                            }else{
                                exportUrl = this.getDataUrl+'/export';
                            }
                        }
                        
                        window.open(exportUrl,'_blank');
                    },
                },
                importExcel:{
                    name: "importExcel",
                    text: " <i class= 'mdi mdi-file-upload-outline' > </i>&nbsp; Import Excel",
                    callback: (document, callback) => {
                        const self = this;
                        self.showImportPanel = !self.showImportPanel; 
                        self.documentId = Number(document.id);
                    },
                },
                documentIndex:{
                    name: "documentIndex",
                    text: "<i class= 'mdi mdi-bike-fast' > </i>&nbsp; Tối ưu nhập liệu",
                    callback: (document, callback) => {
                        this.rowActive = document;
                        this.isDocumentIndex = true;
                        this.$refs.listDocument.openactionPanel();
                        this.getListControl(document);
                        
                    },
                },
            },
            customAPIResult:{
                 reformatData(data){
                    return data.data
                 }
            }
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
        getListControl(document){
            let self = this;
            documentApi.getFieldStruct(document.id).then(res=>{
                if(res.status == 200){
                    console.log(res);
                    self.listControlInDoc = res.data;
                    self.getListControlChecked(document.id);
                }
            });
        },
        getListControlChecked(docId){
            let self = this;
            documentApi.getColumnIndex(docId).then(res=>{
                if(res.status == 200 && res.data.length > 0){
                   let indexs = res.data[0].indexs;
                   if(indexs){
                       try {
                            indexs = JSON.parse(indexs);
                            for (let i = 0; i < indexs.length; i++) {
                                const element = indexs[i];
                                self.$set(self.listControlInDoc[element.parent],'indexName',element.name)
                                let columns = element.column;
                                for (let j = 0; j < columns.length; j++) {
                                    const listControl = self.listControlInDoc[element.parent].control;
                                    for (let l = 0; l < listControl.length; l++) {
                                        if(listControl[l].name == columns[j]){
                                            self.$set(self.listControlInDoc[element.parent].control[l],'checked',true)
                                            break;
                                        }
                                    }
                                }
                                
                            }

                       } catch (error) {
                           console.warn(error);
                       }
                   }
                }
            });
        },
        onSaveIndex(){
            for(let key in this.listControlInDoc){
                let document = this.listControlInDoc[key];
                if(!document.indexName){
                    continue;
                }
                let controlChecked = [];
                for (let i = 0; i < document.control.length; i++) {
                    const control = document.control[i];
                    if(control.checked){
                        controlChecked.push(control.name)
                    }
                    
                }
                if(controlChecked.length > 0){
                    let item = {};
                    item['parent'] = (document.isTable) ? document.name : 'document';
                    item['name'] = document.indexName;
                    item['column'] = controlChecked;
                    this.allIndexSelected.push(item);
                }
            }
            if(this.allIndexSelected.length == 0){
                return;
            }
            let self = this;
            let dataPost = {documentId:this.rowActive.id,indexs:JSON.stringify(this.allIndexSelected)}
            documentApi.saveColumnIndex(dataPost).then(res=>{
                if(res.status == 200){
                    self.$refs.listDocument.closeactionPanel();
                    self.$snotify({
                                type: "success",
                                title: "Thêm index thành công"
                            })
                }
                else{
                    self.$snotify({
                                type: "error",
                                title: res.message
                            })
                }
            });
        },
        onClickControl(doc,control){
            this.$set(control,'checked',!control.checked );
        },
        closePanel(){
            this.isShowQuickSubmit = false;
            this.isDocumentIndex = false;
        },
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

<style scoped>
    .control{
        display: flex;
        height: 25px;
        padding: 5px 4px;
        cursor: pointer;
        transition: background ease-in-out 250ms;
    }
    .control:hover{
        background: var(--symper-background-hover);
    }
    .control >>> .v-icon{
        margin-left: auto;
    }
    .listControl{
        height: calc(100% - 80px);
    }
    .footer-action{
        text-align: right;
    }
    .header-panel{
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 8px;
        border-bottom: var(--symper-border);
    }
    .index-name{
        height: 25px;
        width: 150px;
        background: var(--symper-background-default);
        border-radius: 4px;
        margin-left: 4px;
        padding: 0 8px;
    }
    .index-name:hover{
        outline: none;
    }
    ::v-deep .v-expand-header{
        padding: 12px 4px;
    }
</style>

