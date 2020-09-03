<template>
    <div class="wrap-content-detail">
        <div
            class="sym-form-Detail"
            :id="'sym-Detail-'+keyInstance"
            :style="{'width':documentSize, 'height':'100%','margin':contentMargin}">
            <div v-html="contentDocument"></div>
            
            
            
        </div>
            <!-- <button v-if="!quickView" v-on:click="togglePageSize"  id="toggle-doc-size-btn" :style="togglePageSizeBtnStyle">
                <span class="mdi mdi-arrow-horizontal-lock"></span>
            </button>
            <button v-if="!quickView" v-on:click="toggleSideBar"  id="side-bar-detail-btn" :style="toggleSideBarBtnStyle">
                <span class="mdi mdi-chevron-double-left"></span>
            </button> -->
            <side-bar-detail 
            :sidebarWidth="sidebarWidth"  
            :isShowSidebar="isShowSidebar"
            :userId="userId"
            :taskId="taskId"
            :createTime="createTime"
            :documentObjectId="documentObjectId1"
            :workflowId="workflowId"
            @after-hide-sidebar="afterHideSidebar"
            />
            <HistoryControl ref="historyView" />
     <v-speed-dial
                v-if="!quickView"
                v-model="fab"
                :top="top"
                :bottom="bottom"
                :right="right"
                :left="left"
                :direction="direction"
                :open-on-hover="hover"
                :transition="transition"
            >
            <template v-slot:activator>
                    <v-btn v-model="fab" color="blue darken-2" dark fab>
                        <v-icon v-if="fab">mdi-close</v-icon>
                        <v-icon v-if="!fab">mdi-menu</v-icon>
                    </v-btn>
                </template>
                <v-tooltip left>
                    <template v-slot:activator="{ on }">
                        <div v-on="on">
                            <v-btn fab dark small color="green" @click="togglePageSize">
                                <v-icon>mdi-resize</v-icon>
                            </v-btn>
                        </div>
                    </template>
                    <span>{{$t('document.detail.fab.toggleSize')}}</span>
                </v-tooltip>
                
                <v-tooltip left>
                    <template v-slot:activator="{ on }">
                        <div v-on="on">
                            <v-btn
                                fab
                                dark
                                small
                                color="indigo"
                                @click="toggleSideBar"
                            >
                                <v-icon>mdi-book-open-outline</v-icon>
                            </v-btn>
                        </div>
                    </template>
                    <span>{{$t('document.detail.fab.otherInfo')}}</span>
                </v-tooltip>
                <v-tooltip left>
                    <template v-slot:activator="{ on }">
                        <div v-on="on">
                            <v-btn
                                fab
                                dark
                                small
                                color="indigo"
                                @click="printDiv"
                            >
                                <v-icon>mdi-printer</v-icon>
                            </v-btn>
                        </div>
                    </template>
                    <span>{{$t('document.detail.fab.print')}}</span>
                </v-tooltip>
                
            </v-speed-dial>

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
import  Table from "./../submit/table.js"
import './../submit/customControl.css'
import { getSDocumentSubmitStore } from './../common/common'
import SideBarDetail from './SideBarDetail'
import HistoryControl from './HistoryControl'

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
        quickView:{
            type:Boolean,
            default:false,
        }
    },   
    components:{
        'side-bar-detail':SideBarDetail,
        HistoryControl
    },
    computed: {
        sDocumentEditor() {
            return this.$store.state.document.editor[this.keyInstance];
        },
        sDocumentSubmit() {
            return this.$store.state.document.submit[this.keyInstance];
        }
    },
    data() {
        return {
            contentDocument: null,
            docObjId: null,
            documentSize: null,
            keyInstance: Date.now(),
            contentMargin:'auto',
            sidebarWidth:300,
            isShowSidebar:false,
            workflowId:"",
            taskId:"",
            createTime:"",
            userId:"",
            documentObjectId1:"",
            direction: "top",
            fab: false,
            hover: false,
            tabs: null,
            top: false,
            right: true,
            bottom: true,
            left: false,
            transition: "slide-y-reverse-transition",
            isComponentActive:false

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
            this.docObjId = this.documentObjectId;
        } else if (this.$route.name == "detailDocument" || this.$route.name == "printDocument") {
            this.docObjId = this.$route.params.id;
        }
        if(this.docObjId != null){
            this.documentObjectId1 = this.docObjId;
            this.loadDocumentObject();  
        }
        userApi.getListUser(1,100000).then(res => {
            if (res.status == 200) {
                thisCpn.$store.commit("document/addToDocumentSubmitStore", {
                    key: 'listUser',
                    value: res.data.listObject,
                    instance:thisCpn.keyInstance
                });
            }
            
        })
        .catch(err => {
           
        })
        .always(() => {
        });
        

        this.$evtBus.$on('symper-app-wrapper-clicked',evt=>{
            if(thisCpn.isComponentActive == false) return;
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
    activated() {
        this.isComponentActive = true;
    },
    deactivated() {
        this.isComponentActive = false;
    },
    destroyed(){
    },
    watch:{
        docObjInfo:{
            deep: true,
            immediate: true,
            handler(after){
                if(after.docObjId){
                    this.docObjId = after.docObjId;
                    this.documentSize = after.docSize;
                    this.loadDocumentObject();
                }
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
        loadDocumentStruct(documentId) {
            this.contentDocument = ""
            let thisCpn = this;
            let dataPost = {};
            if(thisCpn.$route.name == 'printDocument'){
                dataPost = {formType:'print'};
            }
            documentApi
                .detailDocument(documentId,dataPost)
                .then(res => {
                    if (res.status == 200) {
                        let content = res.data.document.content;
                        thisCpn.contentDocument = content;
                        thisCpn.$emit('after-load-document',res.data.document)
                        setDataForPropsControl(res.data.fields, thisCpn.keyInstance,'detail'); // ddang chay bat dong bo
                        setTimeout(() => {
                            thisCpn.processHtml(content);
                        }, 100);
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
        loadDocumentObject() {
            let thisCpn = this;
            documentApi
                .detailDocumentObject(this.docObjId)
                .then(res => {
                    if (res.status == 200) {
                        thisCpn.userId = res.data.document_object_user_created_id;
                        thisCpn.taskId = res.data.document_object_task_id;
                        thisCpn.createTime = res.data.document_object_create_time
                        thisCpn.workflowId = res.data.document_object_workflow_id;
                        thisCpn.$store.commit('document/addToDocumentDetailStore',{
                            key: 'allData',
                            value: res.data,
                            instance:thisCpn.keyInstance
                        }) 
                        thisCpn.loadDocumentStruct(res.data.documentId);
                    }
                })
                .catch(err => {
                    this.$snotify({
                                type: "error",
                                title: "Can not load document object",
                            });
                })
                .always(() => {});
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
        processHtml(content) {
            var allInputControl = $("#sym-Detail-" + this.keyInstance).find(
                ".s-control:not(.bkerp-input-table .s-control)"
            );
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
                            let tableControl = new TableControl(
                                idField,
                                $(allInputControl[index]),
                                this.sDocumentEditor.allControl[id],
                                thisCpn.keyInstance
                            );
                            tableControl.initTableControl();
                            tableControl.tableInstance = new Table(
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
                                thisCpn.addToListInputInDocument(childControlName,childControl)
                                listInsideControls[childControlName] = true;
                            });
                            tableControl.listInsideControls = listInsideControls;
                            this.addToListInputInDocument(controlName,tableControl)
                            tableControl.renderTable();
                            tableControl.setData(valueInput);
                        }
                    }
                }

            }
            console.log(this.sDocumentSubmit);
            setTimeout(() => {
                if(thisCpn.$route.name == 'printDocument'){
                    thisCpn.printDiv();
                }
            }, 1000);
        },
        
        printDiv(){
            this.$snotify({
                                type: "error",
                                title: "hoàng đang xử lí, vui lòng quay lại sau",
                            });
            // this.fab = false;

            // $('.sym-form-Detail').find('table[border="1"]').removeAttr('border');
            // $('.sym-form-Detail').find('table[border="1"]').css({border:'none'});
            // // let css = this.getallcss();
            // let head = document.head || document.getElementsByTagName('head')[0];
            // let style = document.createElement('style');
            // $('body').css({display: 'flex',
            // 'justify-content': 'center',padding:'8px'})
          
            // var printContents = $('.sym-form-Detail')[0].innerHTML;
            // $(printContents).find('.s-drawer').remove();
			// var originalContents = document.body.innerHTML;
            // // head.appendChild(style);
            // let x = this.$el.detach();
            // let old = this.$root.$el;
            // // let content = $(printContents).detach();
            // $(this.$root.$el).empty();
            // $(this.$root.$el).append(x);
			// // document.body.innerHTML = printContents;

			// window.print();
            // $(this.$root.$el).append($(old).children().detach());
            // // document.body.innerHTML = originalContents;
            //  $('body').removeAttr('style');
            
        },
        getallcss() {
            var css = "", //variable to hold all the css that we extract
                styletags = document.getElementsByTagName("style");
            for(var i = 0; i < styletags.length; i++)
            {
                css += styletags[i].innerHTML; //extract the css in the current style tag
            }
            css += 'padding:12px';
            if(this.documentSize == '21cm'){
                $('body').addClass('content-print')
            }


            // //loop over all the external stylesheets
//             for(var i = 0; i < document.styleSheets.length; i++)
//             {
//                 var currentsheet = document.styleSheets[i];
//                 if(currentsheet.href == null){
// //loop over all the styling rules in this external stylesheet
//                     for(var e = 0; e < currentsheet.cssRules.length; e++)
//                     {
//                         css += currentsheet.cssRules[e].cssText; //extract all the styling rules
//                     }
//                 }
                
//             }

            return css;
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
        height: calc(100% - 40px);
    }
    .sym-form-Detail >>> .on-selected {
        border: none !important; 
    }
    .sym-form-Detail >>> table:not(.htCore) td,
    .sym-form-Detail >>> table:not(.htCore),
    .sym-form-Detail >>> table:not(.htCore) th {
        border: none !important;
    }
    .sym-form-Detail >>> .htCore td:last-child {
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
    
    /* .sym-form-Detail table:not(.htCore) td, .sym-form-Detail table:not(.htCore), .sym-form-Detail table:not(.htCore) th{
        border: none !important;
    } */
</style>