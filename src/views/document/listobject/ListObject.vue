<template>
    
    <div class="h-100 w-100">
        <list-items
        :getDataUrl="'https://sdocument-management.symper.vn/documents/'+docId+'/objects'"   
        :exportLink="'https://sdocument-management.symper.vn/documents/'+docId+'/export-excel'" 
        :useDefaultContext="false"
        :tableContextMenu="tableContextMenu"
        :pageTitle="$t('documentObject.title')"
        :containerHeight="containerHeight"
        :actionPanelWidth="actionPanelWidth"
        :actionPanelType="'elastic'"
        :showActionPanelInDisplayConfig="true"
        @after-open-add-panel="submitDocument"
        @data-get="afterGetData"
        @before-keydown="afterRowSelected"
        @after-cell-mouse-down="afterRowSelected"
        @after-selected-row="afterSelectedRow"
        @row-selected="afterCellSelection"
        :commonActionProps="commonActionProps"
        ref="listObject"
    >
        <div slot="right-panel-content" class="h-100">
            
            <div class="panel-header">
                <div class="left-action">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-icon  @click="hidePanel" v-on="on">mdi-close</v-icon>
                        </template>
                        <span>{{$t('common.close')}}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-icon  @click="prevRecord" v-on="on">mdi-chevron-left</v-icon>
                        </template>
                        <span>{{$t('document.instance.showlist.prev')}}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-icon  @click="nextRecord" v-on="on">mdi-chevron-right</v-icon>
                        </template>
                        <span>{{$t('document.instance.showlist.next')}}</span>
                    </v-tooltip>
                    <span class="document-title">{{panelDocTitle}}</span>
                </div>
                <div class="right-action">
                    
                    <span class="copyed d-none" transition="scroll-y-reverse-transition">{{$t('document.instance.showlist.copied')}}</span>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-icon  @click="addToClipboard($event)" :clipboard="dataClipboard" v-on="on">mdi-page-next-outline</v-icon>
                        </template>
                        <span>{{$t('document.instance.showlist.copyLink')}}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-icon  v-on="on">mdi-download-outline</v-icon>
                        </template>
                        <span>{{$t('document.instance.showlist.download')}}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-icon  @click="showDetailInfoDocument" v-on="on">mdi-information-outline</v-icon>
                        </template>
                        <span>{{$t('document.instance.showlist.info')}}</span>
                    </v-tooltip>
                    
                </div>
            </div>
            <div class="panel-body">
                <detail-object @after-hide-sidebar="afterHideSidebarDetail" ref="viewDetail" @after-load-document="handleAfterLoadDocument" :quickView="true" :docObjInfo="docObjInfo"/>
            </div>
        </div>
    </list-items>
        <Tablet 
        :listobject="recordPreview"
        :listItem="listTabletItem"
        :width="'30cm'" 
        :height="'80%'" 
        :title="`<span class='mdi mdi-printer-settings'></span> &nbsp;Chọn mẫu in`" 
        @after-selected-item-tablet="afterSelectedItem"
        class="view-print-config" ref="listPrintView">
            <template slot="contentBinding">
                <PrintView :isAlwaysPrint="false" :allObject="allObjectPrint"/>
            </template>
            <template slot="actionBinding">
                <button v-for="(action,index) in listActionForPrint" :key="index" @click="action.action()">
                    {{action.title}}
                </button>
            </template>
        </Tablet>
        <BottomSheet ref="bottomSheetView" class="h-100">
            <div slot="content" class="sheet-content d-flex">
                <div class="count-selection">
                    <span>{{$t('document.instance.showlist.select')}} {{countRecordSelected}} {{$t('document.instance.showlist.record')}}</span>
                </div>
                <div class="sheet-action">
                    <v-btn tile small @click="printSelected" >
                        <v-icon left>mdi-printer</v-icon> {{$t('document.instance.showlist.printRecord')}}
                    </v-btn>
                    <v-btn @click="selectPrintConfig" tile small>
                        <v-icon left>mdi-printer-pos</v-icon> {{$t('document.instance.showlist.selectPrintConfig')}}
                    </v-btn>
                    <v-btn @click="hideBottomSheet" tile small> {{$t('common.close')}}
                    </v-btn>
                </div>
            </div>
        </BottomSheet>
    </div>
</template>
<script>
import ListItems from "./../../../components/common/ListItems.vue";
import BottomSheet from './../../../components/common/BottomSheet'
import PrintView from "./../print/PrintView";
import ActionPanel from "./../../../views/users/ActionPanel.vue";
import Tablet from "./../../../components/common/Tablet";

import { documentApi } from "./../../../api/Document.js";
import { util } from "./../../../plugins/util.js";
import Detail from './../detail/Detail.vue'
export default {
    components: {
        "list-items": ListItems,
        "detail-object": Detail,
        "action-panel": ActionPanel,
        Tablet,
        BottomSheet,
        PrintView

    },
    data(){
        return {
            commonActionProps: {
                "module": "document",
                "resource": "document_instance",
                "scope": "document",
                "parentId": this.$route.params.id
            },
            docId:parseInt(this.$route.params.id),
            currentDocObjectActiveIndex:'',
            panelDocTitle:"",
            docObjInfo:{},
            actionPanelWidth:800,
            containerHeight: 200,
            dataTable:[],
            countRecordSelected:0,
            recordSelected:{},
            recordPreview:{},
            curentFormActive:0,
            listTabletItem:[],
            currentRowData:{},
            allObjectPrint:[],
            totalRecord:0,
            dataClipboard:"",
            listActionForPrint:{    // data truyền vào cho slot action view table
                print:{
                    title: this.$t('common.print'),
                    icon : '',
                    action: function(){
                        let listObj = []
                        for(let rowId in this.recordPreview){
                            let rowData = this.recordPreview[rowId];
                            let item = {document_object_id:rowData.document_object_id,formId:this.curentFormActive};
                            listObj.push(item);
                        }
                        this.hideBottomSheet();
                        this.$goToPage('/documents/print-multiple',"In",false,true,{listObject:listObj});
                    }.bind(this)

                },
                
            },
            tableContextMenu:{
                delete: {
                    name:"delete",
                    text:this.$t('common.delete'),
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
                detail: {
                    name: "detail",
                    text: this.$t('common.detail'),
                    callback: (documentObject, callback) => {
                        this.$goToPage('/documents/objects/'+documentObject.document_object_id,"Danh sách bản ghi");
                    },
                },
                
                list_print: {
                    name: "listPrint",
                    text: this.$t('document.instance.showlist.listPrintConfig'),
                    callback: (documentObject, callback) => {
                        this.$refs.listPrintView.show();
                        this.recordPreview = {record:{document_object_id:documentObject.document_object_id}}
                    },
                },
                print: {
                    name: "print",
                    text: this.$t('document.instance.showlist.print'),
                    callback: (documentObject, callback) => {
                        this.$goToPage('/documents/print-multiple',"In",false,true,{listObject:[{document_object_id:documentObject.document_object_id}]});
                    },
                },
                show_checkbox: {
                    name: "showCheckBox",
                    text: this.$t('document.instance.showlist.printMultiple'),
                    callback: (documentObject, callback) => {
                        this.toggleCheckBoxListItem()
                    
                    },
                },
                // detail_in_view: {
                //     name: "detailInView",
                //     text: "Xem trong trang",
                //     callback: (documentObject, callback) => {
                //         this.currentDocObjectActiveIndex = this.dataTable.findIndex(obj => obj.document_object_id == documentObject.document_object_id)
                //         this.$refs.listObject.openactionPanel();
                //         this.dataClipboard = window.location.origin+ '/#/documents/objects/'+documentObject.document_object_id;
                //         this.docObjInfo = {docObjId:parseInt(documentObject.document_object_id),docSize:'21cm'}
                //     },
                // },
                update: {
                    name: "edit",
                    text: this.$t('common.update'),
                    callback: (documentObject, callback) => {
                        this.$goToPage('/document/objects/update/'+documentObject.document_object_id,"Cập nhật");
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
        documentApi.getListPrintConfig(this.docId).then(res=>{
            thisCpn.listTabletItem = res.data.listObject;
            thisCpn.listTabletItem[0].activeSb = true;
        }).catch(err => {}).always(() => {});
    },
    activated(){
        if(this.$refs.listObject.isShowCheckedRow()){
            this.showBottomSheet();
        }
    },
    methods:{
        afterGetData(data){
            this.dataTable = data
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
            this.$router.push('/documents/'+this.docId+'/submit');
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
        },
        /**
         * Ẩn view side by side
         */
        hidePanel(){
            this.$refs.listObject.closeactionPanel();
        },
        afterRowSelected(data){
            if(this.$refs.listObject.isShowSidebar()){
                let documentObject = data.rowData;
                let cell = data.cell;
                let event = data.event;
                if(cell.col == 0 && this.$refs.listObject.isShowCheckedRow()){
                    return;
                }
                if(['ArrowDown','ArrowUp'].includes(event.key) || event.buttons == 1){
                    if(this.docObjInfo.docObjId == parseInt(documentObject.document_object_id)){
                        return
                    }
                    this.currentDocObjectActiveIndex = this.dataTable.findIndex(obj => obj.document_object_id == documentObject.document_object_id);
                    this.$refs.listObject.openactionPanel();
                    this.dataClipboard = window.location.origin+ '/#/documents/objects/'+documentObject.document_object_id;
                    this.docObjInfo = {docObjId:parseInt(documentObject.document_object_id),docSize:'21cm'}
                }
            }
            
           
        },
        /**
         * Hàm gọi sang compon bottom sheet để hiển thị
         */
        showBottomSheet(){
            this.$refs.bottomSheetView.toggle();
        },
        hideBottomSheet(){
            this.$refs.bottomSheetView.toggle();
            this.$refs.listObject.removeCheckBoxColumn();
        },
        /**
         * Hàm hiển thị cột checkbox trong compon listItem
         */
        toggleCheckBoxListItem(){
            if(!this.$refs.listObject.isShowCheckedRow()){
                this.showBottomSheet();
                this.$refs.listObject.addCheckBoxColumn();
            }
        },
        afterSelectedRow(dataSelected){
            this.countRecordSelected = Object.keys(dataSelected).length;
            this.recordSelected = dataSelected; 
        },
        /**
         * Ấn để in các bản ghi đã chọn
         */
        printSelected(){
            if(Object.keys(this.recordSelected).length == 0){
                this.$snotify({
                            type: "info",
                            title: "Vui lòng chọn bản ghi để in"
                        }); 
                return;
            }
            this.hideBottomSheet();
            this.$goToPage('/documents/print-multiple',"In",false,true,{listObject:this.recordSelected});
        },
        // chọn mẫu trước khi in
        selectPrintConfig(){
            this.$refs.listPrintView.show();
            this.recordPreview = this.recordSelected

        },
        /**
         * xử lí sau khi click vào 1 item bên sidebar của view table
         */
        afterSelectedItem(item){
            if(item){
                this.curentFormActive = parseInt(item.formId);
                this.allObjectPrint = [{document_object_id:parseInt(this.currentRowData.document_object_id),formId:parseInt(item.formId)}]
            }
        },
        /**
         * Sự kiện khi selection vào cell
         */
        afterCellSelection(rowData){
            this.currentRowData = rowData;
        }
    }
}
</script>

<style scoped>
    .panel-header{
        height: 30px;
        display: flex;
        color: #757575;
        margin-top: -3px;
    }
    .panel-header .mdi:hover{
        color: rgba(0,0,0 / 0.6);
    }
    .panel-body{
        height: calc(100vh - 55px);
    }
    .panel-body >>> .wrap-content-detail{
        height: calc(100vh - 65px) !important;
    }
    .right-action{
        margin-left: auto;
        font-size: 15px;
    }
    .panel-header .mdi {
        cursor: pointer;
        margin-right: 12px;
        font-size: 16px;
        transition: all ease-in-out 250ms;
    }
    .left-action .mdi:not(.mdi-close){
        font-size: 24px;
        line-height: 1;
    }
    .left-action .mdi-close{
        font-size: 20px;
        line-height: 1;
    }
    .document-title{
        font-size: 13px;
        display: inline-block;
        vertical-align: middle;
    }

    .copyed {
        margin-right: 12px;
        font-size: 12px;
    }
    .sheet-action{
        margin-left: auto;
    }
    
    .sheet-action >>> button{
        margin: 6px 8px !important;
        border-radius: 4px;
        box-shadow: none;
    }
    .sheet-action >>> button:last-child{
        color: red;
    }
    .count-selection span{
        display: inline-block;
        padding: 12px;
        height: 100%;
    }

</style>