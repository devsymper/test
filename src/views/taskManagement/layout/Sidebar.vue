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
                                    <div class="mt-3 ml-2">{{sCurrentProject.name}}</div>
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
                            <div v-if="item.isWorkSpace" class="sidebar-group-item" :style="{'padding' : (mini) ? '' : '1px 16px'}">
                                <transition name="fade">
                                    <div class="title-workspace" v-if="!mini">{{ item.title }}</div>
                                </transition>
                                <v-list-item
                                    link
                                    v-for="(menuItem,key1) in item.items"
                                    :key="key1"
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
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import ProjectPopup from '@/components/taskManagement/project/ProjectPopup';
import SelectBoard from '@/components/taskManagement/board/SelectBoard';
import { checkPermission } from "@/views/taskManagement/common/taskManagerCommon";
import HomeWorker from 'worker-loader!@/worker/taskManagement/home/Index.Worker.js';
import { taskManagementApi } from "@/api/taskManagement.js";

export default {
    created(){
        this.homeWorker =  new HomeWorker();
        this.$evtBus.$on("symper-app-wrapper-clicked", evt => {
            if (this.$refs.projectPopupView && 
                ($(evt.target).closest(".project-info").length == 0 &&
                $(evt.target).closest(".popup-select-project").length == 0)
            ) {
                this.$refs.projectPopupView.hide()
            }
            if (this.$refs.SelectBoard && 
                $(evt.target).closest('.task-sidebar-item').length == 0 &&
                $(evt.target).closest(".card-add-board").length == 0)
             {
                this.$refs.SelectBoard.hide()
            }
        });
        this.$evtBus.$on('task-manager-change-project', ()=>{
            this.getCurrentProject()
        })
        
        
        let self = this;
       
        this.homeWorker.addEventListener("message", function (event){
			let data = event.data;
            switch (data.action) {
                case 'getAllProject':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit('taskManagement/setAllProject', res.data.listObject);
                        self.getCurrentProject();
                    }
                    break;
                case 'getDetailProject':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit("taskManagement/setCurrentProject", res.data);
                    } 
                    break;
                case 'getListBoard':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit("taskManagement/setListBoardInProject", res.data.listObject);
                        self.setCurentBoard();
                    } 
                    break;
                default:
                    break;
            }
        })
        
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
        userMenuItems(){
            return this.$store.getters['taskManagement/userMenuItems'];
        },
        listBoardInProject(){
            return this.$store.state.taskManagement.listBoardInProject;
        },
        sTaskManagement(){
            return this.$store.state.taskManagement;
        },
        listBoard(){
            return this.$store.state.taskManagement.listBoardInProject;
        },
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
        sCurrentProject(after, before){
            if(after.id == before.id){
                return;
            }
            if (Object.keys(after).length > 0) {
                this.checkShowListMenu();
                this.getAllUserOperations(after.id);
                this.getListBoard();
            }
        },
        "sTaskManagement.currentBoard":function(after){
            if(this.$route.meta.group == 'home'){
                this.menu.workspaceHome.items.selectBoard.icon = (after.type == 'kanban') ? 'mdi-view-dashboard-variant-outline': 'mdi-chart-timeline';
                this.menu.workspaceHome.items.selectBoard.title = after.name
                this.menu.workspaceHome.items.selectBoard.subTitle = after.description;
               
            }
        },
        menu(newVL, oldVl){
            if(JSON.stringify(newVL) != JSON.stringify(oldVl))
            this.setActiveItem();
        }
        
    },
    
    methods: {
        /**
         * Khi load mới sidebar thì gắn active item mặc đinh
         */
        setActiveItem(){
            if(this.oldSelected){
                this.$set(this.oldSelected,'active',false);
            }
            let routeName = this.$route.name;
            if(Object.keys(this.menu).length > 0){
                for(let key in this.menu){
                    if(this.menu[key].isWorkSpace){
                        if(this.menu[key].items[routeName]){
                            this.$set(this.menu[key].items[routeName],'active',true);
                            this.oldSelected = this.menu[key].items[routeName];
                            break;
                        }
                    }
                    else{ 
                        if(this.menu[routeName]){
                            this.$set(this.menu[routeName],'active',true);
                            this.oldSelected = this.menu[routeName];
                            break;
                        }
                    }
                }
            }
        },
        /**
         * Hàm xử lý hiển thị các item ở side bar tùy theo context
         */
        checkShowListMenu(){
            this.menu = [];
            let currentMenu = this.userMenuItems[this.$route.meta.group];
            let currentProject = this.$store.state.taskManagement.currentProject;
            if (currentProject.userLeader == this.$store.state.app.endUserInfo.id) {
                this.menu = currentMenu;
            }
            else{
                if (currentMenu.workspaceHome) {
                    // check role show list component
                    if (!checkPermission('task_manager_components','list')) {
                        delete currentMenu.workspaceHome.items.component;
                    }
                    // check role show list version
                    if (!checkPermission('task_manager_version','list')) {
                        delete currentMenu.workspaceHome.items.version;
                    }
                }
                //check trong workspace 2
                if (currentMenu.workspaceReport) {
                        // check role show báo cáo
                    if (!checkPermission('task_manager_report_config','view')) {
                        delete currentMenu.workspaceHome.items.report;
                    }
                }
                //check trong item 3
                if (currentMenu.workspaceSetting) {
                        // check role project setting
                    if (!checkPermission('task_manager_project_setting','config')) {
                        delete currentMenu.workspaceSetting.items.projectSetting;
                    }
                }
                //check trong setting project
                if (currentMenu.workspaceProject) {
                        // check role show list access controls
                    if (!checkPermission('task_manager_access','list')) {
                        delete currentMenu.workspaceProject.items.access;
                    }

                    // check role show list issue type
                    if (!checkPermission('task_manager_issue_type','list')) {
                        delete currentMenu.workspaceProject.items.issueType;
                    }

                    // check role show list workflow
                    if (!checkPermission('task_manager_task_life_cycle','list')) {
                        delete currentMenu.workspaceProject.items.workflow;
                    }

                    // check role show list issue link
                    if (!checkPermission('task_manager_issue_link','list')) {
                        delete currentMenu.workspaceProject.items.projectIssueLink;
                    }
                    // check role show list priority
                    if (!checkPermission('task_manager_priority','list')) {
                        delete currentMenu.workspaceProject.items.projectPriority;
                    }
                }
                this.menu = currentMenu;
            }
            
        },
        afterSelectBoard(board){
            this.menu.workspaceHome.items.selectBoard.icon = (board.type == 'kanban') ? 'mdi-view-dashboard-variant-outline': 'mdi-chart-timeline';
            this.menu.workspaceHome.items.selectBoard.title = board.name
            this.menu.workspaceHome.items.selectBoard.subTitle = board.description;
            this.$store.commit("taskManagement/setCurrentBoard",board);
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
            if(item.type != 'select'){
                this.$set(item,'active',true);
                if(this.oldSelected && this.oldSelected.name != item.name){
                    this.$set(this.oldSelected,'active',false);
                }
                this.oldSelected = item;
            }
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
        getAllUserOperations(projectId){
            let thisCpn = this;
            taskManagementApi.getAllActionOfProject(projectId).then(res=>{
                if(res.status == 200){
                    thisCpn.$store.commit('taskManagement/addToTaskManagementStore',{key:'userOperations',value:res.data})
                }
            })
        },
        getAllProject(){
            this.homeWorker.postMessage({
                action:'getAllProject',
                data:null
            });
        },
        getCurrentProject(){
            this.projectId = this.$route.params.id;
            this.getDetailProject();
        },
        getDetailProject(){
            this.homeWorker.postMessage({
                action:'getDetailProject',
                data:this.projectId
            });
        },
        getListBoard(){
            this.homeWorker.postMessage({
                action:'getListBoard',
                data:this.projectId
            });
        },
        setCurentBoard(board=null){
            let self = this;
            let currentBoard = null;
            if (board) {
                currentBoard = board;
            }else{
                let allBoard = this.listBoard;
                if (allBoard.length>0) {
                    currentBoard = allBoard[0];  
                }
            }
            self.$store.commit("taskManagement/setCurrentBoard",currentBoard);
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
            homeWorker:null,
            projectId:null
        };
    },
    activated(){
        this.projectId = this.$route.params.id;
        if (!this.sTaskManagement.allProject || this.sTaskManagement.allProject.length == 0) {
            this.getAllProject();
        }
        else if(!this.sCurrentProject.id){
            this.getCurrentProject();
        }
    },
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
    z-index: 99;
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

