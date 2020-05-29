<template>
    <div
        :key="keyInstance"
        class="sym-form-submit"
        :id="'sym-submit-'+keyInstance"
        :style="{'width':docSize, 'height':'100%'}"
    >
        <div v-html="contentDocument"></div>
        <button v-on:click="togglePageSize" v-show="!isQickSubmit" id="toggle-doc-size">
            <span class="mdi mdi-arrow-horizontal-lock"></span>
        </button>
        <autocomplete-input
            ref="autocompleteInput"
            @open-sub-form="openSubFormSubmit"
            @before-close="isShowSubFormSubmit = false"
        />
        <sym-drag-panel
            ref="symDragPanel"
            :dragPanelWidth="840"
            :dragPanelHeight="600"
            :actionTitle="titleDragPanel"
            :titleIcon="titleDragPanelIcon"
        >
            <template slot="drag-panel-content">
                <!-- <submitDocument :isQickSubmit="true" :docId="340" v-if="!isQickSubmit"/> -->
                <filter-input></filter-input>
            </template>
        </sym-drag-panel>
        <input type="file" :id="'file-upload-alter-'+keyInstance" class="hidden d-none" />
        <user-select :keyInstance="keyInstance" ref="userInput" />
        <validate :keyInstance="keyInstance" ref="validate" />
        <date-picker
            :keyInstance="keyInstance"
            @clickDateCell="selectedDate"
            :title="'Chọn ngày'"
            :isTime="false"
            ref="datePicker"
        />
        <time-picker :keyInstance="keyInstance" :title="'Chọn giờ'" ref="timePicker" />
        <v-speed-dial
            v-show="showSubmitButton"
            v-model="fab"
            :top="top"
            :bottom="bottom"
            :right="right"
            :left="left"
            :direction="direction"
            :open-on-hover="hover"
            :transition="transition"
        >
            <template v-slot:activator>
                <v-btn v-model="fab" color="blue darken-2" dark fab>
                    <v-icon v-if="fab">mdi-close</v-icon>
                    <v-icon v-if="!fab && !isSubmitting">mdi-menu</v-icon>
                    <v-progress-circular indeterminate v-show="isSubmitting" color="red"></v-progress-circular>
                </v-btn>
            </template>
            <v-btn fab dark small color="green" @click="submitDocument">
                <v-icon>mdi-content-save</v-icon>
            </v-btn>
            <!-- <v-btn
                    fab
                    dark
                    small
                    color="indigo"
                >
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-btn
                    fab
                    dark
                    small
                    color="red"
                >
                    <v-icon>mdi-delete</v-icon>
            </v-btn>-->
        </v-speed-dial>
    </div>
</template>
<script>
import { documentApi } from "./../../../api/Document.js";
import { getInsertionCSS } from "./../../../components/document/documentUtil.js";
import "./../../../components/document/documentContent.css";
import { setDataForPropsControl } from "./../../../components/document/dataControl";
import BasicControl from "./basicControl";
import TableControl from "./tableControl";
import ActionControl from "./actionControl";
import DatePicker from "./../../../components/common/DateTimePicker";
import TimeBoxPicker from "./../../../components/common/TimeBoxPicker";
import Table from "./table.js";
import SymperDragPanel from "./../../../components/common/SymperDragPanel.vue";
import { util } from "./../../../plugins/util.js";
import AutocompleteInput from "./items/AutocompleteInput.vue";
import User from "./items/User.vue";
import Filter from "./items/Filter.vue";
import Validate from "./items/Validate.vue";
import ClientSQLManager from "./clientSQLManager.js";
export default {
    props: {
        isQickSubmit: {
            type: Boolean,
            default: false
        },
        docId: {
            type: Number,
            default: 0
        },
        showSubmitButton: {
            default: true
        }
    },
    name: "submitDocument",
    watch: {
        $route(to) {
            console.log(to);
        }
    },
    components: {
        validate: Validate,
        "user-select": User,
        "date-picker": DatePicker,
        "time-picker": TimeBoxPicker,
        "filter-input": Filter,
        "autocomplete-input": AutocompleteInput,
        "sym-drag-panel": SymperDragPanel
    },
    computed: {
        sDocumentEditor() {
            return this.$store.state.document.editor;
        },
        sDocumentSubmit() {
            return this.$store.state.document.submit;
        }
    },
    data() {
        return {
            contentDocument: null,
            documentId: null,
            docSize: null,
            editorDoc: null,
            isShowSubFormSubmit: false,
            keyInstance: Date.now(),
            titleDragPanel: null,
            titleDragPanelIcon: null,

            //
            direction: "top",
            fab: false,
            fling: false,
            hover: false,
            tabs: null,
            top: false,
            right: true,
            bottom: true,
            left: false,
            transition: "slide-y-reverse-transition",
            isSubmitting: false
        };
    },
    beforeMount() {
        this.docSize = "21cm";
    },
    mounted() {
        this.editorDoc = $(".sym-form-submit");
        let thisCpn = this;
        $("#file-upload-alter-" + this.keyInstance).on("change", function(e) {
            let name = $(this).attr("data-control-name");
            thisCpn.$store.commit("document/changeControlSubmitProps", {
                name: name,
                key: "value",
                value: $(this).prop("files")[0].name
            });
            thisCpn.sDocumentSubmit.listInputInDocument[name].addFile(
                $(this).prop("files")[0].name
            );
        });
    },

    created() {
        let thisCpn = this;
        this.createSQLLiteDB();
        if (this.docId != 0) {
            this.documentId = this.docId;
        } else if (this.$route.name == "submitDocument") {
            this.documentId = this.$route.params.id;
        }
        this.loadDocumentData();

        this.$evtBus.$on("document-submit-autocomplete-input", e => {
            thisCpn.$refs.autocompleteInput.show(e);
        });

        this.$evtBus.$on("document-submit-input-change", locale => {
            thisCpn.updateListInputInDocument(
                locale.controlName,
                "value",
                locale.val
            );
        });
        this.$evtBus.$on("document-submit-open-validate", e => {
            thisCpn.$refs.validate.show(e);
        });
        this.$evtBus.$on("document-submit-date-input-click", e => {
            thisCpn.$refs.datePicker.openPicker(e);
        });
        this.$evtBus.$on("document-submit-time-input-click", e => {
            thisCpn.$refs.timePicker.show(e);
        });
        this.$evtBus.$on("document-submit-filter-input-click", e => {
            thisCpn.$refs.symDragPanel.show();
            thisCpn.titleDragPanel = "Tìm kiếm thông tin";
            thisCpn.titleDragPanelIcon = "mdi-file-search";
        });
        this.$evtBus.$on("document-submit-autocomplete-input-change", e => {
            thisCpn.$refs.autocompleteInput.setSearch($(e.target).val());
        });
        this.$evtBus.$on("symper-app-wrapper-clicked", evt => {
            if (
                !$(evt.target).hasClass("autocompleting") &&
                !$(evt.target).hasClass("v-data-table") &&
                $(evt.target).closest(".v-data-table").length == 0
            ) {
                thisCpn.$refs.autocompleteInput.hide();
            }
            if (
                !$(evt.target).hasClass("s-control-user") &&
                !$(evt.target).hasClass("card-list-user") &&
                $(evt.target).closest(".card-list-user").length == 0
            ) {
                thisCpn.$refs.userInput.hide();
            }
            if (
                !$(evt.target).hasClass("s-control-date") &&
                !$(evt.target).hasClass("card-datetime-picker") &&
                $(evt.target).closest(".card-datetime-picker").length == 0
            ) {
                thisCpn.$refs.datePicker.closePicker();
            }
            if (
                !$(evt.target).hasClass("s-control-time") &&
                !$(evt.target).hasClass("card-time-picker") &&
                $(evt.target).closest(".card-time-picker").length == 0
            ) {
                thisCpn.$refs.timePicker.hide();
            }
            if (
                !$(evt.target).hasClass("validate-icon") &&
                !$(evt.target).hasClass("card-validate") &&
                $(evt.target).closest(".card-validate").length == 0
            ) {
                thisCpn.$refs.validate.hide();
            }
        });
    },
    watch: {
        docId(after) {
            this.documentId = after;
            this.loadDocumentData();
        }
    },
    methods: {
        // Khadm: load data của document lên để hiển thị và xử lý
        loadDocumentData() {
            if (this.documentId) {
                let thisCpn = this;
                documentApi
                    .detailDocument(this.documentId)
                    .then(res => {
                        if (res.status == 200) {
                            let content = res.data.document.content;
                            thisCpn.contentDocument = content;
                            setDataForPropsControl(res.data.fields); // ddang chay bat dong bo
                            setTimeout(() => {
                                thisCpn.processHtml(content);
                            }, 100);
                        }
                    })
                    .catch(err => {
                        console.log("error from detail document api!!!", err);
                    })
                    .always(() => {});
            }
        },
        togglePageSize() {
            this.docSize = this.docSize == "21cm" ? "100%" : "21cm";
        },
        processHtml(content) {
            var allInputControl = $("#sym-submit-" + this.keyInstance).find(
                ".s-control:not(.bkerp-input-table .s-control)"
            );
            let thisCpn = this;
            for (let index = 0; index < allInputControl.length; index++) {
                let id = $(allInputControl[index]).attr("id");
                let controlType = $(allInputControl[index]).attr(
                    "s-control-type"
                );
                if (this.sDocumentEditor.allControl[id] != undefined) {
                    // ton tai id trong store
                    let idField = this.sDocumentEditor.allControl[id].id;
                    if (controlType == "submit" || controlType == "reset") {
                        let control = new ActionControl(
                            idField,
                            $(allInputControl[index]),
                            this.sDocumentEditor.allControl[id],
                            thisCpn.keyInstance
                        );
                        control.init();
                        control.render();
                        this.$store.commit(
                            "document/addToListInputInDocument",
                            { name: "submit", control: control }
                        );
                    } else {
                        let controlName = this.sDocumentEditor.allControl[id]
                            .properties.name.value;
                        if (controlType != "table") {
                            let control = new BasicControl(
                                idField,
                                $(allInputControl[index]),
                                this.sDocumentEditor.allControl[id],
                                thisCpn.keyInstance
                            );
                            control.init();
                            this.$store.commit(
                                "document/addToListInputInDocument",
                                { name: controlName, control: control }
                            );
                            control.render();
                        }
                        //truong hop la control table
                        else {
                            let listInsideControls = {};
                            let tableControl = new TableControl(
                                idField,
                                $(allInputControl[index]),
                                this.sDocumentEditor.allControl[id],
                                thisCpn.keyInstance
                            );
                            tableControl.initTableControl();
                            tableControl.tableInstance = new Table(
                                tableControl,
                                controlName
                            );
                            let tableEle = $(allInputControl[index]);
                            tableEle.find(".s-control").each(function() {
                                let childControlId = $(this).attr("id");
                                let idFieldChild =
                                    thisCpn.sDocumentEditor.allControl[id]
                                        .listFields[childControlId].id;
                                console.log(
                                    thisCpn.sDocumentEditor.allControl[id]
                                );

                                let childControl = new BasicControl(
                                    idFieldChild,
                                    $(this),
                                    thisCpn.sDocumentEditor.allControl[
                                        id
                                    ].listFields[childControlId],
                                    thisCpn.keyInstance
                                );
                                childControl.init();
                                let childControlName =
                                    thisCpn.sDocumentEditor.allControl[id]
                                        .listFields[childControlId].properties
                                        .name.value;
                                childControl.inTable = controlName;
                                thisCpn.$store.commit(
                                    "document/addToListInputInDocument",
                                    {
                                        name: childControlName,
                                        control: childControl
                                    }
                                );
                                listInsideControls[childControlName] = true;
                            });
                            tableControl.listInsideControls = listInsideControls;
                            tableControl.renderTable();
                            this.$store.commit(
                                "document/addToListInputInDocument",
                                { name: controlName, control: tableControl }
                            );
                        }
                    }
                }
            }
            console.log(this.sDocumentSubmit);
            console.log(this.sDocumentEditor);
            this.getEffectedControl();
        },
        /**
         * Sự kiện phát ra khi click vào date của date picker
         */
        selectedDate(e) {
            console.log(e);
            this.$refs.datePicker.closePicker();
        },

        /**
         * Hàm mở sub-form submit
         */
        openSubFormSubmit() {
            this.$refs.symDragPanel.$children[1].$refs.autocompleteInput.hide();
            this.$refs.symDragPanel.show();
        },

        /**
         * Hàm tạo csql
         */
        async createSQLLiteDB() {
            ClientSQLManager.createDB(this.keyInstance);
        },

        /**
         * Hàm lấy ra các control bị ảnh hưởng từ 1 control và set vao store
         */
        getEffectedControl() {
            let mapControlEffected = {};
            let allControl = this.sDocumentSubmit.listInputInDocument;
            for (let name in allControl) {
                let type = allControl[name].type;
                console.log(name);
                console.log(allControl[name]);

                if (type != "submit" && type != "reset" && type != "draf") {
                    let formulas = allControl[name].controlFormulas;
                    for (let formulasType in formulas) {
                        let inputControl =
                            formulas[formulasType].instance.inputControl;
                        for (let controlEffect in inputControl) {
                            if (
                                mapControlEffected[controlEffect] == undefined
                            ) {
                                mapControlEffected[controlEffect] = [];
                            }
                            mapControlEffected[controlEffect].push(name);
                        }
                    }
                }
            }
            this.updateEffectedControlToStore(mapControlEffected);
        },

        /**
         * Hàm gọi api submit document
         */
        submitDocument() {
            this.isSubmitting = true;
            let thisCpn = this;
            let dataPost = this.getDataPostSubmit();
            dataPost["id"] = this.documentId;
            documentApi
                .submitDocument(dataPost)
                .then(res => {
                    thisCpn.isSubmitting = false;
                    if (res.status == 200) {
                        thisCpn.$snotify({
                            type: "success",
                            title: "Submit document success!"
                        });
                        thisCpn.$emit("submit-document-success", res.data);
                    } else {
                        thisCpn.$snotifyError(res, 'Can not submit document');
                    }
                })
                .catch(err => {
                    thisCpn.$snotify({
                        type: "error",
                        title: "error from submit document api!!!"
                    });
                })
                .always(() => {});
        },

        /**
         * Hàm lấy tất cả giá trị của doc cho submit dạng {field_${id}:value}
         */
        getDataPostSubmit() {
            let listInput = this.sDocumentSubmit.listInputInDocument;
            let dataPost = {};
            for (let controlName in listInput) {
                let id = "field_" + listInput[controlName].idField;
                if (listInput[controlName].type == "table") {
                    let value = this.getDataTableInput(listInput[controlName]);
                    console.log(value);

                    Object.assign(dataPost, value);
                } else {
                    if (listInput[controlName].type != "submit") {
                        let value = listInput[controlName].value;
                        dataPost[id] = [value];
                    }
                }
            }
            return dataPost;
        },
        /**
         * Hàm lấy dữ liệu của table dạng colName : ['a',"b","c"]
         */
        getDataTableInput(table) {
            let listInput = this.sDocumentSubmit.listInputInDocument;
            let indexCol = table.tableInstance.colName2Idx;
            let dataTable = {};
            for (let i in indexCol) {
                let id = "field_" + listInput[i].idField;
                let dataCol = table.tableInstance.tableInstance.getDataAtCol(
                    indexCol[i]
                );
                dataTable[id] = dataCol;
            }
            return dataTable;
        },
        updateEffectedControlToStore(mapControlEffected) {
            for (let controlName in mapControlEffected) {
                this.updateListInputInDocument(
                    controlName,
                    "effectedControl",
                    mapControlEffected[controlName]
                );
            }
        },
        updateListInputInDocument(controlName, key, value) {
            this.$store.commit("document/updateListInputInDocument", {
                controlName: controlName,
                key: key,
                value: value
            });
        },
        addSQLInstanceDBToStore(SQLDBInstance) {
            this.$store.commit("document/addInstanceSubmitDB", {
                instance: this.keyInstance,
                sqlLite: SQLDBInstance
            });
        }
    }
};
</script>
<style  scoped>
.sym-form-submit {
    width: 21cm;
    padding: 16px;
}
.sym-form-submit >>> .on-selected {
    border: none !important;
}
.sym-form-submit >>> table:not(.htCore) td,
.sym-form-submit >>> table:not(.htCore),
.sym-form-submit >>> table:not(.htCore) th {
    border: none !important;
}
.sym-form-submit >>> .htCore td:last-child {
    border-right: 1px solid #ccc !important;
}
.sym-form-submit >>> .ht_clone_left.handsontable table.htCore {
    border-right: none;
}

#toggle-doc-size {
    position: absolute;
    right: 10px;
    top: 50px;
    padding: 4px 12px;
    font-size: 20px;
    border-radius: 4px;
    background: #fafafa;
    opacity: 1;
    color: #757575;
    transition: ease-in-out 300ms;
}
#toggle-doc-size:hover {
    background: #dddddd;
}
#toggle-doc-size:focus {
    outline: none;
}
/* This is for documentation purposes and will not be needed in your application */
.sym-form-submit >>> .v-speed-dial {
    position: absolute;
}

.sym-form-submit >>> .v-btn--floating {
    position: relative;
}
</style>


