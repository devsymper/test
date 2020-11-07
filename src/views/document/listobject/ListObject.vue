<template>
    
    <div class="h-100 w-100 list-object-component">
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
        :showExportButton="true"
        :showImportButton="true"
        :isTablereadOnly="false"
        :conditionByFormula="formulasInput.formula.value"
        @after-open-add-panel="submitDocument"
        @data-get="afterGetData"
        @before-keydown="afterRowSelected"
        @after-cell-mouse-down="afterRowSelected"
        @after-selected-row="afterSelectedRow"
        @row-selected="afterCellSelection"
        :commonActionProps="commonActionProps"
        :customAPIResult="customAPIResult"
        ref="listObject"
    >
        <div slot="right-panel-content" class="h-100">
            <div v-if="isDeleteMultiple" class="h-100">
                <div class="d-flex">
                    <h2>Công thức truy vẫn xóa</h2>
                    <v-icon @click="closePanelFormulas" style="margin-left:auto;font-size:20px;">mdi-close</v-icon>
                </div>
                <div class="formulas-input">
                    <FormTpl  
                        :singleLine="false" 
                        :labelWidth="`100px`"  
                        :allInputs="formulasInput"/>
                    <v-icon @click="runFormulas" class="run-formulas-btn">mdi-send</v-icon>
                </div>
                <v-progress-linear
                    v-if="showProgress"
                    indeterminate
                    color="orange"
                    ></v-progress-linear>
                    <br>
                <v-btn small @click="showDialog" class="delete-record-btn">
                    <v-icon left>mdi-trash-can-outline</v-icon> {{$t('common.delete')}}
                </v-btn>
            </div>
            <div v-else>
                <div class="panel-header" v-if="actionOnRightSidebar == 'detail'">
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
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                    <v-icon @click="updateCurrentRecord" v-on="on">mdi-pencil</v-icon>
                            </template>
                            <span>{{$t('document.instance.showlist.update')}}</span>
                        </v-tooltip>
                    </div>
                    <v-btn small @click="showDialog" class="delete-record-btn">
                        <v-icon left>mdi-trash-can-outline</v-icon> {{$t('common.delete')}}
                    </v-btn>
                </div>
                <div  v-else-if="actionOnRightSidebar == 'update'">
                    <span class="title float-left">
                        {{$t('document.instance.showlist.update')}}
                    </span>
                    <v-icon
                        class="close-btn float-right"
                        @click="hidePanel"
                    >mdi-close</v-icon>
                </div>
                <div class="panel-body">
                    <detail-object 
                        v-if="actionOnRightSidebar == 'detail'"
                        @after-hide-sidebar="afterHideSidebarDetail" 
                        ref="viewDetail" 
                        @after-load-document="handleAfterLoadDocument" 
                        :quickView="true" 
                        :docObjInfo="docObjInfo"/>

                    <DocumentSubmit 
                        v-if="actionOnRightSidebar == 'update'"
                        :action="'update'"
                        :documentObjectId="docObjInfo.docObjId"
                        @submit-document-success="onDocumentUpdateSuccess"/>
                </div>
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
                    <div v-if="isDeleteMultiple">
                        <v-btn small @click="printSelected" >
                            <v-icon left>mdi-trash-can-outline</v-icon> {{$t('common.delete')}}
                        </v-btn>
                        <v-btn @click="hideBottomSheet" tile small> {{$t('common.close')}}
                        </v-btn>
                    </div>
                    <div v-else>
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
            </div>
        </BottomSheet>
        <v-dialog
            v-model="dialog"
            max-width="290">
            <v-card>
                <v-card-title class="headline">Xác nhận Xóa</v-card-title>
                <v-card-text>
                Xác nhận xóa {{countRecordSelected}} bản ghi
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
                    @click="deleteSelectedRecord">
                    {{$t('common.delete')}}
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import ListItems from "./../../../components/common/ListItems.vue";
import BottomSheet from './../../../components/common/BottomSheet'
import PrintView from "./../print/PrintView";
import ActionPanel from "./../../../views/users/ActionPanel.vue";
import Tablet from "./../../../components/common/Tablet";
import FormTpl from "@/components/common/FormTpl.vue"
import { documentApi } from "./../../../api/Document.js";
import { util } from "./../../../plugins/util.js";
import Detail from './../detail/Detail.vue';
import DocumentSubmit from "@/views/document/submit/Submit.vue";

export default {
    components: {
        "list-items": ListItems,
        "detail-object": Detail,
        "action-panel": ActionPanel,
        Tablet,
        BottomSheet,
        PrintView,
        DocumentSubmit,
        FormTpl

    },
    data(){
        return {
            dialog:false,
            showProgress:false,
            actionOnRightSidebar: 'detail',
            commonActionProps: {
                "module": "document",
                "resource": "document_instance",
                "scope": "document",
                "parentId": this.$route.params.id
            },
            customAPIResult:{
                reformatData(res){
                    let thisCpn = util.getClosestVueInstanceFromDom(document.querySelector('.list-object-component'));
                    let listObject = res.data.listObject;
                    // if(Object.keys(thisCpn.recordSelected).length > 0){
                    //     for (let index = 0; index < listObject.length; index++) {
                    //         let row = listObject[index];
                    //         let rowChecked = Object.values(thisCpn.recordSelected).filter(r=>{
                    //             return r.document_object_id == row.document_object_id
                    //         })
                    //         if(rowChecked.length > 0){
                    //             listObject[index]['checkbox_select_item'] = true;
                    //         }
                    //     }
                    // }
                    return{
                        columns:res.data.columns,
                        listObject:res.data.listObject,
                        total:res.data.listObject.length,
                    }
                }
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
            isDeleteMultiple:false,
            dataClipboard:"",
            formulasInput:{
                formula : {
                    title: "Nhập công thức",
                    type: "script",
                    value: '',
                    style:{
                        height:'300px'
                    }
                }, 
            },
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
                        .deleteDocumentObject({objectIds:JSON.stringify(ids)})
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
                        this.$goToPage('/documents/objects/'+documentObject.document_object_id,"Chi tiết");
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
                delete_multi: {
                    name: "deleteMulti",
                    text: this.$t('document.instance.showlist.deleteMultiple'),
                    callback: (documentObject, callback) => {
                        this.isDeleteMultiple = true;
                        this.toggleCheckBoxListItem(false);
                        this.actionPanelWidth = 400;
                        this.$refs.listObject.openactionPanel();
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
            if(this.isDeleteMultiple){
                // for(let row in this.recordSelected){
                //     this.$refs.listObject.getHotInstance().setDataAtCell(row,0,true,'edit');
                // }
            }
            else{
                this.showBottomSheet();
            }
        }
    },
    methods:{
         onDocumentUpdateSuccess(){
            this.actionOnRightSidebar = 'detail';
        },
        updateCurrentRecord(){
            this.actionOnRightSidebar = 'update';
        },
        deleteSelectedRecord(){
            let itemSelected = Object.values(this.recordSelected);
            let ids = itemSelected.reduce((arr,obj)=>{
                arr.push(obj.document_object_id);
                return arr;
            },[]);
            let thisCpn = this;
            this.dialog = false;
            documentApi
            .deleteDocumentObject({objectIds:JSON.stringify(ids)})
            .then(res => {
                if (res.status == 200) {
                    thisCpn.$snotify({
                        type: "success",
                        title: "Delete document Object success!"
                    });  
                    thisCpn.$refs.listObject.removeAllRowChecked();
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
        showDialog(){
            this.dialog = true;
        },
        closePanelFormulas(){
            this.formulasInput.formula.value = "";
            this.isDeleteMultiple = false;
            this.$refs.listObject.removeCheckBoxColumn();
            this.actionPanelWidth = 800;
            this.$refs.listObject.closeactionPanel();
            setTimeout((self) => {
                self.$refs.listObject.refreshList(); 
            }, 200,this);
        },
        runFormulas(){
            this.showProgress = true;
            this.$refs.listObject.refreshList();
        },
        afterGetData(data){
            this.showProgress = false;
            if(this.isDeleteMultiple){
                this.$refs.listObject.addCheckBoxColumn();
            }
            this.dataTable = data;
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
        toggleCheckBoxListItem(isShowBottomSheet = true){
            if(!this.$refs.listObject.isShowCheckedRow()){
                if(isShowBottomSheet){
                    this.showBottomSheet();
                }
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
            this.actionOnRightSidebar = 'detail';
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
    .formulas-input{
        position: relative;
    }
    .run-formulas-btn{
        position: absolute;
        right: 4px;
        bottom: 14px;
        font-size: 18px;
    }
    .delete-record-btn{
        position: absolute;
        bottom: 16px;
        right: 16px;
    }

</style>