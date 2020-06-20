<template>
    <div style="width: 400px; height: 300px">
        <code-editor    
            :ref="'edt-script'" 
            v-model="lazyValue" 
            @init="editorInit" 
            lang="sql" 
            theme="chrome" 
            width="100%" 
            height="100%">
        </code-editor>
    </div>
</template>
<script>
import 'brace';
import 'brace/ext/language_tools';
import customMode from './customFormula';

import customAceEditorSetting from './customSetting';
import CodeEditor from "./AceWrapper";
export default {
    data(){
        return {
        }
    },
    computed: {
        lazyValue:{
            get(){
                return this.value;
            },
            set(value){
                this.$emit('input', value);
            }
        }
    },
    components : {
        'code-editor': CodeEditor
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
    },
    methods:{
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
                showGutter: true,
            });
            customAceEditorSetting(ace,edt,this.listKeyworks);
        }
    }
}
</script>