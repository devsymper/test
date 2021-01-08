<template>
       <div class="w-100 h-100">
        <div style="height:100%">
            <v-card style="box-shadow:none">
                <v-card-title>
                    {{$t("taskManagement.listPriority")}}
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Tìm kiếm"
                        dense
                        solo
                        style="max-width:255px;"
                        single-line
                        hide-details
                        class="sym-small-size sym-style-input"
                    ></v-text-field>
                    <v-btn small class="px-1 ml-1" solo depressed @click="handleCreate" >
                        <span>Create priority</span>
                    </v-btn>
                </v-card-title>
                <v-data-table
                    :headers="headers"
                    :search="search"
                    hide-default-footer
                    class="table-list-priority"
                >
                    <template v-slot:body>
                        <draggable
                            :list="listPriority"
                            tag="tbody"
                            :animation="200"
                            @change="handleChangeLevel"
                            >
                            <tr v-for="item in listPriority" :key="item.id">
                                <td>
                                    <span class="name-project" style="color:#0000aa">
                                        {{item.name}}
                                    </span>
                                </td>
                                <td>
                                    <span>
                                        {{item.description}}
                                    </span>
                                </td>
                                <td>
                                    <v-icon :color="item.color" v-if="!!item.icon && item.icon.indexOf('mdi-') > -1" class="pt-0" style="font-size:18px">{{item.icon}}</v-icon>
                                    <img class="img-fluid" style="object-fit: fill;border-radius:3px" v-else-if="!!item.icon && item.icon.indexOf('mdi-') < 0" :src="item.icon" width="18" height="18">
                                </td>
                                <td>
                                    <div :style="{ 'background': item.color ,'width':'50px','height':'20px'}" ></div>
                                </td>
                                <td>
                                    <infoUser class="userInfo fs-13" :userId="item.userCreate" :roleInfo="{}" />
                                </td>
                                
                                <td>
                                    <span>
                                        {{item.createAt}}
                                    </span>
                                </td>
                                <td>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-icon v-on="on" @click.prevent.stop="handleDetail(item)" style="font-size:20px">mdi-file-document-edit-outline</v-icon>
                                        </template>
                                        <span>Detail</span>
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-icon class="ml-2" v-if="item.common == 0" v-on="on" @click.prevent.stop="handleDelete(item)" style="font-size:20px">mdi-delete-outline</v-icon>
                                        </template>
                                        <span>Delete</span>
                                    </v-tooltip>
                                </td>
                            </tr>
                        </draggable>
                    </template>
                </v-data-table>
            </v-card>
        </div>
        <modalAddOrDetailPriority
            ref="modalAddOrDetailPriority"
            :dataPriorityProps="dataPriorityProps"
            :infoPriority="infoPriority"
            :statusDetail="statusDetail"
        />

        <v-dialog v-model="dialogRemove" max-width="350">
            <v-card>
            <v-card-title class="headline">{{$t("common.remove_confirm_title")}}</v-card-title>
            <v-card-text>{{$t("taskManagement.dialog.removePriority")}}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="removePriority">Xóa</v-btn>
                <v-btn color="green darken-1" text @click="dialogRemove = false">Hủy</v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
    
    </div>
</template>

<script>
import { util } from "@/plugins/util";
import infoUser from "@/components/common/user/InfoUser";
import { taskManagementApi } from "@/api/taskManagement.js";
import modalAddOrDetailPriority from "./ModalAddOrDetailPriority";
import draggable from "vuedraggable";

export default {
    components:{
        infoUser,
        modalAddOrDetailPriority,
        draggable
    },
    name:"listPriority",
    computed:{
        listPriority(){
            return this.$store.state.taskManagement.allPriority;
        }

    },
    data(){
        return{
            statusDetail:false,
            dialogRemove:false,
            search:'',
            headers: [
                {
                text: this.$t("taskManagement.table.name"),
                align: "start",
                value: "name"
                },
                { text: this.$t("taskManagement.table.description"), value: "description" },
                { text: "Icon", value: "icon" },
                { text: "Color", value: "color" },
                { text: this.$t("common.created_by"), value: "user" },
                { text: this.$t("taskManagement.table.createAt"), value: "createAt" },
                { text: "", value: "action" },
            ],
            dataPriorityProps:{
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
                color : {
                    title: "Color",
                    type: "color",
                    value: '',
                    validateStatus:{
                        isValid:true,
                        message:""
                    },
                    validate(){
                    }
                },
            },
            infoPriority:{
                id:"",
                name: "",
                description: "",
                icon: "",
                color: "",
                common: 0
            },
            prioritySelected:{}

        }
    },
    methods:{
        handleChangeLevel(data){
            let dataChange=[];
            let min =0, max =0;
            if (data.moved.oldIndex > data.moved.newIndex) {
                min = data.moved.newIndex;
                max = data.moved.oldIndex;
            }else{
                min = data.moved.oldIndex;
                max = data.moved.newIndex;
            }
            
            for (let i = min; i <= max ; i++) {
                let item={};
                item.id=this.listPriority[i].id;
                item.level=i+1;
                this.$set(this.listPriority[i],'level',i+1);
                dataChange.push(item);
            }

            if (dataChange.length > 0) {
                taskManagementApi
                .updateLevelPriority({data:JSON.stringify(dataChange)})
                .then(res => {
                    if (res.status == 200) {
                        let data={};
                        data.key = "allPriority";
                        data.value = this.listPriority;

                        this.$snotifySuccess("Update level priority success!");
                        this.$store.commit("taskManagement/addToTaskManagementStore",data); 
                    }else{
                        this.$snotifyError("", "Error! Have error !!!");
                    }
                })
                .catch(err => {
                    this.$snotifyError("", "Error! Have error !!!", err);
                });
            }

        },
        handleCreate(){
            this.dataPriorityProps.name.value="";
            this.dataPriorityProps.description.value="";
            this.infoPriority.id='';
            this.infoPriority.icon="mdi-arrow-up";
            this.infoPriority.description="";
            this.infoPriority.name="";
            this.infoPriority.color="";
            this.statusDetail=false;

            this.$refs.modalAddOrDetailPriority.show();
        },
        handleDetail(item){
            this.dataPriorityProps.name.value=item.name;
            this.dataPriorityProps.description.value=item.description;
            this.dataPriorityProps.color.value=item.color;

            this.infoPriority.id=item.id;
            this.infoPriority.icon=item.icon;
            this.infoPriority.description=item.description;
            this.infoPriority.name=item.name;
            this.infoPriority.color=item.color;
            this.infoPriority.common=item.common;

            this.statusDetail=true;
            this.$refs.modalAddOrDetailPriority.show();

        },
        handleDelete(item){
            this.prioritySelected=item;
            this.dialogRemove=true;
        },
        removePriority(){
            taskManagementApi
                .removePriority(this.prioritySelected.id)
                .then(res => {
                    if (res.status == 200) {
                        this.$snotifySuccess("Remove priority success!");
                        this.$store.commit("taskManagement/removePriorityToStore",this.prioritySelected.id);
                    }else{
                        this.$snotifyError("", "Error! Have error !!!");
                    }
                })
                .catch(err => {
                    this.$snotifyError("", "Error! Have error !!!", err);
                });
            this.dialogRemove=false;  
        }
   
    },



}
</script>

<style scoped>
.table-list-priority >>> td{
    font-size: 13px!important;
}
.sym-style-input >>> .v-input__slot{
    box-shadow: none !important;
}
</style>