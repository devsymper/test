<template>
    <v-container fluid>
        <ListItems
            ref="listPack"
            :getDataUrl="baseUrl"
            :headerPrefixKeypath="'permissions.header'"
            :pageTitle="$t('permissions.title')"
            :containerHeight="tableHeight"
            :tableContextMenu="tableContextMenu"
            :useDefaultContext="false"
            :currentItemData="currentPack"
        >
            <template slot="right-panel-content" slot-scope="{ itemData }">
                <v-card-title class="headline">{{
                    !!!isEdit ? "Add new Permission Packge" : "Edit Packge"
                }}</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field
                                v-model="itemData.packName"
                                label="Tên pack"
                                :rules="[
                                    () =>
                                        !!itemData.packName ||
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
                        @click="addPack"
                        :disabled="!!!itemData.packName"
                    >
                        {{ isEdit ? "Cập nhật" : "Thêm" }}
                    </v-btn>
                </v-card-actions>
            </template>
        </ListItems>
    </v-container>
</template>

<script>
import ListItems from "../../components/common/ListItems";
import Api from "./../../api/api.js";
export default {
    name: "ListPermissions",
    components: {
        ListItems: ListItems,
    },
    computed: {
        baseUrl: function() {
            return this.apiUrl + this.permissiontUrl;
        },
    },
    data: function() {
        return {
            apiUrl: "https://v2hoangnd.dev.symper.vn/",
            permissiontUrl: "permission-packages",
            removeCallback: null,
            isEdit: false,
            editCallback: null,
            currentPack: {
                packName: "",
            },
            isShowAddModal: false,
            tableContextMenu: [
               {
                    name: "edit",
                    text: this.$t("permissions.contextMenu.edit"),
                    callback: (pack, callback) => {
                        console.log(pack);
                        this.editCallback = callback;
                        this.showEditPackFrom(pack);
                    },
                },
                {
                    name: "grantPermission",
                    text: this.$t("permissions.contextMenu.grantPermission"),
                    callback: (permission, callback) => {
                        this.$router.push({
                            name: "editPermissions",
                            params: { id: permission.id },
                        });
                    },
                },
                {
                    name: "remove",
                    text: this.$t("permissions.contextMenu.remove"),
                    callback: (pack, callback) => {
                        this.removeCallback = callback;
                        this.deletepermission(pack);
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
        showEditPackFrom(pack) {
            this.currentPack = { ...pack, packName: pack.pack_name };
            this.isEdit = true;
            this.isShowAddModal = true;
        },
        showAddModal() {
            this.isShowAddModal = true;
            this.isEdit = false;
            this.currentPack = { name: "" };
        },
        deletepermission(permission) {
            let req = new Api(this.apiUrl);
            let res = req.delete(this.permissiontUrl + "/" + permission.id);
            res.then((result) => {
                // callback here
                this.removeCallback(result);
            }).catch((err) => {
                console.log(err);
            });
        },
        addPack() {
            if (this.isEdit) {
                this.updatePack();
            } else {
                this.createPack();
            }
        },
        createPack() {
            let req = new Api(this.apiUrl);
            let res = req.post(this.permissiontUrl, this.currentPack);
            res.then((result) => {
                this.isShowAddModal = false;
                // callback come here
                this.$refs.listPack.getData();
            }).catch((err) => {
                console.log(err);
            });
        },
        updatePack() {
            let req = new Api(this.apiUrl);
            let res = req.put(this.permissiontUrl, {
                packId: this.currentPack.id,
                packName: this.currentPack.packName,
            });
            res.then((result) => {
                // callback come here
                this.editCallback({
                    ...result,
                    data: {
                        ...this.currentPack,
                        pack_name: this.currentPack.packName,
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
