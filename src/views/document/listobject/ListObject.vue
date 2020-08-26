<template>
    <list-items
        :getDataUrl="'https://sdocument-management.symper.vn/documents/'+docId+'/objects'"   
        :useDefaultContext="false"
        :tableContextMenu="tableContextMenu"
        :pageTitle="$t('documentObject.title')"
        :containerHeight="containerHeight"
        :actionPanelWidth="actionPanelWidth"
        @after-open-add-panel="submitDocument"
        @data-get="afterGetData"
        ref="listObject"
    >
        <div slot="right-panel-content" class="h-100">
            
            <div class="panel-header">
                <div class="left-action">
                    <span @click="prevRecord" class="mdi mdi-chevron-left"></span>
                    <span @click="nextRecord" class="mdi mdi-chevron-right"></span>
                    <span class="document-title">{{panelDocTitle}}</span>
                </div>
                <div class="right-action">
                    <span class="copyed d-none" transition="scroll-y-reverse-transition">Đã sao chép</span>
                    <span @click="addToClipboard($event)" :clipboard="dataClipboard" class="mdi mdi-page-next-outline"></span>
                    <span class="mdi mdi-download-outline"></span>
                    <span @click="showDetailInfoDocument" class="mdi mdi-information-outline"></span>
                </div>
            </div>
            <div class="panel-body">
                <detail-object @after-hide-sidebar="afterHideSidebarDetail" ref="viewDetail" @after-load-document="handleAfterLoadDocument" :quickView="true" :docObjInfo="docObjInfo"/>
            </div>
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
            currentDocObjectActiveIndex:'',
            panelDocTitle:"",
            docObjInfo:{},
            actionPanelWidth:800,
            containerHeight: 200,
            dataTable:[],
            dataClipboard:"",
            tableContextMenu:[
                {name:"delete",text:'Xóa',
                    callback: (documentObject, callback) => {
                        let ids = documentObject.reduce((arr,obj)=>{
                            arr.push(obj.document_object_id);
                            return arr;
                        },[]);
                        let thisCpn = this;
                        documentApi
                        .deleteDocumentObject({objectIds:ids.join()})
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
                    name: "detail",
                    text: "Xem chi tiết",
                    callback: (documentObject, callback) => {
                        this.$goToPage('/documents/objects/'+documentObject.document_object_id,"Danh sách bản ghi");
                    },
                },
                {
                    name: "print",
                    text: "In",
                    callback: (documentObject, callback) => {
                        this.$goToPage('/documents/objects/'+documentObject.document_object_id+'/print',"In");
                    },
                },
                {
                    name: "detailInView",
                    text: "Xem trong trang",
                    callback: (documentObject, callback) => {
                        this.currentDocObjectActiveIndex = this.dataTable.findIndex(obj => obj.document_object_id == documentObject.document_object_id)
                        this.$refs.listObject.openactionPanel();
                        this.dataClipboard = window.location.origin+ '/#/documents/objects/'+documentObject.document_object_id;
                        this.docObjInfo = {docObjId:parseInt(documentObject.document_object_id),docSize:'21cm'}
                    },
                },
                {
                    name: "edit",
                    text: "Cập nhật",
                    callback: (documentObject, callback) => {
                        this.$goToPage('/document/objects/update/'+documentObject.document_object_id,"Cập nhật");
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
        afterGetData(data){
            this.dataTable = data
            console.log("dsdasd",data);
        },
        nextRecord(){
            if(this.dataTable.length > this.currentDocObjectActiveIndex+1){
                this.currentDocObjectActiveIndex += 1;
                let newRecord = this.dataTable[this.currentDocObjectActiveIndex];
                this.docObjInfo = {docObjId:parseInt(newRecord.document_object_id),docSize:'21cm'}
            }
            else{
                if(this.dataTable.length >= 50){
                    this.$refs.listObject.nextPage();
                    this.currentDocObjectActiveIndex = 0;
                }
            }
        },
        prevRecord(){
            if(this.currentDocObjectActiveIndex > 0){
                this.currentDocObjectActiveIndex -= 1;
                let newRecord = this.dataTable[this.currentDocObjectActiveIndex];
                this.docObjInfo = {docObjId:parseInt(newRecord.document_object_id),docSize:'21cm'}
            }
            else{
                this.$refs.listObject.prevPage();
                this.currentDocObjectActiveIndex = 0;
            }
        },
        submitDocument(){
            this.$router.push('/document/submit/'+this.docId);
        },
     
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        },
        handleAfterLoadDocument(document){
            this.panelDocTitle = document.title
        },
        showDetailInfoDocument(){
            if(this.$refs.viewDetail.isShow()){
                this.actionPanelWidth = 800;
                this.$refs.viewDetail.setLayoutFromQuickView('21cm','auto')
            }
            else{
                this.actionPanelWidth = 1117;
                this.$refs.viewDetail.setLayoutFromQuickView('21cm','unset')
            }
            
            this.$refs.viewDetail.toggleSideBar()
        },
        afterHideSidebarDetail(){
            this.actionPanelWidth = 800;
            this.$refs.viewDetail.setLayoutFromQuickView('21cm','auto')
        },
        
        addToClipboard(event){
            $('.copyed').removeClass('d-none');
            setTimeout(() => {
                $('.copyed').addClass('d-none');
            }, 1500);
            let text = $(event.target).attr('clipboard');
            var inp =document.createElement('input');
            document.body.appendChild(inp)
            inp.value = text
            inp.select();
            document.execCommand('copy',false);
            inp.remove();
        }
    }
}
</script>

<style scoped>
    .panel-header{
        height: 30px;
        display: flex;
        color: #757575;
    }
    .panel-header .mdi:hover{
        color: rgba(0,0,0 / 0.6);
    }
    .panel-body{
        height: calc(100vh - 55px);
    }
    .right-action{
        margin-left: auto;
        font-size: 15px;
    }
    .panel-header .mdi {
        cursor: pointer;
        margin-right: 12px;
        transition: all ease-in-out 250ms;
    }
    .left-action .mdi{
        font-size: 24px;
        line-height: 1;
    }
    .document-title{
        font-size: 13px;
        vertical-align: super;
    }

    .copyed {
        margin-right: 12px;
        font-size: 12px;
    }
    

</style>