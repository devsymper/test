<template>
    <list-items
        :getDataUrl="sDocumentManagementUrl+'documents/'+docId+'/draft-objects'"   
        :useDefaultContext="false"
        :tableContextMenu="tableContextMenu"
        :pageTitle="$t('draft.title')"
        :containerHeight="containerHeight"
        :headerPrefixKeypath="'document'"

        :actionPanelWidth="actionPanelWidth"
        ref="listObject"
    >
    </list-items>
</template>
<script>
import ListItems from "./../../../components/common/ListItems.vue";
import ActionPanel from "./../../../views/users/ActionPanel.vue";
import { documentApi } from "./../../../api/Document.js";
import { util } from "./../../../plugins/util.js";
import Detail from './../detail/Detail.vue'
export default {
    components: {
        "list-items": ListItems,
        "detail-object": Detail,
        "action-panel": ActionPanel,
    },
    data(){
        return {
            sDocumentManagementUrl:appConfigs.apiDomain.sdocumentManagement,
            docId:this.$route.params.id,
            docObjInfo:{},
            actionPanelWidth:800,
            containerHeight: 200,
            tableContextMenu:[
                {name:"delete",text:'Xóa',
                    callback: (documentObject, callback) => {
                        console.log('das',documentObject);
                        let ids = documentObject.reduce((arr,obj)=>{
                            arr.push(obj.id);
                            return arr;
                        },[]);
                        let thisCpn = this;
                        documentApi
                        .deleteDocumentDraftObject({objectIds:ids.join()})
                        .then(res => {
                            if (res.status == 200) {
                                thisCpn.$snotify({
                                    type: "success",
                                    title: "Delete document Object success!"
                                });  
                                thisCpn.$refs.listObject.refreshList();
                            }
                            else{
                                thisCpn.$snotify({
                                    type: "error",
                                    title: res.messagr
                                });  
                            }
                        })
                        .catch(err => {
                        })
                        .always(() => {});
                    },
                },
                {
                    name: "submit",
                    text: "Nhập liệu",
                    callback: (documentObject, callback) => {
                        this.$goToPage('/document/objects/update/'+documentObject.id,"Cập nhật");
                    },
                },
               
            ],
        }
    },
    computed:{
      
    },
    mounted() {
        this.calcContainerHeight();
    },
    created(){
        let thisCpn = this;
        this.$evtBus.$on('change-user-locale',(locale)=>{
            
        });
    },
    watch:{
        
    },
    methods:{
        submitDocument(){
            this.$router.push('/document/submit/'+this.docId);
        },
     
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        }
    }
}
</script>
