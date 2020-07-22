<template>
    <div
        class="sym-form-submit"
        :id="'sym-submit-'+keyInstance"
        :style="{'width':documentSize, 'height':'100%'}"
    >
        <div v-html="contentDocument"></div>
        <!-- <button v-on:click="togglePageSize"  id="toggle-doc-size">
            <span class="mdi mdi-arrow-horizontal-lock"></span>
        </button> -->
        
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
            this.documentSize = this.documentSize == "21cm" ? "100%" : "21cm";
        },
        addToListInputInDocument(name,control){
             this.$store.commit(
                            "document/addToListInputInDocument",
                            { name: name, control: control ,instance: this.keyInstance}
                        );
        },
        processHtml(content) {
            var allInputControl = $("#sym-submit-" + this.keyInstance).find(
                ".s-control:not(.bkerp-input-table .s-control)"
            );
            let thisCpn = this;
            for (let index = 0; index < allInputControl.length; index++) {
                let id = $(allInputControl[index]).attr('id');
                let controlType = $(allInputControl[index]).attr('s-control-type');
                
                if(this.sDocumentEditor.allControl[id] != undefined){   // ton tai id trong store
                    let idField = this.sDocumentEditor.allControl[id].id;
                    let valueInput = this.sDocumentEditor.allControl[id].value
                    console.log('asgasd',valueInput);
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
                if(thisCpn.isPrint){
                    thisCpn.printDiv();
                }
            }, 500);
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
.sym-form-submit {
    width: 21cm;
    padding: 16px;
}
.sym-form-submit >>> .on-selected {
    border: none !important;
}
.sym-form-submit >>> table:not(.htCore) td,
.sym-form-submit >>> table:not(.htCore),
.sym-form-submit >>> table:not(.htCore) th {
    border: none !important;
}
.sym-form-submit >>> .htCore td:last-child {
    border-right: 1px solid #ccc !important;
}
.sym-form-submit >>> .ht_clone_left.handsontable table.htCore {
    border-right: none;
}
.s-control-label{
    background: none !important;
}
</style>