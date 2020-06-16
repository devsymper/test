<template>
    <div
        class="sym-form-submit"
        :id="'sym-submit-'+keyInstance"
        :style="{'width':docSize, 'height':'100%'}"
    >
        <div v-html="contentDocument"></div>
        <button v-on:click="togglePageSize"  id="toggle-doc-size">
            <span class="mdi mdi-arrow-horizontal-lock"></span>
        </button>
        
    </div>
</template>
<script>
import { documentApi } from "./../../../api/Document.js";
import { getInsertionCSS } from "./../../../components/document/documentUtil.js";
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
            documentId: null,
            docSize: null,
            keyInstance: Date.now(),
        };
    },
    beforeMount() {
        this.docSize = "21cm";
    },
    created(){
        let thisCpn = this;
        if (this.docId != 0) {
            this.documentId = this.docId;
        } else if (this.$route.name == "detailDocument") {
            this.documentId = this.$route.params.id;
        }
        if(this.documentId != null)
        this.loadDocumentData();
    },
    watch: {
        docId(after) {
            this.documentId = after;
            this.loadDocumentData();
        }
    },
    methods: {
        
        // Khadm: load data của document lên để hiển thị và xử lý
        loadDocumentData() {
            if (this.documentId) {
                let thisCpn = this;
                documentApi
                    .detailDocument(this.documentId)
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
            }
        },
        togglePageSize() {
            this.docSize = this.docSize == "21cm" ? "100%" : "21cm";
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
                    if(controlType == "submit" || controlType == "reset"){
                        $(allInputControl[index]).remove()
                    } else {
                        let controlName = this.sDocumentEditor.allControl[id].properties.name.value;
                        if (controlType != "table") {
                            let control = new BasicControl(
                                idField,
                                $(allInputControl[index]),
                                this.sDocumentEditor.allControl[id],
                                thisCpn.keyInstance
                            );
                            control.init();
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
                            });
                            tableControl.listInsideControls = listInsideControls;
                            tableControl.renderTable();
                        }
                    }
                }

            }
        },
        
    }
}
</script>