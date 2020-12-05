<template>
    <compSettingBoard
        v-if="Object.keys(infoBoard).length>0"
        :infoBoard="infoBoard"
        :listColumn="listColumn"
     />
</template>

<script>
import compSettingBoard from '../../../components/taskManagement/board/SettingBoard.vue';
import { taskManagementApi } from "@/api/taskManagement.js";

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
            listColumn:[],
        }
    },
    methods:{
        async getListColumn(){
            if (this.sTaskManagement.listColumnInBoard.length > 0 ) {
                this.listColumn = this.sTaskManagement.listColumnInBoard;
            }else{
                debugger
                let idBoard = this.$route.params.idBoard;
                let res = await taskManagementApi.getListColumn(idBoard);
                if (res.status==200 && res.data) {
                    this.listColumn=res.data.listObject;
                    this.$store.commit("taskManagement/setListColumnInBoard", res.data.listObject);
                }
            }
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
        this.getListColumn();
    }
}
</script>

<style>

</style>