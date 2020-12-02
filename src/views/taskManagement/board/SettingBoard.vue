<template>
    <compSettingBoard
        v-if="Object.keys(infoBoard).length>0"
        :infoBoard="infoBoard"
     />
</template>

<script>
import compSettingBoard from '../../../components/taskManagement/board/SettingBoard.vue';

export default {
    components: { compSettingBoard },
    name:"settingBoard",
    computed:{
        sTaskManagement(){
            return this.$store.state.taskManagement;
        }
    },
    data(){
        return{
            infoBoard:{},
        }
    },
    created(){
        let idBoard=this.$route.params.idBoard;
        let allBoard=this.sTaskManagement.listBoardInProject;
        if (allBoard.length>0) {
            let currentBoard=allBoard.find(ele => ele.id == idBoard);
            if (currentBoard) {
                this.infoBoard=currentBoard;
            }
        }
    }
}
</script>

<style>

</style>