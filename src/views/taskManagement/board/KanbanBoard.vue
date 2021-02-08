<template>
    <div class="wraper-loader">
        <preloader ref="preLoaderView"/>
        <kanban-board 
            ref="boardView"
            @loaded-content="afterLoadContent"
            @loading="beforeLoadContent"
        />
        <no-data :message="'Chưa cài đặt Sprint (gợi ý: Backlog -> Create Sprint)'" v-if="isNoData"/>
    </div>
</template>

<script>
import KanbanBoard from '@/components/taskManagement/board/KanbanBoard.vue';
import Preloader from '../../../components/common/Preloader.vue';
import NoData from '../../../components/common/NoData.vue';

export default {
    name: "Board",
    components: {
        KanbanBoard,
        Preloader,
        NoData
    },
 
    methods:{
        afterLoadContent(){
            this.$refs.preLoaderView.hide();
        },
        beforeLoadContent(){
            this.$refs.preLoaderView.show();
        }
    },
 
    data(){
        return {
            isNoData:false
        }
    }
};
</script>

<style scoped>
    .wraper-loader{
        position: relative;
        width: 100%;
        height: 100%;
    }
    .wraper-loader >>> .preloader{
        z-index: 98 !important;
    }
</style>
