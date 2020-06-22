<template>
    <v-app id="symper-platform-app">
        <ba-sidebar />
        <v-content>
            <v-container fluid fill-height class="pa-0">
                <div class="w-100 app-header-bg-color" style="border-bottom:1px solid #cccccc">
                    <div style="width:calc(100% - 200px)" class="float-left">
                        <v-tabs
                            @change="handleChangeTab"
                            v-model="currentTabIndex"
                            class="sym-small-size "
                            color="orange accent-4"
                        >
                            <v-tab class="symper-app-tab" v-for="(title, idx) in tabTitles" :key="idx">
                                {{ title }} 
                                <i class="mdi mdi-close float-right close-tab-btn" @click.stop="closeTab(idx)"></i>
                            </v-tab>
                        </v-tabs>
                    </div>
                    <div
                        class="float-right app-header-bg-color"
                        style="height:40px; line-height:40px;"
                    >
                        <v-menu
                            v-model="isShowDialog"
                            :close-on-content-click="false"
                            :max-width="500"
                            :min-width="500"
                            :max-height="700"
                            offset-y
                            >
                            <template v-slot:activator="{ on }">
                                <v-btn icon v-on="on">
                                    <v-icon>mdi-apps</v-icon>
                                </v-btn>
                            </template>
                            <v-card>
                                <v-app-bar dense flat color="white">
                                    <v-toolbar-title>
                                        <v-icon>mdi-apps</v-icon>
                                        {{$t('common.navigator')}}
                                    </v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-btn icon>
                                        <v-icon @click="isShowDialog = false">mdi-close</v-icon>
                                    </v-btn>
                                </v-app-bar>
                                <v-divider></v-divider>
                                <list-app></list-app>
                            </v-card>
                        </v-menu>
                        <v-btn icon>
                            <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                        <v-menu  v-model="isShowDialogNotification"
                            :close-on-content-click="false"
                            :max-width="452"
                            :min-width="452"
                            :max-height="700"
                            offset-y>
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" icon v-if="unreadNotification > 0">
                                    <v-badge
                                        class="sym-small-size"
                                        
                                        :content="unreadNotification"
                                        :value="unreadNotification"
                                        color="red"
                                        overlap
                                    >
                                        <v-icon>mdi-bell-outline</v-icon>
                                    </v-badge>
                                </v-btn>
                                <v-btn v-on="on" icon v-else>
                                    <v-icon>mdi-bell-outline</v-icon>
                                </v-btn>
                            </template>
                            <list-notification></list-notification>
                        </v-menu>
                    </div>
                </div>
                <v-layout style="height:calc(100% - 41px)" justify-center>
                    <slot />
                </v-layout>
                
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
import Api from "../../api/api.js";
import { appConfigs } from '../../configs';
import BASidebar from "@/components/common/BASidebar.vue";
import listApp from "@/components/common/listApp";
import NotificationBar from "@/components/notification/NotificationBar.vue";
export default {
    methods: {
        /**
         * Xử lý các tab
         */
        handleChangeTab(index) {
            if(index !== undefined){
                let url = Object.keys(this.$store.state.app.urlToTabTitleMap)[index];
                if(url != this.$route.fullPath){
                    this.$router.push(url);
                }
            }
        },
        closeTab(idx){
            let urlMap = this.$store.state.app.urlToTabTitleMap;
            let url = Object.keys(urlMap)[idx];
            this.$store.commit("app/removeTab", url);
        },
        updateCountUnreadNotification(){
            let req = new Api(appConfigs.apiDomain.nofitication);
            req.get("/notifications/count-unread")
            .then(res => {
                console.log(res);
                if (res.status == 200) {
                    this.$store.state.app.unreadNotification = res.data;
                }
            });
        }
        
    },
    components: {
        "ba-sidebar": BASidebar,
        "list-app": listApp,
        "list-notification": NotificationBar
    },
    created() {
        this.$evtBus.$on("app-receive-remote-msg", data => {
            this.$store.state.app.unreadNotification += 1;
            this.$store.state.app.needReloadNotification = true;
        });
        this.updateCountUnreadNotification();
    },
    computed: {
        sapp() {
            return this.$store.state.app;
        },
        unreadNotification(){
            return this.$store.state.app.unreadNotification;
        },
        currentTabIndex: {
            get() {
                return this.$store.state.app.currentTabIndex;
            },
            set(value) {
                this.$store.commit("app/updateCurrentTabIndex", value);
            }
        },
        tabTitles() {
            return Object.values(this.$store.state.app.urlToTabTitleMap);
        }
    },
    data: function() {
        return {
            isShowDialog: false,
            isShowDialogNotification: false,
        };
    }
};
</script>


<style>
.app-header-bg-color,.app-header-bg-color .v-item-group {
    background-color: white!important;
}
.nofitication-title-bar{
    font-size: 13px;
    font-weight: bold;
}

</style>
