<template>
    <v-card v-show="isShow" class="card-add-board" @click:stop:prevent="onCardClick($event)" :style="position"> 
        <div class="card-title">Board trong project A</div>
        <VuePerfectScrollbar>
            <v-list-item
                link
                v-for="(board,index) in listBoard"
                :key="index"
                @click="onItemClick(board)"
                >
                <v-list-item-icon>
                    <v-icon>mdi-view-week-outline</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ board.name }}</v-list-item-title>
                </v-list-item-content>
                
            </v-list-item>
        </VuePerfectScrollbar>
        <div style="text-align:center">
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
import { taskManagementApi } from "@/api/taskManagement.js";
import FormTpl from "@/components/common/FormTpl.vue";

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
            isLoadingAdd:false,
            dialogAddBoard:false,
            isShow:false,
            position:{top:0},
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
            }
        }
    },
    methods:{
        show(e){
            this.isShow = true;
            this.position.top = e.y +20 + "px"
        },
        hide(){
            this.isShow = false;
        },
        onCardClick(e){
            e.preventDefault();
            e.stopPropagation();
            console.log("ádasdasdsa",e);
        },
        onItemClick(item){
            this.$evtBus.$emit("selected-item-board", item);
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
                data.projectId=this.$route.params.id;

                taskManagementApi
                    .addBoardForProject(data)
                    .then(res => {
                        if (res.status == 200) {
                            this.$store.commit("taskManagement/addBoardToStore", res.data);
                            this.$snotifySuccess("Add board type success!");
                            this.dialogAddBoard=false;
                        }else{
                            this.$snotifyError("", "Can not add board type!");
                        }
                    })
                    .catch(err => {
                        this.$snotifyError("", "Can not add board type!", err);
                    })
                    .always(() => {});
                
            }else{
                this.$snotifyError("", "Have error!");
            }
            this.isLoadingAdd=false;
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
    },
    created(){
       
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
    }
    .card-title{
        color: var(--symper-sub-text-color-default);
    }
    .card-add-board >>> .v-list-item__title{
        font-size: 13px;
    }
    .card-add-board >>> .v-list-item .v-list-item__icon{
        margin: 12px 12px 8px 0;;
    }
    .card-add-board >>> .v-list-item .v-list-item__icon .v-icon{
        font-size: 18px;
    }
    .card-add-board >>> .v-list-item{
        min-height: 24px !important;
    }
</style>