var staticItems = [];
import { sqlDef } from "./sql";
import {languages, editor} from 'monaco-editor';

let mapType = {
    keywords: {
        type: languages.CompletionItemKind.Keyword
    },
    operators: {
        type: languages.CompletionItemKind.Operator
    },
    builtinFunctions: {
        type: languages.CompletionItemKind.Function
    },
    builtinVariables: {
        type: languages.CompletionItemKind.Variable
    },
};

for(let type in mapType){
    if(sqlDef[type]){
        for(let word of sqlDef[type]){
            staticItems.push({
                label: word,
                kind: mapType[type].type,
                insertText: word
            });
        }
    }
}
export default staticItems;