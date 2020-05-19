<template>
    <div class="sym-form-submit" :style="{'width':docSize}">
        <div v-html="contentDocument">

        </div>
        <button v-on:click="togglePageSize" id="toggle-doc-size">
            <span class="mdi mdi-arrow-horizontal-lock"></span>
        </button>
        <autocomplete-input ref="autocompleteInput" 
        @open-sub-form="openSubFormSubmit" 
        @before-close="isShowSubFormSubmit = false" />
        <date-picker ref="datePicker" />
        <sym-drag-panel ref="symDragPanel" :showPanel="isShowSubFormSubmit" />

    </div>
</template>
<script>
import { documentApi } from "./../../../api/Document.js";
import { getInsertionCSS } from "./../../../components/document/documentUtil.js";
import './../../../components/document/documentContent.css';
import {setDataForPropsControl} from './../../../components/document/dataControl';
import AutocompleteInput from './controlvalue/AutocompleteInput.vue'
import DatePicker from './../../../components/common/DatePicker.vue'
import Control from './control.js';
import Table from './table.js';
import SymperDragPanel from './../../../components/common/SymperDragPanel.vue'
export default {
    name:'submitDocument',
    components:{
        'control':Control,
        'autocomplete-input': AutocompleteInput,
        'date-picker': DatePicker,
        'sym-drag-panel': SymperDragPanel
    },
    computed: {
        sDocumentEditor(){ 
            return this.$store.state.document.editor;
        },
        sDocumentSubmit(){
            return this.$store.state.document.submit;
        }
    },
    data(){
        return {
            contentDocument:null,
            documentId:null,
            docSize:null,
            editorDoc:null,
            isShowSubFormSubmit:false
        }
    },
    beforeMount(){
        this.docSize = '21cm';
    },
    mounted() {
        this.editorDoc = $('.sym-form-submit');
        
    },
    watch:{
        '$route' (to) {
            this.documentId = to.params.id;
        }
    },
    created(){
        this.documentId = this.$route.params.id;
        let thisCpn = this;
        documentApi.detailDocument(this.documentId).then(res => {
            if (res.status == 200) {
                let content = res.data.document.content;
                thisCpn.contentDocument = content;
                setDataForPropsControl(res.data.fields);    // ddang chay bat dong bo
                setTimeout(() => {
                thisCpn.processHtml(content);

                }, 100);                
            }
        })
        .catch(err => {
            console.log("error from detail document api!!!", err);
        })
        .always(() => {
        });

        this.$evtBus.$on('document-submit-autocomplete-input',e=>{
            thisCpn.$refs.autocompleteInput.show(e);
            
        });
        this.$evtBus.$on('document-submit-autocomplete-input-change',e=>{
            thisCpn.$refs.autocompleteInput.setSearch($(e.target).val());
            
        });
        this.$evtBus.$on('symper-app-wrapper-clicked',evt=>{
            if (
                !$(evt.target).hasClass("s-control-date") && 
                !$(evt.target).hasClass("v-data-table") &&
                $(evt.target).closest(".v-data-table").length == 0
            ) {
                thisCpn.$refs.autocompleteInput.hide();
            }
            
        });
    },
    watch:{
        
    },
    methods:{
        togglePageSize(){
            this.docSize = (this.docSize == '21cm') ? '100%' : '21cm';
        },
        presetTable() {
            // editorDoc.find('.s-control-table').each(function() {
            //     let tableControl = new Table(tableControl, listInputInDocument, dataInputCache, tableName);
            //     tableControl.render();
            // });
        },
        
        processHtml (content) {
            var allInputControl = $('.sym-form-submit').find('.s-control:not(.bkerp-input-table .s-control)');
            let thisCpn = this;
            for (let index = 0; index < allInputControl.length; index++) {
                let id = $(allInputControl[index]).attr('id');
                if(this.sDocumentEditor.allControl[id] != undefined){
                    let control = new Control($(allInputControl[index]),this.sDocumentEditor.allControl[id]);
                    let controlName = this.sDocumentEditor.allControl[id].properties.name.value;
                    control.init();
                    this.$store.commit("document/addToListInputInDocument",{name:controlName,control:control});


                    control.listInsideControls = {};
                    if($(allInputControl[index]).attr('s-control-type') == 'table'){
                        control.tableInstance = new Table(control,controlName)
                        let tableEle = $(allInputControl[index]);
                        tableEle.find('.s-control').each(function() {
                            let childControlId = $(this).attr('id')
                            let childControl = new Control($(this),thisCpn.sDocumentEditor.allControl[id].listFields[childControlId]);
                            childControl.init();
                            let childControlName = thisCpn.sDocumentEditor.allControl[id].listFields[childControlId].properties.name.value;
                            control.inTable = controlName;
                            thisCpn.$store.commit("document/addToListInputInDocument",{name:childControlName,control:childControl});

                            control.listInsideControls[childControlName] = true;

                        });
                    }   
                    control.render();
                }
                

            }
        },
        openSubFormSubmit(){
            this.isShowSubFormSubmit = true;
        }
    }
}
</script>
<style  scoped>
    .sym-form-submit{
        width: 21cm;
        padding: 16px;
    }
    .sym-form-submit >>> .on-selected{
        border: none !important;
    }
    .sym-form-submit >>> table:not(.s-control-table) td,
    .sym-form-submit >>> table:not(.s-control-table),
    .sym-form-submit >>> table:not(.s-control-table) th{
        border: none !important;
    }

    #toggle-doc-size{
        position: absolute;
        right: 10px;
        top: 50px;
        padding: 4px 12px;
        font-size: 20px;
        border-radius: 4px;
        background: #fafafa;
        opacity: 1;
        color: #757575;
        transition: ease-in-out 300ms;
    }
    #toggle-doc-size:hover{
        background: #dddddd;
    }
    #toggle-doc-size:focus{
        outline: none;
    }
</style>
