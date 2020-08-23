<template>
    <div class="h-100 w-100" :style="{height: height}" >
        <code-editor
            ref="edtScript" 
            v-model="lazyValue" 
            @init="editorInit" 
            lang="sql" 
            theme="chrome" 
            width="100%" 
            :height="height">
        </code-editor>
    </div>
</template>
<script>
import 'brace';
import 'brace/ext/language_tools';
import customMode from './customFormula';
import defaultKeywords from "./defaultKeywords";
import { documentApi } from "./../../../api/Document";

export default {
    created(){
        this.$store.dispatch('document/setListDocuments');
    },
    data(){
        return {
        }
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
        'code-editor': require('vue2-ace-editor')
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
        }
    },
    methods:{
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
        }
    }
}
</script>