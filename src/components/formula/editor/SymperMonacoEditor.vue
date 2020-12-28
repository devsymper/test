<template>
    <div
        :style="{
            display: 'block!important',
            width: lazyWidth + '!important',
            height: lazyHeight + '!important',
        }">
        <div 
            class="symper-monaco-editor h-100 w-100"  
            ref="monacoWrapper">
            
        </div>
    </div>
</template>

<script>
import {languages, editor} from 'monaco-editor';
import staticCompletionItems from "./modules/sql/staticCompletionItems";
import { documentApi } from '../../../api/Document';
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
                if(this.completionDiv){
                    this.completionDiv.css('visibility', 'hidden');
                }
                if(self.debouceChangeCompletionPosition){
                    clearTimeout(self.debouceChangeCompletionPosition);
                }
                self.debouceChangeCompletionPosition = setTimeout(() => {
                    self.changeCompletionPosition();
                }, 300);

                setTimeout(() => {
                    self.checkLoadItems();
                }, 0);
            });
        },
        changeCompletionPosition(){
            this.completionDiv = $($(this.$el).find('.editor-widget.suggest-widget')[0]);
            if(this.completionDiv[0]){
                this.completionDiv.css('visibility', 'visible');
                let cWidth = this.completionDiv.width();
                let leftOffset = Number(this.completionDiv.css('left').replace('px', ''));
                let wraperWidth = $(this.$el).width();
                if(leftOffset + cWidth > wraperWidth){
                    this.completionDiv.css('left', (leftOffset - (leftOffset + cWidth - wraperWidth)) + 'px');
                }
            }
        },
        checkLoadItems(){
            let startTime = Date.now();
            let pos = this.editor.getPosition();
            let lineContent = this.model.getLineContent(pos.lineNumber);
            let nearestWord = [];
            for(let i = (pos.column - 1); i-- ; i >= 0){
                if(lineContent[i] != ' '){
                    nearestWord.unshift(lineContent[i]);
                }else{
                    break;
                }
            }

            nearestWord = nearestWord.join('');
            if(nearestWord){
                this.loadRemoteItems(nearestWord);
            }
        },
        async loadRemoteItems(keyword){
            let loadedItems = this.$store.state.formulaEditor.addedCompletionItems;
            let key = `doc:${keyword}`;
            if(loadedItems[key] && !loadedItems[key].loadedField){
                loadedItems[key].loadedField = true;
                let res = await documentApi.getFieldByDocId(keyword);
                if(res.status == 200){
                    this.$store.commit('formulaEditor/addCompletionItemsForDocControls', {
                        docName: keyword,
                        controls: res.data
                    });
                }else{
                    this.$snotifyError(res, "Can not get field of doc " + keyword);
                }
            }
        },
        getSelectedText(){
            return this.model.getValueInRange(this.editor.getSelection());
        },
        getValue(){
            return this.model.getValue();
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
		},
    },
    mounted(){
        let self = this;
        let editorOption = Object.assign({
            language: "sql",
            value: self.value,
            wordWrap: "on",
            fontSize: 12,
            automaticLayout: true
        }, self.options);
        self.editor = editor.create(self.$refs.monacoWrapper, editorOption);
        // Register a completion item provider for the new language
        self.setStaticCompletionItems();
        self.$emit('init', self.editor);
        self.listenEditorEvents();
        self.model = self.editor.getModel();
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
                this.model.setValue(vl);
            }
            this.selfChange = false;
        },
        height(){
            setTimeout((self) => {
                self.editor.layout();
            }, 300, this);
        },
        width(){
            setTimeout((self) => {
                self.editor.layout();
            }, 300, this);
        },
    },
    created(){
        this.$store.commit('formulaEditor/setGlobalMonacoEditorLanuages', languages);
        this.$store.dispatch('document/setListDocuments');
    }
}
</script>

<style >

</style>