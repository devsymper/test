<template>
    <div class="w-100 h-100 pa-2 fs-13" v-if="infoItem.id">
        <div class="mb-1">
            <v-icon style="font-size:22px">{{infoItem.icon}}</v-icon>
            <span class="fs-13 pl-2">{{infoItem.name}}</span>
            <span style="float:right ">
                {{$moment(infoItem.time).format('DD/MM/YY HH:mm:ss')}}
                <v-icon class="grey--text lighten-2 ml-1" x-small>mdi-clock-time-nine-outline</v-icon>
            </span>
        </div>
        <div v-if="activityType=='startEvent'">
            <div style="height: 25px" class=" fs-13 font-weight-medium">
                <span>
                    <v-icon class="mr-3" size="18">mdi-account</v-icon> 
                    <span mt-1>{{$t("tasks.header.userCreate")}}</span>
                </span>
            </div>
            <div class="pl-7 justify-space-between user-show">
                <symperAvatar :size="20"  :userId="userStart.startUserId" />
                <span class="ml-1">{{userStart.startUserName}}</span>
                <div class="fs-11 ml-5 grey--text" v-if="userStart.roleInfo">{{userStart.roleInfo.name}}</div>
            </div>
        </div>
        <div v-else-if="activityType=='userTask' && taskCurrent.id">
            <div class="pt-2">
                <span style="padding-left:30px">{{taskCurrent.name}}</span>
                <span style="float:right">
                    <span>
                        {{commentCountPerTask['task:' + taskCurrent.id]}}
                    </span>
                    <span class="pl-1">
                        <v-icon class="fs-14" >mdi-comment-processing-outline</v-icon>
                    </span>
                    <span class="ml-3">
                        {{fileCountPerTask['task:' + taskCurrent.id]}}
                    </span>
                    <span class="pl-1">
                        <v-icon class="fs-14" >mdi-attachment</v-icon>
                    </span>
                </span>
            </div>
            <div class="mt-2">
                <span>
                    <v-icon class="mr-3" size="18">mdi-account</v-icon> 
                    <span>{{$t("tasks.header.participant")}}</span>
                </span>
                <div class="pl-7 mt-2">
                    <!-- người được giao -->
                    <v-row  class="fs-13 font-weight-medium">
                        <v-col class="pa-0">
                            <span>
                            <v-icon class="mr-3" size="18">mdi-account-plus</v-icon> 
                            <span mt-1>{{$t("tasks.header.assignee")}}</span>
                            </span>
                        </v-col>
                        <v-col class="pa-0">
                            <symperAvatar :size="20"  :userId="taskCurrent.assigneeInfo.id" />
                            <span class="ml-1">{{taskCurrent.assigneeInfo.displayName}}</span>
                            <div class="fs-11 ml-5 grey--text" v-if="taskCurrent.assigneeRole">{{taskCurrent.assigneeRole.name}}</div>
                        </v-col>
                    </v-row>
                    <!-- người sở hữu -->
                    <v-row  class="fs-13 mt-2 font-weight-medium">
                        <v-col class="pa-0">
                            <span>
                                <v-icon class="mr-3" size="18">mdi-account-check</v-icon> 
                                <span mt-1>{{$t("tasks.header.owner")}}</span>
                            </span>
                        </v-col>
                        <v-col class="pa-0">
                            <symperAvatar v-if="taskCurrent.ownerInfo.id" :size="20" :userId="taskCurrent.ownerInfo.id" />
                            <symperAvatar v-else :size="20" :userId="taskCurrent.assigneeInfo.id" />
                            <span>{{taskCurrent.ownerInfo.id ? taskCurrent.ownerInfo.displayName: taskCurrent.assigneeInfo.displayName }}</span>
                            <div class="fs-11 ml-5 grey--text" v-if="taskCurrent.ownerRole">{{taskCurrent.ownerRole.name}}</div>
                        </v-col>
                       
                  </v-row>
                </div>
            </div>
           
        </div>
        <div v-else-if="activityType=='approvalTask'">
            avvvđ
        </div>
    </div>
</template>

<script>
import BPMNEngine from "@/api/BPMNEngine";
import { taskApi } from "@/api/task.js";
import symperAvatar from "@/components/common/SymperAvatar.vue";
import {
  extractTaskInfoFromObject,
  addMoreInfoToTask
} from "@/components/process/processAction";
export default {
    components:{
        symperAvatar
    },
    computed:{
        fileCountPerTask(){
            return this.$store.state.file.fileCountPerObj.list;
        },
        commentCountPerTask(){
            return this.$store.state.comment.commentCountPerObj.list;
        },
       
    },
    data(){
        return{
            activityType:"",
            filterVariables:{
                names:"symper_user_id_start_workflow",
                processInstanceIds:[]
            },
            userStart:{},
            taskCurrent:{},
        }
    },
    props:{
        infoItem:{
           type: Object,
			default: () => {}
        }
    },
    watch:{
      	infoItem:function(newVl){
            if (newVl) {
                this.checkTypeActivity(newVl);
                this.$store.dispatch('file/getWaitingFileCountPerObj');
                this.$store.dispatch('comment/getWaitingCommentCountPerObj');
            }
		
		}
    },
    created(){
        this.checkTypeActivity(this.infoItem);
    },
    methods:{
        async checkTypeActivity(newVl){
            this.activityType=newVl.activityType;
            if (this.activityType=="startEvent") {
                await this.getVariableUserStart(newVl.processInstanceId);
            }else if(this.activityType=="userTask"){
                await this.getInfoTask(newVl.taskId);
            }
          
        },
        async getInfoTask(taskId){
            let filter={};
            filter.taskId=taskId;
            let res= await BPMNEngine.postTaskHistory(filter);
            if (res.total>0) {
                this.taskCurrent=res.data[0];
                addMoreInfoToTask(this.taskCurrent);
                let taskIden = [];
                taskIden.push('task:'+ this.taskCurrent.id);

                this.$store.commit('file/setWaitingFileCountPerObj', taskIden);
                this.$store.commit('comment/setWaitingCommentCountPerObj', taskIden);
                this.$store.dispatch('file/getWaitingFileCountPerObj');
                this.$store.dispatch('comment/getWaitingCommentCountPerObj');
            
                // let desc=JSON.parse(this.taskCurrent.description);
                // if (desc.action.action=="submit") {
                //     this.activityType="submitTask";
                // }else if(desc.action.action=="approval"){
                //     this.activityType="approvalTask";
                // }
            }
        },
        async getVariableUserStart(processInstanceId){
            let self=this;
            let processIds=[];
            processIds.push(processInstanceId);
            self.filterVariables.processInstanceIds=JSON.stringify(processIds);
            self.filterVariables.names="symper_user_id_start_workflow";
            let resVariable = {};
            resVariable = await taskApi.getVariableWorkflow(self.filterVariables);
            if (resVariable.status==200 && resVariable.data.length>0) {
                let allUserById = this.$store.getters['app/mapIdToUser'];
                let dataVariable=resVariable.data[0];
                let userIdStart=dataVariable.value;
                let roleInfo={};
                if (dataVariable.value.indexOf(":")>0) {  //check là userId hay userId:role
                    let arrDataUserIden=dataVariable.value.split(":");
                    userIdStart=arrDataUserIden[0];
                    if (arrDataUserIden.length>3) { // loại trừ trường hợp role=0
                        let roleIdentify=dataVariable.value.slice(userIdStart.length+1);
                        roleInfo=this.getRoleUser(roleIdentify);
                    }
                }
                self.$set(self.userStart,"startUserId",userIdStart);
                self.$set(self.userStart,"startUserName",allUserById[self.userStart.startUserId] ? allUserById[self.userStart.startUserId].displayName : '');
                self.$set(self.userStart,"roleInfo",roleInfo);
            }

        },
        getRoleUser(roleIdentify){
            let arrDataRole=roleIdentify.split(":");
            let allSymperRole=this.$store.state.app.allSymperRoles;
            let role=(allSymperRole[arrDataRole[0]]).find(element => element.roleIdentify===roleIdentify);
            return role;
        },  


    }
    
}
</script>

<style>

</style>