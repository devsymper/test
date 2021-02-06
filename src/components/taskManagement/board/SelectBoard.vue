<template>
    <v-card v-show="isShow" class="card-add-board" @click:stop:prevent="onCardClick($event)" :style="position"> 
        <div class="card-title">Chọn Board</div>
        <VuePerfectScrollbar>
            <v-list-item
                link
                v-for="(board,index) in listBoard"
                :key="index"
                @click="onItemClick(board)"
                >
                <v-list-item-icon>
                    <v-icon v-if="board.type == 'kanban'">mdi-view-dashboard-variant-outline</v-icon>
                    <v-icon v-else>mdi-chart-timeline</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ board.name }}</v-list-item-title>
                </v-list-item-content>
                <v-icon @click.stop.prevent="deleteBoard(board, index)" small>mdi-trash-can-outline</v-icon>
            </v-list-item>
        </VuePerfectScrollbar>
        <div class="mt-2" style="text-align:center;margin-top:4px">
            <v-btn :loading="isLoadingAdd"  small  depressed @click="dialogAddBoard=true">
                <v-icon size="18">mdi-plus</v-icon>
                <span class="ml-2">{{$t("common.add")}}</span>
            </v-btn>
        </div>
        <v-dialog
            v-model="dialogAddBoard"
            persistent
            max-width="500px"
            scrollable
        >
            <v-card>
            <v-card-title>
                <span class="fs-16">Create board</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <div>
                        <form-tpl
                        :allInputs="dataBoardProps"/>
                    </div>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    :loading="isLoadingAdd"
                    class="btn-add"
                    @click="handleAddBoard"
                >
                    {{$t("common.add")}}
                </v-btn>

                <v-btn
                color="red darken-1"
                text
                @click="dialogAddBoard = false"
                >
                    {{$t("common.close")}}
                </v-btn>
           
            </v-card-actions>
            </v-card>
        </v-dialog>


    </v-card>
</template>
<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import FormTpl from "@/components/common/FormTpl.vue";
import KanbanWorker from 'worker-loader!@/worker/taskManagement/kanban/Kanban.Worker.js';
import { documentApi } from '../../../api/Document';

export default {
    components:{
        VuePerfectScrollbar,
        FormTpl
    },
    props:{

    },
    computed:{
        sTaskManagement() {
            return this.$store.state.taskManagement;
        },
        listBoard(){
            return this.$store.state.taskManagement.listBoardInProject;
        }
    },
    data(){
        return {
            kanbanWorker:null,
            isLoadingAdd:false,
            dialogAddBoard:false,
            isShow:false,
            position:{top:'120px'},
            dataBoardProps:{
                name : { 
                    title: "Name",
                    type: "text",
                    value: '',
                    validateStatus:{
                        isValid:true,
                        message:"Error"
                    },
                    validate(){
                        if (this.value=="") {
                            this.validateStatus.isValid=false;
                            this.validateStatus.message="Không bỏ trống";
                        }else{
                            this.validateStatus.isValid=true;
                            this.validateStatus.message="";
                        }
                    }
                },
                description : {
                    title: "Mô tả",
                    type: "text",
                    value: '',
                    validateStatus:{
                        isValid:true,
                        message:""
                    },
                    validate(){
                    }
                },
                type : {
                    title: "Loại board",
                    type: "select",
                    value: 'kanban',
                    validateStatus:{
                        isValid:true,
                        message:""
                    },
                    options:[{value:'kanban',text:'kanban'},{value:'scrum',text:'scrum'}],
                    validate(){
                        if (this.value=="") {
                            this.validateStatus.isValid=false;
                            this.validateStatus.message="Không bỏ trống";
                        }else{
                            this.validateStatus.isValid=true;
                            this.validateStatus.message="";
                        }
                    }
                }
            }
        }
    },
    methods:{
        show(e){
            this.isShow = true;
        },
        hide(){
            this.isShow = false;
        },
        onCardClick(e){
            e.preventDefault();
            e.stopPropagation();
        },
        onItemClick(item){
            this.$emit("selected-item-board", item);
            this.hide();
        },
        handleAddBoard(){
            this.isLoadingAdd = true;
            let isValid = this.validateData();
            if (isValid) {
                let data={};
                data.name=this.dataBoardProps.name.value;
                data.description=this.dataBoardProps.description.value;
                data.type=this.dataBoardProps.type.value;
                data.projectId=this.$route.params.id;

                this.kanbanWorker.postMessage({
                    action:'handleAddBoard',
                    data:data
                });
            }else{
                this.$snotifyError("", "Have error!");
                this.isLoadingAdd=false;
            }
        },
        validateData(){
            let data=this.dataBoardProps;
            for (var key in data) {
                data[key].validate();
                if (data[key].validateStatus.isValid==false) {
                    return false
                }
            }
            return true;
        },
        deleteBoard(board, index){
            let thisCpn = this;
            documentApi
            .deleteDocumentObject({objectIds:JSON.stringify([board.documentObjectId])})
            .then(res => {
                if (res.status == 200) {
                    thisCpn.$snotify({
                        type: "success",
                        title: "Delete board successful"
                    });
                    thisCpn.listBoard.splice(index, 1)
                }
                else{
                    thisCpn.$snotify({
                        type: "error",
                        title: res.messagr
                    });  
                }
            })
            .catch(err => {
            })
            .finally(() => {});
        }
    },
    created(){
        let self = this;
        this.kanbanWorker = new KanbanWorker();
        this.kanbanWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'actionError':
                    self.$snotifyError("", "Update status error!");
                    self.isLoadingAdd = false;
                    break;
                case 'handleAddBoard':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit("taskManagement/addBoardToStore", res.data);
                        self.$snotifySuccess("Add board type success!");
                        self.dialogAddBoard=false;
                        self.isLoadingAdd = false;
                    }
                    break;
             
                default:
                    break;
            }
        });

    }
}
</script>
<style scoped>
    .card-add-board{
        max-height: 500px;
        width: 230px;
        top: 40px;
        left: 15px;
        z-index: 10;
        position: absolute;
        background: white;
        padding: 8px;
        font-size: 13px;
        box-shadow: var(--symper-box-shadow-bottom);
    }
    .card-title{
        color: var(--symper-sub-text-color-default);
    }
    .card-add-board >>> .v-list-item__title{
        font-size: 13px;
    }
    .card-add-board >>> .v-list-item .v-list-item__icon{
        margin: 10px 12px 8px 0;;
    }
    .card-add-board >>> .v-list-item .v-list-item__icon .v-icon{
        font-size: 18px;
    }
    .card-add-board >>> .v-list-item{
        min-height: 24px !important;
    }
</style>