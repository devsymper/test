<template>
    <div class="w-100" v-if="data.originData.id">
        <TaskDetail
            :taskInfo="data.taskInfo"
            :originData="data.originData"
            :parentHeight="taskDetailHeight" 
            :allVariableProcess="variableProcess"
            @close-detail="closeDetail"
            @task-submited="handleTaskSubmited"
            >
        </TaskDetail>
    </div>
</template>

<script>
import TaskDetail from "./TaskDetail";
import BPMNEngine from '@/api/BPMNEngine';
import { extractTaskInfoFromObject, addMoreInfoToTask } from '@/components/process/processAction';
import { util } from '@/plugins/util';
import { taskApi } from "@/api/task.js";
export default {
    name:"DoTask",
    data: function(){
        return {
            data: {
                taskInfo: {},
                originData: {}
            },
            taskDetailHeight: 500,
            variableProcess:[],
            filterVariables:{
                names:"symper_application_id",
                page:1,
                processInstanceIds:[]
            },
        }
    },
    watch:{
        $route(to, from) {
            this.setTaskInfo();
        }
    },
    components: {
        TaskDetail: TaskDetail
    },
    beforeCreate(){
    },
    created(){
        let self = this;
        this.$store.dispatch('process/getAllDefinitions').then((res) => {
            self.setTaskInfo();
        }).catch((err) => {

        });
    },
    mounted(){
        this.taskDetailHeight = util.getComponentSize(this).h;
    },
    methods: {
        async setTaskInfo(){
            let self=this;
            if(self.$route.params.id){
                let filter={};
                filter.taskId=self.$route.params.id;
                let res = await BPMNEngine.postTaskHistory(filter);
                if (res.total>0) {
                    let task=res.data[0];
                    if (task.endTime && task.endTime!=null) {
                        self.$store.commit("task/setFilter", 'done');
                    }else{
                        self.$store.commit("task/setFilter", 'notDone');
                    }
                    let taskInfo = extractTaskInfoFromObject(task);
                    task = addMoreInfoToTask(task);
                    self.$set(self.data, 'taskInfo', taskInfo);
                    self.$set(self.data, 'originData', task);
                    if (task.processInstanceId && task.processInstanceId!=null) {
                        await self.getVariablesProcess(task.processInstanceId)
                    }
                }
            }
        },
        async getVariablesProcess(processInstanceId){
            let self=this;
            let arrProcess=[];
            arrProcess.push(processInstanceId);
            self.filterVariables.processInstanceIds=JSON.stringify(arrProcess);
            let resVariable = {};
            resVariable =await taskApi.getVariableWorkflow(self.filterVariables);
            self.variableProcess=resVariable.data;
        },
        closeDetail(){
            this.$router.push("/myitem");
        },
        handleTaskSubmited(){
            this.$store.commit("task/setIsStatusSubmit",true);
            this.$router.push('/myitem');
        }
    }
}
</script>

<style>

</style>