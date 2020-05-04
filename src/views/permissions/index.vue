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
            :actionPanelWidth="800"
            @after-open-add-panel="showAddModal"
        >
            <template slot="right-panel-content">
                <div v-if="!!!isGrandPermissionMode">
                    <UpdatePermission 
                        :isEdit="isEdit"
                        :pack="currentPack"
                        v-model="currentPack"
                        @create-pack="createPack"
                        @update-pack="createPack"
                    ></UpdatePermission>
                </div>
                <div v-else>
                    <grandPermission :package="currentPack"></grandPermission>
                </div>
            </template>
        </ListItems>
    </v-container>
</template>

<script>
import ListItems from "../../components/common/ListItems";
import grandPermission from "./grandPermission";
import UpdatePermission from "./Update";
import Api from "./../../api/api.js";
export default {
    name: "ListPermissions",
    components: {
        ListItems,
        grandPermission,
        UpdatePermission,
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
            isGrandPermissionMode: false,
            editCallback: null,
            currentPack: {
                pack_name: "",
            },
            tableContextMenu: [
               {
                    name: "edit",
                    text: this.$t("permissions.contextMenu.edit"),
                    callback: (pack, callback) => {
                        this.editCallback = callback;
                        this.currentPack = { ...pack };
                        this.isEdit = true;
                        this.isGrandPermissionMode = false;
                    },
                },
                {
                    name: "grantPermission",
                    text: this.$t("permissions.contextMenu.grantPermission"),
                    callback: (pack, callback) => {
                        this.currentPack = { ...pack };
                        this.isEdit = false;
                        this.isGrandPermissionMode = true;
                        this.$refs.listPack.actionPanel = true;
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
        showAddModal() {
            this.isEdit = false;
            this.isGrandPermissionMode = false
            this.currentPack = { name: "" };
        },
        deletepermission(permission) {
            let req = new Api(this.apiUrl);
            req.delete(this.permissiontUrl + "/" + permission.id)
            .then(res => {
                if (res.status === 200) {
                    this.removeCallback(result);
                    this.closeSidebar();
                    this.$snotify({
                        type: 'success',
                        title: this.$t('notification.successTitle'),
                        text: this.$t('permissions.deleted')
                    })
                } else {
                    this.showError();
                }
            }).catch((err) => {
                this.showError();
                console.log(err);
            });
        },
        createPack(res) {
            if (res.status === 200) {
                this.$refs.listPack.getData();
                this.closeSidebar();
                this.$snotify({
                    type: 'success',
                    title: this.$t('notification.successTitle'),
                    text: this.$t('permissions.created')
                })
            }
        },
        closeSidebar() {
            this.$refs.listPack.actionPanel = false;
        },
        showError(){
            this.$snotify({
                type: 'success',
                title: this.$t('notification.errorTitle'),
                text: this.$t('notification.error')
            })
        },
        updatePack() {
            if (res.status === 200) {
                // callback come here
                this.editCallback({
                    ...res,
                    data: {
                        ...this.currentPack,
                    },
                });
                this.closeSidebar();
                this.$snotify({
                    type: 'success',
                    title: this.$t('notification.successTitle'),
                    text: this.$t('permissions.updated')
                })
            } else {
                this.showError();
            }
        },
    },
};
</script>

<style></style>
