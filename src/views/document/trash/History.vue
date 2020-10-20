<template>
    <list-items
        class="history-document"
        ref="listDocument"
        :getDataUrl="'https://trash.symper.vn/items?type=document_instance'"   
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
                    var allRow = _.groupBy(listObject, function(obj) {
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
                        newRowTable['id'] = rowId;
                        newRowTable['documentName'] = documentObject['documentName'];
                        newRowTable['documentTitle'] = documentObject['documentTitle'];
                        newRowTable['countDelete'] = rowData.length;
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
                            {name: "id", title: "table.id", type: "numeric"},
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
                restore: {
                    name: "restore",
                    text: function() {
                        return " <i class= 'mdi mdi-file-document-edit-outline' > </i>&nbsp; Khôi phục";
                    },
                    callback: (document, callback) => {
                        let thisCpn = this;
                        documentApi
                        .restoreDocument({id:document.id})
                        .then(res => {
                            if (res.status == 200) {
                                thisCpn.$snotify({
                                    type: "success",
                                    title: "restore document success!"
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
        aftersubmitDocument(){
            this.$refs.listDocument.closeactionPanel();
        }
    }
}
</script>
