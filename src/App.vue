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
require("firebase/messaging");
const firebaseConfig = appConfigs.firebaseConfig;

export default {
    created() {
        this.initFirebase();
    },
    methods: {
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
                        console.log(currentToken, "currentToken firebase");
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
