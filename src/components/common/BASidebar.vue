<template>
    <v-navigation-drawer 
        v-resize="reCalcSidebarHeight" 
        mobile-breakpoint="0" 
        :mini-variant="sapp.collapseSideBar"
        v-if="true"
        :v-model="true" app>
        <v-list dense nav class="py-0 pr-0 list-item">
            <v-list-item 
                    :class="{ 
                    'px-0': sapp.collapseSideBar,
                    'ma-0 pt-2': true }" 
                v-show="!sapp.collapseSideBar">
                <img
                    @click="goToHome()"
                    height="30px"
                    :src="require('./../../assets/image/symper-full-logo.png')"/>
            </v-list-item>
            <v-list-item 
                class=" pt-2 px-0 ma-0" v-show="sapp.collapseSideBar">
                <img
                    @click="goToHome()"
                    height="30px"
                    :src="require('./../../assets/image/symper-short-logo.png')"/>
            </v-list-item>
            <v-list-item
                    class="list-item" 
                    two-line 
                    style="margin-bottom:-15px!important"
                    :class="{ 
                    'px-0': sapp.collapseSideBar,
                    'ma-0': true}">
                <v-list-item-avatar @click="invertSidebarShow()">
                    <SymperAvatar :userId="sapp.endUserInfo.id"/>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class=" mb-2">
                        <span 
                            class="mt-1 position-relative cursor-pointer" 
                            style="top: 0px; position: relative;" 
                            @click="$emit('show-user-detail')"
                        >
                            {{ sapp.baInfo.name ? sapp.baInfo.name : sapp.endUserInfo.displayName }}
                            <v-icon  @click="$emit('show-user-detail')" style="font-size:14px" class="ml-2"> mdi-information-outline</v-icon>
                        </span>
                    </v-list-item-title>
                    <div class="w-100 mb-1 ">
                        <div class="w-100 d-flex" v-if="sapp.baInfo.name"  style="color: rgba(0, 0, 0, 0.54)">
                            <v-tooltip top z-index="200">
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
                                    <v-tooltip bottom z-index="200">
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
                            <v-tooltip top z-index="200">
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
                                     <v-tooltip top z-index="200">
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
                        :class="{'menu-group': true , 'menu-group-active': item.active == true }"
                        :symper-action="$bindAction(item.action?item.action:'')"
                        @click="handleItemClick(item)">
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
                            :class="{'menu-group-active': subMenu.active == true }"
                            @click="gotoPage(subMenu,true,item)">
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
                        :class="{'menu-group': true, 'menu-group-active': item.active == true  }"
                        dense
                        v-for="item in menu"
                        :key="item.title" 
                        :style="{'border-bottom': isBorderTop(item.titleGroup)? '1px solid lightgrey':'','height': isBorderTop(item.titleGroup)?'10px':''}"
                        link
                        no-action
                        :symper-action="$bindAction(item.action?item.action:'')"
                        @click="handleItemClick(item)">
                       <template v-slot:prependIcon>
                           <v-menu 
                                right offset-y
                                nudge-right='40'
                                z-index="200"
                                nudge-top='30'>
                                <template v-slot:activator="{ on: menu }">
                                    <v-tooltip z-index="200" bottom>
                                        <template v-slot:activator="{ on: tooltip }">
                                            <v-icon class="collapse icon-group" @click="gotoPage(item)" v-on="{ ...tooltip, ...menu }">
                                            {{ item.icon }}
                                            </v-icon>
                                        </template>
                                    <span class="fs-13">{{item.title ? $t('common.sidebar.'+item.title) : '' }}</span>
                                    </v-tooltip>
                                </template>
                                <v-list dense v-if="item.children">
                                    <v-list-item 
                                        dense
                                        style="height:32px!important"
                                        v-for="(subMenuHover, objectType) in item.children"
                                        :key="objectType"
                                        @click="gotoPage(subMenuHover,true, item)">
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
                    <v-menu top nudge-top='40' nudge-left='60'>
                    <template v-slot:activator="{ on: menu }">
                        <v-btn style="position: absolute;right: 10px;" icon tile v-on="menu">
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
import _groupBy from 'lodash/groupBy';
import { util } from "./../../plugins/util.js";
import { userApi } from "./../../api/user.js";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import UserRoleSelector from "@/components/app/UserRoleSelector.vue";
import { appConfigs } from '../../configs.js';
import SymperAvatar from "@/components/common/SymperAvatar";
import { orgchartApi } from '../../api/orgchart.js';

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
        this.$store.dispatch("app/getAllSymperRoles");
        this.$store.dispatch('app/getAllRoles', this.$store.state.app.endUserInfo.id);
    },
    components: {
        VuePerfectScrollbar,
        UserRoleSelector,
        SymperAvatar,
    },
    computed: {
        showUserInfo(){
            return this.$store.state.user.showUserInfo;
        },
        currentUserAvatar(){
            let userId = this.$store.state.app.endUserInfo.id;
            return appConfigs.apiDomain.fileManagement+'readFile/user_avatar_' + userId;
        },
        sapp() {
            return this.$store.state.app;
        },
        userMenuItems(){
            return this.$store.getters['app/userMenuItems'];
        }
    },
    watch: {
        "sapp.collapseSideBar": function(newVl){
            if(newVl == true){
                this.$set(this.selectingItem, "active", true)
            }else{
                this.$set(this.selectingItem, "active", false)
                this.$set(this.selectingChildItem, "active", true)
                
            }
        }
    },
    mounted(){
        this.reCalcSidebarHeight();
    },
    methods: {
        isBorderTop(titleGroup){
            if(titleGroup=='Administrator'||titleGroup=='Applications'||titleGroup=='Setting'){
                return true
            }else{
                return false
            }
            
		},
		handlerItemClick(item){
			if(item.children){
				this.gotoPage(item)
			}
		},
        // thêm nhóm cho Menu
        showChangeInfoUser(){
            if(this.sapp.baInfo.id==0){
                this.$store.commit('user/setShowUser', !this.showUserInfo);
                this.$router.push("/");
            }
        },
        addGroupInMenu(){
             this.menu = this.userMenuItems;
             let menuItem = [];
             let allMenuItem = [];
             this.menu =  _groupBy(this.menu, 'group');
            Object.keys(this.menu).forEach(type => {
                let name = type;
                menuItem.push({titleGroup: name });
                menuItem.push(...this.menu[type]);
            })
            this.menu = menuItem;
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
            this.menuItemsHeight = (util.getComponentSize(this).h - 160)+'px';
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
		handleItemClick(item){
			if(!item.children){
				this.gotoPage(item)
			}
		},
        invertSidebarShow() {
            this.showChevIcon =!this.showChevIcon;
            this.$store.commit(
                "app/changeCollapseSidebar",
                !this.sapp.collapseSideBar
            );
        },
        gotoPage(item, subItem = false , parent){
            console.log(item,'menu');
            if(item.title == 'viewOrgchart'){
                this.viewOrgchartAction()
                this.setActive(item,subItem, parent)
            }
            if(item.action){
                 this.$evtBus.$emit('symper-app-call-action-handler', item.action, this, {});
            }else{
                let path = 'common.sidebar.'+item.title;
                let title = this.$t(path);
                this.$goToPage(item.link, title, false, false);
            }
            this.setActive(item,subItem, parent)
            
        },
        viewOrgchartAction(){
            orgchartApi.getIdOrgchartDefault().then(res=>{
                let id = res.data.id
                this.$goToPage(
                    `/orgchart/${id}/view`,
                    this.$t("common.detail") + "  " + res.data.name,
                    false,
                    false
                );
                
            }).catch(err=>{})
        },
        setActive(item, subItem, parent){
            let self = this
             this.menu.forEach(function(e){
                if(e.hasOwnProperty('active')){
                    e.active = false
                }
                if(e.hasOwnProperty('children')){
                    for(let child in e.children){
                       self.$set( e.children[child], "active", false)
                    }
                }
            })
            if(self.sapp.collapseSideBar == true){
                this.selectingChildItem = item
                if(subItem == true){
                    this.$set(parent, 'active', true)
                }else{
                    this.$set(item, 'active', true)
                }
            }else{
                this.selectingChildItem = {}
                this.$set(item, 'active', true)
            }
            if(subItem == true){   
                this.selectingItem = parent
            }else{
                this.selectingItem = {}
            }
           
        },
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
            selectingItem: {},
            selectingChildItem: {},
            showMyInfo: false
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
    font-size:17px; 
    color:rgb(0,0,0,0.8); 
    margin-top:-10px;
    margin-left:4px;
}

.collapse.icon-group{
    padding: 10px;
    margin-left: -7px !important;
}

.menu-group ::v-deep .v-list-group__header {
    height: 32px!important;
}
 .menu-group-active{
    background-color:#eaeaea;
    border-radius: 4px; 
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
    pointer-events:none
}
.menu-not-interact{
    pointer-events:none;
}
.menu-not-interact >>> .v-list-group__header{ 
    cursor: unset;
    pointer-events:none;
    
}
.menu-not-interact >>> .v-list-group__header:hover::before{
    background: white !important;
}
.menu-not-interact >>> .v-list-group__header::before{
    transition: unset;
}
.menu-not-interact >>> .v-list-group__header:hover::before{
    background: white !important;
}
.menu-not-interact >>> .v-list-group__header:focus::before{
    background: white !important;
}
.menu-group >>> .v-list-item:first-child{
    margin-bottom: 0 !important;
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
