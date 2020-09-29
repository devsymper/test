<template>
    <v-navigation-drawer 
        v-resize="reCalcSidebarHeight" 
        mobile-breakpoint="0" 
        :mini-variant="sapp.collapseSideBar"
        :v-model="true" app>
        <v-list dense nav class="py-0 pr-0">
            <v-list-item :class="{ 
                    'px-0': sapp.collapseSideBar,
                    'ma-0 pt-2 pb-1': true }" 
                v-show="!sapp.collapseSideBar">
                <img
                    @click="goToHome()"
                    height="30px"
                    :src="require('./../../assets/image/symper-full-logo.png')"/>
            </v-list-item>
            <v-list-item class=" pt-2 px-0 ma-0 pb-1" v-show="sapp.collapseSideBar">
                <img
                    @click="goToHome()"
                    height="30px"
                    :src="require('./../../assets/image/symper-short-logo.png')"/>
            </v-list-item>
            <v-list-item two-line :class="{ 
                    'px-0': sapp.collapseSideBar,
                    'ma-0 pb-1': true ,}">
                <v-list-item-avatar @click="invertSidebarShow()">
                    <SymperAvatar :userId="sapp.endUserInfo.id"/>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class=" mb-2">
                        <span class="mt-1 position-relative" style="top: 0px; position: relative;">
                            {{ sapp.baInfo.name ? sapp.baInfo.name : sapp.endUserInfo.displayName }}
                        </span> 
                        <!-- <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <i @click="logout" v-on="on" class="float-right py-1 pl-1 cursor-pointer mdi mdi-exit-to-app fs-15"></i>
                            </template>
                            <span>{{$t('common.logout')}}</span>
                        </v-tooltip> -->
                    </v-list-item-title>
                    <div class="w-100 mb-1 ">
                        <div class="w-100 d-flex" v-if="sapp.baInfo.name"  style="color: rgba(0, 0, 0, 0.54)">
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <i v-on="on" 
                                        class="mdi mdi-account-check-outline fs-16 mr-1" 
                                        style="position: relative;top: 2px;">
                                    </i> 
                                </template>
                                <span>User</span>
                            </v-tooltip>
                            <v-menu 
                                v-model="showDelegatedUser"
                                :offset-y="true"
                                nudge-bottom='0'
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
                                <div class="bg-white" style="width: 251px">
                                    <div>
                                        <v-icon class="ml-3 fs-16">mdi mdi-account-check-outline</v-icon>
                                        <span class="fs-13 mt-3 mb-2 ml-4"> Chọn user thay mặt</span>
                                    </div>
                                    <v-autocomplete
                                        ref="selectDelegateUser"
                                         :menu-props="{ maxHeight:300, minWidth:251,maxWidth:251, nudgeLeft:8, nudgeBottom:3}"
                                        return-object
                                        class="mr-2 ml-2"
                                        full-width
                                        solo
                                        :items="sapp.allUsers"
                                        background-color="grey lighten-4"
                                        flat
                                        dense
                                        color="blue-grey lighten-2"
                                        item-text="displayName"
                                        @change="delegateUser"
                                        item-value="name"
                                        :filter="filterUser">
                                        <template v-slot:append>
                                            <v-icon style= "font-size:18px;">mdi mdi-magnify</v-icon>
                                        </template>
                                        <template v-slot:label>
                                            <span class="fs-13">{{$t('common.search')}}</span>
                                        </template>
                                        <template v-slot:item="data">
                                        
                                            <div class="fs-13 py-1" >
                                                 <SymperAvatar
                                                    style="height:25px!important; width:25px!important; margin-left:-5px"  
                                                    :userId="data.item.id"/>
                                                <span  class="fs-13 ml-1"> {{data.item.displayName}}</span>
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
                                                <span class="fs-11 fm">
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
            <VuePerfectScrollbar :style="{height: menuItemsHeight} " v-show="!sapp.collapseSideBar">
                <div class="pr-2">
                    <v-list :expand="true">
                    <v-list-group
                        dense
                        v-for="item in menu"
                        :key="item.title" 
                        link
                        no-action
                        :class="{'menu-group': true , 'menu-group-active': item.title == indexActive }"
                        :symper-action="$bindAction(item.action?item.action:'')"
                        @click="gotoPage(item)">
                       <template v-slot:prependIcon>
                            <v-icon class="ml-1 icon-group">
                                {{ item.icon }}
                            </v-icon>
                        </template>
                        <v-icon slot="appendIcon" style="font-size:18px" 
                            :symper-action="$bindAction(item.action)" >
                        </v-icon>
                        <template v-slot:activator v-if="item.title">
                            <v-list-item-title 
                                 style="margin-left:-25px;"
                                
                                 :symper-action="$bindAction(item.action)">
                                <v-list-item-title 
                                    class="fm" 
                                    style="color:rgb(0,0,0,0.8)" 
                                    :symper-action="$bindAction(item.action)">
                                    {{ $t('common.sidebar.'+item.title) }}
                                </v-list-item-title>
                            </v-list-item-title>
                        </template>
                        <template v-slot:activator v-else>  
                            <v-list-item-title class="fm title-group">
                                  <span class="fs-11"> {{ $t('common.sidebar.'+item.titleGroup) }}</span>
                            </v-list-item-title>    
                        </template>
                        <v-list-item
                            style="margin-left:-25px; height:32px!important"
                            v-for="(subMenu, objectType) in item.children"
                            :key="objectType"
                             :class="{'menu-group-active': subMenu.title == indexActive }"
                            @click="gotoPage(subMenu)">
                            <v-list-item-title class="fm" style=" color:rgb(0,0,0,0.8)" >
                                {{$t('common.sidebar.'+subMenu.title)}}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list-group>
                    </v-list>
                </div>
            </VuePerfectScrollbar>
             <VuePerfectScrollbar :style="{height: menuItemsHeight} " v-show="sapp.collapseSideBar">
                <div class="pr-2">
                    <v-list :expand="true" style="margin-top:-40px">
                    <v-list-group  
                        class="menu-group"
                        dense
                        v-for="item in menu"
                        :key="item.title" 
                        :style="{'border-bottom': item.titleGroup=='Administrator'||item.titleGroup=='Applications'? '1px solid lightgrey':'','height':item.titleGroup=='Administrator'||item.titleGroup=='Applications'?'10px':''}"
                        link
                        no-action
                        :symper-action="$bindAction(item.action?item.action:'')"
                        @click="gotoPage(item)">
                       <template v-slot:prependIcon>
                           <v-menu 
                                right offset-y
                                nudge-right='40'
                                nudge-top='30'>
                                <template v-slot:activator="{ on: menu }">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on: tooltip }">
                                            <v-icon class="icon-group" @click="gotoPage(item)" v-on="{ ...tooltip, ...menu }">
                                            {{ item.icon }}
                                            </v-icon>
                                        </template>
                                    <span class="fs-13">{{ $t('common.sidebar.'+item.title) }}</span>
                                    </v-tooltip>
                                </template>
                                <v-list dense v-if="item.children">
                                    <v-list-item 
                                        dense
                                        style="height:32px!important"
                                        v-for="(subMenuHover, objectType) in item.children"
                                        :key="objectType"
                                        @click="gotoPage(subMenuHover)">
                                        <v-list-item-title 
                                            style=" color:rgb(0,0,0,0.8)" 
                                            class="fm fs-13">
                                            {{ $t('common.sidebar.'+subMenuHover.title)}}
                                        </v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </template>
                        <v-icon slot="appendIcon" style="font-size:18px" 
                            :symper-action="$bindAction(item.action)" >
                        </v-icon>
                    </v-list-group>
                    </v-list>
                </div>
            </VuePerfectScrollbar>
        </v-list>
        <template v-slot:append>
            <v-list-item>
                <!-- <v-list-item-icon class="collapse-action-icon d-flex justify-start"> -->
                    <div style="margin-left:-8px">
                        <v-btn
                            icon
                            tile 
                            v-if="showChevIcon"
                            @click.stop="invertSidebarShow()" 
                        >
                            <v-icon
                                style="font-size: 20px">
                                mdi mdi-chevron-left
                            </v-icon>
                        </v-btn>
                        <v-btn
                            icon
                            tile 
                            v-else 
                            @click.stop="invertSidebarShow()" 
                        >
                            <v-icon
                                style="font-size: 20px">
                                mdi mdi-chevron-right
                            </v-icon>
                        </v-btn>
                    </div>
                    
                    <!-- <v-icon v-else 
                        @click.stop="invertSidebarShow()" 
                        style="font-size: 20px">
                        mdi mdi-chevron-right
                    </v-icon> -->
                <!-- </v-list-item-icon> -->
                      <v-menu top nudge-top='40' nudge-left='60'>
                        <template v-slot:activator="{ on: menu }">
                            <v-btn style="margin-left:140px" icon tile v-on="menu">
                                <v-icon style="font-size:18px">mdi-cog-outline</v-icon>
                            </v-btn>
                        </template>
                        <v-list dense>
                            <v-list-item class="v-list-item--link" style="background-color:white!important" dense>
                                <v-menu  right nudge-top="10" nudge-right='80'>
                                    <template v-slot:activator="{ on: menu1 }">
                                        <v-list-item-title class="fs-13 fm" style="padding-left:4px" v-on="menu1">
                                            Ngôn ngữ
                                        </v-list-item-title>
                                    </template>
                                    <v-list-item dense
                                        style="background-color:white!important"
                                        class="v-list-item--link"
                                        v-for="item in sapp.supportedLanguages"
                                        :key="item.key"
                                        @click="changeLocale(item)">
                                         <v-list-item-title class="fs-13 fm">{{ item.title }}</v-list-item-title>
                                    </v-list-item>
                                </v-menu>
                            </v-list-item>
                            <v-list-item  class="v-list-item--link">
                                <v-list-item-title   @click="logout" class="fs-13 fm ">
                                    <v-icon  @click="logout" class="font-size:18px"></v-icon>
                                    Đăng xuất
                                </v-list-item-title>
                            </v-list-item>
                            
                        </v-list>
                    </v-menu>
                </v-list-item>
        </template>
    </v-navigation-drawer>
</template>
<script>
import _ from 'lodash';
import { util } from "./../../plugins/util.js";
import { userApi } from "./../../api/user.js";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import UserRoleSelector from "@/components/app/UserRoleSelector.vue";
import { appConfigs } from '../../configs.js';
import SymperAvatar from "@/components/common/SymperAvatar";

export default {
    created(){
        this.addGroupInMenu();
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
        UserRoleSelector,
        SymperAvatar
    },
    computed: {
        currentUserAvatar(){
            let userId = this.$store.state.app.endUserInfo.id;
            return appConfigs.apiDomain.fileManagement+'readFile/user_avatar_' + userId;
        },
        sapp() {
            return this.$store.state.app;
        },
        userMenuItems(){
            debugger
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
        // thêm nhóm cho Menu
        addGroupInMenu(){
             this.menu = this.userMenuItems;
             debugger
             let menuItem = [];
             let allMenuItem = [];
            debugger
             this.menu =  _.groupBy(this.menu, 'group');
            Object.keys(this.menu).forEach(type => {
                let name = type;
                menuItem.push({titleGroup: name });
                menuItem.push(...this.menu[type]);
            })
            debugger

            this.menu = menuItem;
            debugger
        },
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
                this.$moment.locale(util.str.mapLanguageToMoment[locale])
                util.setSavedLocale(locale);
                userApi.setUserLocale(locale);
                this.$evtBus.$emit("change-user-locale", locale);
            }
        },
        goToHome() {
            this.$goToPage("/", "Trang chủ");
        },
        invertSidebarShow() {
            this.showChevIcon =!this.showChevIcon;
            this.$store.commit(
                "app/changeCollapseSidebar",
                !this.sapp.collapseSideBar
            );
        },
        gotoPage(item){
            if(item.action){
                 this.$evtBus.$emit('symper-app-call-action-handler', item.action, this, {});
            }else{
                this.$goToPage(item.link, item.title, false, false);
            }
            this.$set(this, 'indexActive', item.title)
            
        }
    },
    data() {
        return {
            menu:[],
            showChevIcon:false,
            loadRoleTypes: [],
            showDelegatedUser: false,
            showSwitchRole: false,
            delegatedUser: {},
            searchUserDeligate: '',
            listUserForDelegate: [],
            menuItemsHeight: '200px',
            indexActive: "sdsd",
        };
    }
};
</script>
<style scoped>
.groupBy:hover{
    background-color:white
}
.fm{
    font-weight:400!important;
    
}
.icon-group{
    font-size:14px; 
    color:rgb(0,0,0,0.8); 
    margin-top:-8px;
    margin-left:4px;
}

.menu-group ::v-deep .v-list-group__header {
    height: 32px!important;
}
 .menu-group-active{
    background-color:#f7f7f7; 
 }  
.v-navigation-drawer  >>> .ps__rail-x{    
    display:none
}
.v-navigation-drawer  >>> .v-list-group .v-icon:hover{    
    background: unset;
}
.v-navigation-drawer  >>> .v-list-group button:focus{    
    background: unset !important;
}
.v-navigation-drawer  >>> .v-icon::after{    
    color:unset;
    background-color:unset;
}
.v-navigation-drawer  >>> .v-icon:hover{    
    background-color:unset !important;
}
.v-navigation-drawer  >>> .v-list-group--active .v-list-group__header .v-list-group__header__prepend-icon .v-icon {    
    color:rgb(0,0,0,0.8); 
}
.v-navigation-drawer  >>> .v-list{    
    overflow-x:hidden;
}
.v-navigation-drawer  >>> .collapse-action-icon .v-icon:hover,
.v-navigation-drawer  >>> .collapse-action-icon .v-icon:focus
{    
      background-color:unset !important;
}
.title-group{
    margin-left:-50px;
    color:rgb(0,0,0,0.6); 
    height:15px!important; 
    margin-bottom: auto;
    margin-top:auto;
}
.title-group:hover{
    background:unset
}
.title-group:focus{
    background:unset
}
</style>
<style>
.v-menu__content::-webkit-scrollbar {
        width: 6px;
        background-color: black;
}
.v-menu__content::-webkit-scrollbar-thumb {
	border-radius: 50px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: grey;
}
 .v-menu__content::-webkit-scrollbar-track {
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 50px;
	background-color: #F5F5F5;
}
</style>