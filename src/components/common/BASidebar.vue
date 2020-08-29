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
                <v-list-item-avatar @click="invertSidebarShow()">
                    <img src="https://randomuser.me/api/portraits/men/81.jpg" />
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title>
                        <span class="mt-1 position-relative" style="top: 5px; position: relative;">
                            {{ sapp.baInfo.name ? sapp.baInfo.name : sapp.endUserInfo.displayName }}
                        </span> 
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                
                                <i @click="logout" v-on="on" class="float-right py-1 pl-1 cursor-pointer mdi mdi-exit-to-app fs-15"></i>
                            </template>
                            <span>{{$t('common.logout')}}</span>
                        </v-tooltip>
                    </v-list-item-title>
                    <div class="w-100 mb-1 ">
                        <div class="w-100 d-flex" v-if="sapp.baInfo.name"  style="color: rgba(0, 0, 0, 0.54)">
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <i v-on="on" class="mdi mdi-account-check-outline fs-16 mr-1" style="position: relative;top: 2px;"></i> 
                                </template>
                                <span>User</span>
                            </v-tooltip>
                            <v-menu 
                                v-model="showDelegatedUser"
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
                                                <span class="fs-11" style="font-weight: 400!important">
                                                    {{sapp.endUserInfo.displayName}}
                                                </span>
                                            </v-btn>
                                        </template>
                                        <span>Switch user</span>
                                    </v-tooltip>
                                </template>
                                <div class="bg-white" style="width: 200px">
                                    <v-autocomplete
                                        ref="selectDelegateUser"
                                        return-object
                                        full-width
                                        solo
                                        append-icon=""
                                        :items="sapp.allUsers"
                                        background-color="grey lighten-4"
                                        flat
                                        dense
                                        color="blue-grey lighten-2"
                                        :label="$t('common.search')"
                                        item-text="displayName"
                                        @change="delegateUser"
                                        item-value="name"
                                        :filter="filterUser">
                        
                                        <template v-slot:item="data">
                                            <div class="fs-13 py-1">
                                                <i class="mdi mdi-account mr-2 fs-16"> </i> <span> {{data.item.displayName}}</span>
                                            </div>
                                        </template>
                                    </v-autocomplete>

                                 </div>
                            </v-menu>
                        </div>
                        <div class="w-100 d-flex" style="color: rgba(0, 0, 0, 0.54)">
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <i class="mdi mdi-account-circle-outline fs-16 mr-1" v-on="on" style="position: relative;top: 2px;"></i>                            
                                </template>
                                <span>Role</span>
                            </v-tooltip>

                            <v-menu 
                                v-model="showSwitchRole"
                                :offset-y="true"
                                :close-on-content-click="false">
                                <template v-slot:activator="{ on: menu, attrs }">
                                     <v-tooltip top>
                                        <template v-slot:activator="{ on: tooltip }">
                                            <v-btn
                                                x-small
                                                v-bind="attrs"
                                                text
                                                depressed
                                                v-on="{ ...tooltip, ...menu }">
                                                <span class="fs-11" style="font-weight: 400!important">
                                                    {{sapp.endUserInfo.currentRole.name}}
                                                </span>
                                            </v-btn>
                                        </template>
                                        <span>Switch role</span>
                                    </v-tooltip>
                                </template>
                                
                                <UserRoleSelector></UserRoleSelector>
                            </v-menu>
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

            <VuePerfectScrollbar :style="{height: menuItemsHeight}">
                <div class="pr-2">
                    <v-list-item
                        v-for="item in userMenuItems"
                        :key="item.title" 
                        link
                        :symper-action="$bindAction(item.action)"
                        @click="gotoPage(item)">
                        <v-list-item-icon>
                            <v-tooltip right>
                                <template v-slot:activator="{ on }">
                                    <v-icon :symper-action="$bindAction(item.action)" v-on="on">{{ item.icon }}</v-icon>
                                </template>
                                <span :symper-action="$bindAction(item.action)">{{ $t('common.'+item.title) }}</span>
                            </v-tooltip>
                        </v-list-item-icon>

                        <v-list-item-content :symper-action="$bindAction(item.action)">
                            <v-list-item-title>{{ $t('common.'+item.title) }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </div>
            </VuePerfectScrollbar>
        </v-list>
        <template v-slot:append>
            <v-list dense>
                <v-list-item>
                    <v-list-item-icon >
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
import UserRoleSelector from "@/components/app/UserRoleSelector.vue";

export default {
    created(){
        let self = this;
        let savedUserInfo = util.auth.getSavedUserInfo();
        let roles = this.$store.state.app.endUserInfo.roles;
        
        this.$store.dispatch('app/setUserInfo', savedUserInfo);
        
        this.$evtBus.$on('symper-user-add-loaded-role-type', function(type){
            self.loadRoleTypes.push(type);
            let currentRole = self.$store.state.app.endUserInfo.currentRole;
            if(currentRole.id == 0){
                if(roles.orgchart.length > 0){
                    self.$store.dispatch('app/changeUserRole', roles.orgchart[0]);
                }else if(roles.systemRole.length > 0){
                    self.$store.dispatch('app/changeUserRole', roles.orgchart[0]);
                }
            }
        });
        this.$store.dispatch("app/getAllUsers");
        this.$store.dispatch('app/getAllRoles', this.$store.state.app.endUserInfo.id);
    },
    components: {
        VuePerfectScrollbar,
        UserRoleSelector
    },
    computed: {
        sapp() {
            return this.$store.state.app;
        },
        userMenuItems(){
            return this.$store.getters['app/userMenuItems'];
        }
    },
    watch: {
        "sapp.collapseSideBar": function(newVl) {
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
            this.showDelegatedUser = false;
            this.$store.dispatch('app/setUserInfo', delegatedUser.data);
            location.reload();
        },
        openSelectUserPanel(){
            this.delegatedUser = {};
            setTimeout((self) => {
                $(self.$refs.selectDelegateUser.$el).find('.v-select__slot').click();
            }, 400, this);
        },
        reCalcSidebarHeight(){
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
        gotoPage(item) {
            if(item.action){
                // this.$evtBus.$emit('symper-app-call-action-handler', item.action, this, {});
            }else{
                this.$goToPage(item.link, item.title, false, false);
            }
        }
    },
    data() {
        return {
            loadRoleTypes: [],
            showDelegatedUser: false,
            showSwitchRole: false,
            delegatedUser: {},
            searchUserDeligate: '',
            listUserForDelegate: [],
            menuItemsHeight: '200px'
        };
    }
};
</script>

<style></style>

