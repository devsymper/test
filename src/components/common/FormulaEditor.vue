<template>
    <div class="w-100">
        <div class="bkerp-widget">
            <v-tabs v-model="tab" @change="changeTabEditor">
                <v-tab>Soạn công thức</v-tab>
                <v-tab>Snippets</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
                <v-tab-item>
                    <div class="bkerp-widget-body">
                        <div id="fomular-editor"></div>
                    </div>
                </v-tab-item>
                <v-tab-item>
                    <div class="bkerp-widget-body">
                        <div id="snippet-editor"></div>
                    </div>
                </v-tab-item>
            </v-tabs-items>
        </div>
    </div>
</template>

<script>
import Api from "../../api/api.js";
import ace from "ace-builds";
export default {
    name: "FormulaEditor",
    components: {},

    data: function() {
        return {
            tab: 0,
            value: ``,
            options: {
                useWorker: true,
                enableBasicAutocompletion: true,
                enableSnippets: true,
                showPrintMargin: false,
                enableLiveAutocompletion: true,
                indentedSoftWrap: false,
                showGutter: true,
            },
            formulaEditor: null,
            snippetEditor: null,
            langTools: null,
            snippetManager: null,
            listWordsCompletes: [],
            keywordName: `abort|absolute|abstime|access|aclitem|action|add|admin|after|aggregate|all|also|alter|always|
                analyse|analyze|and|any|anyarray|anyelement|anyenum|anynonarray|anyrange|array|as|asc|
                assertion|assignment|asymmetric|at|attribute|authorization|backward|before|begin|between|
                bigint|binary|bit|bool|boolean|both|box|bpchar|by|bytea|cache|called|cascade|cascaded|case|cast|
                catalog|chain|char|character|characteristics|check|checkpoint|cid|cidr|circle|class|close|
                cluster|coalesce|collate|collation|column|comment|comments|commit|committed|concurrently|
                configuration|connection|constraint|constraints|content|continue|conversion|copy|cost|
                create|cross|cstring|csv|current|current_catalog|current_date|current_role|
                current_schema|current_time|current_timestamp|current_user|cursor|cycle|data|database|
                date|daterange|day|deallocate|dec|decimal|declare|default|defaults|deferrable|deferred|
                definer|delete|delimiter|delimiters|desc|dictionary|disable|discard|distinct|do|document|
                domain|double|drop|each|else|enable|encoding|encrypted|end|enum|escape|event|event_trigger|
                except|exclude|excluding|exclusive|execute|exists|explain|extension|external|extract|false|
                family|fdw_handler|fetch|first|float|float4|float8|following|for|force|foreign|forward|
                freeze|from|full|function|functions|global|grant|granted|greatest|group|gtsvector|handler|
                having|header|hold|hour|identity|if|ilike|immediate|immutable|implicit|in|including|
                increment|index|indexes|inet|inherit|inherits|initially|inline|inner|inout|input|
                insensitive|insert|instead|int|int2|int2vector|int4|int4range|int8|int8range|integer|
                internal|intersect|interval|into|invoker|is|isnull|isolation|join|json|key|label|language|
                language_handler|large|last|lateral|lc_collate|lc_ctype|leading|leakproof|least|left|level|
                like|limit|line|listen|load|local|localtime|localtimestamp|location|lock|lseg|macaddr|
                mapping|match|materialized|maxvalue|minute|minvalue|mode|money|month|move|name|names|
                national|natural|nchar|next|no|none|not|nothing|notify|notnull|nowait|null|nullif|nulls|
                numeric|numrange|object|of|off|offset|oid|oids|oidvector|on|only|opaque|operator|option|
                options|or|order|out|outer|over|overlaps|overlay|owned|owner|parser|partial|partition|passing|
                password|path|pg_attribute|pg_auth_members|pg_authid|pg_class|pg_database|pg_node_tree|
                pg_proc|pg_type|placing|plans|point|polygon|position|preceding|precision|prepare|prepared|
                preserve|primary|prior|privileges|procedural|procedure|program|quote|range|read|real|
                reassign|recheck|record|recursive|ref|refcursor|references|refresh|regclass|regconfig|
                regdictionary|regoper|regoperator|regproc|regprocedure|regtype|reindex|relative|release|
                reltime|rename|repeatable|replace|replica|reset|restart|restrict|returning|returns|revoke|
                right|role|rollback|row|rows|rule|savepoint|schema|scroll|search|second|security|select|
                sequence|sequences|serializable|server|session|session_user|set|setof|share|show|similar|
                simple|smallint|smgr|snapshot|some|stable|standalone|start|statement|statistics|stdin|
                stdout|storage|strict|strip|substring|symmetric|sysid|system|table|tables|tablespace|temp|
                template|temporary|text|then|tid|time|timestamp|timestamptz|timetz|tinterval|to|trailing|
                transaction|treat|trigger|trim|true|truncate|trusted|tsquery|tsrange|tstzrange|tsvector|
                txid_snapshot|type|types|unbounded|uncommitted|unencrypted|union|unique|unknown|unlisten|
                unlogged|until|update|user|using|uuid|vacuum|valid|validate|validator|value|values|varbit|
                varchar|variadic|varying|verbose|version|view|void|volatile|when|where|whitespace|window|
                with|without|work|wrapper|write|xid|xml|xmlattributes|xmlconcat|xmlelement|xmlexists|
                xmlforest|xmlparse|xmlpi|xmlroot|xmlserialize|year|yes|zone`.split("|"),
            functionName: ["abs","cbrt","ceil","ceiling","degrees","div","exp","floor","ln","log","log","mod","pi",
                "power","power","radians","round","round","sign","sqrt","trunc","trunc","width_bucket",
                "width_bucket","random","setseed","acos","asin","atan","atan2","cos","cot","sin","tan",
                "bit_length","char_length","lower","octet_length","overlay","position","substring","substring",
                "substring","trim","upper","ascii","btrim","chr","concat","concat_ws","convert","convert_from",
                "convert_to","decode","encode","format","initcap","left","length","length","lpad","ltrim","md5",
                "pg_client_encoding","quote_ident","quote_literal","quote_literal","quote_nullable",
                "quote_nullable","regexp_matches","regexp_replace","regexp_split_to_array","regexp_split_to_table",
                "repeat","replace","reverse","right","rpad","rtrim","split_part","strpos","substr","to_ascii",
                "to_hex","translate","age","age","clock_timestamp","current_date","current_time","current_timestamp",
                "date_part","date_part","date_trunc","extract","isfinite","isfinite","isfinite",
                "justify_days","justify_hours","justify_interval","localtime","localtimestamp","now",
                "statement_timestamp","timeofday","transaction_timestamp"]
        };
    },
    mounted() {
        ace.config.set('basePath', 'ace-builds/src-min-noconflict');
        this.initEditor();
        this.getListAutoComplete();
        this.setupTooltip();
    },
    methods: {
        changeTabEditor(tab) {
            if (this.snippetEditor == null) {
                let that = this;
                setTimeout(() => {
                    that.snippetEditor = ace.edit("snippet-editor");
                    that.snippetEditor.session.setMode("ace/mode/json");
                    that.snippetEditor.setOptions({
                        useWorker: false,
                        enableBasicAutocompletion: true,
                        showPrintMargin: false,
                        enableLiveAutocompletion: true,
                        indentedSoftWrap: false,
                        showGutter: true,
                    });
                    that.snippetEditor.getSession().setUseWrapMode(true);
                    /**
                     * Update BA snippet
                     */
                    that.snippetEditor.session.on("change", (e) => {
                        try {
                            let listSnippets = JSON.parse(
                                that.snippetEditor.getValue()
                            );
                            let listMethods = [];
                            for (
                                let index = 0;
                                index < listSnippets.length;
                                index++
                            ) {
                                const method = listSnippets[index];
                                let methodDes = `<b>Mô tả:</b> ${method.description}</br><b>Nội dung:</b> ${method.value}`;
                                if (that.listWordsCompletes.filter(word => {
                                    return word.meta == "BA snippet" && word.caption == method.name;
                                }).length) {
                                    for (let i = 0; i < that.formulaEditor.session.$mode.$highlightRules.$keywordList.length; i++) {
                                        const word = that.formulaEditor.session.$mode.$highlightRules.$keywordList[i];
                                        if (word.meta == "BA snippet" && word.caption == method.name) {
                                            that.formulaEditor.session.$mode.$highlightRules.$keywordList[i].value = method.value;
                                            that.formulaEditor.session.$mode.$highlightRules.$keywordList[i].description = methodDes;
                                            break;
                                        }
                                    }
                                } else {
                                    that.formulaEditor.session.$mode.$highlightRules.$keywordList[
                                        method.name
                                    ] = "BA snippet";
                                    that.listWordsCompletes.push({
                                        caption: method.name,
                                        value: method.value,
                                        meta: "BA snippet",
                                        description: methodDes,
                                    });
                                }
                                listMethods.push({
                                    content: method.value,
                                    name: method.name,
                                    tabTrigger: method.name,
                                });
                            }
                            that.snippetManager.register(listMethods, "pgsql");
                            that.setupUpdateAutocomplete(that.listWordsCompletes);
                        } catch (error) {}
                    });
                }, 500);
            }
        },
        updateBASnippet(newValue) {
            // let req = new Api("https://v2datnt.dev.symper.vn/");
            // let res = req.put("formulas/ba-snippets");
        },
        setDefaultKeyword() {
            let listwords = [];
            for (const kw of this.keywordName) {
                listwords.push({
                    caption: kw,
                    value: kw,
                    meta: "Keyword",
                    description: kw,
                })
            }
            for (const fn of this.keywordName) {
                listwords.push({
                    caption: fn,
                    value: fn,
                    meta: "function",
                    description: fn,
                })
            }
            this.setupUpdateAutocomplete(listwords);
        },
        initEditor() {
            this.langTools = require("ace-builds/src-min-noconflict/ext-language_tools");
            this.snippetManager = ace.require("ace/snippets").snippetManager;
            this.formulaEditor = ace.edit("fomular-editor");
            let pgsqlMode = require("ace-builds/src-min-noconflict/mode-pgsql")
                .Mode;
            this.formulaEditor.session.setMode(new pgsqlMode());
            this.formulaEditor.setOptions(this.options);
            this.formulaEditor.getSession().setUseWrapMode(true);
            // this.setDefaultKeyword();
            this.setupAutocomplete();
        },
        getListAutoComplete() {
            let req = new Api("https://v2hoangnd.dev.symper.vn/");
            let res = req.get("formula-services/list-autocompletes");
            res.then((result) => {
                let docs = result.data.document;
                let listDocsCompletes = [];
                let listMethods = this.snippetManager.parseSnippetFile(
                    "snippet test\n  TEST"
                );
                for (const kw of this.keywordName) {
                    listDocsCompletes.push({
                        caption: kw,
                        value: kw,
                        meta: "Keyword",
                        description: kw,
                    })
                }
                for (const fn of this.keywordName) {
                    listDocsCompletes.push({
                        caption: fn,
                        value: fn,
                        meta: "function",
                        description: fn,
                    })
                }
                for (let index = 0; index < docs.length; index++) {
                    const doc = docs[index];
                    this.formulaEditor.session.$mode.$highlightRules.$keywordList[
                        doc.name
                    ] = "document";
                    listDocsCompletes.push({
                        caption: doc.name,
                        value: doc.name,
                        meta: "document",
                        description: doc.title,
                    });
                    for (let item of doc.fields) {
                        this.formulaEditor.session.$mode.$highlightRules.$keywordList[
                            item.name
                        ] = "control";
                        listDocsCompletes.push({
                            caption: doc.name + "." + item.name,
                            value: doc.name + "." + item.name,
                            meta: "control",
                            description: item.title,
                        });
                    }
                }
                for (
                    let index = 0;
                    index < result.data.method.length;
                    index++
                ) {
                    const method = result.data.method[index];
                    this.formulaEditor.session.$mode.$highlightRules.$keywordList[
                        method.name
                    ] = "method";
                    let paramStr = "";
                    try {
                        let listParams = JSON.parse(method.parameter);
                        paramStr = [];
                        for (let param of listParams) {
                            paramStr.push(param.name);
                        }
                        paramStr = paramStr.join(", ");
                    } catch (error) {}
                    listDocsCompletes.push({
                        caption: method.name,
                        value: method.name + "(" + paramStr + ")",
                        meta: "BA Method",
                        description: method.description,
                    });

                    listMethods.push({
                        content: method.name + "(" + paramStr + ")",
                        name: method.name,
                        tabTrigger: method.name,
                    });
                }
                this.formulaEditor.session.bgTokenizer.start(0);
                this.snippetManager.register(listMethods, "pgsql");
                this.setupUpdateAutocomplete(listDocsCompletes);
                this.listWordsCompletes = listDocsCompletes;
            }).catch((err) => {
                console.log("catch", err);
            });
        },
        setupAutocomplete() {
            if (this.formulaEditor !== null) {
                let that = this;
                this.formulaEditor.on("keyup", function(e) {
                    if (e.key == "." || e.key.match(/^[\d\w+]$/i)) {
                        that.editor.execCommand("autocomplete");
                    }
                });
            }
        },
        setupTooltip() {
            let staticWordCompleter = {
                identifierRegexps: [/[\w]/],
                getCompletions: function(
                    editor,
                    session,
                    pos,
                    prefix,
                    callback
                ) {
                    callback(null, this.listWordsCompletes);
                },
                getDocTooltip: (item) => {
                    item.docHTML = item.description;
                },
            };
            this.langTools.setCompleters([staticWordCompleter]);
        },
        setupUpdateAutocomplete(listDocsCompletes) {
            let fieldsToComplete = {
                getCompletions: function(
                    editor,
                    session,
                    pos,
                    prefix,
                    callback
                ) {
                    callback(null, listDocsCompletes);
                },
            };
            this.formulaEditor.completers.push(fieldsToComplete);
        },
    },
};
</script>

<style>
.v-window.v-item-group.theme--light.v-tabs-items,
.v-window-item.v-window-item--active {
    height: 100%;
}
.v-tab {
    font-size: 12px;
    text-transform: inherit;
    font-weight: normal;
    text-shadow: 0 0 0;
}
.bkerp-widget {
    min-width: 700px;
    width: 60%;
    height: 500px;
    border: 1px solid #bfbfbf;
    right: 150px;
    background: #ffffff;
    z-index: 2;
}
div#fomular-editor,
div#snippet-editor {
    width: 100%;
    height: 100%;
}
.bkerp-widget-body {
    width: 100%;
    height: calc(100% - 50px);
}
.ace_tooltip.ace_doc-tooltip {
    border-color: #eee;
    background-image: none;
    background: #f1f1f1;
    white-space: normal;
    border-radius: 3px;
}
.ace_tooltip.ace_doc-tooltip {
    font-family: sans-serif;
    font-size: 11px;
    border-color: #eee;
    background-image: none;
    background: #f1f1f1;
    white-space: normal;
    border-radius: 3px;
    max-width: 350px;
}
.ace_tooltip.ace_doc-tooltip hr {
    margin: 5px;
    background: #333;
    color: #333;
    border-color: #d4d4d4;
}
.ace_tooltip.ace_doc-tooltip ul {
    padding-left: 25px;
}
span.ace_completion-meta {
    float: right;
    margin: 0;
    margin-right: 0.5em;
}
.ace_tooltip.ace_doc-tooltip li small {
    font-size: 11px;
    opacity: 0.7;
}
.ace_editor.ace_autocomplete .ace_layer.ace_text-layer {
    max-width: 100%;
}
.ace_editor.ace_autocomplete.ace-tm {
    min-width: 400px;
}
input[id="toggle-script-editor"]:checked + .bkerp-widget {
    top: calc(100% - 30px);
}
.ace-tm .ace_comment {
    color: rgba(153, 153, 153, 0.79);
}
/* span.ace_keyword + span.ace_identifier {
    color: coral;
} */
/* span.ace_keyword + span.ace_identifier + span.ace_identifier {
    color: mediumpurple;
} */
.ace-tm .ace_support.ace_function {
    color: darkcyan;
}
/* span.ace_keyword.ace_statementBegin,
span.ace_keyword.ace_statementBegin + span.ace_identifier {
    color: #e53935;
}
span.ace_keyword.ace_statementBegin + span.ace_identifier + span.ace_identifier {
    color: #358ce5;
    color: #0097A7;
} */
span.ace_support.ace_workflow {
    color: #ab47bc;
}
span.ace_support.ace_virtual_doc {
    color: #ab47bc;
}
/* span.ace_support.ace_field, .ace_support + span.ace_identifier{
    color: #0097A7;
} */
.ace_bracket.red.ace_start {
    background: rgba(250, 237, 224, 0.7);
}
span.ace_support.ace_method {
    color: #cb798f;
}
.tooltip-method {
    position: fixed;
    z-index: +1000000000;
    width: 100vw;
    height: 100vh;
    display: block;
    top: 0;
    left: 0;
}
.tooltip-method-content {
    position: absolute;
    display: block;
    width: 400px;
    height: auto;
    max-width: 400px;
    background: #fff;
    z-index: +100;
    padding: 5px;
    border-radius: 3px;
    border: 1px solid #ccc;
}
.tooltip-method-content hr {
    margin: 5px;
}
.check-formula-result {
    position: fixed;
    min-width: 500px;
    bottom: 300px;
    right: 150px;
    z-index: +1000000;
    background: #fff;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
}
.check-formula-result .c-f-r-table-wraper {
    max-width: 100%;
    max-height: 500px;
    overflow: auto;
}
.check-formula-result .c-f-r-table-wraper table thead th {
    position: sticky;
    top: 0;
    background: #ccc;
}
.check-formula-result ul.pagination {
    margin: 10px 0 0 0;
}
.check-formula-result ul.pagination li {
    margin-right: 5px;
    display: block;
    float: left;
}
.check-formula-result ul.pagination li a {
    margin: 0;
    padding: 5px 10px;
}
</style>
