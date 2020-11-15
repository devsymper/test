<template>
    <div 
        class="symper-monaco-editor"  
        ref="monacoWrapper" 
        :style="{
            width: lazyWidth,
            height: lazyHeight,
        }">
        
    </div>
</template>

<script>
import {languages, editor} from 'monaco-editor';
import staticCompletionItems from "./modules/sql/staticCompletionItems";
export default {
    methods: {
        focus(){
            this.editor.focus();
        },
        listenEditorEvents(){
            let self = this;
            this.editor.onDidChangeCursorSelection((e) => {
                self.$emit('on-change-selection');
            });

            this.editor.onDidBlurEditorText((e) => {
                self.$emit('blur');
            });

            this.editor.onDidChangeModelContent((e) => {
                let vl = self.getValue();
                self.selfChange = true;
                self.$emit('input', vl);
                self.$emit('change', vl);
            });
        },
        getSelectedText(){
            return this.editor.getModel().getValueInRange(this.editor.getSelection());
        },
        getValue(){
            return this.editor.getModel().getValue();
        },
        setReadOnly(readOnly = true){
            this.editor.updateOptions({ readOnly: readOnly });
        },
        setStaticCompletionItems(){
            if(!this.$store.state.formulaEditor.didSetStaticCompletionItems){
                languages.registerCompletionItemProvider('sql', {
                    provideCompletionItems: (model, position) => {
                        var suggestions = staticCompletionItems;
                        var word = model.getWordUntilPosition(position);
                        var range = {
                            startLineNumber: position.lineNumber,
                            endLineNumber: position.lineNumber,
                            startColumn: word.startColumn,
                            endColumn: word.endColumn
                        };
                        for(let item of suggestions){
                            item.range = range;
                        }
                        return { suggestions: suggestions };
                    }
                });
                this.$store.state.formulaEditor.didSetStaticCompletionItems = true;
            }
        }
    },
    mounted(){
        setTimeout((self) => {
            let editorOption = Object.assign({
                language: "sql",
                value: self.value,
                wordWrap: "on",
                fontSize: 12
            }, this.options);
            self.editor = editor.create(self.$refs.monacoWrapper, editorOption);
            // Register a completion item provider for the new language
            self.setStaticCompletionItems();
            self.$emit('init', self.editor);
            self.listenEditorEvents();
        }, 50, this);
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        listKeyworks: {
            type: Array,
            default(){
                return []
            }
        },
        height: {
            default: '100%'
        },
        width: {
            default: '100%'
        },
        options: {
            type: Object,
            default(){
                return {}
            }
        }
    },
    computed: {
        lazyWidth(){
            return isNaN(this.width) ? this.width : (this.width + 'px');
        },
        lazyHeight(){
            return isNaN(this.height) ? this.height : (this.height + 'px');
        },
    },
    watch: {
        options: {
            deep: true,
            immediate: true,
            handler(newValue){
                if(this.editor){
                    this.editor.updateOptions(newValue);
                }
            }
        },
        value(vl){
            if(!this.selfChange){
                this.editor.getModel().setValue(vl);
            }
            this.selfChange = false;
        }
    }
}
</script>

<style>

</style>