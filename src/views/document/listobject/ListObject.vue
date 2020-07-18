<template>
    <list-items
        :getDataUrl="'https://sdocument-management.symper.vn/documents/'+docId+'/objects'"   
        :useDefaultContext="false"
        :tableContextMenu="tableContextMenu"
        :pageTitle="$t('document.title')"
        :containerHeight="containerHeight"
        :actionPanelWidth="actionPanelWidth"
        @after-open-add-panel="addDocument"
        ref="listObject"
    >
        <div slot="right-panel-content" class="h-100">
            <detail-object :docObjInfo="docObjInfo"/>
        </div>
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
            docId:this.$route.params.id,
            docObjInfo:{},
            actionPanelWidth:800,
            containerHeight: 200,
            tableContextMenu:[
                {name:"delete",text:'Xóa',
                    callback: (documentObject, callback) => {
                        console.log(documentObject);
                        
                        let thisCpn = this;
                        documentApi
                        .deleteDocumentObject(documentObject[0].document_object_id)
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
                            console.log("error from detail document Object api!!!", err);
                        })
                        .always(() => {});
                    },
                },
                {
                    name: "detail",
                    text: "Xem chi tiết",
                    callback: (documentObject, callback) => {
                        this.$goToPage('/documents/objects/'+documentObject.document_object_id,"Danh sách bản ghi");
                    },
                },
                {
                    name: "print",
                    text: "In",
                    // callback: (documentObject, callback) => {
                    //     this.$goToPage('/documents/objects/'+documentObject.document_object_id,"Danh sách bản ghi");
                    // },
                },
                {
                    name: "detailInView",
                    text: "Xem trong trang",
                    callback: (documentObject, callback) => {
                        this.$refs.listObject.openactionPanel();
                        this.docObjInfo = {docObjId:parseInt(documentObject.document_object_id),docSize:'100%'}
                    },
                },
                {
                    name: "edit",
                    text: "Cập nhật",
                    callback: (documentObject, callback) => {
                        this.$goToPage('/document/objects/update/'+documentObject.document_object_id,"Danh sách bản ghi");
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
        addDocument(){
            this.$router.push('/document/editor');
        },
     
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        }
    }
}
</script>
