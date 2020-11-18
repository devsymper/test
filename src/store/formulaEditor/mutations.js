import {languages, editor} from 'monaco-editor';


const addCompletionItemsForDocs = (state, docs) => {
    let items = [];
    let word = '';
    let item = {};
    for(let doc of docs){
        word = `${doc.name} (${doc.id} - ${doc.title})`;
        if(!state.addedCompletionItems[doc.name]){
            item = {
                label: word,
                symperKind: 'doc',
                kind: languages.CompletionItemKind.Keyword,
                insertText: doc.name
            };
            items.push(item);
            state.addedCompletionItems[`doc:${doc.name}`] = item;
        }
    }
    addCompletionItems(state, items);
}


const addCompletionItemsForDocControls = (state, data) => {
    let controls = data.controls;
    let docName = data.docName;
    let items = [];
    let word = '';
    let item = {};

    for(let ctrl of controls){
        word = `${docName}.${ctrl.name} (${ctrl.title})`;
        if(!state.addedCompletionItems[ctrl.name]){
            item = {
                label: word,
                symperKind: 'control',
                kind: languages.CompletionItemKind.Unit,
                insertText: ctrl.name
            };
            items.push(item);
            state.addedCompletionItems[`control:${docName}:${ctrl.name}`] = item;
        }
    }
    addCompletionItems(state, items);
}


const addCompletionItems = (state, items) => {
    languages.registerCompletionItemProvider('sql', {
        provideCompletionItems: (model, position) => {
            var suggestions = items;
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
}


export {
    addCompletionItemsForDocs,
    addCompletionItemsForDocControls,
    addCompletionItems
};