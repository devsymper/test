<template>
    <div class="wraper-loader">
        <preloader ref="preLoaderView"/>
        <kanban-board 
        ref="boardView"
        :key="projectId+board"
    />
    </div>
   

</template>

<script>
import KanbanBoard from '@/components/taskManagement/board/KanbanBoard.vue';
import Preloader from '../../../components/common/Preloader.vue';

export default {
    name: "Board",
    components: {
        KanbanBoard,
        Preloader
    },
 
    data() {
        return {
            projectId:null,
            board:0,
           
        };
    },
   
    methods:{
  
    },
    created(){
        let self = this;
        self.projectId = this.$route.params.id;
    },
    
};
</script>

<style scoped>
    .wraper-loader{
        position: relative;
        width: inherit;
        height: inherit;
    }
</style>
