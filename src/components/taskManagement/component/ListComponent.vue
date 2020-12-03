<template>
    <div class="w-100 h-100">
        <div class="w-100 justify-space-between d-flex" style="height:40px">
            <div class="symper-title pl-2">{{title}}</div>
            <div class="d-flex pt-2 pr-4">
                <v-btn small class="px-1" solo depressed @click="handleCreate" color="#1976d2">
                    <v-icon color="white" size="18">mdi-plus</v-icon>
                    <span style="color:white">Create component</span>
                </v-btn>
            </div>
        </div>
            <!-- list category -->
        <div style="height:calc(100% - 40px)">
             <v-card style="box-shadow:none">
                <v-card-title>
                    {{$t("taskManagement.listComponent")}}
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
                </v-card-title>
                <v-data-table
                    v-if="allComponent.length>0"
                    :headers="headers"
                    :items="allComponent"
                    :search="search"
                    hide-default-footer
                    class="table-list-component"
                >
                    <template v-slot:[`item.name`]="{ item }">
                        <span class="name-title">{{item.name}}</span>
                    </template>
                    <template v-slot:[`item.user`]="{ item }">
                        <infoUser class="userInfo fs-13" :userId="item.userCreate" :roleInfo="{}" />
                    </template>
                    <template v-slot:[`item.userLeader`]="{ item }">
                        <infoUser class="userInfo fs-13" :userId="item.userLeader" :roleInfo="{}" />
                    </template>
                    <template  v-slot:[`item.action`]="{ item }">
                        <v-icon class="mr-2" @click.prevent.stop="handelDetailComponent(item)" style="font-size:20px">mdi-file-document-edit-outline</v-icon>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" @click.prevent.stop="handleDelete(item)" style="font-size:20px">mdi-delete-outline</v-icon>
                            </template>
                            <span>Delete</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-card>
        </div>
        <modalAddOrDetailComponent
            ref="modalAddOrDetailComponent"
            :dataComponentProps="dataComponentProps"
            :infoComponent="infoComponent"
            :statusDetail="statusDetail"
            :currentUserLeader="currentUserLeader"
            @add-component="addComponent"
        />

        <v-dialog v-model="dialogRemoveComponent" max-width="350">
            <v-card>
            <v-card-title class="headline">{{$t("common.remove_confirm_title")}}</v-card-title>
            <v-card-text>{{$t("taskManagement.dialog.removeComponent")}}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="removeComponent">Xóa</v-btn>
                <v-btn color="green darken-1" text @click="dialogRemoveComponent = false">Hủy</v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { taskManagementApi } from "@/api/taskManagement.js";
import modalAddOrDetailComponent from "./ModalAddOrDetailComponent";
import { util } from "@/plugins/util";
import infoUser from "@/components/common/user/InfoUser";

export default {
    name:"listComponent",
    components:{
        modalAddOrDetailComponent,
        infoUser
    },
    computed:{
        allComponent(){
            let listComponent=util.cloneDeep(this.listComponent);
            console.log("components",listComponent);
            return listComponent; 
        },
    },
    props:{
        listComponent: {
            type: Array,
            default() {
                return [];
            }
        },
       
    },
    data(){
        return{
            componentSelected:{},
            currentUserLeader:{id:''},
            statusDetail:false,
            dialogRemoveComponent:false,
            search:'',
            title:"Component",
            infoComponent:{
                id:"",
                name: "",
                description: "",
                userLeader:""
            },
            headers: [
                {
                text: this.$t("taskManagement.table.name"),
                align: "start",
                value: "name"
                },
                { text: this.$t("taskManagement.table.description"), value: "description" },
                { text: this.$t("taskManagement.table.lead"), value: "userLeader" },
                { text: this.$t("common.created_by"), value: "user" },
                { text: this.$t("taskManagement.table.createAt"), value: "createAt" },
                { text: "", value: "action" },
            ],
            dataComponentProps:{
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
            },
        }
    },
    methods:{
        addComponent(){
            this.$emit("add-component");
        },
        handleDelete(item){
            this.componentSelected=item;
            this.dialogRemoveComponent=true;
        },
        removeComponent(){
            taskManagementApi
                .removeComponent(this.componentSelected.id)
                .then(res => {
                    if (res.status == 200) {
                        this.$snotifySuccess("Remove component success!");
                        this.$emit("add-component");
                    }else{
                        this.$snotifyError("", "Error! Have error !!!");
                    }
                })
                .catch(err => {
                    this.$snotifyError("", "Error! Have error !!!", err);
                });
            this.dialogRemoveComponent=false;  
        },
     
        handleCreate(){
            this.dataComponentProps.name.value="";
            this.dataComponentProps.description.value="";
            // this.infoComponent.id='';
            // this.infoComponent.icon="";
            // this.infoComponent.description="";
            // this.infoComponent.name="";
            this.currentUserLeader.id="";
            this.statusDetail=false;

            this.$refs.modalAddOrDetailComponent.show();
        },
        handelDetailComponent(item){
            this.dataComponentProps.name.value=item.name;
            this.dataComponentProps.description.value=item.description;
            this.currentUserLeader.id=item.userLeader;
            this.infoComponent.id=item.id;
            this.infoComponent.description=item.description;
            this.infoComponent.name=item.name;
            this.infoComponent.userLeader=item.userLeader;
            this.statusDetail=true;
            this.$refs.modalAddOrDetailComponent.show();

        },
     
    },
    created(){
    }

}
</script>

<style scoped>
.name-title{
    color:#0000aa;
}
.name-title:hover{
    cursor: pointer;
    text-decoration: underline;
}
.table-list-component >>> td{
    font-size: 13px!important;
}
</style>