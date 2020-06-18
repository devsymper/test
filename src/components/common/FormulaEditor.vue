<template>
    <div class="w-100">
        <div
            :class="{'sym-formula-editor': true, 'simple-mode':simpleMode}"
            :style="{
            width: width,
            height: height
        }"
        >
            <v-tabs v-model.lazy="tab" v-show="!simpleMode">
                <v-tab>Soạn công thức</v-tab>
                <v-tab>Snippets</v-tab>
            </v-tabs>
            <v-tabs-items v-model.lazy="tab" class="h-100">
                <v-tab-item>
                    <div
                        class="sym-formula-editor-body"
                    >
                        <div ref="formulaEditor" class="symper-fomular-editor"></div>
                    </div>
                </v-tab-item>
                <v-tab-item v-if="!simpleMode">
                    <v-card>
                        <v-data-table
                            :headers="headersForListSnippet"
                            :items="listBaSnippet"
                            :search="searchKey"
                            class="elevation-1"
                        >
                            <template v-slot:top>
                                <v-container fluid>
                                    <v-row>
                                        <v-col cols="6">
                                            <v-btn
                                                color="orange darken-1"
                                                text
                                                @click="showAddModal"
                                            >Thêm snippet</v-btn>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                v-model.lazy="searchKey"
                                                append-icon="mdi-magnify"
                                                label="Tìm kiếm"
                                                single-line
                                                hide-details
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </template>
                            <template v-slot:item.actions="{ item }">
                                <v-icon
                                    small
                                    class="mr-2"
                                    @click="showEditSnippetFrom(item)"
                                >mdi-pencil</v-icon>
                                <v-icon small @click="deleteSnippet(item)">mdi-delete</v-icon>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </div>
        <v-dialog v-model.lazy="isShowAddModal" v-if="!simpleMode" max-width="500">
            <v-card>
                <v-card-title class="headline">{{!!!isEdit ? "Add new snippet" : "Edit snippet"}}</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="5">
                            <v-text-field
                                v-model.lazy="currentSnippet.name"
                                label="Tên"
                                hint="Chỉ chứa các chữ cái không dấu, chữ số và gạch dưới"
                                :rules="[
                                    () => !!currentSnippet.name || 'Trường này bắt buộc',
                                    () => !!currentSnippet.name && /^[a-zA-Z\d_]{3,20}$/.test(currentSnippet.name) || 'Tên không hợp lệ, vui lòng chỉ nhập chữ cái không dấu, chữ số và gạch dưới, dài từ 3 - 20 ký tự',
                                ]"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="7">
                            <v-text-field v-model.lazy="currentSnippet.description" label="Mô tả"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea
                                v-model.lazy="currentSnippet.value"
                                :rules="[
                                    () => !!currentSnippet.value || 'Trường này bắt buộc',
                                ]"
                                required
                            >
                                <template v-slot:label>
                                    <div>Nội dung</div>
                                </template>
                            </v-textarea>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" text @click="isShowAddModal = false">Hủy</v-btn>
                    <v-btn
                        color="orange darken-1"
                        text
                        @click="addSnippet"
                        :disabled="!isAllowToSubmit"
                    >{{isEdit ? "Cập nhật" : "Thêm"}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import Api from "../../api/api.js";
import ace from "ace-builds";
export default {
    name: "FormulaEditor",
    components: {},
    watch: {
        value(vl){
            if(!this.innerChangeValue){
                this.setValue(vl);
            }
            this.innerChangeValue = false;
        },
    },
    props: {
        // Khadm: Thêm option để hiển thị công thức ở chế độ đơn giản: không chứa header (snippest, soạn công thức )
        simpleMode: {
            type: Boolean,
            default: false
        },
        width: {
            type: String,
            default: "700px"
        },
        height: {
            type: String,
            default: "500px"
        },
        value: {
            default: ""
        },
    },
    data: function() {
        return {
            tab: 0,
            searchKey: ``,
            options: {
                useWorker: true,
                enableBasicAutocompletion: true,
                enableSnippets: true,
                showPrintMargin: false,
                enableLiveAutocompletion: true,
                indentedSoftWrap: false,
                showGutter: true
            },
            headersForListSnippet: [
                { text: "Id", value: "id" },
                { text: "Tên", value: "name" },
                { text: "Mô tả", value: "description" },
                { text: "Công thức", value: "snippet" },
                { text: "Hành động", value: "actions" }
            ],
            formulaEditor: null,
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
                xmlforest|xmlparse|xmlpi|xmlroot|xmlserialize|year|yes|zone`.split(
                "|"
            ),
            functionName: `abs|cbrt|ceil|ceiling|degrees|div|exp|floor|ln|log|log|mod|pi|power|power|radians|
                round|round|sign|sqrt|trunc|trunc|width_bucket|width_bucket|random|setseed|acos|asin|atan|
                atan2|cos|cot|sin|tan|bit_length|char_length|lower|octet_length|overlay|position|substring|
                substring|substring|trim|upper|ascii|btrim|chr|concat|concat_ws|convert|convert_from|
                convert_to|decode|encode|format|initcap|left|length|length|lpad|ltrim|md5|pg_client_encoding|
                quote_ident|quote_literal|quote_literal|quote_nullable|quote_nullable|regexp_matches|
                regexp_replace|regexp_split_to_array|regexp_split_to_table|repeat|replace|reverse|right|
                rpad|rtrim|split_part|strpos|substr|to_ascii|to_hex|translate|age|age|clock_timestamp|
                current_date|current_time|current_timestamp|date_part|date_part|date_trunc|extract|
                isfinite|isfinite|isfinite|justify_days|justify_hours|justify_interval|localtime|
                localtimestamp|now|statement_timestamp|timeofday|transaction_timestamp`.split(
                "|"
            ),
            listBaSnippet: [],
            isCalledApiToGetListBaSnippet: false,
            currentSnippet: {
                name: "",
                description: "",
                value: ""
            },
            isShowAddModal: false,
            isEdit: false
        };
    },
    computed: {
        isAllowToSubmit: function() {
            return this.currentSnippet.value.trim().length > 0 &&
                this.currentSnippet.name.trim().length > 0 &&
                /^[a-zA-Z\d_]{3,20}$/.test(this.currentSnippet.name)
                ? true
                : false;
        }
    },
    mounted() {
        ace.config.set("basePath", "ace-builds/src-min-noconflict");
        this.initEditor();
        this.getListAutoComplete();
        this.setupTooltip();
        this.setupBaSnippet();
        let thisCpn = this;
    },
    methods: {
        /**
         * Set công thức cho editor
         */
        setValue(formula) {
            this.manualChangeValue = false;
            this.formulaEditor.session.setValue(formula);
        },
        /**
         * Lấy giá  trị của công thức
         */
        getValue() {
            return this.formulaEditor.session.getValue();
        },
        showEditSnippetFrom(snippet) {
            this.currentSnippet = { ...snippet, value: snippet.snippet };
            this.isEdit = true;
            this.isShowAddModal = true;
        },
        addSnippet() {
            if (this.isEdit) {
                this.updateSnippet();
            } else {
                this.createSnippet();
            }
        },
        deleteSnippet(snippet) {
            let req = new Api("https://v2hoangnd.dev.symper.vn/");
            let res = req.delete("ba-snippet/" + snippet.id);
            res.then(result => {
                for (
                    let index = 0;
                    index < this.listBaSnippet.length;
                    index++
                ) {
                    const item = this.listBaSnippet[index];
                    if (snippet.id === item.id) {
                        this.listBaSnippet.splice(index, 1);
                        break;
                    }
                }
            }).catch(err => {
                console.log(err);
            });
        },
        createSnippet() {
            let req = new Api("https://v2hoangnd.dev.symper.vn/");
            let res = req.post("ba-snippet", this.currentSnippet);
            res.then(result => {
                this.listBaSnippet.push({
                    id: result.data,
                    snippet: this.currentSnippet.value,
                    name: this.currentSnippet.name,
                    description: this.currentSnippet.description
                });
                this.isShowAddModal = false;
                let methodDes = `<b>Mô tả:</b> ${this.currentSnippet.description}</br><b>Nội dung:</b> ${this.currentSnippet.value}`;
                this.listWordsCompletes.push({
                    caption: this.currentSnippet.name,
                    value: this.currentSnippet.value,
                    meta: "BA snippet",
                    description: methodDes
                });
                this.setupUpdateAutocomplete(this.listWordsCompletes);
            }).catch(err => {
                console.log(err);
            });
        },
        updateSnippet() {
            let req = new Api("https://v2hoangnd.dev.symper.vn/");
            let res = req.put("ba-snippet", this.currentSnippet);
            res.then(result => {
                for (
                    let index = 0;
                    index < this.listBaSnippet.length;
                    index++
                ) {
                    const snippet = this.listBaSnippet[index];
                    if (snippet.id == this.currentSnippet.id) {
                        this.listBaSnippet[
                            index
                        ].name = this.currentSnippet.name;
                        this.listBaSnippet[
                            index
                        ].value = this.currentSnippet.value;
                        this.listBaSnippet[
                            index
                        ].description = this.currentSnippet.description;
                        this.listBaSnippet[
                            index
                        ].snippet = this.currentSnippet.value;
                        let methodDes = `<b>Mô tả:</b> ${this.currentSnippet.description}</br><b>Nội dung:</b> ${this.currentSnippet.value}`;
                        this.listWordsCompletes.push({
                            caption: this.currentSnippet.name,
                            value: this.currentSnippet.value,
                            meta: "BA snippet",
                            description: methodDes
                        });
                        this.setupUpdateAutocomplete(this.listWordsCompletes);
                        break;
                    }
                }
                this.isShowAddModal = false;
            }).catch(err => {
                console.log(err);
            });
        },
        showAddModal() {
            this.isShowAddModal = true;
            this.isEdit = false;
            this.currentSnippet = {
                name: "",
                description: "",
                value: ""
            };
        },
        setupBaSnippet() {
            let req = new Api("https://v2hoangnd.dev.symper.vn/");
            let res = req.get("ba-snippet");
            res.then(result => {
                this.listBaSnippet = result.data;
                for (
                    let index = 0;
                    index < this.listBaSnippet.length;
                    index++
                ) {
                    const method = this.listBaSnippet[index];
                    let methodDes = `<b>Mô tả:</b> ${method.description}</br><b>Nội dung:</b> ${method.snippet}`;
                    this.listWordsCompletes.push({
                        caption: method.name,
                        value: method.snippet,
                        meta: "BA snippet",
                        description: methodDes
                    });
                }
                this.setupUpdateAutocomplete(this.listWordsCompletes);
            }).catch(err => {
                console.log(err);
            });
        },
        initEditor() {
            this.langTools = require("ace-builds/src-min-noconflict/ext-language_tools");
            this.snippetManager = ace.require("ace/snippets").snippetManager;
            this.formulaEditor = ace.edit(this.$refs.formulaEditor);
            let pgsqlMode = require("ace-builds/src-min-noconflict/mode-pgsql")
                .Mode;
            this.formulaEditor.session.setMode(new pgsqlMode());
            this.formulaEditor.setOptions(this.options);
            this.formulaEditor.getSession().setUseWrapMode(true);
            this.setupAutocomplete();
            this.setValue(this.value);
            this.listenChangeEvt();
            if(this.simpleMode){
                this.formulaEditor.setOption('showGutter', false);
            }
        },

        // khadm: Phát sự kiện khi thay đổi giá trị formula
        listenChangeEvt() {
            let self = this;
            
            this.formulaEditor.on("change", e => {
                if (self.debounceAutoSave) {
                    clearTimeout(self.debounceAutoSave);
                }
                
                self.debounceAutoSave = setTimeout(() => {
                    if(self.manualChangeValue){
                        self.innerChangeValue = true; // đánh dấu sự thay đổi của công thức là do người dùng gõ phím
                    }else{
                        self.manualChangeValue = true;
                    }
                    self.$emit("input", self.getValue());
                }, 300);
                
            });

            this.formulaEditor.on("blur", e => {
                self.$emit("change", self.getValue());
            });
        },
        getListAutoComplete() {
            let req = new Api("https://v2hoangnd.dev.symper.vn/");
            let res = req.get("formula-services/list-autocompletes");
            res.then(result => {
                let docs = result.data.document;
                let listDocsCompletes = [];
                let listMethods = this.snippetManager.parseSnippetFile(
                    "snippet test\n  TEST"
                );
                for (const kw of this.keywordName) {
                    listDocsCompletes.push({
                        caption: kw.toUpperCase(),
                        value: kw.toUpperCase(),
                        meta: "Keyword",
                        description: kw.toUpperCase()
                    });
                }
                for (const fn of this.functionName) {
                    listDocsCompletes.push({
                        caption: fn.toUpperCase(),
                        value: fn.toUpperCase(),
                        meta: "function",
                        description: fn.toUpperCase()
                    });
                }
                for (let index = 0; index < docs.length; index++) {
                    const doc = docs[index];
                    this.formulaEditor.session.$mode.$highlightRules.$keywordList[
                        doc.name
                    ] = "support.tables";
                    listDocsCompletes.push({
                        caption: doc.name,
                        value: doc.name,
                        meta: "tables",
                        description: doc.title
                    });
                    for (let item of doc.fields) {
                        this.formulaEditor.session.$mode.$highlightRules.$keywordList[
                            item.name
                        ] = "support.fields";
                        listDocsCompletes.push({
                            caption: doc.name + "." + item.name,
                            value: doc.name + "." + item.name,
                            meta: "fields",
                            description: item.title
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
                    ] = "support.function";
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
                        description: method.description
                    });

                    listMethods.push({
                        content: method.name + "(" + paramStr + ")",
                        name: method.name,
                        tabTrigger: method.name
                    });
                }
                this.formulaEditor.session.bgTokenizer.start(0);
                this.snippetManager.register(listMethods, "pgsql");
                this.setupUpdateAutocomplete(listDocsCompletes);
                this.listWordsCompletes = listDocsCompletes;
            }).catch(err => {
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
                getDocTooltip: item => {
                    item.docHTML = item.description;
                }
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
                }
            };
            this.formulaEditor.completers.push(fieldsToComplete);
        }
    }
};
</script>

<style>
.v-text-field {
    padding-top: 0 !important;
    margin-top: 0 !important;
}
.v-input input {
    max-height: 25px !important;
    font-size: 12px;
}
.v-label {
    font-size: 14px !important;
}
.v-data-table td {
    font-size: 12px !important;
    height: unset !important;
}
.v-data-table td,
.v-data-table th {
    height: unset !important;
    padding: 5px 10px !important;
}
.sym-formula-editor.simple-mode .v-window.v-item-group.v-tabs-items,
.sym-formula-editor .v-window-item.v-window-item--active {
    height: 100%;
}

.sym-formula-editor .v-window.v-item-group.v-tabs-items{
    height: calc(100% - 50px);
}

.sym-formula-editor .v-window__container{
    height: 100%;
}

.v-tabs-bar {
    height: 31px !important;
}
.v-tab {
    font-size: 12px !important;
    text-transform: inherit !important;
    font-weight: normal !important;
    text-shadow: 0 0 0 !important;
}
.v-dialog > .v-card > .v-card__title {
    padding-bottom: 5px;
    font-size: 18px !important;
    font-weight: normal;
    text-shadow: 0 0 0;
}
.v-dialog > .v-card > .v-card__text {
    padding-bottom: 0;
}
.v-dialog .col-12 {
    padding-top: 0px;
    padding-bottom: 0px;
}
.sym-formula-editor {
    background: #ffffff;
    z-index: 2;
}
div.symper-fomular-editor,
div.symper-snippet-editor {
    width: 100%;
    height: 100%;
}
.sym-formula-editor-body {
    width: 100%;
    height: 100%;
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
input[id="toggle-script-editor"]:checked + .sym-formula-editor {
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
