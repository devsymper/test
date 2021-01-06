<template>
    <div class="w-100">
        <list-items
        class="history-document"
        ref="listItem"
        :getDataUrl="trashDomain + 'items?type=document_instance'"   
        :useDefaultContext="false"
        :tableContextMenu="tableContextMenu"
        :pageTitle="$t('document.title')"
        :containerHeight="containerHeight"
        :actionPanelWidth="actionPanelWidth"
        :headerPrefixKeypath="'document'"
        :commonActionProps="commonActionProps"
        :customAPIResult="customAPIResult"
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
import { appConfigs } from '../../../configs.js';
import { documentApi } from "./../../../api/Document.js";
import ListItems from "./../../../components/common/ListItems.vue";
import { util } from "./../../../plugins/util.js";
import _groupBy from "lodash/groupBy";

export default {
    name:"History",
    components: {
        "list-items": ListItems,
    },
    data(){
        return {
            trashDomain: appConfigs.apiDomain.trash,
            dialog:false,
            dataRestore:null,
            countRestore:null,
            allIds:null,
            documentIdSelected:null,
            commonActionProps: {
                "module": "document",
                "resource": "document_definition",
                "scope": "document",
            },
            customAPIResult:{
                reformatData(res){
                    let thisCpn = util.getClosestVueInstanceFromDom(document.querySelector('.history-document'));
                    let listObject = res.data;
                    let newList = [];
                    let allObjectIdentifier = listObject.reduce((arr,obj)=>{
                        let objectId = obj['objectIdentifier'].match(/\d+/g)[0];
                        if(arr.indexOf(objectId) == -1){
                            arr.push(objectId);
                        }
                        return arr;
                    },[]);
                    var allRow = _groupBy(listObject, function(obj) {
                        return obj.deletedAt;
                    });
                    let rowId = 0;
                    let allUser = thisCpn.$store.state.app.allUsers;
                    for (let time in allRow) {
                        let rowData = allRow[time];
                        if(!rowData[0].data){
                            continue
                        }
                        let documentObject = JSON.parse(rowData[0].data);
                        
                        let newRowTable = {};
                        newRowTable['id'] = rowId + 1;
                        newRowTable['documentName'] = documentObject['documentName'];
                        newRowTable['documentTitle'] = documentObject['documentTitle'];
                        newRowTable['field'] = documentObject['field'];
                        newRowTable['countDelete'] = rowData.length;
                        let allDataObject = [];
                        let allIds = [];
                        for (let index = 0; index < rowData.length; index++) {
                            let objectData = rowData[index].data;
                            objectData = JSON.parse(objectData);
                            delete objectData.documentName;
                            delete objectData.documentTitle;
                            delete objectData.field;
                            objectData['idTrash'] = rowData[index].id;
                            allDataObject.push(objectData);
                            allIds.push(rowData[index].id);
                        }
                        newRowTable['dataObject'] = allDataObject;
                        newRowTable['allIds'] = allIds;
                        let user = allUser.filter(u=>{
                            return u.id == rowData[0]['userDeleted'];
                        })
                        if(user && user.length>0){
                            newRowTable['userDelete'] = user[0].displayName;
                        }
                        else{
                            newRowTable['userDelete'] = rowData[0]['userDeleted'];
                        }
                        newRowTable['timeDelete'] = time;
                        newList.push(newRowTable);
                        rowId++;
                    }
                    return{
                        columns:[
                            {name: "id", title: "table.history.id", type: "numeric"},
                            {name: "documentName", title: "table.history.name", type: "text"},
                            {name: "documentTitle", title: "table.history.title", type: "text"},
                            {name: "countDelete", title: "table.history.countDelete", type: "text"},
                            {name: "userDelete", title: "table.history.userDelete", type: "text"},
                            {name: "timeDelete", title: "table.history.timeDelete", type: "text"},
                        ],
                        listObject:newList
                    }
                },
            },
            
            documentId:0,
            actionPanelWidth:830,
            containerHeight: 200,
            tableContextMenu:{
                list: {
                    name: "listObject",
                    text: function() {
                        return " <i class= 'mdi mdi-file-document-edit-outline' > </i>&nbsp; Danh sách";
                    },
                    callback: (document, callback) => {
                        this.$goToPage('/documents/delete-history/objects',"Danh sách bản ghi",false,true,{allData:document.dataObject,field:document.field});
                    },
                },
                restore: {
                    name: "restore",
                    text: function() {
                        return " <i class= 'mdi mdi-file-document-edit-outline' > </i>&nbsp; Khôi phục";
                    },
                    callback: (document, callback) => {
                        this.allIds = document.allIds;
                        this.dialog = true;
                        this.countRestore = document.countDelete;
                        this.dataRestore = document.dataObject;
                        
                    },
                },
                
                drop: {
                    name:"delete",
                    text:function() {
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
                        .finally(() => {});
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
    methods:{
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        },
        restoreDocumentObject(){
            this.dialog = false;
            let thisCpn = this;
            let objectIds = this.dataRestore.reduce((arr,obj)=>{
                arr.push(obj.document_object_id);
                return arr;
            },[])
            documentApi
            .restoreDocumentObject({dataObject:JSON.stringify(this.dataRestore),objectIds:JSON.stringify(objectIds), ids:JSON.stringify(this.allIds)})
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
            .finally(() => {});
        }
    }
}
</script>
