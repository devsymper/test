<template>
    <div class="w-100">
        <TaskDetail
            :taskInfo="data.taskInfo"
            :originData="data.originData"
            :parentHeight="taskDetailHeight" 
            @close-detail="closeDetail"
            >
        </TaskDetail>
    </div>
</template>

<script>
import TaskDetail from "./TaskDetail";
import BPMNEngine from '@/api/BPMNEngine';
import { extractTaskInfoFromObject, addMoreInfoToTask } from '@/components/process/processAction';
import { util } from '@/plugins/util';

export default {
    data: function(){
        return {
            data: {
                taskInfo: {},
                originData: {}
            },
            taskDetailHeight: 500
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
            self.setTaskInfo()
        }).catch((err) => {

        });
    },
    mounted(){
        this.taskDetailHeight = util.getComponentSize(this).h;
    },
    methods: {
        async setTaskInfo(){
            let self=this;
            if(this.$route.params.id){
                let task = await BPMNEngine.getATaskInfo(self.$route.params.id);
                debugger
                let taskInfo = extractTaskInfoFromObject(task);
                task = addMoreInfoToTask(task);
                self.$set(self.data, 'taskInfo', taskInfo);
                self.$set(self.data, 'originData', task);
            }
        },
        closeDetail(){
            this.$router.push("/myitem");
        }
    }
}
</script>

<style>

</style>