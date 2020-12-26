<template>
    <compSettingBoard
        v-if="infoBoard"
        :infoBoard="infoBoard"
        :listColumn="listColumn"
        :listStatusColumn="listStatusColumn"
     />
</template>

<script>
import compSettingBoard from '../../../components/taskManagement/board/SettingBoard.vue';
import { taskManagementApi } from "@/api/taskManagement.js";
import { util } from '../../../plugins/util';

export default {
    components: { compSettingBoard },
    name:"settingBoard",
    computed:{
        sTaskManagement(){
            return this.$store.state.taskManagement;
        },
        listColumn(){
            let idBoard = this.$route.params.idBoard;
            let arrColumn = [];
            if (this.sTaskManagement.listColumnInBoard[idBoard] && this.sTaskManagement.listColumnInBoard[idBoard].length >= 0 ) {
                let columns = util.cloneDeep(this.sTaskManagement.listColumnInBoard[idBoard]);
                for (let i = 0; i < columns.length; i++) {
                    let obj={};
                    obj.statusInColumn = [];
                    obj.name = columns[i].name;
                    obj.id = columns[i].id;
                    obj.position = columns[i].position;
                    obj.isHidden = (columns[i].isHidden == 1) ? true : false ;
                    obj.isBacklog = columns[i].isBacklog == 1 ? true : false;
                    arrColumn.push(obj);
                }
            }
            return arrColumn;
        },
        listStatusColumn(){
            let idBoard=this.$route.params.idBoard;
            if (this.sTaskManagement.listStatusInColumnBoard[idBoard]) {
                return this.sTaskManagement.listStatusInColumnBoard[idBoard];
            }else{
                return [];
            }
        }
    },
    data(){
        return{
            infoBoard:{},
        }
    },
    methods:{
    },
    created(){
        let idBoard=this.$route.params.idBoard;
        let allBoard=this.sTaskManagement.listBoardInProject;
        let projectId=this.$route.params.id;
        if (allBoard.length>0) {
            let currentBoard=allBoard.find(ele => ele.id == idBoard);
            if (currentBoard) {
                this.infoBoard=currentBoard;
            }
        }
        else{
            taskManagementApi.getDetailBoard(idBoard).then(res=>{
                if(res.status == 200){
                    this.infoBoard = res.data;
                }
            }).always({}).catch({})
        }
        if (!this.$store.state.taskManagement.listStatusInProjects[projectId] || this.$store.state.taskManagement.listStatusInProjects[projectId].length == 0) {
            this.$store.dispatch("taskManagement/getListStautsInProject", projectId);
        }
        if (!this.$store.state.taskManagement.listColumnInBoard[idBoard] || this.$store.state.taskManagement.listColumnInBoard[idBoard].length == 0) {
            this.$store.dispatch("taskManagement/getListColumnInBoard",idBoard);
        }
        if (!this.$store.state.taskManagement.listStatusInColumnBoard[idBoard] || this.$store.state.taskManagement.listStatusInColumnBoard[idBoard].length == 0) {
            this.$store.dispatch("taskManagement/getListStatusInColumnBoard",idBoard);
        }
    }
}
</script>

<style>

</style>