<template>
    <v-app id="symper-platform-app">
        <ba-sidebar />
        <v-content>
            <v-container fluid fill-height class="pt-0">
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
                                    <v-btn icon @click="showObjectType=6">
                                        <v-icon>mdi-view-module</v-icon>
                                    </v-btn>
                                    <v-btn icon @click="showObjectType=12">
                                        <v-icon>mdi-view-headline</v-icon>
                                    </v-btn>
                                    <v-btn icon>
                                        <v-icon @click="isShowDialog = false">mdi-close</v-icon>
                                    </v-btn>
                                </v-app-bar>
                                <v-divider></v-divider>
                                <list-app :gridSize='showObjectType'></list-app>
                            </v-card>
                        </v-menu>
                        <v-btn icon>
                            <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                        <v-btn icon v-if="sapp.unreadNotification > 0">
                            <v-badge
                                class="sym-small-size"
                                
                                :content="sapp.unreadNotification"
                                :value="sapp.unreadNotification"
                                color="red"
                                overlap
                            >
                                <v-icon>mdi-bell-outline</v-icon>
                            </v-badge>
                        </v-btn>
                        <v-btn icon v-else>
                            <v-icon>mdi-bell-outline</v-icon>
                        </v-btn>
                    </div>
                </div>
                <v-layout style="height:calc(100% - 40px)" justify-center>
                    <slot />
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
import BASidebar from "@/components/common/BASidebar.vue";
import listApp from "@/components/common/listApp";
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
        }
    },
    components: {
        "ba-sidebar": BASidebar,
        "list-app": listApp
    },
    created() {},
    computed: {
        sapp() {
            return this.$store.state.app;
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
            showObjectType: 6,
        };
    }
};
</script>


<style>
.app-header-bg-color,.app-header-bg-color .v-item-group {
    background-color: white!important;
}
</style>
