<template>
    <v-app id="symper-platform-app">
        <ba-sidebar />
        <v-content>
            <v-container fluid fill-height class="pa-0">
                <div class="w-100 app-header-bg-color" style="border-bottom:1px solid #e6e5e5">
                    <div style="width:calc(100% - 500px)" class="float-left">
                        <v-tabs
                            hide-slider
                            active-class="symper-tab-active"
                            @change="handleChangeTab"
                            v-model="currentTabIndex"
                            class="sym-small-size "
                            color="grey darken-4">
                            <v-tab class="symper-app-tab pr-6" v-for="(item, idx) in tabUrlItems" :key="idx">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <span 
                                        v-bind="attrs"
                                        v-on="on">
                                            {{ item.title }}
                                        </span> 
                                    </template>
                                    <span>{{ item.title }} </span>
                                </v-tooltip>
                                
                                <i class="mdi mdi-close float-right close-tab-btn" @click.stop="closeTab(idx)"></i>
                            </v-tab>
                        </v-tabs>
                    
                </div>
                <div class="float-right app-header-bg-color d-flex justify-end " style="widh:500px;height:40px; line-height:40px;">
                    <!-- search -->
                    <div v-show="showSearchInput" class="d-flex justify-center align-items-center">
                        <transition name="slide-fade">
                        </transition>
                    </div>
                    <v-btn icon @click="showSearchInput = !showSearchInput">
                        <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                    <v-menu v-model="isShowDialog" :close-on-content-click="false" :max-width="500" :min-width="500" :max-height="700" offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-apps </v-icon>
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
                    <v-menu v-model="isShowDialogNotification" z-index="161" :close-on-content-click="false" 
                    :max-width="452" :min-width="452" :max-height="700" offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" icon v-if="unreadNotification > 0">
                                <v-badge class="sym-small-size" :content="unreadNotification" :value="unreadNotification" color="red" overlap>
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
            <v-layout style="height:calc(100% - 41px)" class="w-100 h-100" justify-center>
                <slot />
            </v-layout>

        </v-container>
    </v-content>
</v-app>
</template>

<script>
import Api from "../../api/api.js";

import {
    appConfigs
} from '../../configs';
import BASidebar from "@/components/common/BASidebar.vue";
import listApp from "@/components/common/listApp";
import NotificationBar from "@/components/notification/NotificationBar.vue";
export default {
    
    methods: {
        
        /**
         * Xử lý các tab
         */

        handleChangeTab(index) {
            if (index !== undefined) {
                let urlKey = Object.keys(this.tabUrlItems)[index];
                let urlInfo = this.tabUrlItems[urlKey];

                if (urlInfo.routeName == this.$route.name) {
                    this.$router.push({
                        name: 'symperHiddenRedirectComponent',
                        params: {
                            urlInfo: urlInfo,
                            pageInstanceKey: Date.now()
                        }
                    });
                } else {
                    this.$router.push({
                        name: urlInfo.routeName,
                        params: urlInfo.routeParams
                    });
                }
            }
        },
        closeTab(idx) {
            let urlKey = Object.keys(this.$store.state.app.urlToTabTitleMap)[idx];
            let urlInfo = this.tabUrlItems[urlKey];

            this.$store.commit("app/removeTab", urlKey);
            this.$evtBus.$emit('symper-close-app-tab', {
                pageInstanceKey: urlInfo.pageInstanceKey
            });
        },
        updateCountUnreadNotification() {
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
        "list-notification": NotificationBar,
        SearchInput: Search
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
        unreadNotification() {
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
        tabUrlItems() {
            return Object.values(this.$store.state.app.urlToTabTitleMap);
        }
    },
    data: function () {
        return {
            showSearchInput: false,
            isShowDialog: false,
            isShowDialogNotification: false,
        };
    }
};
</script>

<style>
.app-header-bg-color,
.app-header-bg-color .v-item-group {
    background-color: white !important;
}

.nofitication-title-bar {
    font-size: 13px;
    font-weight: bold;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
