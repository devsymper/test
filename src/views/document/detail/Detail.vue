<template>
    <div style="overflow:hidden;position: relative;"
        :class="globalClass"
    >
        <Preloader ref="preLoaderView"/>
        <div class="panel-header" v-if="!quickView && !isPrint">
            <div class="right-action">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon  @click="togglePageSize" v-on="on">mdi-resize</v-icon>
                    </template>
                    <span>{{$t('document.detail.fab.toggleSize')}}</span>
                </v-tooltip>
                
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon @click="showSideBar" v-on="on">mdi-information-outline</v-icon>
                    </template>
                    <span>{{$t('document.detail.fab.otherInfo')}}</span>
                </v-tooltip>
                <v-tooltip bottom>
                    
                     <template v-slot:activator="{ on }">
                        <v-icon  @click="handleClickPrint" v-on="on">mdi-printer</v-icon>
                    </template>
                    <span>{{$t('document.detail.fab.print')}}</span>
                </v-tooltip>
            </div>
        </div>
        <VuePerfectScrollbar style="height: calc(100% - 30px);" class="content-scroll wrapview-contextmenu">
            <div
                class="sym-form-Detail"
                :id="'sym-Detail-'+keyInstance"
                :style="{'width':documentSize, 'height':contentHeight,'margin':contentMargin}">
                <div class="content-document" v-html="contentDocument"></div>
                <div class="content-print-document" :style="formSize" v-html="contentPrintDocument"></div>
                <FloattingPopup 
                    ref="floattingPopup" 
                    :focusingControlName="focusingControlName"
                    :instance="keyInstance"/>
            </div>
        </VuePerfectScrollbar>
        <side-bar-detail 
            v-if="!isPrint"
            :isShowSidebar="isShowSidebar"
            ref="sidebarView"
            :keyInstance="keyInstance"
            :sidebarWidth="sidebarWidth"  
            :userId="userId"
            :taskId="taskId"
            :createTime="createTime"
            :documentObjectId="docObjId"
            :userRole="userCreateInfo.role"
            :workflowId="workflowId"
            :showCommentInDoc="showCommentInDoc"
            @after-hide-sidebar="afterHideSidebar"
        />
        <HistoryControl ref="historyView" />
        <Comment style="margin-left:-12px;margin-right:8px" 
				:showComment="true" 
				:objectIdentifier="taskId ? taskId : String(docObjId)" 
				:objectType="taskId ? 'task' : 'document'" 
				:height="'480px'"
                :listCommentHeight="425"
                ref="commentView"
                v-show="isShowComment"
				:buttonClose="false" 
                class="comment-approval-view"
			/>

    </div>
</template>
<script>
import { documentApi } from "./../../../api/Document.js";
import "./../../../components/document/documentContent.css";
import BasicControl from "./../submit/basicControl";
import  ActionControl from "./../submit/actionControl.js"
import LayoutControl from "./../submit/layoutControl";
import { getSDocumentSubmitStore,getControlInstanceFromStore } from './../common/common'
import SideBarDetail from './SideBarDetail'
import HistoryControl from './HistoryControl'
import FloattingPopup from './../common/FloattingPopup'
import Preloader from './../../../components/common/Preloader';
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import tinymce from 'tinymce/tinymce';
import Comment from '@/components/common/comment/Comment.vue'
import ControlRelationWorker from 'worker-loader!@/worker/document/submit/ControlRelation.Worker.js';
import TableControl1 from '../submit/tableControl1.js';

export default {
    name: "detailDocument",
    props: {
        documentObjectId: {
            type: Number,
            default: 0
        },
        docObjInfo: {
            type: Object,
            default(){
                return {
                    docObjId: 0,
                    docSize : '21cm'
                }
            }
        }, 
        isPrint:{
            type:Boolean,
            default:false
        },
        showCommentInDoc:{
            type:Boolean,
            default:true
        },
        formId:{
            type:Number,
            default:0
        },
        quickView:{
            type:Boolean,
            default:false,
        },
        contentHeight:{
            type:String,
            default:"calc(100% - 30px);"
        },
        
    },   
    components:{
        'side-bar-detail':SideBarDetail,
        HistoryControl,
        Preloader,
        FloattingPopup,
        VuePerfectScrollbar,
        Comment
    },
    computed: {
        routeName(){
            return this.$getRouteName();
        },
        sDocumentEditor() {
            return this.$store.state.document.editor[this.keyInstance];
        },
        sDocumentSubmit() {
            return this.$store.state.document.submit[this.keyInstance];
        },
        sDocumentDetail() {
            return this.$store.state.document.detail[this.keyInstance];
        },
        listLinkControl() {
            return this.$store.state.document.linkControl[this.keyInstance];
        },
        allUsers(){
            let allUser = this.$store.state.app.allUsers
            thisCpn.$store.commit("document/addToDocumentSubmitStore", {
                key: 'listUser',
                value: allUser,
                instance:thisCpn.keyInstance
            });
        }
    },
    data() {
        return {
            controlRelationWorker:null,
            focusingControlName: '',
            contentDocument: null,
            contentPrintDocument:null,
            docObjId: null,
            documentId:null,
            isShowSidebar:false,
            documentSize: null,
            keyInstance: Date.now(),
            contentMargin:'auto',
            sidebarWidth:400,
            workflowId:"",
            taskId:"",
            userCreateInfo:"",
            createTime:"",
            userId:"",
            direction: "top",
            fab: false,
            hover: false,
            tabs: null,
            top: false,
            right: true,
            bottom: true,
            left: false,
            transition: "slide-y-reverse-transition",
            printConfigActive:null,
            formSize:{},
            wrapFormCss:{},
            defaultData:{},
            dataPivotTable:{},
            dataGroupTable:{},
            globalClass:null,
            isShowComment:false,

        };
    },
    beforeMount() {
        this.documentSize = "21cm";
         this.globalClass = {
            'wrap-content-detail':true,
        }
    },
    mounted(){
        let thisCpn = this;
        this.controlRelationWorker = new ControlRelationWorker();
        this.controlRelationWorker.addEventListener("message", function (event) {
            let data = event.data;
            switch (data.action) {
                case 'setDataForPropsControl':
                    let listControlToStore = data.dataAfter.listControlToStore;
                    for(let controlId in listControlToStore){
                        thisCpn.$store.commit(
                            "document/addControl", { id: controlId, props: listControlToStore[controlId], instance: thisCpn.keyInstance }
                        );
					}
                    thisCpn.processHtml();
                    // thisCpn.controlRelationWorker.terminate();
                    break;
                default:
                    break;
            }
        });
    },
    created(){
        tinymce.remove();
        this.$store.commit("document/setDefaultSubmitStore",{instance:this.keyInstance});
        this.$store.commit("document/setDefaultDetailStore",{instance:this.keyInstance});
        this.$store.commit("document/setDefaultEditorStore",{instance:this.keyInstance});
        if(this.$route.params.extraData && this.$route.params.extraData.defaultData){
            this.defaultData = this.$route.params.extraData.defaultData;
        }
        let thisCpn = this;
        this.$store.commit("document/changeViewType", {
            key: thisCpn.keyInstance,
            value: 'detail'
        });
        if(this.isPrint || this.routeName == "printDocument"){
            this.$store.commit("document/changeViewType", {
                key: thisCpn.keyInstance,
                value: 'print'
            });
        }
        if (this.documentObjectId != 0) {
            this.docObjId = Number(this.documentObjectId);
        } else if (this.routeName == "detailDocument" || this.routeName == "printDocument") {
            this.docObjId = Number(this.$route.params.id);
            this.loadDocumentObject(this.isPrint); 
        }
        this.$evtBus.$on('symper-app-wrapper-clicked',evt=>{
            if(thisCpn._inactive == true) return;
            if(this.$refs.historyView){
                if($(evt.target).is('.highlight-history') ){
                    this.$refs.historyView.show($(evt.target))    
                }
                else if($(evt.target).closest('.info-control-btn').length > 0){
                    this.focusingControlName = $(evt.target).closest('.info-control-btn').attr('data-control');
                    this.$refs.floattingPopup.show(evt, $('#sym-Detail-'+this.keyInstance));
                }
                else{
                    if(!$(evt.target).hasClass("v-data-table") &&
                        $(evt.target).closest(".v-data-table").length == 0){
                        this.$refs.historyView.hide() 
                    }
                    if(!$(evt.target).hasClass("s-floatting-popup") &&
                        $(evt.target).closest(".s-floatting-popup").length == 0){
                        this.focusingControlName = "";
                        this.$refs.floattingPopup.hide() 
                    }
                }
            }
            
        })
        
        /**
         * Nhận xử lí sự kiện click chuyển đổi dạng table <=> pivot mode
         */
        this.$evtBus.$on("on-switch-pivot-table-mode", locate =>{
            if(thisCpn._inactive == true) return;
            let tableName = locate.tableName;
            let tableInstance = getControlInstanceFromStore(this.keyInstance,tableName);
            tableInstance.tableMode = (tableInstance.tableMode == 'nomal') ? 'pivot' : 'nomal';
            tableInstance.switchTable();
        })
        /**
         * Sau khi load data cho table thi render pivot table
         */
        this.$evtBus.$on("document-on-table-change", locate =>{
            if(thisCpn._inactive == true) return;
            let tableName = locate.tableName;
            if(this.dataPivotTable && this.dataPivotTable[tableName]){
                let data = locate.data;
                let tableIns = getControlInstanceFromStore(this.keyInstance, tableName);
                tableIns.pivotTable.setData(data);
            }
        })
        
       
    },
    watch:{
        docObjInfo:{
            deep: true,
            immediate: true,
            handler(after){
                if(after.docObjId){
                    this.docObjId = Number(after.docObjId);
                    this.documentSize = after.docSize;
                    this.loadDocumentObject(this.isPrint);
                }
            }
        },
        documentObjectId(after){
            this.contentPrintDocument = null
            this.docObjId = Number(after);
            this.loadDocumentObject(this.isPrint);
        },
    },
    methods: {
        afterHideSidebar(){
            this.$emit('after-hide-sidebar')
        },
         toggleSideBar(){
            this.isShowSidebar = !this.isShowSidebar;
        },
        isShow(){
            return this.isShowSidebar
        },
        setLayoutFromQuickView(size,margin){
            this.documentSize = size;
            this.contentMargin = margin;
        },
        // Khadm: load data của document lên để hiển thị và xử lý
        async loadDocumentStruct(documentId,isPrint = false) {
            try {
                if(this.routeName == 'printDocument'){
                    isPrint = true;
                }
                let dataPost = {};
                if(isPrint){
                    dataPost = {formId:this.formId};
                    if(this.formId == 0){
                        dataPost.formId = 'active';
                    }
                }
                let docDetailRes = await documentApi.detailDocument(documentId,dataPost);
                if (docDetailRes.status == 200) {
                    this.$store.commit("document/addToDocumentSubmitStore", {
                        key: 'documentInfo',
                        value: docDetailRes.data,
                        instance:this.keyInstance
                    });
                    this.dataPivotTable = docDetailRes.data.pivotConfig;
                    this.dataGroupTable = docDetailRes.data.groupConfig;
                    let content = docDetailRes.data.document.content;
                    if(!isPrint){
                        $('.content-print-document').addClass('d-none');
                        $('.content-document').removeClass('d-none');
                        this.contentDocument = content;
                    }
                    else{
                        $('.content-print-document').removeClass('d-none');
                        $('.content-document').addClass('d-none');
                        this.contentPrintDocument = content;
                    }
                    this.documentSize = '21cm';
                    let contentPrintCss = {};
                    contentPrintCss = {'margin':'auto'};
                    if(docDetailRes.data.document.formStyle){
                        let style = JSON.parse(docDetailRes.data.document.formStyle);
                        if(!style['globalClass']){
                            style['globalClass'] = 'document-form-style-default'
                        }
                        this.globalClass[style['globalClass']] = true;
                    }
                    else{
                        this.globalClass['document-form-style-default'] = true;
                    }
                    if(docDetailRes.data.document.formSize){
                        this.formSize = JSON.parse(docDetailRes.data.document.formSize);
                        if(this.formSize){
                            this.documentSize = 'auto';
                            if(this.formSize.type == 'A3'){
                                contentPrintCss = {'transform':'scale(0.84)','transform-origin':'top left'};
                            }
                            else if(this.formSize.type == 'A5'){
                                contentPrintCss = {'transform':'scale(0.84)','transform-origin':'top left','margin':'auto'}
                            }
                            if(this.$getRouteName() == 'printMultiple'){
                                contentPrintCss['transform'] = 'scale(1)'
                            }
                            Object.assign(this.formSize,contentPrintCss);
                        }
                    }
                    
                    this.controlRelationWorker.postMessage({action:'setDataForPropsControl',data:
                        { fields: docDetailRes.data.fields, viewType: 'detail', allDataDetail: this.sDocumentDetail.allData}
                    });
                }
                this.$emit('after-load-document',docDetailRes.data.document);  

            } catch (error) {
                console.log(error,'errorerror');
            }

        },
        async loadDocumentObject(isPrint=false) {
            this.contentDocument = ""
            let thisCpn = this;
            let res = await documentApi
                .detailDocumentObject(this.docObjId);
            if (res.status == 200) {
                thisCpn.userId = res.data.document_object_user_created_id;
                thisCpn.taskId = res.data.document_object_task_id;
                thisCpn.createTime = res.data.document_object_create_time
                thisCpn.workflowId = res.data.document_object_workflow_object_id;
                thisCpn.documentId = res.data.documentId;
                thisCpn.userCreateInfo = res.data.userCreateInfo;
                let dataToStore = res.data;
                if(Object.keys(thisCpn.defaultData).length > 0){
                    dataToStore = thisCpn.defaultData;
                    dataToStore.documentId = res.data.documentId;
                }
                thisCpn.$store.commit('document/addToDocumentDetailStore',{
                    key: 'allData',
                    value: dataToStore,
                    instance:thisCpn.keyInstance
                }) 
                thisCpn.$store.commit('document/updateListLinkControl',{
                    key: thisCpn.keyInstance,
                    value: res.data.otherInfo,
                }); 
                thisCpn.loadDocumentStruct(res.data.documentId,isPrint);
            }
            else{
                this.$snotify({
                    type: "error",
                    title: res.message,
                });
            }
        },
        togglePageSize() {
            this.contentMargin = this.documentSize == "21cm" ? "" : "auto";
            this.documentSize = this.documentSize == "21cm" ? "calc(100%)" : "21cm";
            let listInputInDocument = this.getListInputInDocument();
            let allControlInstance = Object.values(listInputInDocument);
            let listTableControlInstance = allControlInstance.filter(control =>{
                return control.type == 'table'
            })
            for (let index = 0; index < listTableControlInstance.length; index++) {
                let table = listTableControlInstance[index];
                setTimeout(() => {
                    table.tableInstance.tableInstance.render();
                }, 50);
                
            }
        },
        showSideBar(){
            this.$refs.sidebarView.show()
        },
        getListInputInDocument() {
            return getSDocumentSubmitStore(this.keyInstance).listInputInDocument;
        },
        getControlInstance(controlName) {
            return getSDocumentSubmitStore(this.keyInstance).listInputInDocument[controlName];
        },
        addToListInputInDocument(name,control){
             this.$store.commit(
                            "document/addToListInputInDocument",
                            { name: name, control: control ,instance: this.keyInstance}
                        );
        },
        processHtml() {
            var allInputControl = $("#sym-Detail-" + this.keyInstance +" .content-document").find(
                ".s-control:not(.bkerp-input-table .s-control)"
            );
            if(this.isPrint){
                allInputControl = $("#sym-Detail-" + this.keyInstance +" .content-print-document").find(
                    ".s-control:not(.bkerp-input-table .s-control)"
                );
            }
            let thisCpn = this;
            for (let index = 0; index < allInputControl.length; index++) {
                let id = $(allInputControl[index]).attr('id');
                let controlType = $(allInputControl[index]).attr('s-control-type');
                
                if(this.sDocumentEditor.allControl[id] != undefined){   // ton tai id trong store
                    let idField = this.sDocumentEditor.allControl[id].id;
                    let valueInput = this.sDocumentEditor.allControl[id].value;
                    if(controlType == "submit" || controlType == "reset" || controlType == "draft"){
                        $(allInputControl[index]).remove()
                    }
                    else if(controlType == "approvalHistory"){
                        let control = new ActionControl(
                                idField,
                                $(allInputControl[index]),
                                this.sDocumentEditor.allControl[id],
                                thisCpn.keyInstance,
                                this.docObjId
                            );
                            control.init();
                            control.render();
                            this.isShowComment = true;
                            control.addCommentToView($(this.$refs.commentView.$el).detach());
                    }
                    else if(controlType == 'tabPage'){
                        let control = new LayoutControl(
                                idField,
                                $(allInputControl[index]),
                                this.sDocumentEditor.allControl[id],
                                thisCpn.keyInstance,
                                this.docObjId
                            );
                        control.init();
                        control.render();
                    }
                    else {
                        let controlName = this.sDocumentEditor.allControl[id].properties.name.value;
                        if (controlType != "table") {
                            let control = new BasicControl(
                                idField,
                                $(allInputControl[index]),
                                this.sDocumentEditor.allControl[id],
                                thisCpn.keyInstance,
                                valueInput
                            );
                            control.init();
                            this.addToListInputInDocument(controlName,control)
                            control.render();
                            control.checkHasInfoControl(this.listLinkControl);
                        }
                        //truong hop la control table
                        else {
                            let controlInTable = {};
                            let tableControl = new TableControl1(
                                idField,
                                $(allInputControl[index]),
                                this.sDocumentEditor.allControl[id],
                                thisCpn.keyInstance,
                                (this.dataPivotTable) ? this.dataPivotTable[controlName] : {},
                                (this.dataGroupTable) ? this.dataGroupTable[controlName] : {},
                                this.isPrint
                            );
                            let tableEle = $(allInputControl[index]);
                            tableEle.find(".s-control").each(function() {
                                let childControlId = $(this).attr("id");
                                let childControlProp = thisCpn.sDocumentEditor.allControl[id].listFields[childControlId];
                                let idFieldChild = childControlProp.id;
                                let childControl = new BasicControl(
                                    idFieldChild,
                                    $(this), 
                                    childControlProp,
                                    thisCpn.keyInstance
                                );
                                childControl.init();
                                childControl.inTable = controlName;
                                let childControlName = childControlProp.properties.name.value;
                                thisCpn.addToListInputInDocument(childControlName,childControl)
                                controlInTable[childControlName] = childControl;
                            });
                            tableControl.controlInTable = controlInTable;
                            tableControl.renderTable();
                            this.addToListInputInDocument(controlName,tableControl);
                            console.log(valueInput,'valueInputvalueInput');
                            tableControl.setData(valueInput);
                        }
                    }
                }
			}
            this.$refs.preLoaderView.hide();
            this.$emit("after-loaded-component-detail",this.formSize);
            $('.wrap-content-detail').removeAttr('style');
        },

        getColIndexControl(controlEl){
            let td = controlEl.closest('td');
            let tr = controlEl.closest('tr').css('position','relative');
            let tdIndex = td.index();
            return tdIndex;
        },
        async handleClickPrint(){
            this.$goToPage('/documents/print-multiple',"In",false,true,{listObject:[{document_object_id:this.docObjId}]});
        }
       
    }
}
</script>
<style  scoped>
    .sym-form-Detail {
        width: 21cm;
        padding: 16px;
    }
    .wrap-content-detail{
        position: relative;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .sym-form-Detail >>> .on-selected {
        border: none !important; 
    }
    .sym-form-Detail >>> table:not(.htCore):not(.table-print) td,
    .sym-form-Detail >>> table:not(.htCore):not(.table-print),
    .sym-form-Detail >>> table:not(.htCore):not(.table-print) th {
        border: none !important;
    }
    .sym-form-Detail >>> .htCore td:nth-last-child(3) {
        border-right: 1px solid #ccc !important;
    }
    .sym-form-Detail >>> .htCore thead tr th:nth-last-child(3) {
        border-right: 1px solid #ccc !important;
    }
    .sym-form-Detail >>> .ht_clone_left.handsontable table.htCore {
        border-right: none;
    }
    .s-control-label{
        background: none !important;
    }

    #toggle-doc-size-btn {
        position: absolute;
        top: 15px;
        padding: 4px 12px;
        font-size: 20px;
        border-radius: 4px;
        background: #fafafa;
        opacity: 1;
        color: #757575;
        transition:all cubic-bezier(0.4, 0, 0.2, 1) 250ms;
    }
    #toggle-doc-size-btn:hover {
        background: #dddddd;
    }
    #toggle-doc-size-btn:focus {
        outline: none;
    }
    #side-bar-detail-btn {
        position: absolute;
        top: 15px;
        padding: 4px 12px;
        font-size: 20px;
        border-radius: 4px;
        background: #fafafa;
        opacity: 1;
        color: #757575;
        transition:all cubic-bezier(0.4, 0, 0.2, 1) 250ms;
    }
    #side-bar-detail-btn:hover {
        background: #dddddd;
    }
    #side-bar-detail-btn:focus {
        outline: none;
    }
    ::v-deep .v-speed-dial {
        position: absolute;
    }
    

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
    .right-action >>> .v-icon{
        font-size: 16px !important;
    }
    .panel-header .mdi {
        cursor: pointer;
        margin-right: 12px;
        transition: all ease-in-out 250ms;
    }
    .comment-approval-view >>> .v-toolbar__content{
        display: none !important;
    }
   
</style>