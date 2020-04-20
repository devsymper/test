<template>
    <div>
        <v-dialog v-model="isShowAddModal" max-width="500">
            <v-card>
                <v-card-title class="headline">{{
                    !!!isEdit ? "Add new snippet" : "Edit snippet"
                }}</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="5">
                            <v-text-field
                                v-model="currentSnippet.name"
                                label="Tên"
                                hint="Chỉ chứa các chữ cái không dấu, chữ số và gạch dưới"
                                :rules="[
                                    () =>
                                        !!currentSnippet.name ||
                                        'Trường này bắt buộc',
                                    () =>
                                        (!!currentSnippet.name &&
                                            /^[a-zA-Z\d_]{3,20}$/.test(
                                                currentSnippet.name
                                            )) ||
                                        'Tên không hợp lệ, vui lòng chỉ nhập chữ cái không dấu, chữ số và gạch dưới, dài từ 3 - 20 ký tự',
                                ]"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="7">
                            <v-text-field
                                v-model="currentSnippet.description"
                                label="Mô tả"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea
                                v-model="currentSnippet.value"
                                :rules="[
                                    () =>
                                        !!currentSnippet.value ||
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
                    <v-spacer></v-spacer>
                    <v-btn
                        color="darken-1"
                        text
                        @click="isShowAddModal = false"
                    >
                        Hủy
                    </v-btn>
                    <v-btn
                        color="orange darken-1"
                        text
                        @click="addSnippet"
                        :disabled="!isAllowToSubmit"
                    >
                        {{ isEdit ? "Cập nhật" : "Thêm" }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <ListItems
            :getDataUrl="baseUrl"
        ></ListItems>
    </div>
</template>

<script>
import FormulaEditor from "../../components/common/FormulaEditor";
import ListItems from "../../components/common/ListItems";
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
            baseUrl: "https://v2hoangnd.dev.symper.vn/ba-snippet"
        };
    },
    methods: {
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
            let res = req.delete("/" + snippet.id);
            res.then((result) => {
                // callback here
            }).catch((err) => {
                console.log(err);
            });
        },
        createSnippet() {
            let req = new Api("https://v2hoangnd.dev.symper.vn/");
            let res = req.post("", this.currentSnippet);
            res.then((result) => {
                this.listBaSnippet.push({
                    id: result.data,
                    snippet: this.currentSnippet.value,
                    name: this.currentSnippet.name,
                    description: this.currentSnippet.description,
                });
                this.isShowAddModal = false;
                // callback come here
            }).catch((err) => {
                console.log(err);
            });
        },
        updateSnippet() {
            let req = new Api("https://v2hoangnd.dev.symper.vn/");
            let res = req.put("", this.currentSnippet);
            res.then((result) => {
                // callback come here
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