<template>
    <v-container fluid>
        <ListItems
            ref="listApp"
            :getDataUrl="baseUrl"
            :headerPrefixKeypath="'apps.header'"
            :pageTitle="$t('apps.title')"
            :containerHeight="tableHeight"
            :tableContextMenu="tableContextMenu"
            :useDefaultContext="false"
            :actionPanelWidth="600"
            @after-open-add-panel="showAddModal"
        >
            <div slot="right-panel-content" class="h-100">
                <updateApp
                    ref="actionPanel"
                    :isEdit="isEdit"
                    @add-app="addApp"
                    @update-app="updateApp"
                ></updateApp>
            </div>
        </ListItems>
    </v-container>
</template>

<script>
import Api from "./../../api/api.js";
import ListItems from "../../components/common/ListItems";
import UpdateApp from "./Update";
export default {
    name: "listApps",
    components: {
        ListItems,
        UpdateApp,
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
            isEdit: false,
            tableContextMenu: [
               {
                    name: "edit",
                    text: this.$t("apps.contextMenu.edit"),
                    callback: (app, callback) => {
                        this.editCallback = callback;
                        this.showEditAppPanel(app);
                    },
                },
                {
                    name: "remove",
                    text: this.$t("apps.contextMenu.remove"),
                    callback: (app, callback) => {
                        this.removeCallback = callback;
                        this.deleteApp(app);
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
        showEditAppPanel(app) {
            this.isEdit = true;
            this.$refs.actionPanel.setAppObject(app);
        },

        showAddModal() {
            this.isEdit = false;
            this.$refs.actionPanel.setAppObject({ 
                name: "",
                note: "",
                icon: "",
                status: false
            });
        },
        closeSidebar() {
            this.$refs.listApp.actionPanel = false;
        },
        showError(){
            this.$snotify({
                type: 'success',
                title: this.$t('notification.errorTitle'),
                text: this.$t('notification.error')
            })
        },
        deleteApp(app) {
            let req = new Api(this.apiUrl);
            req.delete(this.appUrl + "/" + app.id)
            .then(res => {
                if (res.status == 200) {
                    // callback here
                    this.removeCallback(res);
                    this.$snotify({
                        type: 'success',
                        title: this.$t('notification.successTitle'),
                        text: this.$t('apps.deleted')
                    })
                } else {
                    this.showError()
                }
            }).catch((err) => {
                this.showError()
            });
        },
        addApp(res) {
            if (res.status == 200) {
                // callback come here
                this.$refs.listApp.getData();
                this.closeSidebar();
                this.$snotify({
                    type: 'success',
                    title: this.$t('notification.successTitle'),
                    text: this.$t('apps.added')
                })
            } else {
                this.showError()
            }
        },
        updateApp(res) {
            if (res.status == 200) {
                // callback come here
                this.editCallback({
                    ...res,
                    data: {
                        ...this.currentApp,
                    },
                });
                this.closeSidebar();
                this.$snotify({
                    type: 'success',
                    title: this.$t('notification.successTitle'),
                    text: this.$t('apps.updated')
                })
            } else {
                this.showError()
            }
        }
    },
};
</script>