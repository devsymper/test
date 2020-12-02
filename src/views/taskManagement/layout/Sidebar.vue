<template>
    <div style="position:relative;font-size:13px;" class="h-100">
        <v-navigation-drawer
        class="h-100"
        v-model="drawer"
        :mini-variant.sync="mini"
        permanent
        >
            <!-- <div class="sidebar-header">
                <img v-if="!mini" height="25px" src="/img/symper-full-logo.png" />
                <img v-else height="25px" src="/img/symper-short-logo.png" />
            </div> -->
            <VuePerfectScrollbar class="sidebar-content">
                <v-list dense>
                    <v-list-item class="v-list-item-project-info">
                        <div class="project-info" @click="showAllProject">
                            <img height="25px" src="https://symperv01.atlassian.net/secure/projectavatar?pid=10035&avatarId=10416&size=xxlarge" />
                            <div class="project-name" v-if="!mini">
                                <div>hoang tesst</div>
                                <div>đây là 1 project</div>
                            </div>
                            <v-icon style="height:24px;" v-if="!mini">mdi-chevron-down</v-icon>
                        </div>
                    </v-list-item>
                    <transition v-for="(item,key) in menu"
                        :key="key">
                        <v-list-item
                            link
                            v-if="!item.isWorkSpace"
                            @click="onClickItem(item, $event)"
                            >
                            <v-list-item-icon>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                                <v-list-item-subtitle v-if="item.type == 'select'">{{item.subTitle}} </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-icon v-if="item.type == 'select'">
                                <v-icon>mdi-chevron-down</v-icon>
                            </v-list-item-icon>
                            
                        </v-list-item>
                        <div v-if="item.isWorkSpace" class="sidebar-group-item" :style="{'padding' : (mini) ? '' : '1px 16px'}">
                            <transition name="fade">
                                <div class="title-workspace" v-if="!mini">{{ item.title }}</div>
                            </transition>
                            <v-list-item
                                link
                                v-for="(menuItem,index) in item.items"
                                :key="index"
                                @click="onClickItem(menuItem, $event)"
                                :class="{'select-item':menuItem.type == 'select0'}"
                                >
                                <v-list-item-icon>
                                    <v-icon>{{ menuItem.icon }}</v-icon>
                                </v-list-item-icon>

                                <v-list-item-content>
                                    <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
                                    <v-list-item-subtitle v-if="menuItem.type == 'select'">{{menuItem.subTitle}} </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-icon v-if="menuItem.type == 'select'">
                                    <v-icon>mdi-chevron-down</v-icon>
                                </v-list-item-icon>
                                
                            </v-list-item>
                        </div>
                    </transition>
                </v-list>
            </VuePerfectScrollbar>
            <div class="sidebar-bottom">
                <v-btn
                    icon
                    @click.stop="toggleSidebar"
                    >
                    <div class="hamburger sb-menu-icon">
                        <span class="line"></span>
                        <span class="line"></span>
                        <span class="line"></span>
                    </div>
                </v-btn>
            </div>
        </v-navigation-drawer>
        <SelectBoard ref="SelectBoard"/>
        <ProjectPopup ref="projectPopupView" v-if="!mini"/>
    </div>
</template>
<script>
import _ from 'lodash';
import { util } from "@/plugins/util.js";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { appConfigs } from '../../../configs.js';
import ProjectPopup from '@/components/taskManagement/project/ProjectPopup';
import SelectBoard from '@/components/taskManagement/board/SelectBoard';
export default {
    created(){
        this.$evtBus.$on("symper-app-wrapper-clicked", evt => {
            if (this.$refs.projectPopupView && 
                ($(evt.target).closest(".project-info").length == 0 &&
                $(evt.target).closest(".popup-select-project").length == 0)
            ) {
                this.$refs.projectPopupView.hide()
            }
            if (this.$refs.SelectBoard && 
                ($(evt.target).closest(".v-list-item").length == 0 &&
                $(evt.target).closest(".card-add-board").length == 0)
            ) {
                this.$refs.SelectBoard.hide()
            }
        });
        
        
    },
    components: {
        VuePerfectScrollbar,
        ProjectPopup,
        SelectBoard
    },
    computed: {
        
    },
    watch:{
        mini(vl){
            if(!vl){
                $('.sb-menu-icon').addClass("is-active");
            }
            else{
                $('.sb-menu-icon').removeClass("is-active");
            }
            this.$emit('after-toggle-sidebar',vl)
        },
        '$route' (to, old) {
            if(to.meta.group){
                this.menu = appConfigs.sideBar[to.meta.group];
            }         
        },
    },
    mounted(){
        this.menu = appConfigs.sideBar[this.$route.meta.group];
    },
    
    methods: {
        showAllProject(){
            this.$refs.projectPopupView.show();
        },
        toggleSidebar(){
            this.mini = !this.mini
        },
        onClickItem(item, event){
            if(item.url){
                let projectId= this.$route.params.id;
                this.gotoLink(item.url,{id:projectId});
            }
            else{
                this.$refs[item.component].show(event);
            }
        },
        gotoLink(link, params = {}){
            let listParams = link.match(/:\w+/g);
            if(listParams && listParams.length > 0){
                for (let index = 0; index < listParams.length; index++) {
                    let param = listParams[index];
                    param = param.replace(":",'').trim();
                    if(Object.keys(params).includes(param)){
                        link = link.replace(listParams[index],params[param])
                    }
                    else{
                        return;
                    }
                }
            }
            if(this.$route.path != link){
                this.$router.push(link);
            }
        },
      
    },
    data() {
        return {
            menu:null,
            showChevIcon:false,
            menuItemsHeight: '200px',
            selectingItem: {},
            selectingChildItem: {},
            isShowSidebar:true,
            drawer: true,
            mini: true,
        };
    }
};
</script>
<style scoped>
.sb-menu-icon{
    margin-left: auto;
}
.sb-menu-icon .line{
  width: 18px;
  height: 2px;
  background-color: black;
  display: block;
  margin: 4px auto;
  -webkit-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

.sb-menu-icon:hover{
  cursor: pointer;
}


.sb-menu-icon.is-active .line:nth-child(1),
.sb-menu-icon.is-active .line:nth-child(3){
    width: 11px;
    margin: -3px auto;
}

.sb-menu-icon.is-active .line:nth-child(1){
  -webkit-transform: translateX(-7px) rotate(-45deg);
  -ms-transform: translateX(-7px) rotate(-45deg);
  -o-transform: translateX(-7px) rotate(-45deg);
  transform: translateX(-7px) rotate(-45deg);
}

.sb-menu-icon.is-active .line:nth-child(3){
  -webkit-transform: translateX(-7px) rotate(45deg);
  -ms-transform: translateX(-7px) rotate(45deg);
  -o-transform: translateX(-7px) rotate(45deg);
  transform: translateX(-7px) rotate(45deg);
}
.sidebar-header{
    height: 44px;
    padding: 4px;
}
.sidebar-header img{
    margin: 5px 7px;
}
.sidebar-bottom{
    display: flex;
}
.sidebar-bottom button{
    margin-left: auto;
    margin-right: 12px;
    padding: 7px;
}
.sidebar-content{
    height: calc(100% - 40px);
}
.sidebar-content .v-list-item-project-info{
    padding: 0 !important;
}
.project-info{
    height: 45px;
    width: 100%;
    display: flex;
    transition: all ease-in-out 250ms;
    cursor: pointer;
    padding: 0 16px;
}
.project-info:hover{
        background: var(--symper-background-hover);
    }
.project-info img{
    margin: 8px 18px 8px 0;
    height: 19px;
}
.project-info .project-name{
    width: calc(100% - 45px);
}
.project-info .project-name > div{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 13px;
}
.project-info .project-name > div:first-child{
    font-weight: 500;
}
.sidebar-content >>> .v-list-item__action:first-child, 
.sidebar-content >>> .v-list-item__icon:first-child{
    margin-right: 18px !important;
}
::v-deep .popup-select-project{
    position: absolute;
    top: 90px;
    left: 15px;
}
.sidebar-content >>> .ps__rail-x{
    display: none !important;
}
.sidebar-item{
    align-items: center;
    display: flex;
    flex: 1 1 100%;
    letter-spacing: normal;
    outline: none;
    position: relative;
    text-decoration: none;
}
.sidebar-content ::v-deep .v-icon{
    font-size: 18px;
}
.title-workspace{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: rgb(0,0,0,0.6);
}
</style>

