<template>
    <div class="wrap-content-detail" style="overflow:hidden;">
        
        <Loader ref="skeletonView"/>
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
                        <v-icon @click="toggleSideBar" v-on="on">mdi-information-outline</v-icon>
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
        <div
            class="sym-form-Detail"
            :id="'sym-Detail-'+keyInstance"
            :style="{'width':documentSize, 'height':contentHeight,'margin':contentMargin}">
            <div class="content-document" v-html="contentDocument"></div>
            <div class="content-print-document" :style="formSize" v-html="contentPrintDocument"></div>
        </div>
      
        <side-bar-detail 
        v-if="!isPrint"
        :sidebarWidth="sidebarWidth"  
        :isShowSidebar="isShowSidebar"
        :userId="userId"
        :taskId="taskId"
        :createTime="createTime"
        :documentObjectId="docObjId"
        :workflowId="workflowId"
        :showCommentInDoc="showCommentInDoc"
        @after-hide-sidebar="afterHideSidebar"
        />
        <HistoryControl ref="historyView" />
       

    </div>
</template>
<script>
import { documentApi } from "./../../../api/Document.js";
import { userApi } from "./../../../api/user.js";
import "./../../../components/document/documentContent.css";
import { setDataForPropsControl } from "./../../../components/document/dataControl";
import BasicControl from "./../submit/basicControl";
import  TableControl from "./../submit/tableControl.js"
import  ActionControl from "./../submit/actionControl.js"
import LayoutControl from "./../submit/layoutControl";
import  Table from "./../submit/table.js"
import  TablePrint from "./../print/PrintTable"
import './../submit/customControl.css'
import { getSDocumentSubmitStore } from './../common/common'
import SideBarDetail from './SideBarDetail'
import HistoryControl from './HistoryControl'
import Loader from './../../../components/common/Loader';
import { util } from '../../../plugins/util.js';
export default {
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
        }
    },   
    components:{
        'side-bar-detail':SideBarDetail,
        HistoryControl,
        Loader
    },
    computed: {
        sDocumentEditor() {
            return this.$store.state.document.editor[this.keyInstance];
        },
        sDocumentSubmit() {
            return this.$store.state.document.submit[this.keyInstance];
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
            contentDocument: null,
            contentPrintDocument:null,
            docObjId: null,
            documentId:null,
            documentSize: null,
            keyInstance: Date.now(),
            contentMargin:'auto',
            sidebarWidth:400,
            isShowSidebar:false,
            workflowId:"",
            taskId:"",
            createTime:"",
            userId:"",
            printConfigActive:null,
            formSize:{},
            wrapFormCss:{},

        };
    },
    beforeMount() {
        this.documentSize = "21cm";
    },
    
    created(){
        this.$store.commit("document/setDefaultSubmitStore",{instance:this.keyInstance});
        this.$store.commit("document/setDefaultDetailStore",{instance:this.keyInstance});
        this.$store.commit("document/setDefaultEditorStore",{instance:this.keyInstance});
        
        let thisCpn = this;
        this.$store.commit("document/changeViewType", {
            key: thisCpn.keyInstance,
            value: 'detail'
        });
        if (this.documentObjectId != 0) {
            this.docObjId = Number(this.documentObjectId);
        } else if (this.$route.name == "detailDocument" || this.$route.name == "printDocument") {
            this.docObjId = Number(this.$route.params.id);
            this.loadDocumentObject(this.isPrint); 
        }

        this.$evtBus.$on('symper-app-wrapper-clicked',evt=>{
            if(thisCpn._inactive == true) return;
            if($(evt.target).is('.highlight-history')){
                this.$refs.historyView.show($(evt.target))    
            }
            else{
                if(
                    !$(evt.target).hasClass("v-data-table") &&
                    $(evt.target).closest(".v-data-table").length == 0){
                        this.$refs.historyView.hide() 
                    }
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
        formId(after){
            this.contentPrintDocument = null
            this.loadDocumentObject(this.isPrint);
        },
        documentObjectId(after){
            this.contentPrintDocument = null
            this.docObjId = Number(after);
            this.loadDocumentObject(this.isPrint);
        },
        documentId(after){
            if(after){
                let self = this;
                documentApi.getPrintConfigActive(this.documentId).then(res => {
                    if (res.status == 200) {
                       self.printConfigActive = res.data
                    }
                    
                })
                .catch(err => {
                
                })
                .always(() => {
                });
            }
        }
    },
    methods: {
        afterHideSidebar(){
            this.$emit('after-hide-sidebar')
        },
      
        setLayoutFromQuickView(size,margin){
            this.documentSize = size;
            this.contentMargin = margin;
        },
        // Khadm: load data của document lên để hiển thị và xử lý
        loadDocumentStruct(documentId,isPrint = false) {
            if(this.$route.name == 'printDocument'){
                isPrint = true;
            }
            let thisCpn = this;
            let dataPost = {};
            if(isPrint){
                dataPost = {formId:this.formId};
            }
            documentApi
                .detailDocument(documentId,dataPost)
                .then(res => {
                    if (res.status == 200) {
                        let content = res.data.document.content;
                        if(!isPrint){
                            $('.content-print-document').addClass('d-none');
                            $('.content-document').removeClass('d-none');
                            thisCpn.contentDocument = content;
                        }
                        else{
                            $('.content-print-document').removeClass('d-none');
                            $('.content-document').addClass('d-none');
                            thisCpn.contentPrintDocument = content;
                        }
                        try {
                            thisCpn.documentSize = '21cm';
                            contentPrintCss = {'margin':'auto'}
                            thisCpn.formSize = JSON.parse(res.data.document.formSize);
                            let contentPrintCss = {};
                            if(thisCpn.formSize.type == 'A3'){
                                thisCpn.documentSize = 'auto';
                                contentPrintCss = {'transform':'scale(0.84)','transform-origin':'top left'};
                            }
                            else if(thisCpn.formSize.type == 'A5'){
                                thisCpn.documentSize = 'auto';
                                contentPrintCss = {'transform':'scale(0.84)','transform-origin':'top left','margin':'auto'}
                            }
                            Object.assign(thisCpn.formSize,contentPrintCss)

                        } catch (error) {
                            
                        }
                        thisCpn.$emit('after-load-document',res.data.document)
                        setDataForPropsControl(res.data.fields, thisCpn.keyInstance,'detail'); // ddang chay bat dong bo
                        setTimeout(() => {
                            thisCpn.processHtml(content,isPrint);
                        }, 100);
                    }
                    else{
                        this.$snotify({
                                type: "error",
                                title: res.message,
                            });
                    }
                })
                .catch(err => {
                     this.$snotify({
                                type: "error",
                                title: "Can not load document struct",
                            });
                })
                .always(() => {});
        },
        async loadDocumentObject(isPrint=false) {
            this.contentDocument = ""
            try {
                this.$refs.skeletonView.show();
                let thisCpn = this;
                let res = await documentApi
                    .detailDocumentObject(this.docObjId);
                    if (res.status == 200) {
                        thisCpn.userId = res.data.document_object_user_created_id;
                        thisCpn.taskId = res.data.document_object_task_id;
                        thisCpn.createTime = res.data.document_object_create_time
                        thisCpn.workflowId = res.data.document_object_workflow_id;
                        thisCpn.documentId = res.data.documentId;
                        thisCpn.$store.commit('document/addToDocumentDetailStore',{
                            key: 'allData',
                            value: res.data,
                            instance:thisCpn.keyInstance
                        }) 
                        thisCpn.loadDocumentStruct(res.data.documentId,isPrint);
                    }
                    else{
                            this.$snotify({
                                type: "error",
                                title: res.message,
                            });
                    }
            } catch (error) {
                
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
        toggleSideBar(){
            this.isShowSidebar = !this.isShowSidebar;
        },
        isShow(){
            return this.isShowSidebar
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
        processHtml(content,isPrint = false) {
            var allInputControl = $("#sym-Detail-" + this.keyInstance +" .content-document").find(
                ".s-control:not(.bkerp-input-table .s-control)"
            );
            if(isPrint){
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
                    let valueInput = this.sDocumentEditor.allControl[id].value
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
                        }
                        //truong hop la control table
                        else {
                            let listInsideControls = {};
                            let mapControlToIndex = {};
                            let tableControl = new TableControl(
                                idField,
                                $(allInputControl[index]),
                                this.sDocumentEditor.allControl[id],
                                thisCpn.keyInstance
                            );
                            tableControl.initTableControl(isPrint);
                            tableControl.tableInstance = new Table(
                                tableControl,
                                controlName,
                                thisCpn.keyInstance
                            );
                            tableControl.tablePrint = new TablePrint(
                                tableControl,
                                controlName,
                                thisCpn.keyInstance
                            );
                            let columnsTableSqlLite = {};
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
                                let colIndex = thisCpn.getColIndexControl($(this));
                                mapControlToIndex[childControlName] = colIndex
                                thisCpn.addToListInputInDocument(childControlName,childControl)
                                listInsideControls[childControlName] = true;
                            });
                            tableControl.listInsideControls = listInsideControls;
                            tableControl.mapControlToIndex = mapControlToIndex;
                            this.addToListInputInDocument(controlName,tableControl)
                            tableControl.renderTable();
                            tableControl.setData(valueInput);
                        }
                    }
                }
            }
            this.$refs.skeletonView.hide();
            this.$emit("after-loaded-component-detail");
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
        position: relative;
    }
    .wrap-content-detail{
        position: relative;
        width: 100%;
        height: calc(100vh - 50px);
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
   
</style>