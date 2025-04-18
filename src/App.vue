<template>
    <div id="symper-app" @click="handleClickApp">
        <component :is="layout">
            <keep-alive>
                <router-view :key="$route.params.pageInstanceKey"  :ref="$route.params.pageInstanceKey" />
            </keep-alive>
            <notifications group="symper-general-notification" :position="sapp.generalNotificationPosition">
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
        
        <v-dialog v-model="conflicSignInUser" width="500">
            <v-card>
                <v-card-title class="headline"> <i class="mdi mdi-alert red--text mr-2"></i> Conflict login user</v-card-title>
                <v-card-text>
                    Your machine is logged in with more than one account!
                    <br>
                    <span class="font-weight-medium">Please reload page</span>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        depressed
                        color="primary"
                        @click="reloadPage"
                    >
                        Reload page
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
/**
 * Cách tổ chức layout học theo: https://itnext.io/anyway-heres-how-to-create-a-multiple-layout-system-with-vue-and-vue-router-b379baa91a05
 */
import Api from "./api/api.js";
import AppSidebar from "./components/common/AppSidebar.vue";
import Content from "./components/common/Content.vue";
import GeneralNotification from "./components/common/GeneralNotification.vue";
import { appConfigs } from "./configs.js";
var firebase = require("@firebase/app").firebase;
import IndexedDB from "./plugins/utilModules/indexedDB.js";
import ResolveBacklogRequest from "./components/app/ResolveBacklogRequest";
import { util } from './plugins/util.js';
require("@/assets/css/handsontable.min.css");
require("@firebase/messaging");
require('@/assets/css/kh.css')
const firebaseConfig = appConfigs.firebaseConfig;

var SYM_IDB_NAME = "SYMPER-IDB-STORE";
const STORE_REQUEST_NAME = "requestes";
export default {
    created() {
        this.initFirebase();
        this.$store.dispatch('app/getAndSetUserOperations');
        this.checkUniqueUserInAllTab();
    },
    data() {
        return {
            activeResolveBaclog: false,
            backlogRequests: {
                needResolve: {},
                resolved: {},
                resolving: {}
            },
            conflicSignInUser: false
        };
    },
    components: {
        "general-notification": GeneralNotification,
        "resolve-backlog-request": ResolveBacklogRequest
    },
    mounted() {
        // this.checkBacklogRequest();
    },
    methods: {
        reloadPage(){
            location.reload();
        },
        checkUniqueUserInAllTab(){
            let self = this;
            document.addEventListener("visibilitychange", function() {
                if(!document.hidden){
                    self.conflicSignInUser = false;
                    let storageData = util.auth.getSavedUserInfo();
                    let stateData = self.$store.state.app;

                    if(!$.isEmptyObject(storageData)){
                        // Nếu BA đăng nhập
                        if(stateData.baInfo.id != storageData.baId){ 
                            self.conflicSignInUser = true;
                        }else if (stateData.baInfo.id == '0'){
                            // Nếu enduser đăng nhập
                            if(stateData.endUserInfo.id != storageData.endUserId){
                                self.conflicSignInUser = true;
                            }
                        }
                    }
                }
            });
        },
        handleClickApp(evt) {
            this.$evtBus.$emit("symper-app-wrapper-clicked", evt);
            if($(evt.target).attr('symper-action')){
                let actionDef = null;
                try {
                    actionDef = JSON.parse($(evt.target).attr('symper-action'));
                } catch (error) {
                    console.error('[SYMPER-ACTION-HANDLER: DOM has symper-action attribute but can not parse to object]', evt.target);
                }

                if(actionDef){
                    if(actionDef.action){
                        this.$evtBus.$emit('symper-app-call-action-handler', actionDef.action, this, actionDef.params ? actionDef.params : {})
                    }else{
                        console.error('[SYMPER-ACTION-HANDLER: action property not found in action definition]', evt.target, actionDef);
                    }
                }
            }
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
            this.$store.commit('app/updateSystemMessaging', {messageObj: messaging});
            messaging.usePublicVapidKey(
                "BNnZfegBztDE4pakIBFZa6GGqcy56WBZhrZ7nUP4R7JPGVyR77zEGFdKwcq4N15NlcamOxNMZKwIMSMQml5KTro"
            );

            messaging.onMessage(payload => {
                this.$snotify({"title":payload.data.title,"text":payload.data.body});
                this.$evtBus.$emit(
                    "app-receive-remote-msg",
                    payload
                );
            });


            messaging
                .getToken()
                .then(currentToken => {
                    if (currentToken) {
                        // this.setTokenFireBase(currentToken);
                        this.$store.dispatch('app/setSystemMessagingToken', currentToken);
                        console.log("Token create: ", currentToken);
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
                        // this.setTokenFireBase(currentToken);
                        this.$store.dispatch('app/resetSystemMessagingToken', currentToken);
                        console.log("Token refreshed: ", refreshedToken);
                    })
                    .catch(err => {
                        console.log("Unable to retrieve refreshed token ", err);
                    });
            });
            // this.$store.state.app.firebaseMessaging = messaging;
        },
        // setTokenFireBase(token){
        //     let req = new Api(appConfigs.apiDomain.nofitication);
        //     req.post("/users/set-token",{"token":token})
        //     .then(res => {
        //         console.log(res);
        //         if (res.status == 200) {
                    
        //         }
        //     });
        // }
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
        },
        sapp(){
            return this.$store.state.app;
        }
    }
};
</script>
