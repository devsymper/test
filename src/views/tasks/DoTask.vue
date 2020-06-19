<template>
    <div class="w-100">
        <TaskDetail
            :taskInfo="taskInfo">

        </TaskDetail>
    </div>
</template>

<script>
import TaskDetail from "./taskDetail.vue";
import BPMNEngine from '../../api/BPMNEngine';

export default {
    data: function(){
        return {
            taskInfo: {}
        }
    },
    components: {
        TaskDetail: TaskDetail
    },
    created(){
        this.setTaskInfo()
    },
    methods: {
        async setTaskInfo(){
            if(this.$route.params.id){
                let taskInfo = await BPMNEngine.getATaskInfo(this.$route.params.id);
                try {
                    taskInfo = JSON.parse(taskInfo.description);
                    if(taskInfo){
                        this.taskInfo = taskInfo;
                    }else{
                        this.$snotifyError({message: 'nul value'}, 'Can not get data from task description!');
                    }
                } catch (error) {
                    this.$snotifyError(error, 'Can not get data from task description!');
                }
            }
        }
    }
}
</script>

<style>

</style>