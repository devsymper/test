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
            <submit-view ref="submitView" :isQickSubmit="true" :action="'submit'" @submit-document-success="aftersubmitDocument" :docId="documentId"/>
        </div> 
    </list-items>
      <v-navigation-drawer 
        v-model="drawerImportExelPanel" 
        absolute
        class="d-none d-sm-none d-md-flex"
        temporary
        style="height: 100vh"
        v-bind:class="[showValidate==true?'manage-timesheet-800':'manage-timesheet-500']" 
        right>
         <ImportExcelPanel 
            @cancel="closeImportExcelPanel" 
            :documentId="documentId" 
            @showValidate="showValidateComponent"
            :drawerImportExelPanel="drawerImportExelPanel" />
    </v-navigation-drawer>
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
            showValidate:false,
            drawerImportExelPanel: null,
            commonActionProps: {
                "module": "document",
                "resource": "document_definition",
                "scope": "document",
            },
            documentId:0,
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
                        this.drawerImportExelPanel = true; 
                        this.documentId = Number(document.id);
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
        
    },
    methods:{
        closeImportExcelPanel(){
            this.drawerImportExelPanel = false;
        },
        showValidateComponent(data){
            this.showValidate = data;
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
<style lang="scss" scoped>
.manage-timesheet-500{
    width: 470px!important;
}
.manage-timesheet-800{
    width: 800px!important  ;
}
.manage-timesheet ::v-deep .v-card {
    box-shadow: none !important;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.manage-timesheet ::v-deep .v-window {
    display: flex;
    flex-direction: column;
}

.manage-timesheet ::v-deep .v-window__container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}
.fw-500 {
    font-weight: 500;
}
.fw-400{
    font-weight: 400;
}

.fw-300 {
    font-weight: 300;
}
.font-normal {
    font-size: 13px!important;
    font-family: Roboto!important;
    font-weight: normal!important;
}
.font{
    font-size: 13px!important;
    font-family: Roboto!important;
}

.color-normal {
    color: #707070
}
</style>

