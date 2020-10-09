<template>
    <div class="h-100 w-100"  >
        <div class="d-flex" :style="{height: height}">
            <code-editor
                ref="edtScript" 
                v-model="lazyValue" 
                @init="editorInit"
                lang="sql" 
                theme="chrome" 
                width="100%" 
                :height="height">
            </code-editor>
            <div class="debug-input-view" v-if="showDebugView">
                <p>(x) Tham số đầu vào:</p>
                <VuePerfectScrollbar :style="{height: 'calc(100% - 30px)','padding-right': '12px'}">
                    <table style="width:100%">
                        <tr v-for="(input,key) in allInput" :key="key">
                            <td>{{key}}</td>
                            <td><input v-model="input.value" type="text"></td>
                        </tr>
                       
                    </table>
                </VuePerfectScrollbar>
            </div>
        </div>
        <div v-if="showDebugView" class="debug-result-view" :style="{height: debugResultHeight}">
            <div class="result__header">
                <div class="result__header--title">
                    <v-icon>mdi-calculator-variant</v-icon>
                    <span>Kết quả</span>
                    <span>thành công</span>
                </div>
                <div class="result__header--time">
                    <span>Thời gian</span>
                    <span>:1.1222s</span>
                </div>
            </div>
            <div class="result__body">
                <AgGridVue style="width: 100%; height: 100%;"
                    :animateRows="true"
                    @grid-ready="onGridReady"
                    class="ag-theme-balham mt-2"
                    :columnDefs="columnDefs"
                    :rowData="rowData">
                </AgGridVue>
            </div>
            <div class="result__footer">
                <Pagination
                    :total="100"
                    :totalVisible="7"
                ></Pagination>
            </div>
        </div>
    </div>
</template>
<script>
import 'brace';
import 'brace/ext/language_tools';
import customMode from './customFormula';
import defaultKeywords from "./defaultKeywords";
import { documentApi } from "./../../../api/Document";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import AgDataTable from "./../../../components/common/agDataTable/AgDataTable.vue"
import Pagination from './../../../components/common/Pagination'
import Formulas from '../../../views/document/submit/formulas';
import {AgGridVue} from "ag-grid-vue";
export default {
    created(){
        this.$store.dispatch('document/setListDocuments');
    },
    data(){
        return {
            showDebugView:false,
            allInput:{},
            debugResultHeight:0,
            inputViewHeight:0,
            columnDefs: null,
            rowData: null,
            agApi:null

        }
    },
    beforeMount() {
        this.columnDefs = [];

        this.rowData = [];
    },
    mounted(){
        let self = this;
        if(this.disabled){
            this.$refs.edtScript.editor.setReadOnly(true);
        }

        this.$refs.edtScript.editor.on('blur', () => {
            self.$emit('blur', {});
        });
    },
    computed: {
        lazyValue:{
            get(){
                return this.value;
            },
            set(value){
                this.$emit('input', value);
                this.$emit('change', value);
            }
        },
        listAllDocs(){
            return this.$store.state.document.listAllDocument;
        },
        autocompleteWords(){
            let rsl = defaultKeywords;
            let allDocs = this.$store.state.document.listAllDocument;

            let docs = Object.values(allDocs).reduce((arr, el)=>{
                arr.push({
                    caption: el.name,
                    value: el.name,
                    meta: "document",
                    docHTML: `<b>${el.id} : </b>${el.title}`,
                });
                return arr;
            }, []);

            let fields = [];
            for(let docName in allDocs){
                let docFields = [];
                if(allDocs[docName].allFields){
                    docFields = Object.values(allDocs[docName].allFields).reduce((arr, field)=>{
                        arr.push({
                            caption: docName+'.'+field.properties.name,
                            value: docName+'.'+field.properties.name,
                            meta: "control",
                            docHTML: field.properties.title,
                        });
                        return arr;
                    }, []);
                    fields = fields.concat(docFields);
                }
            }
            return rsl.concat(docs).concat(fields).concat(this.listKeyworks);
        }
    },
    components : {
        'code-editor': require('vue2-ace-editor'),
        VuePerfectScrollbar,
        'data-table' : AgDataTable,
        Pagination,
        AgGridVue
    },
    props:{
        value: {
            type: String,
            default: ''
        },
        listKeyworks: {
            type: Array,
            default() {
                return [];
            }
        },
        height: {
            type: String,
            default: "500px"
        },
        simpleMode: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
    },
    watch:{
        height(vl){
            this.debugResultHeight = "calc(100% - "+vl+" - 30px)"
        }
    },
    methods:{
        changeSelection(e){
            console.log("ádsad");
        },
        toggleDebugView(){
            this.showDebugView = !this.showDebugView;
            this.debugResultHeight = "calc(100% - "+this.height+" - 30px)"
            this.inputViewHeight = this.height
        },
        async handleEditorInput(formula){
            let pos = this.$refs.edtScript.editor.getCursorPosition();
            let range = this.$refs.edtScript.editor.session.getLine(pos.row).slice(0,pos.column);

            let lastWord = range.slice(
                range.lastIndexOf(' ') + 1
            );

            let doc = this.listAllDocs[lastWord];
            if(doc && !doc.allFields){
                let docInfo = await documentApi.detailDocument(doc.id);
                if(docInfo.status == 200){
                    this.$set(doc, 'allFields', docInfo.data.fields);
                }
            }
        },
        editorInit(edt){
            require('brace/ext/language_tools'); //language extension prerequsite...
            require('brace/mode/html')  ;              
            require('brace/mode/sql')  ;  //language
            require('brace/mode/less');
            require('brace/theme/chrome');
            edt.setOptions({
                useWorker: true,
                enableBasicAutocompletion: true,
                enableSnippets: true,
                showPrintMargin: false,
                enableLiveAutocompletion: true,
                indentedSoftWrap: false,
                showGutter: !this.simpleMode,
            });
            this.customAceEditorSetting(edt);
            this.setSelectionEvent(edt)
        },
        
        customAceEditorSetting(editor) {
            let langTools = ace.acequire("ace/ext/language_tools");
            let self = this;
            editor.getSession().setUseWrapMode(true);
            let staticWordCompleter = {
                identifierRegexps: [/[a-zA-Z_0-9\.\$\-\u00A2-\uFFFF]/],
                getCompletions: function(editor, session, pos, prefix, callback) {
                    callback(null, self.autocompleteWords);
                },
                getDocTooltip: (item) => {
                }
            }
            langTools.setCompleters([staticWordCompleter]);
        },
        onFocus(){
            this.$refs.edtScript.editor.focus();
        },
        /**
         * Hoangnd
         * Hàm nhận sự kiện thay đổi selection(bôi đen text) trên editor để tìm các tham số đầu vào cho việc debug
         */
        setSelectionEvent(edt){
            let selection = edt.selection;
            let self = this;
            selection.on("changeSelection", function(){
                if(!self.showDebugView){
                    return;
                }
                self.allInput = {};
                let selectionText = edt.getSelectedText();
                if(selectionText.length > 0){
                    let dataInput = selectionText.match(/(?<={)[A-Za-z0-9_]+(?=})/gi);
                    if(dataInput){
                        self.allInput = dataInput.reduce(function(obj, cur, i) {
                            obj[cur] = {value:""};
                            return obj;
                        }, {});
                    }
                }
            })
        },
        executeFormulas(){
            let selectionText = this.$refs.edtScript.editor.getSelectedText();
            let formulas = new Formulas(0,selectionText,"");
            let dataInput = {};
            let self = this;
            for(let input in this.allInput){
                dataInput[input] = this.allInput[input].value;
            }
            formulas.handleBeforeRunFormulas(dataInput).then(rs=>{
                let data = rs.data.data;
                self.handleDataToTable(data);
            });
        },
        handleDataToTable(data){
            let firstRow = data[0];
            for(let column in firstRow){
                this.columnDefs.push( {headerName: column, field: column});
            }
            this.rowData = data;
            this.agApi.sizeColumnsToFit();
        },
        onGridReady(params) {
            this.agApi = params.api; 
        }
        
    }
}
</script>
<style scoped>
    .debug-input-view{
        border-left: var(--symper-border);
        font-size: var(--symper-font-size-default);
        width: 400px;
        padding: 8px 0 8px 8px;
    }
    .debug-input-view p{
        margin-bottom: 8px;
    }
    .debug-input-view table tr{
        height: 30px;
    }
    .debug-input-view table tr td:first-child{
        width: 30%;
    }
    .debug-input-view table tr input{
        border:var(--symper-border);
        width: 100%;
        height: 24px;
        border-radius: 4px;
        padding: 0 6px;
    }
    .debug-input-view table tr input:focus{
        outline: none;
    }
    .debug-result-view{
        font-size: var(--symper-font-size-default);
        border-top: var(--symper-border);
    }

    .result__header{
        display: flex;
        padding: 8px 0;
    }
    .result__header .result__header--time{
        margin-left: auto;
    }
    .result__header .result__header--time span:first-child{
        font-weight: 500;
    }
    .result__header--title .v-icon{
        margin-top: -4px;
        font-size: 18px;
    }
    .result__header--title span:nth-child(2){
        margin: 0 8px;
    }
    .result__header--title span:last-child{
        background: green;
        color: white;
        display: inline-block;
        padding: 1px 8px;
        border-radius: 10px;
        font-size: 11px;
    }
    .result__body{
        height: calc(100% - 50px);
    }
    .result__footer{
        height: 30px;
        margin-top: 6px;
    }
</style>