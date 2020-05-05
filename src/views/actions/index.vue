<template>
    <v-container fluid>
        <ListItems
            ref="listApp"
            :getDataUrl="baseUrl"
            :headerPrefixKeypath="'actions.header'"
            :pageTitle="$t('actions.title')"
            :containerHeight="tableHeight"
            :tableContextMenu="tableContextMenu"
            :useDefaultContext="false"
            :actionPanelWidth="600"
            @after-open-add-panel="showAddModal"
        >
            <div slot="right-panel-content" class="h-100">
                <updateAction
                    ref="actionPanel"
                    :isEdit="isEdit"
                    @add-app="addApp"
                    @update-app="updateAction"
                ></updateAction>
            </div>
        </ListItems>
    </v-container>
</template>

<script>
import Api from "./../../api/api.js";
import ListItems from "../../components/common/ListItems";
import UpdateAction from "./Update";
export default {
    name: "listActions",
    components: {
        ListItems,
        UpdateAction,
    },
    computed: {
        baseUrl: function() {
            return this.apiUrl + this.actionPackUrl + "/lists";
        },
    },
    data: function() {
        return {
            apiUrl: "https://v2hoangnd.dev.symper.vn/",
            actionPackUrl: "action-packs",
            isEdit: false,
            tableContextMenu: [
               {
                    name: "edit",
                    text: this.$t("actions.contextMenu.edit"),
                    callback: (app, callback) => {
                        this.editCallback = callback;
                        this.showEditAppPanel(app);
                    },
                },
                {
                    name: "remove",
                    text: this.$t("actions.contextMenu.remove"),
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
            req.delete(this.actionPackUrl + "/" + app.id)
            .then(res => {
                if (res.status == 200) {
                    // callback here
                    this.removeCallback(res);
                    this.$snotify({
                        type: 'success',
                        title: this.$t('notification.successTitle'),
                        text: this.$t('actions.deleted')
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
                    text: this.$t('actions.added')
                })
            } else {
                this.showError()
            }
        },
        updateAction(res) {
            if (res.status == 200) {
                // callback come here
                this.editCallback({
                    ...res,
                });
                this.closeSidebar();
                this.$snotify({
                    type: 'success',
                    title: this.$t('notification.successTitle'),
                    text: this.$t('actions.updated')
                })
            } else {
                this.showError()
            }
        }
    },
};
</script>