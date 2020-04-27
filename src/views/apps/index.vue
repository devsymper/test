<template>
    <v-container fluid>
        <ListItems
            ref="listapp"
            :getDataUrl="baseUrl"
            :headerPrefixKeypath="'apps.header'"
            :pageTitle="$t('apps.title')"
            :containerHeight="tableHeight"
            :tableContextMenu="tableContextMenu"
            :useDefaultContext="false"
            :currentItemData="currentApp"
            :actionPanelWidth="600"
            @after-open-add-panel="showAddModal"
        >
            <template slot="right-panel-content" slot-scope="{ itemData }">
                <v-card-title class="headline">{{
                    !!!isEdit ? "Thêm App" : "Sửa"
                }}</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field
                                v-model="itemData.name"
                                label="Tên app"
                                :rules="[
                                    () =>
                                        !!itemData.name ||
                                        'Trường này bắt buộc',
                                ]"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="orange darken-1"
                        text
                        @click="addapp"
                        :disabled="!!!itemData.name"
                    >
                        {{ isEdit ? "Cập nhật" : "Thêm" }}
                    </v-btn>
                </v-card-actions>
            </template>
        </ListItems>
    </v-container>
</template>

<script>
import Api from "./../../api/api.js";
import ListItems from "../../components/common/ListItems";
export default {
    name: "listApps",
    components: {
        ListItems,
    },
    computed: {
        baseUrl: function() {
            return this.apiUrl + this.appUrl + "/lists";
        },
    },
    data: function() {
        return {
            apiUrl: "https://v2hoangnd.dev.symper.vn/",
            appUrl: "apps",
            removeCallback: null,
            isEdit: false,
            isGrandPermissionMode: false,
            editCallback: null,
            currentApp: {
                name: "",
                note: "",
                icon: "",
                status: false,
            },
            isShowAddModal: false,
            tableContextMenu: [
               {
                    name: "edit",
                    text: this.$t("apps.contextMenu.edit"),
                    callback: (app, callback) => {
                        this.currentApp = { ...app, appName: app.app_name };
                        this.isEdit = true;
                        this.isGrandPermissionMode = false;
                    },
                },
                {
                    name: "remove",
                    text: this.$t("apps.contextMenu.remove"),
                    callback: (app, callback) => {
                        this.removeCallback = callback;
                        this.deletepermission(app);
                    },
                },
            ],
            tableHeight: 0,
        };
    },
    mounted() {
        this.tableHeight = document.body.clientHeight - 0;
    },
    methods: {
        showAddModal() {
            this.isShowAddModal = true;
            this.isEdit = false;
            this.currentApp = { 
                name: "",
                note: "",
                icon: "",
                status: false
            };
        },
        deletepermission(permission) {
            let req = new Api(this.apiUrl);
            let res = req.delete(this.appUrl + "/" + permission.id);
            res.then((result) => {
                // callback here
                this.removeCallback(result);
            }).catch((err) => {
                console.log(err);
            });
        },
        addapp() {
            if (this.isEdit) {
                this.updateapp();
            } else {
                this.createapp();
            }
        },
        createapp() {
            let req = new Api(this.apiUrl);
            let res = req.post(this.appUrl, this.currentApp);
            res.then((result) => {
                this.isShowAddModal = false;
                // callback come here
                this.$refs.listapp.getData();
            }).catch((err) => {
                console.log(err);
            });
        },
        updateapp() {
            let req = new Api(this.apiUrl);
            let res = req.put(this.appUrl, {
                appId: this.currentApp.id,
                appName: this.currentApp.appName,
            });
            res.then((result) => {
                // callback come here
                this.editCallback({
                    ...result,
                    data: {
                        ...this.currentApp,
                        app_name: this.currentApp.appName,
                    },
                });
                this.isShowAddModal = false;
            }).catch((err) => {
                console.log(err);
            });
        },
    },
};
</script>

<style></style>
