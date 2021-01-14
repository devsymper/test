<template>
    <div class="w-100 h-100">
        <div style="height:100%">
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
                    <v-btn v-if="checkRole('task_manager_component','add')" small class="ml-1 px-1" solo depressed @click="handleCreate">
                        <span>Create component</span>
                    </v-btn>
                </v-card-title>
                <v-data-table
                    v-if="allComponent.length>0"
                    :headers="headers"
                    :items="allComponent"
                    :search="search"
                    hide-default-footer
                    class="table-list-component"
                    @click:row="handleClickRow"
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
                        <v-icon v-if="checkRole('task_manager_component','edit')" class="mr-2" @click.prevent.stop="handelDetailComponent(item)" style="font-size:20px">mdi-file-document-edit-outline</v-icon>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon  v-if="checkRole('task_manager_component','delete')" v-on="on" @click.prevent.stop="handleDelete(item)" style="font-size:20px">mdi-delete-outline</v-icon>
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
                <v-btn color="red darken-1" :loading="loading" text @click="removeComponent">Xóa</v-btn>
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
import { checkPermission } from "@/views/taskManagement/common/taskManagerCommon";
import ComponentWorker from 'worker-loader!@/worker/taskManagement/component/Component.Worker.js';

export default {
    name:"listComponent",
    components:{
        modalAddOrDetailComponent,
        infoUser
    },
    computed:{
        allComponent(){
            let listComponent=util.cloneDeep(this.listComponent);
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
            loading:false,
            componentWorker:null,
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
        checkRole(objectType,action){
            return checkPermission(objectType,action);
        },
        handleClickRow(item){ 
            if (this.checkRole('task_manager_component','detail')) {
                if (item.id) {
                    let projectId=this.$route.params.id;
                    this.$store.commit("taskManagement/setInfoComponentCurrent", item);
                    this.$router.push('/task-management/projects/'+projectId+'/components/'+item.id);
                }
            }
           
        },
        addComponent(){
            this.$emit("add-component");
        },
        handleDelete(item){
            this.componentSelected=item;
            this.dialogRemoveComponent=true;
        },
        removeComponent(){
            this.loading = true;
            this.componentWorker.postMessage({
                action:'removeComponent',
                data:this.componentSelected.id
            });
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
        let self = this;
        this.componentWorker = new ComponentWorker();

        this.componentWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'actionError':
                    self.dialogRemoveComponent=false;
                    self.loading=false;
                    break;
                case 'removeComponent':
                    self.$snotifySuccess("Remove component success!");
                    self.$emit("add-component");
                    self.dialogRemoveComponent=false;  
                    self.loading = false;
                    break;
                default:
                    break;
            }
        });
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
.sym-style-input >>> .v-input__slot{
    box-shadow: none !important;
}
</style>