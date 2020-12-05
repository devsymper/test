<template>
    <div class="w-100 h-100">
        <div style="height:100%">
            <v-card style="box-shadow:none">
                <v-card-title>
                    {{$t("taskManagement.listProject")}}
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
                    <v-btn class="px-1 ml-1" small solo depressed @click="handleCreate" color="#1976d2">
                        <v-icon color="white" size="18">mdi-plus</v-icon>
                        <span  style="color:white">Create project</span>
                    </v-btn>
                </v-card-title>
                <v-data-table
                    :headers="headers"
                    :items="listProject"
                    :search="search"
                    hide-default-footer
                    class="table-list-category"
                    @click:row="onProjectItemClick"
                >
                    <template v-slot:[`item.isFavorite`]="{ item }">
                        <v-icon v-if="item.isFavorite==1" class="ml-2 favorite" color="yellow" @click="updateFavorite(item)">mdi-star</v-icon>
                        <v-icon v-else class="ml-2 favorite" @click.prevent.stop="updateFavorite(item)" >mdi-star-outline</v-icon>
                   
                    </template>
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
                    <template v-slot:[`item.userLeader`]="{ item }">
                        <infoUser class="userInfo fs-13" :userId="item.userLeader" :roleInfo="{}" />
                    </template>

                    <template  v-slot:[`item.action`]="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" @click.prevent.stop="handleDeleteProject(item)" style="font-size:24px">mdi-delete-outline</v-icon>
                            </template>
                            <span>Delete</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-card>
        </div>

        <v-dialog
            v-model="dialogCreate"
            persistent
            max-width="500px"
        >
            <v-card>
                <v-card-title>
                    <span class="headline">Create project</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <div style="text-align:center">
                            <v-icon v-if="!!infoProject.icon && infoProject.icon.indexOf('mdi-') > -1" class="display-3 pt-0">{{infoProject.icon}}</v-icon>
                            <img class="img-fluid" style="object-fit: fill;border-radius:3px" v-else-if="!!infoProject.icon && infoProject.icon.indexOf('mdi-') < 0" :src="infoProject.icon" width="60" height="60">
                            <pick-icon
                                @selected="selectedIcon"
                                class="mt-2 pick-icon"
                            />
                        </div>
                        <div>
                            <form-tpl
                            :allInputs="dataProjectProps"/>
                        </div>
                        <small style="color:red">*{{$t("taskManagement.requiredField")}}</small>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                        <v-btn
                            color="blue darken-1"
                            text
                            :loading="isLoadingAdd"
                            @click="validateAddProject"
                        >
                            {{$t("common.add")}}
                        </v-btn>
                        <v-btn
                            color="red darken-1"
                            text
                            @click="dialogCreate = false"
                        >
                            {{$t("common.close")}}
                        </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogRemove" max-width="350">
            <v-card>
            <v-card-title class="headline">{{$t("common.remove_confirm_title")}}</v-card-title>
            <v-card-text>{{$t("taskManagement.dialog.removeCategory")}}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="removeProject">Xóa</v-btn>
                <v-btn color="green darken-1" text @click="dialogRemove = false">Hủy</v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { util } from "@/plugins/util";
import infoUser from "@/components/common/user/InfoUser";
import pickIcon from "@/components/common/iconPicker";
import { taskManagementApi } from "@/api/taskManagement.js";
import FormTpl from "@/components/common/FormTpl.vue";

export default {
    components:{
        VuePerfectScrollbar: VuePerfectScrollbar,
        infoUser,
        pickIcon,
        FormTpl
    },
    computed:{
        listProject(){
            let allUserById = this.$store.getters['app/mapIdToUser'];
            let projects=this.$store.state.taskManagement.allProject;
            let categories=this.$store.state.taskManagement.allCategory;
            for (let i = 0; i < projects.length; i++) {
                let roleInfo={};
                projects[i].infoUserLead={};
                if (projects[i].userLeader) {
                    let userId=projects[i].userLeader;
                    if (userId.indexOf(":")>0) {  //check là userId hay userId:role
                        let arrDataUserIden=userId.split(":");
                        userId=arrDataUserIden[0];
                        if (arrDataUserIden.length>3) { // loại trừ trường hợp role=0
                            let roleIdentify=projects[i].userLeader.slice(userId.length+1);
                            roleInfo=this.getRoleUser(roleIdentify);
                        }
                    }
                    projects[i].infoUserLead.userId= userId;
                    projects[i].infoUserLead.userName = allUserById[projects[i].userLeader] ? allUserById[projects[i].userLeader].displayName : '';
                    projects[i].infoUserLead.roleInfo = roleInfo;
                }
                //
                let categoryName="";
                let category=categories.find(element => element.id==projects[i].categoryId);
                if (category) {
                    categoryName= category.name;
                }
                projects[i].categoryName=categoryName;
            }
            console.log("project",projects);
            return projects;
        }
    },
    data(){
        return{
            isLoadingAdd:false,
            search:"",
            title:"Project",
            dialogCreate:false,
            data:[],
            infoProject: {
                name: "",
                description: "",
                key:"",
				icon: "",
                categoryId:"",
            },
            valid: false,
            headers: [
                { text: '', align: "start", value: "isFavorite" },

                {
                text: this.$t("taskManagement.table.name"),
                value: "name"
                },
                { text: 'Key', value: "key" },
                { text: this.$t("taskManagement.table.description"), value: "description" },
                { text: this.$t("taskManagement.table.createAt"), value: "createAt" },
                { text: this.$t("taskManagement.table.lead"), value: "userLeader" },
                { text: this.$t("taskManagement.table.category"), value: "categoryName" },
                { text: "", value: "action" },
            ],
            dataProjectProps:{
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
                key : { 
                    title: "Key",
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
                categories : { 
                    title: "Category",
                    type: "select",
                    value:"",
                    options: [
                    ],
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
            },
            projectSelected:{},
            dialogRemove:false,
          
        }
    },
    methods:{
        handleDeleteProject(item){
            this.projectSelected=item;
            this.dialogRemove=true;
        },
        removeProject(){
            taskManagementApi
                .removeProject(this.projectSelected.id)
                .then(res => {
                    if (res.status == 200) {
                        this.$snotifySuccess("Remove project success!");
                        this.$store.commit("taskManagement/removeProjectToStore",this.projectSelected.id);
                    }else{
                        this.$snotifyError("", "Error! Have error !!!");
                    }
                })
                .catch(err => {
                    this.$snotifyError("", "Error! Have error !!!", err);
                });
            this.dialogRemove=false;  
        },
        /**
         * hoangnd:chuyển view mở chi tiết 1 project
         */
        onProjectItemClick(obj){
            this.$router.push('/task-management/projects/'+obj.id+'/kanban-board');
        },
        validateData(){
            let data=this.dataProjectProps;
            for (var key in data) {
                data[key].validate();
                if (data[key].validateStatus.isValid==false) {
                    return false
                }
            }
            return true;
        },
        validateAddProject () {
            this.isLoadingAdd = true;
            let self=this;
            let isValid = this.validateData();
            if (isValid) {
                if (!self.dataProjectProps.name.value || !self.dataProjectProps.key.value ||!self.dataProjectProps.categories.value ) {
                    self.$snotifyError("", "Can not add project!");
                }else{
                    let data = {};
                    data.name = self.dataProjectProps.name.value;
                    data.description =self.dataProjectProps.description.value;
                    data.categoryId = self.dataProjectProps.categories.value;
                    if (self.infoProject.icon) {
                        data.icon = self.infoProject.icon;
                    }
                    data.key = self.dataProjectProps.key.value;
                    taskManagementApi
                        .addProject(data)
                        .then(res => {
                            if (res.status == 200) {
                                self.$snotifySuccess("Add project completed!");
                                self.$store.dispatch("taskManagement/addProjectToStore", res.data);
                                self.dialogCreate=false;
                            }else if(res.status==400){
                                self.$snotifyError("", "Validate key error",res.message);
                            }
                        })
                        .catch(err => {
                            self.$snotifyError("", "Can not add project!", err);
                        })
                        .always(() => {});
                }
            }
            this.isLoadingAdd = false;
        },
        updateFavorite(obj){
            let self=this;
            taskManagementApi
                .updateProjectFavorite(obj.id)
                .then(res => {
                    if (res.status == 200) {
                        self.$snotifySuccess("Update project completed!");
                        self.$store.commit("taskManagement/updateStatusFavoriteProject", obj.id);

                    }else{
                        self.$snotifyError("", "Can not update project!");
                    }
                })
                .catch(err => {
                    self.$snotifyError("", "Can not update project!", err);
                })
                .always(() => {});
        },
        selectedIcon(data) {
            this.$set(this.infoProject, 'icon', data.icon.trim() );
		},
    
        /**~~~~~~~~~~~~~~~~~~~~ */
        getRoleUser(roleIdentify){
            let arrDataRole=roleIdentify.split(":");
            let allSymperRole=this.$store.state.app.allSymperRoles;
            if (allSymperRole[arrDataRole[0]]) {
                let role=(allSymperRole[arrDataRole[0]]).find(element => element.roleIdentify===roleIdentify);
                return role;
            }else{
                return {};
            }
        },  
        handleCreate(){
            this.dialogCreate=true;
        },
        setCategorySelect(){
            setTimeout((self) => {
                let category = this.$store.state.taskManagement.allCategory;
                category = category.reduce((arr, obj)=>{
                    let newObj = {text:obj.name,value:obj.id};
                    arr.push(newObj);
                    return arr
                },[]);
                self.dataProjectProps.categories.options = category;
            }, 500,this);
        }
    },
    created(){
        this.setCategorySelect();
    }
  
}
</script>

<style scoped>
.single-row:hover {
    background: #f5f5f5;
    cursor: pointer;
}
.name-project:hover{
    cursor: pointer;
    text-decoration: underline;
}
.favorite:hover{
    color: rgb(226, 226, 59);
}
.pick-icon >>> button {
    padding: 0 6px!important;
    font-size: 11px;

}
</style>