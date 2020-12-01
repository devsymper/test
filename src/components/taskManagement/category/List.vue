<template>
    <div class="w-100 h-100">
        <div class="w-100 justify-space-between d-flex" style="height:40px">
            <div class="symper-title pl-2">{{title}}</div>
            <div class="d-flex pt-2 pr-4">
                <v-btn small class="px-1" solo depressed @click="handleCreate" color="#0052CC">
                    <v-icon color="white" size="18">mdi-plus</v-icon>
                    <span style="color:white">Create category</span>
                </v-btn>
            </div>
        </div>
            <!-- list category -->
        <div style="height:calc(100% - 40px)">
             <v-card style="box-shadow:none">
                <v-card-title>
                    {{$t("taskManagement.listCategory")}}
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
                    :headers="headers"
                    :items="allCategory"
                    :search="search"
                    hide-default-footer
                    class="table-list-user"
                    @click:row="handelDetailCategory"
                >
                    <template v-slot:[`item.name`]="{ item }">
                        <div class="d-flex">
                            <div class="d-flex">
                                <v-icon v-if="!!item.icon && item.icon.indexOf('mdi-') > -1" class="pt-0" style="font-size:24px">{{item.icon}}</v-icon>
                                <img class="img-fluid" style="object-fit: fill;border-radius:3px" v-else-if="!!item.icon && item.icon.indexOf('mdi-') < 0" :src="item.icon" width="24" height="24">
                            </div>
                            <span class="name-project pt-1 pl-2" style="color:#0000aa">
                                {{item.name}}
                            </span>
                        </div>
                    </template>
                    <template v-slot:[`item.user`]="{ item }">
                        <infoUser class="userInfo fs-13" :userId="item.userCreate" :roleInfo="{}" />
                    </template>

                    <template  v-slot:[`item.action`]="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" @click.prevent.stop="handleDeleteCategory(item)" style="font-size:24px">mdi-delete-outline</v-icon>
                            </template>
                            <span>Delete</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-card>
        </div>
        <modalAddOrDetailCategory
            ref="modalAddOrDetailCategory"
            :dataCategoryProps="dataCategoryProps"
            :infoCategory="infoCategory"
            :statusDetail="statusDetail"
        />

        <v-dialog v-model="dialogRemoveCate" max-width="350">
            <v-card>
            <v-card-title class="headline">{{$t("common.remove_confirm_title")}}</v-card-title>
            <v-card-text>{{$t("taskManagement.dialog.removeCategory")}}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="removeCategory">Xóa</v-btn>
                <v-btn color="green darken-1" text @click="dialogRemoveCate = false">Hủy</v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
    
    </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { util } from "@/plugins/util";
import infoUser from "@/components/common/user/InfoUser";
import { taskManagementApi } from "@/api/taskManagement.js";
import modalAddOrDetailCategory from "./ModalAddOrDetailCategory";

export default {
    name:"list-category",
    components:{
        VuePerfectScrollbar: VuePerfectScrollbar,
        infoUser,
        modalAddOrDetailCategory
    },
    computed:{
        allCategory(){
            let categories=this.$store.state.taskManagement.allCategory;
            console.log("categories",categories);
            return categories; 
        },
    },
    data(){
        return{
            statusDetail:false,
            dialogAddCategory:false,
            dialogRemoveCate:false,
            search:'',
            title:"Category",
            headers: [
                {
                text: this.$t("taskManagement.table.name"),
                align: "start",
                value: "name"
                },
                { text: this.$t("taskManagement.table.description"), value: "description" },
                { text: this.$t("common.created_by"), value: "user" },
                { text: this.$t("taskManagement.table.createAt"), value: "createAt" },
                { text: "", value: "action" },
            ],
            dataCategoryProps:{
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
            infoCategory:{
                name: "",
                description: "",
                icon: "",
            },
            categorySelected:{}
          
        }
    },
    methods:{
        handleCreate(){
            this.dataCategoryProps.name.value="";
            this.dataCategoryProps.description.value="";
            this.infoCategory.id='';
            this.infoCategory.icon="";
            this.infoCategory.description="";
            this.infoCategory.name="";
            this.statusDetail=false;

            this.$refs.modalAddOrDetailCategory.show();
        },
        handelDetailCategory(item){
            this.dataCategoryProps.name.value=item.name;
            this.dataCategoryProps.description.value=item.description;

            this.infoCategory.id=item.id;
            this.infoCategory.icon=item.icon;
            this.infoCategory.description=item.description;
            this.infoCategory.name=item.name;
            this.statusDetail=true;
            this.$refs.modalAddOrDetailCategory.show();

        },
        handleDeleteCategory(item){
            this.categorySelected=item;
            this.dialogRemoveCate=true;
        },
        removeCategory(){
            taskManagementApi
                .removeCategory(this.categorySelected.id)
                .then(res => {
                    if (res.status == 200) {
                        this.$snotifySuccess("Remove category success!");
                        this.$store.commit("taskManagement/removeCategoryToStore",this.categorySelected.id);
                    }else{
                        this.$snotifyError("", "Error! Have error !!!");
                    }
                })
                .catch(err => {
                    this.$snotifyError("", "Error! Have error !!!", err);
                });
            this.dialogRemoveCate=false;  
        }
   
    },
    created(){
    },
  
}
</script>

<style scoped>

.name-project:hover{
    cursor: pointer;
    text-decoration: underline;
}
</style>