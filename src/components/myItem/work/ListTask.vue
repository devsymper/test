<template>
    <div class="h-100 w-100">
            <v-row class="ml-0 mr-0" >
                <v-col cols="12" class="list-tasks pt-0 pb-0">
                    <v-row>
                    <v-col
                        cols="1"
                        class="pl-3 fs-13 font-weight-medium"
                        style="flex:0!important"
                    >{{$t("tasks.header.type")}}</v-col>
                    <v-col
                        cols="2"
                        class="pl-3 fs-13 font-weight-medium"
                    >{{$t("tasks.header.name")}}</v-col>
                    <v-col
                        cols="2"
                        class=" fs-13 font-weight-medium"
                    >{{$t("tasks.header.assignee")}}</v-col>
                    <v-col
                        cols="2"
                        class=" fs-13 font-weight-medium"
                    >{{$t("tasks.header.owner")}}</v-col>
                    <v-col
                        cols="2"
                        class="fs-13 font-weight-medium"
                    >{{$t("tasks.header.dueDate")}}</v-col>

                    <v-col
                        cols="2"
                        class="fs-13 font-weight-medium"
                    >{{$t("tasks.header.app")}}</v-col>
                    <v-col
                        cols="1"
                        class="fs-13 font-weight-medium"
                    >{{$t("common.add")}}</v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <VuePerfectScrollbar
                @ps-y-reach-end="handleReachEndList"
                style="height: calc(100vh - 135px);"
                >
                    <div style="overflow: hidden;">
                        <v-row
                        class="item-task"
                        v-for="(obj, idx) in listTaskComputed"
                        :key="idx"
                        :style="{
                            minHeight: '30px'
                        }"
                        :class="{
                                'd-active':indexObj==idx
                        }"
                        @mouseover="indexObj=idx"
                        @mouseout="indexObj = null"
                        @dblclick="selectObject(obj)"
                        style="border-bottom: 1px solid #eeeeee!important;margin-left:0px!important"
                    >
                        <v-col
                            style="line-height: 24px; flex:0 1 3%!important"
                            cols="1"
                            class="pl-5 fs-12 px-1 py-0"
                        >
                            <div class="pl-1">
                                <div>
                                    <v-icon class="fs-14"
                                        style="margin-top:10px"
                                        v-if="obj.taskData.action"
                                    >{{(obj.taskData.action.action=='submit' || obj.taskData.action.action=='') ? 'mdi-file-document-edit-outline': 'mdi-seal-variant'}}</v-icon>
                                    <v-icon 
                                        style="margin-top:10px"
                                        class="fs-14" v-else>
                                        mdi-checkbox-marked-circle-outline
                                    </v-icon>
                                </div>
                                <div >
                                    <v-icon v-if="obj.endTime !=null" style="font-size:10px; color:green;">mdi-circle</v-icon>
                                    <v-icon v-else-if="obj.dueDate && checkTimeDueDate(obj)" style="font-size:10px ; color:red;">mdi-circle</v-icon>
                                    <v-icon v-else style="font-size:10px ; color:blue;">mdi-circle</v-icon>
                                </div>
                            </div>
                        </v-col>
                        <v-col   cols="2" class="pl-3 pr-1 pb-1 pt-2">
                            <div class="pl-3">
                                <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <div v-on="on" class="text-left fs-13  text-ellipsis w-100">
                          
                                        {{obj.taskData.content}}
                                    </div>
                                </template>
                                <span>{{ obj.taskData.content }}</span>
                                </v-tooltip>
                                <div class="pa-0 grey--text mt-1 lighten-2 d-flex justify-space-between">
                                <div
                                    class="fs-11  text-ellipsis"
                                >{{obj.taskData.extraLabel}} {{obj.taskData.extraValue}}</div>

                                <div class="fs-11 py-0  text-ellipsis">
                                    {{obj.endTime==null ? $moment(obj.startTime).format('DD/MM/YY HH:mm:ss'):$moment(obj.endTime).format('DD/MM/YY HH:mm:ss')}}
                                    <v-icon class="grey--text lighten-2 ml-1" x-small>mdi-clock-time-nine-outline</v-icon>
                                </div>
                                </div>
                            </div>
                        </v-col>
                        <v-col
                            style="line-height: 42px"
                            cols="2"
                            class="pl-3 fs-12 px-1 py-0"
                        >
                            <symperAvatar :size="20" :userId="obj.assigneeInfo.id" />
                            {{obj.assigneeInfo.displayName}}
                        </v-col>
                        <v-col
                            style="line-height: 42px"
                            cols="2"
                            class="pl-3 fs-12 px-1 py-0"
                        >
                            <symperAvatar v-if="obj.ownerInfo.id" :size="20" :userId="obj.ownerInfo.id" />
                            <symperAvatar v-else :size="20" :userId="obj.assigneeInfo.id" />
                            {{obj.ownerInfo.id ? obj.ownerInfo.displayName: obj.assigneeInfo.displayName }}
                        </v-col>
                        <v-col
                            style="line-height: 42px"
                            cols="2"
                            class="pl-3 fs-13 px-1 py-0"
                        >
                            <span class="mt-1">{{obj.dueDate ==null? '':$moment(obj.dueDate).fromNow()}}</span>
                        </v-col>
                        <v-col
                            class="pl-3 py-0"
                            cols="2"
                        >
                            <div class="pl-1 mt-1">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                    <span
                                        v-on="on"
                                        v-if="obj.processDefinitionId"
                                        class=" text-left fs-13 text-ellipsis w-80 title-quytrinh"
                                    >{{obj.processDefinitionName}}</span>
                                    <span v-on="on" v-else class="text-left fs-13text-ellipsis w-80 title-quytrinh">ad hoc</span>
                                    </template>
                                    <span>{{ obj.processDefinitionName?  obj.processDefinitionName : `ad hoc` }}</span>
                                </v-tooltip>
                                <div class="pa-0 grey--text mt-1 lighten-2 d-flex justify-space-between">
                                    {{appName}}
                                </div>
                            </div>
                        </v-col>
                        <v-col
                            cols="1"
                            class="pl-3 fs-13 px-1 py-0"
                        >
                            <div class="pl-1 mt-1">
                                <div style="width:55px">
                                    {{commentCountPerTask['task:' + obj.id]}}
                                    <v-icon class="fs-14" style="float:right;margin-top:4px;margin-right:12px">mdi-comment-processing-outline</v-icon> </div>
                                <div style="width:55px">
                                      {{fileCountPerTask['task:' + obj.id]}}
                                    <v-icon class="fs-14" style="float:right;margin-top:4px;margin-right:12px">mdi-attachment</v-icon></div>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </VuePerfectScrollbar>
        </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import icon from "@/components/common/SymperIcon";
import symperAvatar from "@/components/common/SymperAvatar.vue";
import {
  extractTaskInfoFromObject,
  addMoreInfoToTask
} from "@/components/process/processAction";
export default {
    props: {
        listTask: {
            type: Array,
            default: []
        },
        appName:{
            type: String,
            default: null
        }
    },
    watch: {
        listTask(newVl){
            this.getData();
            if(!newVl){
                this.$store.dispatch('file/getWaitingFileCountPerObj');
                this.$store.dispatch('comment/getWaitingCommentCountPerObj');
            }
        }
    },
    components: {
        icon: icon,
        VuePerfectScrollbar,
        symperAvatar
    },
    data: function() {
        return {
            indexObj:null,
        }
    },
    computed:{
        fileCountPerTask(){
            return this.$store.state.file.fileCountPerObj.list;
        },
        commentCountPerTask(){
            return this.$store.state.comment.commentCountPerObj.list;
        },
        listTaskComputed(){
            let self=this;
            let arrListTask=this.listTask;
            if (arrListTask.length>0) {
                    arrListTask.forEach(task => {
                    task.taskData = self.getTaskData(task);
                    task = addMoreInfoToTask(task);
                });

                return arrListTask;
            }else{
                return [];
            }
           
        }
    },
    methods:{
        checkTimeDueDate(item){
            if (item.dueDate) {
                let dueDate=new Date(item.dueDate).getTime();
                if (dueDate<Date.now()) {
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        },
        handleReachEndList(){},
        selectNameApp(variables){
            const symperAppId = variables.find(element => element.name=='symper_application_id');
            if (symperAppId) {
                let appId=symperAppId.value;
                let allApp = this.$store.state.task.allAppActive;
                let app=allApp.find(element => element.id==appId);
                if (app) {
                    return app.name;
                }else{
                    return "";
                }
            }else{
                return "";
            }
        },
        getTaskData(task) {
            let rsl = {
                content: "",
                extraLabel: "",
                extraValue: ""
            };
            try {
                let taskData = JSON.parse(task.description);
                if (taskData) {
                rsl = taskData;
                }
            } catch (error) {
                rsl.content = task.description;
            }
            return rsl;
        },
        selectObject(obj){
            this.$router.push("/myitem/tasks/"+obj.id);
        },
        getData(){
            if (this.listTask && this.listTask.length>0) {
                let arrListTask=this.listTask;
                let taskIden = [];
                arrListTask.forEach(task => {
                    taskIden.push('task:'+task.id);
                })
                this.$store.commit('file/setWaitingFileCountPerObj', taskIden);
                this.$store.commit('comment/setWaitingCommentCountPerObj', taskIden);
                this.$store.dispatch('file/getWaitingFileCountPerObj');
                this.$store.dispatch('comment/getWaitingCommentCountPerObj');
            
            }
        }
    },
    created(){
        this.getData();
    }
}
</script>

<style scoped>
.item-task{
    cursor: pointer;
}
.d-active {
  background: #f5f5f5;
}
.title-quytrinh {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box !important;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>