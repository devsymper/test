<template>
    <div class="wrap-content-detail">
        <div
            class="sym-form-Detail"
            :id="'sym-Detail-'+keyInstance"
            :style="{'width':documentSize, 'height':'100%','margin':contentMargin}"
        >
            <div v-html="contentDocument"></div>
            
            
        </div>
            <button v-on:click="togglePageSize"  id="toggle-doc-size-btn" :style="togglePageSizeBtnStyle">
                <span class="mdi mdi-arrow-horizontal-lock"></span>
            </button>
            <button v-on:click="toggleSideBar"  id="side-bar-detail-btn" :style="toggleSideBarBtnStyle">
                <span class="mdi mdi-chevron-double-left"></span>
            </button>
            <side-bar-detail :sidebarWidth="sidebarWidth" :isShowSidebar="isShowSidebar"/>

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

export default {
    props: {
        docObjectId: {
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
        }
    },   
    components:{
        'side-bar-detail':SideBarDetail
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
            toggleSideBarBtnStyle:null,
            togglePageSizeBtnStyle:null,
            isShowSidebar:false
        };
    },
    beforeMount() {
        this.documentSize = "21cm";
        this.toggleSideBarBtnStyle = {right: 20 + 'px'}
        this.togglePageSizeBtnStyle = {right: 80 + 'px'}
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
        if (this.docObjectId != 0) {
            this.docObjId = this.docObjectId;
        } else if (this.$route.name == "detailDocument" || this.$route.name == "printDocument") {
            this.docObjId = this.$route.params.id;
        }
        if(this.docObjId != null)
        this.loadDocumentObject();  
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
        
        // Khadm: load data của document lên để hiển thị và xử lý
        loadDocumentStruct(documentId) {
            let thisCpn = this;
            documentApi
                .detailDocument(documentId)
                .then(res => {
                    if (res.status == 200) {
                        let content = res.data.document.content;
                        thisCpn.contentDocument = content;
                        setDataForPropsControl(res.data.fields, thisCpn.keyInstance,'detail'); // ddang chay bat dong bo
                        setTimeout(() => {
                            thisCpn.processHtml(content);
                        }, 100);
                    }
                })
                .catch(err => {
                    console.log("error from detail document api!!!", err);
                })
                .always(() => {});
        },
        loadDocumentObject() {
            let thisCpn = this;
            documentApi
                .detailDocumentObject(this.docObjId)
                .then(res => {
                    if (res.status == 200) {
                        thisCpn.$store.commit('document/addToDocumentDetailStore',{
                            key: 'allData',
                            value: res.data,
                            instance:thisCpn.keyInstance
                        })
                        thisCpn.loadDocumentStruct(res.data.documentId);
                    }
                })
                .catch(err => {
                    console.log("error from detail document api!!!", err);
                })
                .always(() => {});
        },
        togglePageSize() {
            this.contentMargin = this.documentSize == "21cm" ? "" : "auto";
            this.documentSize = this.documentSize == "21cm" ? "calc(100% - "+this.sidebarWidth+"px)" : "21cm";
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
            this.toggleSideBarBtnStyle = {right: 20 + 'px'}
            this.togglePageSizeBtnStyle = {right: 80 + 'px'}
            if(this.isShowSidebar){
                this.toggleSideBarBtnStyle = {right:this.sidebarWidth - 15 + 'px','border-radius':'50%', top: '21px', padding:'0 6px','z-index':9999};
                this.togglePageSizeBtnStyle = {right:this.sidebarWidth + 35  + 'px'}
            }
           
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
            setTimeout(() => {
                if(thisCpn.$route.name == 'printDocument'){
                    thisCpn.printDiv();
                }
            }, 1000);
        },
        
        printDiv(){
            // let css = this.getallcss();
            let head = document.head || document.getElementsByTagName('head')[0];
            let style = document.createElement('style');
            
            // style.type = 'text/css';
            // if (style.styleSheet){
            // // This is required for IE8 and below.
            // style.styleSheet.cssText = css;
            // } else {
            // style.appendChild(document.createTextNode(css));
            // }
			var printContents = $('.layout.justify-center')[0].innerHTML;
			var originalContents = document.body.innerHTML;
            // head.appendChild(style);

			document.body.innerHTML = printContents;

			window.print();

			document.body.innerHTML = originalContents;

        },
        getallcss() {
            var css = "", //variable to hold all the css that we extract
                styletags = document.getElementsByTagName("style");
            for(var i = 0; i < styletags.length; i++)
            {
                css += styletags[i].innerHTML; //extract the css in the current style tag
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
</style>