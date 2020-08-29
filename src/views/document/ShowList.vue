<template>
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
    >
        <div slot="right-panel-content" class="h-100">
            <submit-view ref="submitView" :isQickSubmit="true" :action="'submit'" @submit-document-success="aftersubmitDocument" :docId="documentId"/>
        </div>
    </list-items>
</template>
<script>
import { documentApi } from "./../../api/Document.js";
import ListItems from "./../../components/common/ListItems.vue";
import ActionPanel from "./../../views/users/ActionPanel.vue";
import ChangePassPanel from "./../../views/users/ChangePass.vue";
import Submit from './submit/Submit'
import { util } from "./../../plugins/util.js";
export default {
    components: {
        "list-items": ListItems,
        "action-panel": ActionPanel,
        'submit-view':Submit
    },
    data(){
        return {
            documentId:0,
            actionPanelWidth:830,
            containerHeight: 200,
            tableContextMenu:[
                
                {
                    name: "editdoc",
                    text: function() {
                        return " <i class= 'mdi mdi-file-document-edit-outline' > </i>&nbsp; Sửa";
                    },
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/editor/edit',document.title);
                    },
                },
                {
                    name: "printConfig",
                    text: function() {
                        return " <i class= 'mdi mdi-printer-3d-nozzle-outline' > </i>&nbsp; Cấu hình in";
                    },
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/editor/print-config',document.title);
                    },
                },
                {
                    name: "cloneDoc",
                    text: function() {
                        return " <i class= 'mdi mdi-file-document-multiple-outline' > </i>&nbsp; Nhân bản";
                    },
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/editor/clone',"Nhân bản "+document.title);
                    },
                },
                {
                    name: "submit",
                    text: function() {
                        return " <i class= 'mdi mdi-file-document-outline' > </i>&nbsp; Nhập liệu";
                    },
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/submit',document.title);
                    },
                },
                {
                    name: "quickSubmit",
                    text: function() {
                        return " <i class= 'mdi mdi-text-box-plus-outline' > </i>&nbsp; Nhập liệu nhanh";
                    },
                    callback: (document, callback) => {
                        this.$refs.listDocument.openactionPanel();
                        this.documentId = parseInt(document.id)
                    },
                },
                {
                    name: "listObject",
                    text: function() {
                        return " <i class= 'mdi mdi-format-list-checkbox' > </i>&nbsp; Danh sách bản ghi";
                    },
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/objects',"Danh sách bản ghi");
                    },
                },
                {
                    name: "listDraftObject",
                    text: function() {
                        return " <i class= 'mdi mdi-playlist-edit' > </i>&nbsp; Danh sách bản nháp";
                    },
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/draft-objects',"Danh sách bản nháp");
                    },
                },
                {name:"delete",text:
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
    watch:{
        
    },
    methods:{
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
