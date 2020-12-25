<template>
    <div class="kanban-board-view h-100">
        <div class="kanban-board-view__header">
            <div class="left-content">
                <v-icon>mdi-view-dashboard-variant-outline</v-icon>
                <span>Kanban Board</span>
            </div>
            <div class="right-content">
                 <v-text-field
                 class="sym-small-size sym-style-input d-inline-block mr-3"
                    append-icon="mdi-magnify"
                    solo
                    :placeholder="$t('common.search')"
                    hide-details
                ></v-text-field>
                <div class="list-user d-inline-block">
                    <img class="user-in-project" src="https://file.symper.vn/readFile/user_avatar_922" alt="">
                    <img class="user-in-project" src="https://file.symper.vn/readFile/user_avatar_922" alt="">
                    <img class="user-in-project" src="https://file.symper.vn/readFile/user_avatar_922" alt="">
                    <img class="user-in-project" src="https://file.symper.vn/readFile/user_avatar_922" alt="">
                </div>
                <div class="ml-3 d-inline-block">
                   
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon    
                                v-bind="attrs"
                                v-on="on">mdi-dots-horizontal</v-icon>
                         
                        </template>
                        <v-list dense>
                            <v-list-item
                                v-for="(item, index) in items"
                                :key="index"
                                @click="item.menuAction(item)"
                            >
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                        </v-menu>
                </div>
            </div>
        </div>
        <VuePerfectScrollbar class="wrap-scroll">
            <div class="wrap-kanban-board py-4 h-100">
                <div
                    v-for="column in columns"
                    :key="column.id"
                    class="px-3 board-column-item rounded mr-4"
                >
                    <p class="title-column">{{column.name}}</p>
                    <!-- Draggable component comes from vuedraggable. It provides drag & drop functionality -->
                    <VuePerfectScrollbar style="max-height: calc(100vh - 250px);">
                        <div v-for="(status, idex) in column.statusInColumn"
                            :key="idex"
                        >
                            <p>{{status.name}}-{{status.taskLifeCircleName}}</p>
                            <draggable :list="status.tasks" :animation="250" ghost-class="ghost-card" group="tasks">
                                <!-- Each element from here will be draggable and animated. Note :key is very important here to be unique both for draggable and animations to be smooth & consistent. -->
                                <task-card
                                    v-for="(task) in status.tasks"
                                    :key="task.id"
                                    :task="task"
                                    class="mt-3 cursor-move"
                                ></task-card>
                                <!-- </transition-group> -->
                            </draggable>

                        </div>
                    </VuePerfectScrollbar>
                    <!-- <div class="text-center mt-2">
                        <v-btn depressed height="25">
                        <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </div> -->
                    
                </div>
            </div>
        </VuePerfectScrollbar>
    </div>

</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import draggable from "vuedraggable";
import TaskCard from "@/components/taskManagement/board/TaskCard.vue";
import { taskManagementApi } from "@/api/taskManagement.js";
import { util } from '../../../plugins/util';

export default {
    name: "KanbanBoard",
    components: {
        TaskCard,
        draggable,
        VuePerfectScrollbar
    },
    computed:{
        columns(){
            let columns = this.listColumn;
            let self = this;
            if (this.listStatus.length > 0 ) {
                for (let i = 0; i < this.listStatusColumn.length; i++) {
                    let idColumn = this.listStatusColumn[i].columnId;
                    let statusRoleId = this.listStatusColumn[i].statusRoleId;
                    let item = this.listStatus.find(ele => ele.statusRoleId == statusRoleId);
                    if (item) {
                        item['tasks'] = this.tasks;
                        let column = columns.find(ele => ele.id == idColumn);
                        if (column) {
                            column.statusInColumn.push(item);
                        }
                        let index = self.listStatus.indexOf(item);
                        if (index > -1) {
                            self.listStatus.splice(index, 1);
                        }
                    }
                    
                }  
            }
            return columns;
        },
        sTaskManagement() {
            return this.$store.state.taskManagement;
        },
        listColumn(){
            if (!this.currentBoard.id) {
                return [];
            }
            let idBoard=this.currentBoard.id;
            let arrColumn = [];
            if (this.sTaskManagement.listColumnInBoard[idBoard] && this.sTaskManagement.listColumnInBoard[idBoard].length >= 0 ) {
                let columns = util.cloneDeep(this.sTaskManagement.listColumnInBoard[idBoard]);
                for (let i = 0; i < columns.length; i++) {
                    if (columns[i].isHidden == 0 && columns[i].isBacklog == 0) {
                        let obj={};
                        obj.statusInColumn = [];
                        obj.name = columns[i].name;
                        obj.id = columns[i].id;
                        arrColumn.push(obj);
                    }
                }
            }
            return arrColumn;
        },
        listStatusColumn(){
            if (!this.currentBoard.id) {
                return [];
            }
            let idBoard=this.currentBoard.id;
            let listStatusColumn = [];
            if (this.sTaskManagement.listStatusInColumnBoard[idBoard] && this.sTaskManagement.listStatusInColumnBoard[idBoard].length >= 0 ) {
                listStatusColumn = util.cloneDeep(this.sTaskManagement.listStatusInColumnBoard[idBoard]);
            }
            return listStatusColumn;
        },
        listStatus(){
            let projectId=this.$route.params.id;
            let listStatus = [];
            if (this.sTaskManagement.listStatusInProjects[projectId] && this.sTaskManagement.listStatusInProjects[projectId].length >= 0 ) {
                listStatus = util.cloneDeep(this.$store.state.taskManagement.listStatusInProjects[projectId]);
            }
            return listStatus;
        }
    },
    watch:{
        
    },
    data() {
        let self=this;
        return {
            items: [
                { 
                    title: this.$t("taskManagement.settingBoard"),
                    menuAction: action => {
                       if (Object.keys(self.currentBoard).length > 0) {
                            let id=self.$route.params.id;
                            self.$router.push("/task-management/projects/"+id+"/kanban-board/settings/" + self.currentBoard.id);
                       }else{
                           console.log("Chưa có data");
                       }
                    },
                },
            ],
            tasks: [
                {
                    id: 14,
                    title: "Add discount code to checkout page",
                    date: "Sep 14",
                    issueType:{
                        icon:'mdi-tools'
                    },
                    priority:{
                        icon:'mdi-tools'
                    }
                },
                {
                id: 15,
                    title: "Design shopping cart dropdown",
                    date: "Sep 9",
                    issueType:{
                        icon:'mdi-tools'
                    },
                    priority:{
                        icon:'mdi-tools'
                    }
                },
                {
                    id: 16,
                    title: "Add discount code to checkout page",
                    date: "Sep 14",
                    issueType:{
                        icon:'mdi-tools'
                    },
                    priority:{
                        icon:'mdi-tools'
                    }
                }
            ],
            // columns: [
            //     {
            //     title: "Backlog2",
            //     tasks: [
            //         {
            //         id: 1312,
            //         title: "Add discount code to checkout page",
            //         date: "Sep 14",
            //         issueType:{
            //             icon:'mdi-chevron-down-box'
            //         },
            //         priority:{
            //             icon:'mdi-chevron-double-down'
            //         }
            //         },
            //         {
            //         id: 212,
            //         title: "Provide documentation on integrations",
            //         date: "Sep 12"
            //         },
            //         {
            //         id: 32,
            //         title: "Design shopping cart dropdown",
            //         date: "Sep 9",
            //         issueType:{
            //             icon:'mdi-chevron-down-box'
            //         },
            //         priority:{
            //             icon:'mdi-chevron-double-down'
            //         }
            //         },
            //         {
            //         id: 443,
            //         title: "Add discount code to checkout page",
            //         date: "Sep 14",
            //         issueType:{
            //             icon:'mdi-chevron-down-box'
            //         },
            //         priority:{
            //             icon:'mdi-chevron-double-down'
            //         }
            //         },
            //         {
            //         id: 52,
            //         title: "Test checkout flow",
            //         date: "Sep 15",
            //         issueType:{
            //             icon:'mdi-chevron-down-box'
            //         },
            //         priority:{
            //             icon:'mdi-chevron-double-down'
            //         }
            //         }
            //     ]
            //     },
            //     {
            //     title: "Backlog1",
            //     tasks: [
            //         {
            //         id: 1312,
            //         title: "Add discount code to checkout page",
            //         date: "Sep 14",
            //         issueType:{
            //             icon:'mdi-chevron-down-box'
            //         },
            //         priority:{
            //             icon:'mdi-chevron-double-down'
            //         }
            //         },
            //         {
            //         id: 212,
            //         title: "Provide documentation on integrations",
            //         date: "Sep 12"
            //         },
            //         {
            //         id: 32,
            //         title: "Design shopping cart dropdown",
            //         date: "Sep 9",
            //         issueType:{
            //             icon:'mdi-chevron-down-box'
            //         },
            //         priority:{
            //             icon:'mdi-chevron-double-down'
            //         }
            //         },
            //         {
            //         id: 443,
            //         title: "Add discount code to checkout page",
            //         date: "Sep 14",
            //         issueType:{
            //             icon:'mdi-chevron-down-box'
            //         },
            //         priority:{
            //             icon:'mdi-chevron-double-down'
            //         }
            //         },
            //         {
            //         id: 52,
            //         title: "Test checkout flow",
            //         date: "Sep 15",
            //         issueType:{
            //             icon:'mdi-chevron-down-box'
            //         },
            //         priority:{
            //             icon:'mdi-chevron-double-down'
            //         }
            //         }
            //     ]
            //     },
            //     {
            //     title: "Backlog",
            //     tasks: [
            //         {
            //         id: 1312,
            //         title: "Add discount code to checkout page",
            //         date: "Sep 14",
            //         issueType:{
            //             icon:'mdi-chevron-down-box'
            //         },
            //         priority:{
            //             icon:'mdi-chevron-double-down'
            //         }
            //         },
            //         {
            //         id: 212,
            //         title: "Provide documentation on integrations",
            //         date: "Sep 12"
            //         },
            //         {
            //         id: 32,
            //         title: "Design shopping cart dropdown",
            //         date: "Sep 9",
            //         issueType:{
            //             icon:'mdi-chevron-down-box'
            //         },
            //         priority:{
            //             icon:'mdi-chevron-double-down'
            //         }
            //         },
            //         {
            //         id: 443,
            //         title: "Add discount code to checkout page",
            //         date: "Sep 14",
            //         issueType:{
            //             icon:'mdi-chevron-down-box'
            //         },
            //         priority:{
            //             icon:'mdi-chevron-double-down'
            //         }
            //         },
            //         {
            //         id: 52,
            //         title: "Test checkout flow",
            //         date: "Sep 15",
            //         issueType:{
            //             icon:'mdi-chevron-down-box'
            //         },
            //         priority:{
            //             icon:'mdi-chevron-double-down'
            //         }
            //         }
            //     ]
            //     },
            
            //     {
            //     title: "In Progress",
            //     tasks: [
            //         {
            //         id: 6,
            //         title: "Design shopping cart dropdown",
            //         date: "Sep 9",
            //         issueType:{
            //             icon:'mdi-checkbox-multiple-marked-circle'
            //         },
            //         priority:{
            //             icon:'mdi-shuffle-variant'
            //         }
            //         },
            //         {
            //         id: 7,
            //         title: "Add discount code to checkout page",
            //         date: "Sep 14",
            //         issueType:{
            //             icon:'mdi-checkbox-multiple-marked-circle'
            //         },
            //         priority:{
            //             icon:'mdi-shuffle-variant'
            //         }
            //         },
            //         {
            //         id: 8,
            //         title: "Provide documentation on integrations",
            //         date: "Sep 12",
            //         issueType:{
            //             icon:'mdi-checkbox-multiple-marked-circle'
            //         },
            //         priority:{
            //             icon:'mdi-shuffle-variant'
            //         }
            //         }
            //     ]
            //     },
            //     {
            //     title: "Review",
            //     tasks: [
            //         {
            //             id: 9,
            //             title: "Provide documentation on integrations",
            //             date: "Sep 12"
            //             },
            //             {
            //             id: 10,
            //             title: "Design shopping cart dropdown",
            //             date: "Sep 9",
            //             issueType:{
            //                 icon:'mdi-tools'
            //             },
            //             priority:{
            //                 icon:'mdi-tools'
            //             }
            //         },
            //         {
            //             id: 11,
            //             title: "Add discount code to checkout page",
            //             date: "Sep 14",
            //             issueType:{
            //                 icon:'mdi-tools'
            //             },
            //             priority:{
            //                 icon:'mdi-tools'
            //             }
            //         },
            //         {
            //             id: 12,
            //             title: "Design shopping cart dropdown",
            //             date: "Sep 9",
            //             issueType:{
            //                 icon:'mdi-tools'
            //             },
            //             priority:{
            //                 icon:'mdi-tools'
            //             }
            //         },
            //         {
            //             id: 13,
            //             title: "Add discount code to checkout page",
            //             date: "Sep 14",
            //             issueType:{
            //                 icon:'mdi-tools'
            //             },
            //             priority:{
            //                 icon:'mdi-tools'
            //             }
            //         }
            //     ]
            //     },
            //     {
            //     title: "Done",
            //     tasks: [
            //         {
            //             id: 14,
            //             title: "Add discount code to checkout page",
            //             date: "Sep 14",
            //             issueType:{
            //                 icon:'mdi-tools'
            //             },
            //             priority:{
            //                 icon:'mdi-tools'
            //             }
            //         },
            //         {
            //         id: 15,
            //             title: "Design shopping cart dropdown",
            //             date: "Sep 9",
            //             issueType:{
            //                 icon:'mdi-tools'
            //             },
            //             priority:{
            //                 icon:'mdi-tools'
            //             }
            //         },
            //         {
            //             id: 16,
            //             title: "Add discount code to checkout page",
            //             date: "Sep 14",
            //             issueType:{
            //                 icon:'mdi-tools'
            //             },
            //             priority:{
            //                 icon:'mdi-tools'
            //             }
            //         }
            //     ]
            //     }
            // ],
            currentBoard:{}
        };
    },
    methods:{
        async getListBoard(){
            let self=this;
            let id=this.$route.params.id;
            if (id) {
                taskManagementApi.getListBoardInProject(id).then(res=>{
                    if (res.status == 200) {
                        self.$store.commit("taskManagement/setListBoardInProject", res.data.listObject);
                    }
                });
                
            }
        },
        setBoardCurrent(){
            let projectId=this.$route.params.id;
            setTimeout((self) => {
                let allBoard=self.$store.state.taskManagement.listBoardInProject;
                if (allBoard.length>0) {
                    self.currentBoard=allBoard[0];  
                }
            }, 300,this);
            if (!this.$store.state.taskManagement.listStatusInProjects[projectId] || this.$store.state.taskManagement.listStatusInProjects[projectId].length == 0) {
                this.$store.dispatch("taskManagement/getListStautsInProject", projectId);
            }
            this.getListStatusInProject();
            this.getListColumn();
            this.getListColumnStatus();
        },
        getListStatusInProject(){
            let projectId=this.$route.params.id;
            if (!this.$store.state.taskManagement.listStatusInProjects[projectId] || this.$store.state.taskManagement.listStatusInProjects[projectId].length == 0) {
                this.$store.dispatch("taskManagement/getListStautsInProject", projectId);
            }
        },
        getListColumn(){
            if (this.currentBoard.id) {
                let idBoard=this.currentBoard.id;
                if (!this.$store.state.taskManagement.listColumnInBoard[idBoard] || this.$store.state.taskManagement.listColumnInBoard[idBoard].length == 0) {
                    this.$store.dispatch("taskManagement/getListColumnInBoard",idBoard);
                }
            }
      
        },
        getListColumnStatus(){
            if (this.currentBoard.id) {
                let idBoard=this.currentBoard.id;
                if (!this.$store.state.taskManagement.listStatusInColumnBoard[idBoard] || this.$store.state.taskManagement.listStatusInColumnBoard[idBoard].length == 0) {
                    this.$store.dispatch("taskManagement/getListStatusInColumnBoard",idBoard);
                }
            }
        }
    },
    created(){
        let self = this;
        this.$evtBus.$on('selected-item-board', (data) =>{
			if (data.id) {
                self.currentBoard=data;
                self.getListStatusInProject();
                self.getListColumn();
                self.getListColumnStatus();
			}else{
			}
        });
        this.setBoardCurrent();
        
    },
    activated(){
        this.getListBoard();
       // this.toggleMainContentLoader(false);
        let breadcrumbs = [
                {
                    text: 'Dashboard',
                    disabled: true,
                    to: '/report',
                },
                {
                    text: 'test kanban',
                    disabled: false,
                    to: 'breadcrumbs_link_1',
                },
                {
                    text: 'Link 2',
                    disabled: true,
                    to: 'breadcrumbs_link_2',
                },
            ]
        this.$store.commit("taskManagement/addToTaskManagementStore",{key:"headerBreadcrumbs",value:breadcrumbs})
        let id=this.$route.params.id;
        let self = this;
        if (id) {
            let allProject=this.$store.state.taskManagement.allProject;
            let project=allProject.find(element => element.id==id);
            if (project) {
                self.$store.commit("taskManagement/setCurrentProject", project);
            }else{ // call api get detail project
                taskManagementApi
                    .getDetailProject(id)
                    .then(res => {
                        if (res.status == 200) {
                            self.$store.commit("taskManagement/setCurrentProject", res.data);
                        }else{
                            self.$snotifyError("", "Can not get detail project with id:"+id);
                        }
                    })
                    .catch(err => {
                        self.$snotifyError("", "Can not get detail project with id:"+id);
                    })
                    .always(() => {});
            }
        }
    }
};
</script>

<style scoped>
.kanban-board-view__header{
    height: 50px;
    display: flex;
}
.wrap-scroll{
    height: calc(100% - 50px);
}
.board-column-item {
    min-width: 320px;
    width: 320px;
    display: table;
    background: var(--symper-background-default);
    padding: 8px 0;
    transition: all ease-in-out 300ms;
}
.ghost-card {
  opacity: 0.5;
  background: #F7FAFC;
  border: 1px solid #4299e1;
}
.wrap-kanban-board{
    display: flex;
    flex: 1 1 auto;
    max-width: 100%;
}
.left-content{
    padding: 12px 0;
}
.left-content span{
    font-size: 18px;
    font-weight: 500;
    margin-left: 8px;
}
.left-content .mdi{
    margin-bottom: 5px;
}
.right-content{
    padding: 8px;
    margin-left: auto;
}
.user-in-project{
    height: 24px;
    width: 24px;
    border-radius: 50%;
    margin-right: -4px;
}
.list-user{
    vertical-align: middle;
}
.title-column{
    font-weight: 500;
    font-size: 15px;
}
</style>
