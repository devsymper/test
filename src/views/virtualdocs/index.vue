<template>
    <v-container fluid>
        <ListItems
            ref="listvirtualdoc"
            :getDataUrl="baseUrl"
            :headerPrefixKeypath="'virtualdoc.header'"
            :pageTitle="$t('virtualdoc.title')"
            :containerHeight="tableHeight"
            :tableContextMenu="tableContextMenu"
            :useDefaultContext="false"
            :actionPanelWidth="panelWidth"
            @after-open-add-panel="showAddModal"
        >
            <template slot="right-panel-content">
                <update 
                    :isEdit="isEdit"
                    ref="actionPanel"
                    @add-virtualdoc="addvirtualdoc"
                    @update-virtualdoc="updatevirtualdoc"
                    v-if="!isShowDetail"
                ></update>
                <detail 
                    :virtualdoc="detailVirtualdoc"
                    :tableHeight="tableHeight"
                    v-if="isShowDetail"
                    @close-sidebar="closeSidebar"
                ></detail>
            </template>
        </ListItems>
    </v-container>
</template>

<script>
import ListItems from "../../components/common/ListItems";
import XLSX from 'xlsx'
import Api from "./../../api/api.js";
import update from "./update";
import detail from "./detail";
export default {
    name: "Listvirtualdocs",
    components: {
        ListItems: ListItems,
        update: update,
        detail: detail,
    },
    computed: {
        baseUrl: function(){
            return this.apiUrl + this.virtualdocUrl;
        }
    },
    mounted() {
        this.tableHeight = document.body.clientHeight - 0;
    },
    data: function() {
        return {
            isEdit: false,
            isShowDetail: false,
            panelWidth: 400,
            apiUrl: "https://v2hoangnd.dev.symper.vn/",
            virtualdocUrl: "virtualdocs",
            editCallback: null,
            removeCallback: null,
            exportData : [],
            addCallback: null,
            tableHeight: 0,
            detailVirtualdoc: {},
            tableContextMenu: [
                {
                    name: "detail",
                    text: this.$t("virtualdoc.contextMenu.detail"),
                    callback: (virtualdoc, callback) => {
                        this.editCallback = callback;
                        this.showDetailVirtualdoc(virtualdoc)
                    }
                },
                {
                    name: "edit",
                    text: this.$t("virtualdoc.contextMenu.edit"),
                    callback: (virtualdoc, callback) => {
                        this.editCallback = callback;
                        this.showEditVirtualdocFrom(virtualdoc)
                    }
                },
                {
                    name: "execute",
                    text: this.$t("virtualdoc.contextMenu.execute"),
                    callback: (virtualdoc, callback) => {
                        this.executeVirtualdoc(virtualdoc);
                    }
                },
                {
                    name: "export",
                    text: this.$t("virtualdoc.contextMenu.export"),
                    callback: (virtualdoc, callback) => {
                        this.exportExcel(virtualdoc);
                    }
                },
                {
                    name: "remove",
                    text: this.$t("virtualdoc.contextMenu.remove"),
                    callback: (virtualdoc, callback) => {
                        this.removeCallback = callback;
                        this.deletevirtualdoc(virtualdoc);
                    }
                }
            ],
        };
    },
    methods: {
        showEditVirtualdocFrom(virtualdoc) {
            this.isEdit       = true;
            this.isShowDetail = false;
            this.panelWidth   = 400;
            if (this.$refs.actionPanel != undefined) {
                this.$refs.actionPanel.setVirtualdocObject(virtualdoc);
            }
        },
        showDetailVirtualdoc(virtualdoc) {
            this.panelWidth       = document.body.clientWidth - 50;
            this.isEdit           = false;
            this.isShowDetail     = true;
            this.detailVirtualdoc = virtualdoc;
            this.$refs.listvirtualdoc.actionPanel = true;
        },
        showAddModal() {
            this.isEdit       = false;
            this.isShowDetail = false;
            this.panelWidth   = 400;
            if (this.$refs.actionPanel != undefined) {
                this.$refs.actionPanel.setVirtualdocObject({ 
                    name: "",
                    description: "",
                    formula: "",
                    columnsOrder: "",
                });
            }
        },
        closeSidebar() {
            this.$refs.listvirtualdoc.actionPanel = false;
        },
        showError(){
            this.$snotify({
                type: 'error',
                title: this.$t('notification.errorTitle'),
                text: this.$t('notification.error')
            })
        },
        deletevirtualdoc(virtualdoc) {
            let req = new Api(this.apiUrl);
            let res = req.delete(this.virtualdocUrl + "/" + virtualdoc.id);
            res.then((result) => {
                // callback here
                if (res.status == 200) {
                    // callback here
                    this.removeCallback(res);
                    this.$snotify({
                        type: 'success',
                        title: this.$t('notification.successTitle'),
                        text: this.$t('virtualdoc.deleted')
                    })
                } else {
                    this.showError()
                }
            }).catch((err) => {
                console.log(err);
                this.showError();
            });
        },
        executeVirtualdoc(virtualdoc) {
            let req = new Api(this.apiUrl);
            let res = req.post(this.virtualdocUrl + "/" + virtualdoc.id + "/execute");
            res.then((result) => {
                // callback here
                if (res.status == 200) {
                    // callback here
                    this.$snotify({
                        type: 'success',
                        title: this.$t('notification.successTitle'),
                        text: this.$t('virtualdoc.updated')
                    })
                } else {
                    this.showError()
                }
            }).catch((err) => {
                console.log(err);
                this.showError();
            });
        },
        exportExcel(virtualdoc) {
            let req = new Api(this.apiUrl);
            req.get(this.virtualdocUrl + "/" + virtualdoc.id + "/export")
            .then(res => {
                if (res.status == 200) {
                    // callback here
                    if (res.data.total > 0) {
                        this.$snotify({
                            type: 'info',
                            title: this.$t('notification.successTitle'),
                            text: this.$t('virtualdoc.loadingData')
                        });
                        this.doExport(virtualdoc, req, res.data.listObject)
                    } else {
                        this.$snotify({
                            type: 'info',
                            title: this.$t('notification.successTitle'),
                            text: this.$t('virtualdoc.noData')
                        });
                    }
                } else {
                    this.showError()
                }
            }).catch((err) => {
                console.log(err);
                this.showError();
            });
        },
        doExport(virtualdoc, req, data, page = 2) {
            req.get(this.virtualdocUrl + "/" + virtualdoc.id + "/export?page=" + page)
            .then(res => {
                if (res.status == 200) {
                    if (res.data.listObject.length) {
                        data = [...data, res.data.listObject];
                        this.doExport(virtualdoc, req, data, ++page)
                    } else {
                        let ws_name = virtualdoc.name;
                        let ws = XLSX.utils.json_to_sheet(data);
                        let wb = XLSX.utils.book_new();
                        try {
                            XLSX.utils.book_append_sheet(wb, ws, ws_name);
                            XLSX.writeFile(wb, ws_name + '.xlsx', { compression: true });
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
            })
        },
        addvirtualdoc(res) {
            if (res.status == 200) {
                // callback come here
                this.$refs.listvirtualdoc.getData();
                this.closeSidebar();
                this.$snotify({
                    type: 'success',
                    title: this.$t('notification.successTitle'),
                    text: this.$t('virtualdoc.added')
                })
            } else {
                this.showError();
            }
        },
        updatevirtualdoc(res) {
            if (res.status == 200) {
                // callback come here
                this.editCallback({
                    ...res,
                });
                this.$refs.listvirtualdoc.getData();
                this.closeSidebar();
                this.$snotify({
                    type: 'success',
                    title: this.$t('notification.successTitle'),
                    text: this.$t('virtualdoc.updated')
                })
            } else {
                this.showError()
            }
        }
    }
}
</script>
