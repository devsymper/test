<template>
   <kanban-board 
    ref="boardView"
    :key="projectId+board"
   />

</template>

<script>
import KanbanBoard from '@/components/taskManagement/board/KanbanBoard.vue';

export default {
    name: "Board",
    components: {
        KanbanBoard
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

</style>
