<template>
    <v-navigation-drawer v-resize="reCalcSidebarHeight" mobile-break-point="0" :mini-variant="sapp.collapseSideBar" :v-model="true" app>
        <v-list dense nav class="py-0 pr-0">
            <v-list-item :class="{ 
                    'px-0': sapp.collapseSideBar,
                    'ma-0 pt-2 pb-1': true 
                }" 
                v-show="!sapp.collapseSideBar">
                <img
                    @click="goToHome()"
                    height="30px"
                    :src="require('./../../assets/image/symper-full-logo.png')"
                />
            </v-list-item>
            <v-list-item class=" pt-2 px-0 ma-0 pb-1" v-show="sapp.collapseSideBar">
                <img
                    @click="goToHome()"
                    height="30px"
                    :src="require('./../../assets/image/symper-short-logo.png')"
                />
            </v-list-item>

            <v-list-item two-line :class="{ 
                    'px-0': sapp.collapseSideBar,
                    'ma-0 pb-1': true 
                }">
                <v-list-item-avatar>
                    <img src="https://randomuser.me/api/portraits/men/81.jpg" />
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title>
                        <span class="mt-1 position-relative" style="top: 5px; position: relative;">{{ sapp.endUserInfo.name }}</span> 
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                
                                <i @click="logout" v-on="on" class="float-right py-1 pl-1 cursor-pointer mdi mdi-exit-to-app fs-15"></i>
                            </template>
                            <span>{{$t('common.logout')}}</span>
                        </v-tooltip>
                    </v-list-item-title>

                    <v-list-item-subtitle>
                        <v-menu bottom left>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    class="w-100"
                                    x-small
                                    v-on="on"
                                    depressed
                                >{{ sapp.endUserInfo.currentRole.title }}</v-btn>
                            </template>

                            <v-list dense>
                                <v-list-item v-for="(item, i) in sapp.endUserInfo.roles" :key="i">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>


            <VuePerfectScrollbar :style="{height: menuItemsHeight}">
                <div class="pr-2">
                    <v-list-item
                        v-for="item in sapp.items"
                        :key="item.title" 
                        link
                        @click="gotoPage(item.link, item.title)"
                    >
                        <v-list-item-icon>
                            <v-tooltip right>
                                <template v-slot:activator="{ on }">
                                    <v-icon v-on="on">{{ item.icon }}</v-icon>
                                </template>
                                <span>{{ $t('common.'+item.title) }}</span>
                            </v-tooltip>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>{{ $t('common.'+item.title) }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </div>
            </VuePerfectScrollbar>
        </v-list>
        <template v-slot:append>
            <v-list dense>
                <v-list-item>
                    <v-list-item-icon class="mx-2">
                        <v-icon @click.stop="invertSidebarShow()">mdi-menu</v-icon>
                    </v-list-item-icon>
                    <v-menu>
                        <template v-slot:activator="{ on: menu }">
                            <v-tooltip top>
                                <template v-slot:activator="{ on: tooltip }">
                                    <v-btn icon v-on="{ ...tooltip, ...menu }">
                                        <v-icon>mdi-earth</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{$t('common.select_lang')}}</span>
                            </v-tooltip>
                        </template>
                        <v-list>
                            <v-list-item
                                class="v-list-item--link"
                                v-for="item in sapp.supportedLanguages"
                                :key="item.key"
                                @click="changeLocale(item)"
                            >
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-list-item>
            </v-list>
        </template>
    </v-navigation-drawer>
</template>

<script>
import { util } from "./../../plugins/util.js";
import { userApi } from "./../../api/user.js";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
    components: {
        VuePerfectScrollbar
    },
    computed: {
        sapp() {
            return this.$store.state.app;
        }
    },
    watch: {
        "sapp.collapseSideBar": function(newVl) {
            console.log("collapseSideBar app changed", newVl);
        }
    },
    mounted(){
        this.reCalcSidebarHeight();
    },
    methods: {
        reCalcSidebarHeight(){
            console.log('xxxxxxxxxxxxxx');
            
            this.menuItemsHeight = (util.getComponentSize(this).h - 178)+'px';
        },
        logout(){
            util.auth.logout();
            location.reload();
        },
        changeLocale(item) {
            let locale = item.key;
            let currentLocale = util.getSavedLocale();
            if (currentLocale != locale) {
                this.$i18n.locale = locale;
                util.setSavedLocale(locale);
                userApi.setUserLocale(locale);
                this.$evtBus.$emit("change-user-locale", locale);
            }
        },
        goToHome() {
            this.$goToPage("/", "Trang chủ");
        },
        invertSidebarShow() {
            this.$store.commit(
                "app/changeCollapseSidebar",
                !this.sapp.collapseSideBar
            );
        },
        gotoPage(uri, title) {
            this.$goToPage(uri, title);
        }
    },
    data() {
        return {
            menuItemsHeight: '200px'
        };
    }
};
</script>

<style></style>
