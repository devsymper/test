<template>
    <v-container fluid>
        <ListItems
            ref="listApp"
            :getDataUrl="apiUrl"
            :headerPrefixKeypath="'apps.header'"
            :pageTitle="$t('apps.title')"
            :containerHeight="tableHeight"
            :tableContextMenu="tableContextMenu"
            :useDefaultContext="false"
            :actionPanelWidth="600"
            @after-open-add-panel="showAddModal"
            :customAPIResult="customAPIResult"
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
import {appManagementApi} from './../../api/AppManagement.js'
export default {
    name: "listApps",
    components: {
        ListItems,
        UpdateApp,
    },
    computed: {
        baseUrl: function() {
            return this.apiUrl + this.appUrl ;
        },
        
    },
    created(){
        let self = this;
    },
    data: function() {
        return {
            apiUrl: "https://core.symper.vn/application",
            appUrl: "apps",
            isEdit: false,
            customAPIResult: {
                reformatData(res){
                   return{
                         listObject: res.data.listObject,
                         columns: [
                                {name: "id", title: "id ", 	type: "text", },
                                {name: "name", title: "Tên ứng dụng", type: "text"},
                                {name: "iconName", title: "icon", type: "text",},
                                    // renderer:  function(instance, td, row, col, prop, value, cellProperties) {
                                    //         return td;
                                    //     },},
                                {name: "status", title: "Trạng thái", type: "text"},
                                {name: "createdAt", title: "Thời gian tạo", type: "text"},
                                {name: "updatedAt", title: "Thời gian cập nhật", type: "text"},
                         ],
                   }
                }
            },
            tableContextMenu: [
               {
                    name: "edit",
                    text: this.$t("apps.contextMenu.edit"),
                    callback: (app, callback) => {
                        this.editCallback = callback;
                        appManagementApi.getAppDetails(app.id).then(res => {
                        if (res.status == 200) {
							console.log(res.data.listObject,"resdata listobj");
							debugger
                             this.showEditAppPanel(res.data.listObject)   
                        }else {
                            this.showError()
                        }
                         }).catch((err) => {
                                this.showError()
                        });
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
			this.$store.commit('appConfig/emptyItemSelected')
        },
        closeSidebar() {
            this.$refs.listApp.actionPanel = false;
        },
        showError(){
            this.$snotify({
                type: 'error',
                title: this.$t('notification.errorTitle'),
                text: this.$t('notification.error')
            })
        },
        deleteApp(app) {
           
            console.log(app[0].id);
            appManagementApi.deleteApp(app[0].id)
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
        },
      
    },
};
</script>