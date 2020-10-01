<template>
    <div class="w-100 h-100">
        <VuePerfectScrollbar
            v-if="!loadingTaskList"
            style="height:100%"
        >
            <div v-if="!sideBySideMode" style="overflow: hidden;">
                <v-row
                    v-for="(obj, idx) in listTaskApproval"
                    :key="obj.id"
                    :index="obj.id"
                    :class="{
                            'mr-0 ml-0 single-row': true ,
                            'd-active':index==idx 
                        }"
                    @mouseover="index=idx"
                    @mouseout="index = null"
                    style="border-bottom: 1px solid #eeeeee!important;max-height:40px"
                >
                    <v-col
                        :cols="!sideBySideMode ? 1 : 1"
                        class="fs-13 pa-0 pl-1 py-0 "
                        style="flex:0!important"
                    >
                        <v-checkbox
                            ref="listCheck"
                            v-model="obj.checked"
                            class="checkBoxTask pa-0 ma-0 checkBox"
                            @change="changeValueCheckBox"
                        ></v-checkbox>
                    </v-col>

                    <v-col    
                        :cols="!sideBySideMode ? 2 : 2" 
                        class="pl-0 pr-1 pb-1 pt-0"
                        @click="selectObject(obj, idx)"
                        >
                        
                        <div >
                                <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <div v-on="on" class="text-left fs-13  text-ellipsis w-100">
                                        <v-icon class="fs-14"
                                            style="margin-top:1px"
                                        >mdi-file-check-outline</v-icon>
                                        
                                        {{obj.taskData.content}}
                                    </div>
                                </template>
                                <span>{{ obj.taskData.content }}</span>
                                </v-tooltip>
                                <div class="pa-0 grey--text mt-1 lighten-2 d-flex justify-space-between">
                                <div
                                    class="fs-11  text-ellipsis"
                                >
                                    <v-icon style="font-size:10px; color:green;padding-left:2px">mdi-circle</v-icon>
                                {{obj.taskData.extraLabel}} {{obj.taskData.extraValue}}</div>

                                <div class="fs-11 py-0  text-ellipsis">
                                    {{obj.endTime==null ? $moment(obj.startTime).format('DD/MM/YY HH:mm:ss'):$moment(obj.endTime).format('DD/MM/YY HH:mm:ss')}}
                                    <v-icon class="grey--text lighten-2 ml-1" x-small>mdi-clock-time-nine-outline</v-icon>
                                </div>
                            </div>
                        </div>
                    </v-col>
                    <v-col
                        @click="selectObject(obj, idx)"
                        v-if="!sideBySideMode"
                        style="line-height: 42px"
                        cols="2"
                        class="fs-12 pl-3 px-1 py-0"
                    >
                    <symperAvatar :size="20" :userId="obj.assigneeInfo.id" />
                    {{obj.assigneeInfo.displayName}}
                    </v-col>
                    <v-col
                        @click="selectObject(obj, idx)"
                        v-if="!sideBySideMode"
                        style="line-height: 42px"
                        cols="2"
                        class="fs-12 pl-3 px-1 py-0"
                        >
                    <symperAvatar v-if="obj.ownerInfo.id" :size="20" :userId="obj.ownerInfo.id" />
                    <symperAvatar v-else :size="20" :userId="obj.assigneeInfo.id" />
                    {{obj.ownerInfo.id ? obj.ownerInfo.displayName: obj.assigneeInfo.displayName }}
                    </v-col>
                    <v-col
                       @click="selectObject(obj, idx)"
                        v-if="!sideBySideMode"
                        style="line-height: 42px"
                        cols="2"
                        class="fs-13  pl-3 px-1 py-0"
                    >
                        <span class="mt-1">{{obj.dueDate ==null? '':$moment(obj.dueDate).fromNow()}}</span>
                    </v-col>
                    <v-col
                       @click="selectObject(obj, idx)"
                        v-if="!sideBySideMode"
                        class="py-0"
                        cols="2"
                    >
                        <div class="pl-1 mt-1">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                <span
                                    v-on="on"
                                    v-if="obj.processDefinitionName"
                                    class=" text-left fs-13 pr-6 text-ellipsis w-80 title-quytrinh"
                                >{{obj.processDefinitionName}}</span>
                                <span v-on="on" v-else class="text-left fs-13 pr-6 text-ellipsis w-80 title-quytrinh">ad hoc</span>
                                </template>
                                <span>{{ obj.processDefinitionName?  obj.processDefinitionName : `ad hoc` }}</span>
                            </v-tooltip>
                            <div class="pa-0 grey--text mt-1 lighten-2 d-flex justify-space-between">
                                <div
                                    class="fs-11 pr-6 text-ellipsis"
                                >{{selectNameApp(obj.variables)}}</div>
                            </div>
                        </div>
                    </v-col>
                    <v-col
                       @click="selectObject(obj, idx)"
                        v-if="!sideBySideMode"
                        cols="1"
                        class="fs-13 px-1 py-0"
                    >
                        <div class="pl-1">
                            <div style="width:55px">
                                {{commentCountPerTask['task:' + obj.id]}}
                                <v-icon class="fs-14" style="float:right;margin-top:4px;margin-right:12px">mdi-comment-processing-outline</v-icon> 
                            </div>
                            <div style="width:55px"> 
                                {{fileCountPerTask['task:' + obj.id]}}
                                <v-icon class="fs-14" style="float:right;margin-top:4px;margin-right:12px">mdi-attachment</v-icon>
                            </div>
                        </div>
                    </v-col>

                </v-row>
            </div>

            <div v-else style="height:100%">
                <v-row style="height:100%">
                    <v-col cols="3" style="border-right:1px solid #dedede; padding-top:0px!important;padding-right:0px" >
                        <v-row
                            v-for="(obj, idx) in listTaskApproval"
                            :key="obj.id"
                            :index="obj.id"
                            :class="{
                                    'mr-0 ml-0 single-row': true ,
                                    'd-active':index==idx || selectObj==idx
                                }"
                            @mouseover="index=idx"
                            @mouseout="index = null"
                            style="border-bottom: 1px solid #eeeeee!important;max-height:40px"
                            >
                                <v-col
                                    cols="3"
                                    class="fs-13 pa-0 pl-1"
                                    style="flex:0!important"
                                >
                                    <v-checkbox
                                        ref="listCheck"
                                        v-model="obj.checked"
                                        class="checkBoxTask pa-0 ma-0 checkBox"
                                        @change="changeValueCheckBox"
                                    ></v-checkbox>
                                </v-col>

                                <v-col    
                                    cols="9" 
                                    class="pa-0 pt-0"
                                    @click="selectObject(obj, idx)"
                                    style="max-width:100%!important;flex: 1 0 70%;"
                                    >
                                    <div>
                                            <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <div v-on="on" class="text-left fs-13  text-ellipsis w-100"
                                                    style="width: 250px;"
                                                >
                                                    <v-icon class="fs-14"
                                                        style="margin-top:1px"
                                                    >mdi-file-check-outline</v-icon>
                                                    
                                                    {{obj.taskData.content}}
                                                </div>
                                            </template>
                                            <span>{{ obj.taskData.content }}</span>
                                            </v-tooltip>
                                            <div class="pa-0 grey--text mt-1 lighten-2 d-flex justify-space-between">
                                            <div
                                                class="fs-11  text-ellipsis"
                                            >
                                                <v-icon style="font-size:10px; color:green;padding-left:2px">mdi-circle</v-icon>
                                            {{obj.taskData.extraLabel}} {{obj.taskData.extraValue}}</div>

                                            <div class="fs-11 py-0  text-ellipsis">
                                                {{obj.endTime==null ? $moment(obj.startTime).format('DD/MM/YY HH:mm:ss'):$moment(obj.endTime).format('DD/MM/YY HH:mm:ss')}}
                                                <v-icon class="grey--text lighten-2 ml-1" x-small>mdi-clock-time-nine-outline</v-icon>
                                            </div>
                                        </div>
                                    </div>
                                </v-col>
                        </v-row>
                    </v-col>
                    <v-col class="detailDoc" cols="9" style="padding:0px!important;height:100%">
                        <detailDocument 
                            :showCommentInDoc="true"
                            :docObjInfo="docObjInfo">
                        </detailDocument>
                    </v-col>
                </v-row>
           
            </div>
        </VuePerfectScrollbar>
    </div>
</template>

<script>
import BPMNEngine from "@/api/BPMNEngine";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import symperAvatar from "@/components/common/SymperAvatar.vue";
import detailDocument from '@/views/document/detail/Detail';

import {
  extractTaskInfoFromObject,
  addMoreInfoToTask
} from "@/components/process/processAction";
export default {
    props: {
        nodeInfo: {
            type: Object,
            default(){
                return {}
            }
        },
        selectAll:{
            type:Boolean,
            default:false
        },
        sideBySideMode:{
            type:Boolean,
            default:false
        }
    },
    components: {
        VuePerfectScrollbar: VuePerfectScrollbar,
        symperAvatar: symperAvatar,
        detailDocument

    },
    watch:{
        nodeInfo(newVl) {
           this.getData();
        },
        selectAll(newVl){
            this.selectedAllTask(newVl);
        }
    },
    computed:{
        fileCountPerTask(){
            return this.$store.state.file.fileCountPerObj.list;
        },
        commentCountPerTask(){
            return this.$store.state.comment.commentCountPerObj.list;
        },
        listTaskApproval(){
            let allTask=this.allTaskInNode;
            let listTaskApproval=[];
            for (var key in allTask) {
                if (allTask[key].description && allTask[key].description!= null) {
                    let desc=JSON.parse(allTask[key].description);
                    let action=desc.action;
                    if (action.action=="approval") {
                        allTask[key].taskData = JSON.parse(allTask[key].description);
                        allTask[key] = addMoreInfoToTask(allTask[key]);
                        this.$set(allTask[key],'checked',false);
                        listTaskApproval.push(allTask[key]);
                    }
                }
            }
            return listTaskApproval;
        }
    },
    data(){
        return{
            loadingTaskList:false,
            allTaskInNode:[],
            index:-1,
            selectObj:-1,
            docObjInfo: {
                docObjId: "",
            },
        }
    },
    methods:{
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
        closeDetail() {
            this.$emit("changeSideBySide",false);
        },
        async getData(){
           
            let self=this;
             if (self.nodeInfo.process_definition_id) {
                 let filter={};
                filter.sort= "createTime";
                filter.order= "desc";
                filter.processDefinitionId=self.nodeInfo.process_definition_id;
                filter.taskDefinitionKey=self.nodeInfo.activity_id;
                filter.includeProcessVariables=true;
                let res = await BPMNEngine.getTask(filter);
                self.allTaskInNode=res.data;
            }
           
        },
        selectObject(obj, idx){
            this.selectObj=idx;
            let desc=JSON.parse(obj.description);
            this.docObjInfo.docObjId= String(desc.action.parameter.documentObjectId);
            this.$emit("changeSideBySide",true);
        },
        selectedAllTask(value){
            let allTask=this.listTaskApproval;
            //let allTask=this.allTaskInNode;
            for (var key in allTask) {
                this.$set(this.listTaskApproval[key],'checked',value);
            }
            this.$emit("changeValueCheckBox",this.listTaskApproval);
        },
        changeValueCheckBox(){
            this.$emit("changeValueCheckBox",this.listTaskApproval);
        }
       
    },
    created(){
       this.getData();
    }
}
</script>

<style scoped>
.d-active {
    background: #f5f5f5;
}
.detailDoc >>>.wrap-content-detail{
    height: calc(100%)!important;
}
</style>