<template>
    <div class="w-100">
        <list-items
        class="history-document"
        ref="listItem"
        :useDefaultContext="false"
        :tableContextMenu="tableContextMenu"
        :pageTitle="$t('document.title')"
        :containerHeight="containerHeight"
        :actionPanelWidth="actionPanelWidth"
        :commonActionProps="commonActionProps"
        :customAPIResult="customAPIResult"
        :defaultData="defaultData"
    >
    </list-items>
     <v-dialog
            v-model="dialog"
            max-width="290">
            <v-card>
                <v-card-title class="headline">Xác nhận khôi phục</v-card-title>
                <v-card-text>
                Xác nhận khôi phục {{countRestore}} bản ghi
                </v-card-text>

                <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    color="darken-1"
                    text
                    @click="dialog = false"
                >
                    {{$t('common.close')}}
                </v-btn>

                <v-btn
                    color="green"
                    text
                    @click="restoreDocumentObject">
                    {{$t('common.restore')}}
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { documentApi } from "./../../../api/Document.js";
import ListItems from "./../../../components/common/ListItems.vue";
import { util } from "./../../../plugins/util.js";
export default {
    name:"History",
    components: {
        "list-items": ListItems,
    },
    data(){
        return {
            dialog:false,
            dataRestore:null,
            countRestore:1,
            documentIdSelected:null,
            defaultData:{},
            customAPIResult:{
                
            },
            commonActionProps: {
                "module": "document",
                "resource": "document_definition",
                "scope": "document",
            },
            documentId:0,
            actionPanelWidth:830,
            containerHeight: 200,
            tableContextMenu:{
                list: {
                    name: "detail",
                    text: function() {
                        return " <i class= 'mdi mdi-file-document-edit-outline' > </i>&nbsp; Chi tiêt";
                    },
                    callback: (documentObject, callback) => {
                        this.$goToPage('/documents/objects/'+documentObject.document_object_id,"Chi tiết",false,true,{defaultData:documentObject});
                    },
                },
                restore: {
                    name: "restore",
                    text: function() {
                        return " <i class= 'mdi mdi-file-document-edit-outline' > </i>&nbsp; Khôi phục";
                    },
                    callback: (documentObject, callback) => {
                        this.dialog = true;
                        this.dataRestore = documentObject;
                        
                    },
                },
                
                delete: {
                    name:"delete",
                    text:function() {
                        return " <i class= 'mdi mdi-delete-outline' > </i>&nbsp; Xóa";
                    },
                    callback: (documentObject, callback) => {
                        let ids = documentObject.reduce((arr,obj)=>{
                            arr.push(obj.idTrash);
                            return arr;
                        },[]);
                        let thisCpn = this;
                        documentApi
                        .deleteObjectInTrash({ids:ids.join()})
                        .then(res => {
                            if (res.status == 200) {
                                thisCpn.$snotify({
                                    type: "success",
                                    title: "Delete success!"
                                });  
                            }
                            else{
                                thisCpn.$snotify({
                                    type: "error",
                                    title: res.messagr
                                });  
                            }
                        })
                        .catch(err => {
                            console.log("error from delete trash api!!!", err);
                        })
                        .always(() => {});
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
         
        if(this.$route.params.extraData && this.$route.params.extraData.allData){
            let allData = this.$route.params.extraData.allData;
            let field = this.$route.params.extraData.field;
            if(allData.length > 0){
                let columns = [];
                let firstRow = allData[0];
                for(let columnName in firstRow){
                    if(columnName == 'document_object_id'){
                        columns.push({name:columnName,title:'Id',type:'text',noFilter:true});
                    }
                    else if(!/document_/.test(columnName) && typeof firstRow[columnName] != 'object'){
                        columns.push({name:columnName,title:(field && field[columnName] ? field[columnName] : columnName),type:'text',noFilter:true});
                    }
                }
                this.defaultData = {
                    columns:columns,
                    listObject:allData,
                    total:allData.length
                }
            }
            
            
        }
    },
    methods:{
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        },
        restoreDocumentObject(){
            this.dialog = false;
            let dataRestore = util.cloneDeep(this.dataRestore);
            let thisCpn = this;
            let objectIds = [dataRestore.document_object_id];
            let allId = [dataRestore.idTrash];
            delete dataRestore.idTrash;
            documentApi
            .restoreDocumentObject({dataObject:JSON.stringify(dataRestore),objectIds:JSON.stringify(objectIds), ids:JSON.stringify(allId)})
            .then(res => {
                if (res.status == 200) {
                    thisCpn.$snotify({
                        type: "success",
                        title: "restore document success!"
                    });  
                    thisCpn.$refs.listItem.refreshList();
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
        }
    }
}
</script>
