<template>
    <div class="w-100 h-100 pa-2 fs-13" v-if="infoItem.id">
        <div>
            <v-icon class="fs-16 pr-1">{{infoItem.icon}}</v-icon>
            <span>{{infoItem.name}}</span>
            <span style="float:right">
                {{$moment(infoItem.time).format('DD/MM/YY HH:mm:ss')}}
                <v-icon class="grey--text lighten-2 ml-1" x-small>mdi-clock-time-nine-outline</v-icon>
            </span>
            
        </div>
        <div v-if="activityType=='startEvent'">
            start node
        </div>
        <div v-else>
            avvvđ
        </div>

    </div>
</template>

<script>
import BPMNEngine from "@/api/BPMNEngine";
import { taskApi } from "@/api/task.js";

export default {
    data(){
        return{
            activityType:"",
            filterVariables:{
                names:"symper_user_id_start_workflow",
                processInstanceIds:[]
            },
            userStart:{}
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
            }
		
		}
    },
    methods:{
        async checkTypeActivity(newVl){
            this.activityType=newVl.activityType;
            if (this.activityType=="startEvent") {
                await this.getVariableUserStart(newVl.processInstanceId);
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
                self.userStart.startUserId = userIdStart;
                self.userStart.startUserName = allUserById[work.startUserId] ? allUserById[work.startUserId].displayName : '';
                self.userStart.roleInfo = roleInfo;
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