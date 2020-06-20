import defaultKeywords from './defaultKeywords';

function getWordsOfEditor(allCols) {
    let words = [];
    for (let uid in allCols) {
        let col = allCols[uid];
        let title = col.title ? col.title : col.columnName;
        words.push({
            caption: wrapBracket(col.columnName),
            value: wrapBracket(col.columnName),
            meta: "column",
            docHTML: `<b>Title : </b> ` + title + `<br> <b>Datatype : </b>` + col.type,
        });
    }
    return words.concat(defaultKeywords);
}

function wrapBracket(str) {
    return "[" + str + "]";
}

function customAceEditorSetting(ace, editor, allCols) {
    let langTools = ace.acequire("ace/ext/language_tools");
    debugger
    let words = getWordsOfEditor(allCols);
    editor.getSession().setUseWrapMode(true);
    let staticWordCompleter = {
        identifierRegexps: [/[a-zA-Z_0-9\.\$\-\u00A2-\uFFFF]/],
        getCompletions: function(editor, session, pos, prefix, callback) {
            callback(null, words);
        },
        getDocTooltip: (item) => {
            // item.docHTML = item.description;
            console.log(item);

        }
    }
    langTools.setCompleters([staticWordCompleter]);
}
export default customAceEditorSetting;