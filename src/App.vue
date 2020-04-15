<template>
    <div id="symper-app">
        <component :is="layout">
            <keep-alive>
                <router-view />
            </keep-alive>
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
import { appConfigs } from "./configs.js";
var firebase = require("firebase/app");
import { IndexedDB } from "./plugins/utilModules/indexedDB.js";

require("firebase/messaging");
const firebaseConfig = appConfigs.firebaseConfig;

var SYM_IDB_NAME = "SYMPER-IDB-STORE";
const STORE_REQUEST_NAME = "requestes";
export default {
    created() {
        this.initFirebase();
    },
    mounted() {
        this.checkBacklogRequest();
    },
    methods: {
        /**
         * Kiểm tra các request còn tồn đọng trong indexed db để thông báo cho người dùng
         */
        checkBacklogRequest() {
            let idb = new IndexedDB(SYM_IDB_NAME);
            idb.open(STORE_REQUEST_NAME, false, false, () => {
                idb.readAll(item => {
                    console.log(item, "Các request đang còn tồn đọng");

                });
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
