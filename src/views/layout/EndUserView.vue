<template>
    <v-app id="symper-platform-app">
        <ba-sidebar @show-user-detail="showMyInfo = true" />
        <v-main style="height:100vh;">
            <v-container fluid fill-height class="pa-0">
                <div class=" app-header-bg-color" style="border-bottom:1px solid #e6e5e5; width: calc(100% - 5px)">
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
                                
                                <i class="mdi mdi-close float-right close-tab-btn" @click.stop="handleCloseTab(idx)"></i>
                            </v-tab>
                        </v-tabs>
                    </div>
                    <div
                        class="float-right app-header-bg-color mr-2 d-flex justify-end "
                        style="widh:500px;height:40px; line-height:40px;"
                    >
                     <!-- search -->
                        <div v-show="showSearchInput" class="d-flex justify-center align-items-center">
                            <transition name="slide-fade">
                                <SearchInput v-show="showSearchInput" class="mr-2" style="width:330px"/>
                            </transition>
                        </div>
                        <v-menu
                            v-model="isShowDialog"
                            :close-on-content-click="false"
                            :max-width="700"
                            :max-height="700"
       				   	    :nudge-width="570"
                            offset-y
                            style="z-index:1000; margin-top: 2px"
                            >
                            <template v-slot:activator="{ on }">
                                <v-btn icon v-on="on">
                                    <v-icon class="mdi-18px">mdi-apps</v-icon>
                                </v-btn>
                            </template>
                            <EndUserPopup style="z-index:1000 !important"   />
                        </v-menu>
                        <v-btn icon @click="showSearchInput = !showSearchInput" style="margin-top: 2px">
                            <v-icon class="mdi-18px">mdi-magnify</v-icon>
                        </v-btn>
                        <v-menu  v-model="isShowDialogNotification"
                            z-index="161"
                            :close-on-content-click="false"
                            :max-width="385"
                            :min-width="385"
                            :max-height="700"
                            offset-y>
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" icon v-if="unreadNotification > 0" style="margin-top: 2px">
                                    <v-badge
                                        class="sym-small-size"
                                        
                                        :content="unreadNotification"
                                        :value="unreadNotification"
                                        color="red"
                                        overlap
                                    >
                                        <v-icon class="mdi-18px">mdi-bell-outline</v-icon>
                                    </v-badge>
                                </v-btn>
                                <v-btn v-on="on" icon v-else>
                                    <v-icon class="mdi-18px">mdi-bell-outline</v-icon>
                                </v-btn>
                            </template>
                            <list-notification></list-notification>
                        </v-menu>
                    </div>
                </div>
                <v-layout style="height:calc(100% - 41px);overflow:hidden;"  justify-center>
                    <slot>
					</slot>
                </v-layout>
            </v-container>
        </v-main>
        <v-navigation-drawer
            v-bind:class="[isExpand==true?'width-1200':'width-400']"
            right
            v-model="showMyInfo"
            v-show="showMyInfo"
            absolute
            style="z-index:999!important"
            temporary>
            <DetailUser 
                :userInfo="sapp.endUserInfo"
                @expand-panel="isExpand=true"
                :close="isExpand"
                @make-small-panel="isExpand=false"
                @closePanel="showMyInfo=false"
            />
        </v-navigation-drawer>
    </v-app>
</template>

<script>
import Api from "../../api/api.js";
import { appConfigs } from '../../configs';
import BASidebar from "@/components/common/BASidebar.vue";
import listApp from "@/components/common/listApp";
import EndUserPopup from './../apps/EndUserPopup.vue';
import NotificationBar from "@/components/notification/NotificationBar.vue";
import Search from "@/components/search/Search";
import DetailUser from "@/components/common/user/DetailUser.vue";

export default {
    watch:{
        showMyInfo(){
            if(!this.showMyInfo){
                this.isExpand = false;
            }
        }

    },
    methods: {
        handleCloseTab(idx){
            this.$evtBus.$emit("before-close-app-tab", idx);
            this.closeTab(idx);
        },
        /**
         * Xử lý các tab
         */
        handleChangeTab(index) {
            if(index !== undefined){
                let urlKey = Object.keys(this.tabUrlItems)[index];
                let urlInfo = this.tabUrlItems[urlKey];
                if(urlInfo.routeName == this.$route.name){
                    this.$router.push({
                        name: 'symperHiddenRedirectComponent',
                        params: {
                            urlInfo: urlInfo,
                            pageInstanceKey: Date.now()
                        }
                    });
                }else{
                    this.$router.push({
                        name: urlInfo.routeName,
                        params: urlInfo.routeParams
                    });
                }
            }
		},
		closeCurrentTab(){
            this.closeTab(this.$store.state.app.currentTabIndex);
        },

        closeTab(idx){            
            let urlToTabArr = Object.keys(this.$store.state.app.urlToTabTitleMap);
            let urlKey = urlToTabArr[idx];
            let urlInfo = this.tabUrlItems[urlKey];

            this.$store.commit("app/removeTab", urlKey);
            if(urlInfo){
                // this.$evtBus.$emit('symper-close-app-tab', {
                //     pageInstanceKey: urlInfo.pageInstanceKey
                // });
            }

            setTimeout((self) => {
                let arr = Object.keys(self.$store.state.app.urlToTabTitleMap);
                if(arr.length == 0){
                    self.$goToPage("/", "Trang chủ");
                }else{
                    let currentTabIndex = self.$store.state.app.currentTabIndex;
                    if(currentTabIndex == idx){
                        self.handleChangeTab(currentTabIndex);
                    }else if(idx < currentTabIndex ){
                        self.$store.state.app.currentTabIndex = currentTabIndex - 1;
                        self.handleChangeTab(currentTabIndex - 1);
                    }
                }
            }, 100, this);
        },
        updateCountUnreadNotification(){
            let req = new Api(appConfigs.apiDomain.nofitication);
            req.get("/notifications/count-unread")
            .then(res => {
                if (res.status == 200) {
                    this.$store.state.app.unreadNotification = res.data;
                }
            });
		},
		logItem(data){
			console.log(data);
		}
        
    },
    components: {
        "ba-sidebar": BASidebar,
        "list-app": listApp,
        "list-notification": NotificationBar,
        EndUserPopup,
        SearchInput: Search,
        DetailUser
    },
    created() {
        let self = this;
        this.$evtBus.$on("app-receive-remote-msg", data => {
            this.$store.state.app.unreadNotification += 1;
            this.$store.state.app.needReloadNotification = true;
        });
        this.updateCountUnreadNotification();
        
        this.$evtBus.$on("auto-active-tab", tabIndex => {
            self.$store.state.app.currentTabIndex = tabIndex;
            self.handleChangeTab(tabIndex);
        });
        
        this.$evtBus.$on("close-current-app-tab", () => {
            self.closeCurrentTab();
        });

        this.$evtBus.$on("close-app-tab", (idx) => {
            self.closeTab(idx);
        });
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
        tabUrlItems() {
            return Object.values(this.$store.state.app.urlToTabTitleMap);
        }
    },
    data: function() {
        return {
            showConfigNotification:false,
            isExpand:false,
            showSearchInput: false,
            isShowDialog: false,
            isShowDialogNotification: false,
            showMyInfo: false
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
.width-1200{
    width:1200px!important

}
.width-400{
    width:400px!important
}
</style>
