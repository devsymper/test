<template>
    <list-items
        ref="listDocument"
        :getDataUrl="sDocumentManagementUrl+'documents/'+docId+'/prints'"
        :useDefaultContext="false"
        :tableContextMenu="tableContextMenu"
        :pageTitle="$t('document.title')"
        :containerHeight="containerHeight"
        :actionPanelWidth="actionPanelWidth"
        @after-open-add-panel="addDocument"
        :headerPrefixKeypath="'document'"
        :commonActionProps="commonActionProps"
    >
    </list-items>
</template>
<script>
import { documentApi } from "./../../../api/Document.js";
import ListItems from "./../../../components/common/ListItems.vue";
import { util } from "./../../../plugins/util.js";
import { appConfigs } from './../../../configs';

export default {
    components: {
        "list-items": ListItems,
    },
    data(){
        return {
            sDocumentManagementUrl:appConfigs.apiDomain.sdocumentManagement,
            docId:this.$route.params.id,
            commonActionProps: {
                // "module": "document",
                // "resource": "document_definition",
                // "scope": "document",
            },
            documentId:0,
            actionPanelWidth:830,
            containerHeight: 200,
            tableContextMenu:{
                edit: {
                    name: "editdoc",
                    text: " <i class= 'mdi mdi-file-document-edit-outline' > </i>&nbsp; Sửa",
                    callback: (printConfig, callback) => {
                        this.$goToPage('/documents/'+printConfig.documentId+'/editor/print-config/'+printConfig.id,printConfig.title);
                    },
                },
                active: {
                    name: "active",
                    text: " <i class= 'mdi mdi-file-document-edit-outline' > </i>&nbsp; Chọn để in",
                    callback: (printConfig, callback) => {
                        
                        let thisCpn = this;
                        documentApi
                        .updateActivePrintConfig({printConfigId:printConfig.id})
                        .then(res => {
                            if (res.status == 200) {
                                thisCpn.$snotify({
                                    type: "success",
                                    title: "Success"
                                });  
                            }
                           
                        })
                        .catch(err => {
                        })
                        .finally(() => {});
                    },
                },
                
                drop: {
                    name:"delete",
                    text: " <i class= 'mdi mdi-delete-outline' > </i>&nbsp; Xóa",
                    callback: (document, callback) => {
                        // let ids = document.reduce((arr,obj)=>{
                        //     arr.push(obj.id);
                        //     return arr;
                        // },[]);
                        // let thisCpn = this;
                        // documentApi
                        // .deleteDocument({ids:ids.join()})
                        // .then(res => {
                        //     if (res.status == 200) {
                        //         thisCpn.$snotify({
                        //             type: "success",
                        //             title: "Delete document success!"
                        //         });  
                        //         thisCpn.$refs.listDocument.refreshList();
                        //     }
                        //     else{
                        //         thisCpn.$snotify({
                        //             type: "error",
                        //             title: res.messagr
                        //         });  
                        //     }
                        // })
                        // .catch(err => {
                        //     console.log("error from delete document api!!!", err);
                        // })
                        // .finally(() => {});
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
