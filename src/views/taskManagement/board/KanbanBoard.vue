<template>
    <div class="wraper-loader">
        <preloader ref="preLoaderView"/>
        <kanban-board 
        ref="boardView"
        @loaded-content="afterLoadContent"
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
 
    methods:{
        afterLoadContent(){
            this.$refs.preLoaderView.hide();
        }
    },
    
};
</script>

<style scoped>
    .wraper-loader{
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>
