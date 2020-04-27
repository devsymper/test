<template>
    <div id="symper-app" @click="handleClickApp">
        <component :is="layout">
            <keep-alive>
                <router-view />
            </keep-alive>
            <notifications group="symper-general-notification">
                <template slot="body" slot-scope="props">
                    <general-notification
                        :props="props"
                        @close-notification="closeNotification(props)"
                    ></general-notification>
                </template>
            </notifications>
            <v-dialog v-model="activeResolveBaclog" width="500">
                <resolve-backlog-request
                    @change-select-item="handleChangeSelectItem"
                    @close-dialog="closeDialog"
                    @sync-backlog-request="syncBacklogRequest"
                    @remove-backlog-request="removeBacklogRequest"
                    :resolved="backlogRequests.resolved"
                    :needResolve="backlogRequests.needResolve"
                    :resolving="backlogRequests.resolving"
                ></resolve-backlog-request>
            </v-dialog>
        </component>
    </div>
</template>

<script>
/**
 * Cách tổ chức layout học theo: https://itnext.io/anyway-heres-how-to-create-a-multiple-layout-system-with-vue-and-vue-router-b379baa91a05
 */
import AppSidebar from "./components/common/AppSidebar.vue";
import Content from "./components/common/Content.vue";
import appWorker from "@/worker";
import GeneralNotification from "./components/common/GeneralNotification.vue";
import { appConfigs } from "./configs.js";
var firebase = require("firebase/app");
import { IndexedDB } from "./plugins/utilModules/indexedDB.js";
import ResolveBacklogRequest from "./components/app/ResolveBacklogRequest";
require("@/assets/css/handsontable.min.css");
require("firebase/messaging");

const firebaseConfig = appConfigs.firebaseConfig;

var SYM_IDB_NAME = "SYMPER-IDB-STORE";
const STORE_REQUEST_NAME = "requestes";
export default {
    created() {
        this.initFirebase();
    },
    data() {
        return {
            activeResolveBaclog: false,
            backlogRequests: {
                needResolve: {},
                resolved: {},
                resolving: {}
            }
        };
    },
    components: {
        "general-notification": GeneralNotification,
        "resolve-backlog-request": ResolveBacklogRequest
    },
    mounted() {
        this.checkBacklogRequest();
    },
    methods: {
        handleClickApp(evt) {
            this.$evtBus.$emit("symper-app-wrapper-clicked", evt);
        },
        removeBacklogRequest() {
            let needResolve = this.backlogRequests.needResolve;

            for (let i in needResolve) {
                if (needResolve[i].selected) {
                    this.$delete(this.backlogRequests.needResolve, i);
                }
            }
        },
        syncBacklogRequest() {
            let needResolve = this.backlogRequests.needResolve;
            for (let i in needResolve) {
                if (needResolve[i].selected) {
                    this.$set(this.backlogRequests.resolving, i, true);
                }
            }

            setTimeout(
                thisCpn => {
                    for (let i in thisCpn.backlogRequests.resolving) {
                        thisCpn.$set(thisCpn.backlogRequests.resolved, i, true);
                    }
                },
                2000,
                this
            );
        },
        handleChangeSelectItem(key) {
            this.backlogRequests.needResolve[key].selected = !this
                .backlogRequests.needResolve[key].selected;
        },
        closeDialog() {
            this.activeResolveBaclog = false;
        },
        closeNotification(props) {
            props.close();
        },
        /**
         * Kiểm tra các request còn tồn đọng trong indexed db để thông báo cho người dùng
         */
        checkBacklogRequest() {
            let idb = new IndexedDB(SYM_IDB_NAME);
            let activeBacklogs = {};
            let thisCpn = this;
            idb.open(STORE_REQUEST_NAME, false, false, () => {
                idb.readAll(
                    item => {
                        activeBacklogs[item.key] = item.value;
                        activeBacklogs[item.key].selected = false;
                        activeBacklogs[item.key].create_time = new Date(
                            activeBacklogs[item.key].create_time
                        ).toLocaleString();
                        console.log(item, "Các request đang còn tồn đọng");
                    },
                    () => {
                        thisCpn.$set(
                            this.backlogRequests,
                            "needResolve",
                            activeBacklogs
                        );
                        let backlogLength = Object.keys(activeBacklogs).length;
                        if (backlogLength > 0) {
                            thisCpn.$snotify({
                                title: "Dữ liệu chưa đồng bộ!",
                                text: `Bạn có ${backlogLength} mục cần đồng bộ với server`,
                                actionBtns: [
                                    {
                                        text: "Xử lý",
                                        icon: "mdi-send-check",
                                        action: () => {
                                            thisCpn.activeResolveBaclog = true;
                                        }
                                    }
                                ]
                            });
                        }
                    }
                );
            });
        },
        initFirebase() {
            var app = firebase.initializeApp(firebaseConfig);
            var messaging = firebase.messaging();
            messaging.usePublicVapidKey(
                "BDDoFdEPGfIDi9fLXTJrCpiIBhok5xZmEKt0GHSVB7MrQz2xRCYWD6yu75dqRhxoXPQYFFfXdbzbhy0pp7E5YOI"
            );

            messaging.onMessage(payload => {
                this.$evtBus.$emit(
                    "app-receive-remote-msg",
                    payload.data,
                    payload.notification
                );
            });

            messaging
                .getToken()
                .then(currentToken => {
                    if (currentToken) {
                    } else {
                        console.log(
                            "No Instance ID token available. Request permission to generate one."
                        );
                    }
                })
                .catch(err => {
                    console.log(
                        "An error occurred while retrieving token. ",
                        err
                    );
                });

            messaging.onTokenRefresh(() => {
                messaging
                    .getToken()
                    .then(refreshedToken => {
                        console.log("Token refreshed.", refreshedToken);
                    })
                    .catch(err => {
                        console.log("Unable to retrieve refreshed token ", err);
                    });
            });
        }
    },
    computed: {
        layout() {
            let isBA = this.$store.state.app.accountType == "ba";
            let contentOnly =
                this.$route.meta && this.$route.meta.layout == "content-only";

            if (contentOnly) {
                return "content-only-view";
            } else {
                // return isBA ? "ba-view" : "end-user-view";
                return "end-user-view";
            }
        }
    }
};
</script>
