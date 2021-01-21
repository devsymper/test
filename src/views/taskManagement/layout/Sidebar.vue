<template>
    <div :style="{'position':isExpand ? 'relative' :'absolute'}" class="task-manager-sidebar" @mouseenter="drawer = true" @mouseleave="drawer = false">
        <v-btn
            :class="{'collapse-sidebar-icon':true,'btn-collapsing':isExpand}"
            icon
            @click="expandSidebar"
            >
            <v-icon v-if="!isExpand && !drawer">mdi-menu</v-icon>
            <v-icon v-else-if="isExpand">mdi-chevron-double-left</v-icon>
            <v-icon v-else-if="drawer">mdi-chevron-double-right</v-icon>
            
        </v-btn>
        <transition name="slide">
            <div v-show="checkShowSideBar()" :class="{'wrapper-sidebar':true,'wrapper-sidebar-mini':!isExpand,'wrapper-sidebar-full':isExpand}">
                <VuePerfectScrollbar class="sidebar-content">
                    <v-list dense>
                        <v-list-item class="v-list-item-project-info">
                            <div class="project-info" @click="showAllProject">
                                <v-icon v-if="!!sCurrentProject.icon && sCurrentProject.icon.indexOf('mdi-') > -1" style="font-size:25px" class="pt-0">{{sCurrentProject.icon}}</v-icon>
                                <img class="img-fluid" style="object-fit: fill;border-radius:3px" v-else-if="!!sCurrentProject.icon && sCurrentProject.icon.indexOf('mdi-') < 0" :src="sCurrentProject.icon" width="23" height="23">
                                <div class="project-name" v-if="!mini">
                                    <div class="mt-2">{{sCurrentProject.name}}</div>
                                </div>
                                <!-- <v-icon style="height:24px;" v-if="!mini">mdi-chevron-down</v-icon> -->
                            </div>
                        </v-list-item>
                        <transition v-for="(item,key) in menu"
                            :key="key">
                            <v-list-item
                                link
                                v-if="!item.isWorkSpace"
                                @click="onClickItem(item, $event)"
                                :class="{
                                    'item-active': item.active
                                }"
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
                            <div v-if="item.isWorkSpace && item.items.length > 0" class="sidebar-group-item" :style="{'padding' : (mini) ? '' : '1px 16px'}">
                                <transition name="fade">
                                    <div class="title-workspace" v-if="!mini">{{ item.title }}</div>
                                </transition>
                                <v-list-item
                                    link
                                    v-for="(menuItem,index) in item.items"
                                    :key="index"
                                    @click="onClickItem(menuItem, $event)"
                                    :class="{'select-item':menuItem.type == 'select','task-sidebar-item':true,'item-active': menuItem.active}"
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
            </div>
        </transition>
        
        <SelectBoard ref="SelectBoard" @selected-item-board="afterSelectBoard"/>
        <ProjectPopup ref="projectPopupView"/>
    </div>
</template>
<script>
import _ from 'lodash';
import { util } from "@/plugins/util.js";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import ProjectPopup from '@/components/taskManagement/project/ProjectPopup';
import SelectBoard from '@/components/taskManagement/board/SelectBoard';
import { checkPermission } from "@/views/taskManagement/common/taskManagerCommon";
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

        this.$evtBus.$on('selected-item-board', (board) =>{
            this.menu.workspace1.items[0].title = board.name;
            this.menu.workspace1.items[0].subTitle = "";
        });
        
        
    },
    components: {
        VuePerfectScrollbar,
        ProjectPopup,
        SelectBoard
    },
    computed: {
        sCurrentProject(){
            return this.$store.state.taskManagement.currentProject
        },
        sTaskManagement(){
            return this.$store.state.taskManagement
        },
        userMenuItems(){
            return this.$store.getters['taskManagement/userMenuItems'];
        },
        listBoardInProject(){
            return this.$store.state.taskManagement.listBoardInProject;
        }
    },
    watch:{
        mini(vl){
            if(!vl){
                $('.sb-menu-icon').addClass("is-active");
            }
            else{
                $('.sb-menu-icon').removeClass("is-active");
            }
        },
        '$route' (to, old) {
            if(to.meta.group){
                this.checkShowListMenu();
            }         
        },
        drawer(vl){
            if(!vl){
                this.$refs.projectPopupView.hide();
                this.$refs.SelectBoard.hide();
            }
        },
        // listBoardInProject(vl){
        //     if(vl.length > 0){
        //         this.menu.workspace1.items[0].title = vl[0].name;
        //         this.menu.workspace1.items[0].subTitle = "";
        //     }
        // },
        sCurrentProject(newVl){
            if (Object.keys(newVl).length > 0) {
                this.checkShowListMenu();
            }
        }
    },
    mounted(){
        this.checkShowListMenu()
    },
    
    methods: {
        checkShowListMenu(){
            this.menu = [];
            let currentMenu = this.userMenuItems[this.$route.meta.group];
            let currentProject = this.$store.state.taskManagement.currentProject;
            if (currentProject.userLeader == this.$store.state.app.endUserInfo.id) {
                this.menu = currentMenu;
            }
            else{
                if (currentMenu.workspace1) {
                    let listItemInWorkspace1 = currentMenu.workspace1.items;
                    // check role show list component
                    if (!checkPermission('task_manager_components','list')) {
                        let item = listItemInWorkspace1.find(data => data.name === 'component')
                        var index = listItemInWorkspace1.indexOf(item);
                        if (index > -1) {
                            listItemInWorkspace1.splice(index, 1);
                        }
                    }
                    // check role show list version
                    if (!checkPermission('task_manager_version','list')) {
                        let item = listItemInWorkspace1.find(data => data.name === 'version')
                        var index = listItemInWorkspace1.indexOf(item);
                        if (index > -1) {
                            listItemInWorkspace1.splice(index, 1);
                        }
                    }
                }
                //check trong workspace 2
                if (currentMenu.workspace2) {
                    let listItemInWorkspace2 = currentMenu.workspace2.items;
                        // check role show báo cáo
                    if (!checkPermission('task_manager_report_config','view')) {
                        let item = listItemInWorkspace2.find(data => data.name === 'report')
                        var index = listItemInWorkspace2.indexOf(item);
                        if (index > -1) {
                            listItemInWorkspace2.splice(index, 1);
                        }
                    }
                }
                //check trong item 3
                if (currentMenu.item3) {
                    let listItemInItem3 = currentMenu.item3.items;
                        // check role project setting
                    if (!checkPermission('task_manager_project_setting','config')) {
                        let item = listItemInItem3.find(data => data.name === 'projectSetting')
                        var index = listItemInItem3.indexOf(item);
                        if (index > -1) {
                            listItemInItem3.splice(index, 1);
                        }
                    }
                }
                //check trong setting project
                if (currentMenu.workspaceProject) {
                    let listItemInWorkspaceProject = currentMenu.workspaceProject.items;
                        // check role show list access controls
                    if (!checkPermission('task_manager_access','list')) {
                        let item = listItemInWorkspaceProject.find(data => data.name === "access")
                        var index = listItemInWorkspaceProject.indexOf(item);
                        if (index > -1) {
                            listItemInWorkspaceProject.splice(index, 1);
                        }
                    }

                    // check role show list issue type
                    if (!checkPermission('task_manager_issue_type','list')) {
                        let item = listItemInWorkspaceProject.find(data => data.name === "issueType")
                        var index = listItemInWorkspaceProject.indexOf(item);
                        if (index > -1) {
                            listItemInWorkspaceProject.splice(index, 1);
                        }
                    }

                    // check role show list workflow
                    if (!checkPermission('task_manager_task_life_cycle','list')) {
                        let item = listItemInWorkspaceProject.find(data => data.name === "workflow")
                        var index = listItemInWorkspaceProject.indexOf(item);
                        if (index > -1) {
                            listItemInWorkspaceProject.splice(index, 1);
                        }
                    }

                    // check role show list issue link
                    if (!checkPermission('task_manager_issue_link','list')) {
                        let item = listItemInWorkspaceProject.find(data => data.name === "issueLink")
                        var index = listItemInWorkspaceProject.indexOf(item);
                        if (index > -1) {
                            listItemInWorkspaceProject.splice(index, 1);
                        }
                    }
                    // check role show list priority
                    if (!checkPermission('task_manager_priority','list')) {
                        let item = listItemInWorkspaceProject.find(data => data.name === "priority")
                        var index = listItemInWorkspaceProject.indexOf(item);
                        if (index > -1) {
                            listItemInWorkspaceProject.splice(index, 1);
                        }
                    }
                }
                this.menu = currentMenu;
                console.log(this.menu,'this.menu');
            }
            
        },
        afterSelectBoard(board){
            this.menu.workspace1.items[0].title = board.name
        },
        checkShowSideBar(){
            if(!this.isExpand){
                return this.drawer
            }
            return true
        },
        expandSidebar(){
            this.isExpand = !this.isExpand;
            this.$emit('after-toggle-sidebar',!this.isExpand)
        },
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
            isExpand:false,
            menu:null,
            showChevIcon:false,
            menuItemsHeight: '200px',
            selectingItem: {},
            selectingChildItem: {},
            isShowSidebar:true,
            drawer: false,
            mini: false,
            oldSelected:null,
            originMenu:null,
        };
    }
};
</script>
<style scoped>

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
    height: 40px;
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
    margin: 5px 10px 5px 0;
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
    top: 40px;
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
.collapse-sidebar-icon{
    position: absolute;
    top:3px;
    transition: all 200ms cubic-bezier(.42,0,.58,1);
}
.btn-collapsing{
    right: 0px;
    top:3px;
    z-index: 1;
    transition: all 250ms ease-in-out;
}
.btn-collapsing:hover{
    background: beige;
}
.wrapper-sidebar{
    width: 210px !important;
    transition: all 200ms cubic-bezier(.42,0,.58,1);
}
.wrapper-sidebar-mini{
    background: white;
    z-index: 1;
    border-right: var(--symper-border);
    border-top: var(--symper-border);
    border-bottom: var(--symper-border);
    box-shadow: var(--symper-box-shadow);
    height: calc(100% - 100px) !important;
    margin-top: 38px;
}
.wrapper-sidebar-full{
    background: white;
    border-right: var(--symper-border);
    height: 100%;
}
.slide-leave-active,
.slide-enter-active {
  transition: 0.3s cubic-bezier(.42,0,.58,1);
}
.slide-enter {
  transform: translate(-100%, 0);
  opacity: 1;
}
.slide-enter-to {
    transform: translate(0,0px);
}
.slide-leave-to {
    transform: translate(-100%, 0);
    opacity: 0;
}
.task-manager-sidebar{
    height: calc(100%);
    left: 0;
    font-size:13px;
    z-index: 1;
}
.task-sidebar-item{
    padding: 0 !important;
}
.item-active >>> .v-list-item__icon .mdi{
    color: var(--symper-color) !important;
}
.item-active >>> .v-list-item__title{
    color: var(--symper-color) !important;
}
</style>

