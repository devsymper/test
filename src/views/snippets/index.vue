<template>
    <v-container fluid>
        <ListItems
            ref="listSnippet"
            :getDataUrl="baseUrl"
            :headerPrefixKeypath="'snippet.header'"
            :pageTitle="$t('snippet.title')"
            :containerHeight="tableHeight"
            :tableContextMenu="tableContextMenu"
            :useDefaultContext="false"
            :currentItemData="currentSnippet"
            @add-item="showAddModal"
        >
            <template slot="right-panel-content" slot-scope="{itemData}">
                <v-card-title class="headline">{{
                    !!!isEdit ? "Add new snippet" : "Edit snippet"
                }}</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="5">
                            <v-text-field
                                v-model="itemData.name"
                                label="Tên"
                                hint="Chỉ chứa các chữ cái không dấu, chữ số và gạch dưới"
                                :rules="[
                                    () =>
                                        !!itemData.name ||
                                        'Trường này bắt buộc',
                                    () =>
                                        (!!itemData.name &&
                                            /^[a-zA-Z\d_]{3,20}$/.test(
                                                itemData.name
                                            )) ||
                                        'Tên không hợp lệ, vui lòng chỉ nhập chữ cái không dấu, chữ số và gạch dưới, dài từ 3 - 20 ký tự',
                                ]"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="7">
                            <v-text-field
                                v-model="itemData.description"
                                label="Mô tả"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea
                                v-model="itemData.value"
                                :rules="[
                                    () =>
                                        !!itemData.value ||
                                        'Trường này bắt buộc',
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
                    <v-btn
                        color="orange darken-1"
                        text
                        @click="addSnippet"
                        :disabled="!isAllowToSubmit"
                    >
                        {{ isEdit ? "Cập nhật" : "Thêm" }}
                    </v-btn>
                </v-card-actions>
            </template>
        </ListItems>
    </v-container>
</template>

<script>
import FormulaEditor from "../../components/common/FormulaEditor";
import ListItems from "../../components/common/ListItems";
import Api from "./../../api/api.js";
export default {
    name: "ListSnippets",
    components: {
        FormulaEditor: FormulaEditor,
        ListItems: ListItems,
    },
    computed: {
        isAllowToSubmit: function() {
            return this.currentSnippet.value.trim().length > 0 &&
                this.currentSnippet.name.trim().length > 0 &&
                /^[a-zA-Z\d_]{3,20}$/.test(this.currentSnippet.name)
                ? true
                : false;
        },
        baseUrl: function(){
            return this.apiUrl + this.snippetUrl;
        }
    },
    mounted() {
        this.tableHeight = document.body.clientHeight - 0;
    },
    data: function() {
        return {
            isShowAddModal: false,
            currentSnippet: {
                name: "",
                description: "",
                value: "",
            },
            isShowAddModal: false,
            isEdit: false,
            apiUrl: "https://v2hoangnd.dev.symper.vn/",
            snippetUrl: "ba-snippet",
            editCallback: null,
            removeCallback: null,
            addCallback: null,
            tableHeight: 0,
            tableContextMenu: [
                {
                    name: "edit",
                    text: this.$t("snippet.contextMenu.edit"),
                    callback: (snippet, callback) => {
                        this.editCallback = callback;
                        this.showEditSnippetFrom(snippet)
                    }
                },
                {
                    name: "remove",
                    text: this.$t("snippet.contextMenu.remove"),
                    callback: (snippet, callback) => {
                        this.removeCallback = callback;
                        this.deleteSnippet(snippet);
                    }
                }
            ],
        };
    },
    methods: {
        showEditSnippetFrom(snippet) {
            this.currentSnippet = { ...snippet, value: snippet.snippet };
            this.isEdit = true;
            this.isShowAddModal = true;
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
        addSnippet() {
            if (this.isEdit) {
                this.updateSnippet();
            } else {
                this.createSnippet();
            }
        },
        deleteSnippet(snippet) {
            let req = new Api(this.apiUrl);
            let res = req.delete(this.snippetUrl + "/" + snippet.id);
            res.then((result) => {
                // callback here
                this.removeCallback(result)
            }).catch((err) => {
                console.log(err);
            });
        },
        createSnippet() {
            let req = new Api(this.apiUrl);
            let res = req.post(this.snippetUrl, this.currentSnippet);
            res.then((result) => {
                this.isShowAddModal = false;
                // callback come here
                this.$refs.listSnippet.getData();
            }).catch((err) => {
                console.log(err);
            });
        },
        updateSnippet() {
            let req = new Api(this.apiUrl);
            let res = req.put(this.snippetUrl, this.currentSnippet);
            res.then((result) => {
                // callback come here
                this.editCallback({
                    ...result,
                    data: {...this.currentSnippet, snippet: this.currentSnippet.value}
                })
                this.isShowAddModal = false;
            }).catch((err) => {
                console.log(err);
            });
        },
    }
}
</script>

<style>

</style>