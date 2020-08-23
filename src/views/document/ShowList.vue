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
        :headerPrefixKeypath="'document'">
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
import { documentApi } from "./../../api/Document.js";
import ListItems from "./../../components/common/ListItems.vue";
import ActionPanel from "./../../views/users/ActionPanel.vue";
import ChangePassPanel from "./../../views/users/ChangePass.vue";
import Submit from './submit/Submit'
import { util } from "./../../plugins/util.js";
import ImportExcelPanel from "./../../components/document/ImportExelPanel";

export default {
    components: {
        "list-items": ListItems,
        ImportExcelPanel: ImportExcelPanel,
        "action-panel": ActionPanel,
        'submit-view':Submit,
    },
    data(){
        return {
            drawerImportExelPanel: null,
            showValidate:false,
            documentId:0,
            actionPanelWidth:830,
            containerHeight: 200,
            tableContextMenu:[
                {name:"delete",text:'Xóa',
                    callback: (document, callback) => {
                        let ids = document.reduce((arr,obj)=>{
                            arr.push(obj.id);
                            return arr;
                        },[]);
                        let thisCpn = this;
                        documentApi
                        .deleteDocument({ids:ids.join()})
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
                            console.log("error from detail document api!!!", err);
                        })
                        .always(() => {});
                    },
                },
                {
                    name: "editdoc",
                    text: "Sửa",
                    callback: (document, callback) => {
                        this.$goToPage('/document/editor/'+document.id,document.title);
                    },
                },
                {
                    name: "cloneDoc",
                    text: "Nhân bản",
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/clone/editor',"Nhân bản "+document.title);
                    },
                },
                {
                    name: "submit",
                    text: "Nhập liệu",
                    callback: (document, callback) => {
                        this.$goToPage('/document/submit/'+document.id,document.title);
                    },
                },
                {
                    name: "quickSubmit",
                    text: "Nhập liệu nhanh",
                    callback: (document, callback) => {
                        this.$refs.listDocument.openactionPanel();
                        this.documentId = parseInt(document.id)
                    },
                },
                {
                    name: "listObject",
                    text: "Danh sách bản ghi",
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/objects',"Danh sách bản ghi");
                    },
                },
                {
                    name: "importExcel",
                    text: "Import excel",
                    callback: (document, callback) => {
                        this.drawerImportExelPanel =! this.drawerImportExelPanel; 
                        this.documentId = Number(document.id);
                        
                    }
                },
                {
                    name: "listDraftObject",
                    text: "Danh sách bản nháp",
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/draft-objects',"Danh sách bản nháp");
                    },
                },
            ],
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
    width: 500px!important;
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
</style>
<style>
.v-list-item__title{
    font-size:13px!important;
}
.v-select__slot{
    padding-left:7px;
    font-size:13px!important;
    font-family: Roboto;
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