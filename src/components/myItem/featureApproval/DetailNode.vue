<template>
    <div class="w-100 h-100">
        <VuePerfectScrollbar
            v-if="!loadingTaskList"
        >
            <v-row
                v-for="(obj, idx) in listTaskApproval"
                :key="obj.id"
                :index="obj.id"
                :class="{
                        'mr-0 ml-0 single-row': true ,
                        'd-active':index==idx
                    }"
                @click="selectObject(obj, idx)"
                style="border-bottom: 1px solid #eeeeee!important;max-height:40px"
            >
                <v-col
                    cols="1"
                    class="fs-13 px-1 py-0 pl-3"
                >
                    <v-checkbox
                        ref="listCheck"
                        v-model="obj.checked"
                        class="checkBoxTask pa-0 ma-0"
                        @change="changeValueCheckBox"
                    ></v-checkbox>
                </v-col>

                <v-col cols="2" class="pl-1 pr-1 pb-1 pt-0">
                    <div class="pl-3">
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
                    style="line-height: 42px"
                    cols="2"
                    class="fs-12 px-1 py-0"
                >
                <!-- <symperAvatar :size="20" :userId="obj.assigneeInfo.id" />
                {{obj.assigneeInfo.displayName}} -->
                </v-col>
                <v-col
                    style="line-height: 42px"
                    cols="2"
                    class="fs-12 px-1 py-0"
                    >
                <!-- <symperAvatar v-if="obj.ownerInfo.id" :size="20" :userId="obj.ownerInfo.id" />
                <symperAvatar v-else :size="20" :userId="obj.assigneeInfo.id" />
                    {{obj.ownerInfo.id ? obj.ownerInfo.displayName: obj.assigneeInfo.displayName }} -->
                </v-col>
                <v-col
                    style="line-height: 42px"
                    cols="2"
                    class="fs-13 px-1 py-0"
                >
                    <span class="mt-1">{{obj.dueDate ==null? '':$moment(obj.dueDate).fromNow()}}</span>
                </v-col>
                <v-col
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
                            <!-- <div
                                class="fs-11 pr-6 text-ellipsis"
                            >{{selectNameApp(obj.variables)}}</div> -->
                        </div>
                    </div>
                    
                </v-col>
                <v-col
                    cols="1"
                    class="fs-13 px-1 py-0"
                >
                    <div class="pl-1">
                        <div style="width:55px">
                            <v-icon class="fs-14" style="float:right;margin-top:4px;margin-right:12px">mdi-comment-processing-outline</v-icon> 
                        </div>
                        <div style="width:55px"> 
                            <v-icon class="fs-14" style="float:right;margin-top:4px;margin-right:12px">mdi-attachment</v-icon>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </VuePerfectScrollbar>
    </div>
</template>

<script>
import BPMNEngine from "@/api/BPMNEngine";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
    props: {
        nodeInfo: {
            type: Object,
            default(){
                return {}
            }
        },
    },
    components: {
        VuePerfectScrollbar: VuePerfectScrollbar,
    },
    watch:{
        nodeInfo(newVl) {
           this.getData();
        },
           
    },
    computed:{
        listTaskApproval(){
            let allTask=this.allTaskInNode;
            let listTaskApproval=[];
            for (var key in allTask) {
                if (allTask[key].description && allTask[key].description!= null) {
                    let desc=JSON.parse(allTask[key].description);
                    let action=desc.action;
                    if (action.action=="approval") {
                        allTask[key].taskData = JSON.parse(allTask[key].description);
                        allTask[key].checked = false;
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
        }
    },
    methods:{
        async getData(){
            let self=this;
            let filter={};
            filter.sort= "createTime";
            filter.order= "desc";
            filter.processDefinitionId=self.nodeInfo.process_definition_id;
            filter.taskDefinitionKey=self.nodeInfo.activity_id;
            let res = await BPMNEngine.getTask(filter);
        
            self.allTaskInNode=res.data;
        },
        selectObject(){

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

</style>