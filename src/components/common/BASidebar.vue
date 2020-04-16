<template>
    <v-navigation-drawer :mini-variant="sapp.collapseSideBar" :v-model="true" app>
        <v-list dense nav class="py-0">
            <v-list-item :class="{ 'px-0': sapp.collapseSideBar }" v-show="!sapp.collapseSideBar">
                <img
                    @click="goToHome()"
                    height="30px"
                    :src="require('./../../assets/image/symper-full-logo.png')"
                />
            </v-list-item>
            <v-list-item class="px-0" v-show="sapp.collapseSideBar">
                <img
                    @click="goToHome()"
                    height="30px"
                    :src="require('./../../assets/image/symper-short-logo.png')"
                />
            </v-list-item>

            <v-list-item two-line :class="{ 'px-0': sapp.collapseSideBar }">
                <v-list-item-avatar>
                    <img src="https://randomuser.me/api/portraits/men/81.jpg" />
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title>{{ sapp.endUserInfo.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                        <v-menu bottom left>
                            <template v-slot:activator="{ on }">
                                <v-btn
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

<!-- 
            <v-list-group
                no-action
                v-for="item in sapp.items"
                :key="item.title"
            >
                <template v-slot:activator>
                    <v-list-item-icon>
                        <v-tooltip right>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on">{{ item.icon }}</v-icon>
                            </template>
                            <span>{{ item.title }}</span>
                        </v-tooltip>
                    </v-list-item-icon>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </template>
                <v-list-item
                    v-for="item in item.group"
                    :key="item.title"
                    link
                    @click="gotoPage(item.link)"
                >
                    <v-list-item-icon>
                    <v-tooltip right>
                        <template v-slot:activator="{ on }">
                            <v-icon v-on="on">{{ item.icon }}</v-icon>
                        </template>
                        <span>{{ item.title }}</span>
                    </v-tooltip>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                
            </v-list-group> -->




        </v-list>
        <template v-slot:append>
            <v-list dense>
                <v-list-item>
                    <v-list-item-icon class="mr-2">
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
export default {
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
    methods: {
        changeLocale(item){
            this.$i18n.locale = item.key;
            util.auth.setSavedLocale(item.key);
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
        return {};
    }
};
</script>

<style></style>
