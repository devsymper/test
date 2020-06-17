<template>
    <div
        class="sym-form-submit"
        :id="'sym-submit-'+keyInstance"
        :style="{'width':docSize, 'height':'100%'}"
    >
        <div v-html="contentDocument"></div>
        <!-- <button v-on:click="togglePageSize"  id="toggle-doc-size">
            <span class="mdi mdi-arrow-horizontal-lock"></span>
        </button> -->
        
    </div>
</template>
<script>
import { documentApi } from "./../../../api/Document.js";
import "./../../../components/document/documentContent.css";
import { setDataForPropsControl } from "./../../../components/document/dataControl";
import BasicControl from "./../submit/basicControl";
import  TableControl from "./../submit/tableControl.js"
import  ActionControl from "./../submit/actionControl.js"
import  Table from "./../submit/table.js"
export default {
    props: {
        docId: {
            type: Number,
            default: 0
        },
        docName:{
            type: String,
            default: ''
        }
    },   
    computed: {
        sDocumentEditor() {
            return this.$store.state.document.editor;
        },
        sDocumentSubmit() {
            return this.$store.state.document.submit;
        }
    },
    data() {
        return {
            contentDocument: null,
            docObjId: null,
            documentName: null,
            docSize: null,
            keyInstance: Date.now(),
        };
    },
    beforeMount() {
        this.docSize = "21cm";
    },
    created(){
        this.$store.commit("document/addToDocumentStore", {
            key: 'isDetailView',
            value: true
        });
        let thisCpn = this;
        if (this.docObjId != 0 && this.docName != "") {
            this.docObjId = this.docObjId;
            this.documentName = this.docName;
        } else if (this.$route.name == "detailDocument") {
            this.docObjId = this.$route.params.id;
            this.documentName = this.$route.params.name;
        }
        if(this.docObjId != null)
        this.loadDocumentObject();
        
    },
    destroyed(){
    },
    methods: {
        
        // Khadm: load data của document lên để hiển thị và xử lý
        loadDocumentStruct() {
            let thisCpn = this;
            documentApi
                .detailDocumentByName(this.documentName)
                .then(res => {
                    if (res.status == 200) {
                        let content = res.data.document.content;
                        thisCpn.contentDocument = content;
                        setDataForPropsControl(res.data.fields); // ddang chay bat dong bo
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
                .getDocumentObject(this.documentName,this.docObjId)
                .then(res => {
                    if (res.status == 200) {
                        console.log(res);
                        thisCpn.$store.commit('document/addToDocumentDetailStore',{
                            key: 'allData',
                            value: res.data
                        })
                        thisCpn.loadDocumentStruct();
                    }
                })
                .catch(err => {
                    console.log("error from detail document api!!!", err);
                })
                .always(() => {});
        },
        togglePageSize() {
            this.docSize = this.docSize == "21cm" ? "100%" : "21cm";
        },
        processHtml(content) {
            console.log(this.sDocumentEditor);
            
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
                    
                    if(controlType == "submit" || controlType == "reset"){
                        $(allInputControl[index]).remove()
                    } else {
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
                            this.$store.commit(
                                "document/addToListInputInDocument",
                                { name: controlName, control: control }
                            );
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
                                 thisCpn.$store.commit(
                                    "document/addToListInputInDocument",
                                    {
                                        name: childControlName,
                                        control: childControl
                                    }
                                );
                                listInsideControls[childControlName] = true;
                            });
                            tableControl.listInsideControls = listInsideControls;
                            this.$store.commit(
                                "document/addToListInputInDocument",
                                { name: controlName, control: tableControl }
                            );
                            tableControl.renderTable();
                            tableControl.setData(valueInput);
                        }
                    }
                }

            }
        },
        
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
</style>