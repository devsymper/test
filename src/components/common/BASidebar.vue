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
                    'ma-0 pb-1': true ,
                }">
                <v-list-item-avatar style="position: relative; top: -8px">
                    <img src="https://randomuser.me/api/portraits/men/81.jpg" />
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title>
                        <span class="mt-1 position-relative" style="top: 5px; position: relative;">
                            {{ sapp.baInfo.name }}
                        </span> 
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                
                                <i @click="logout" v-on="on" class="float-right py-1 pl-1 cursor-pointer mdi mdi-exit-to-app fs-15"></i>
                            </template>
                            <span>{{$t('common.logout')}}</span>
                        </v-tooltip>
                    </v-list-item-title>
                    <div class="w-100 mb-1 ">
                        <div class="w-100 d-flex"  style="color: rgba(0, 0, 0, 0.54)">
                            
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <i v-on="on" class="mdi mdi-account-check-outline fs-16 mr-1" style="position: relative;top: 2px;"></i> 
                                </template>
                                <span>User</span>
                            </v-tooltip>
                            <v-menu 
                                :offset-y="true"
                                :close-on-content-click="false">
                                <template v-slot:activator="{ on: menu, attrs }">
                                    <v-tooltip bottom>
                                    <template v-slot:activator="{ on: tooltip }">
                                        <v-btn
                                            x-small
                                            text
                                            v-bind="attrs"
                                            @click="openSelectUserPanel"
                                            depressed
                                            v-on="{ ...tooltip, ...menu }">
                                            {{sapp.endUserInfo.displayName}}
                                        </v-btn>
                                    </template>
                                    <span>Switch user</span>

                                    </v-tooltip>
                                </template>
                                 <v-card>
                                    <v-autocomplete
                                        ref="selectDelegateUser"
                                        return-object
                                        :items="sapp.allUsers"
                                        chips
                                        dense
                                        color="blue-grey lighten-2"
                                        label="Select"
                                        item-text="name"
                                        @change="delegateUser"
                                        item-value="name"
                                        :filter="filterUser">
                        
                                        <template v-slot:item="data">
                                            <i class="mdi mdi-account mr-2 fs-16"> </i> <span> {{data.item.displayName}}</span>
                                        </template>

                                    </v-autocomplete>

                                 </v-card>
                            </v-menu>
                        </div>
                        <div class="w-100 d-flex" style="color: rgba(0, 0, 0, 0.54)">
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <i class="mdi mdi-account-circle-outline fs-16 mr-1" v-on="on" style="position: relative;top: 2px;"></i>                            
                                </template>
                                <span>Role</span>
                            </v-tooltip>
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        x-small
                                        text
                                        v-on="on"
                                        depressed>
                                        {{sapp.endUserInfo.currentRole.title}}
                                    </v-btn>
                                </template>
                                <span>Switch role</span>
                            </v-tooltip>
                        </div>
                    </div>

                    <v-list-item-subtitle>
                        <v-menu bottom left>
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

            <v-divider style="margin-left: -5px"></v-divider>
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
    created(){
        let savedUserInfo = util.auth.getSavedUserInfo();
        this.setUserInfo(savedUserInfo);
        this.$store.dispatch("app/getAllUsers");
    },
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
        filterUser(item, queryText, itemText){
            let lowcaseText = queryText.toLowerCase();
            return item.displayName.toLowerCase().includes(lowcaseText);
        },
        async delegateUser(user){
            let delegatedUser = await userApi.changeDelegate(user);
            this.setUserInfo(delegatedUser.data);
            location.reload();
        },
        openSelectUserPanel(){
            this.delegatedUser = {};
            setTimeout((self) => {
                $(self.$refs.selectDelegateUser.$el).find('.v-select__slot').click();
            }, 400, this);
        },
        setUserInfo(data) {// đang trùng với hàm cùng tên ở component BAsidebar.vue
            let accData = {
                accType: data.profile.type,
                info: data.profile
            };
            let endUserInfo = data.profile;
            let accInfo = {
                token: data.token,
                baId: 0,
                endUserId: 0,
                profile:data.profile
            }

            if(data.profile.type == 'ba'){
                accInfo.baId = data.profile.id;
                this.$store.commit("app/changeCurrentBAInfo", data.profile);
                endUserInfo = endUserInfo.userDelegate;
                accInfo.endUserId = data.profile.userDelegate.id;
            }else{
                accInfo.endUserId = data.profile.id;
            }
            this.$store.commit("app/changeCurrentUserInfo", endUserInfo);
            util.auth.saveLoginInfo(accInfo);
        },
        reCalcSidebarHeight(){
            console.log('xxxxxxxxxxxxxx');
            
            this.menuItemsHeight = (util.getComponentSize(this).h - 200)+'px';
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
            delegatedUser: {},
            searchUserDeligate: '',
            listUserForDelegate: [],
            menuItemsHeight: '200px'
        };
    }
};
</script>

<style></style>
