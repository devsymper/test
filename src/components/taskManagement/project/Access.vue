<template>
    <div class="h-100" style="width:60%;margin:auto;">
        <div class="d-flex  justify-space-between" style="height:40px">
            <h1 class="ml-4">Access</h1>
            <div>
                 <v-btn color="primary" small class="mr-2 px-2"  @click="handleClickAddPeople" >
                    {{$t("taskManagement.addPeople")}}
                </v-btn>
                  <v-btn depressed color="#eee" class="px-2" style="color:#111" @click="handleRoleManager" small >
                    {{$t("taskManagement.managerRole")}}
                </v-btn>
            </div>
        </div>
        <!-- list user -->
        <div style="height:calc(100% - 40px)">
             <v-card style="box-shadow:none">
                <v-card-title>
                    <div>
                        {{$t("taskManagement.listMember")}}
                        <div><span class="fs-13 grey--text">Tổng số thành viên: {{allUserInProject.length}}</span></div>
                    </div>
                    
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
                    :items="allUserInProject"
                    :search="search"
                    hide-default-footer
                    class="table-list-user"
                >
                    <template v-slot:[`item.name`]="{ item }">
                        <infoUser class="userInfo fs-13" :userId="item.userId" :roleInfo="{}" />
                    </template>

                    <template v-slot:[`item.role`]="{ item }">
                        <v-autocomplete
                            class="my-2 fs-13 select-role-user sym-small-size sym-style-input"
                            hide-details
                            style="width:300px;"
                            v-model="item.infoUserRole"
                            :loading="loadingChangeRole"
                            :items="flatAllRoles"
                            item-text="name"
                            item-value="id"
                            return-object
                            multiple
                            solo
                            dense
                            small-chips
                            @change="changeRoleUser(item)"
                        >
                        </v-autocomplete>
                    </template>
                    <template  v-slot:[`item.action`]="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" @click="handleDeleteMember(item)" style="font-size:24px">mdi-delete-outline</v-icon>
                            </template>
                            <span>Delete</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-card>
        </div>

        <!-- dialog show list role -->
        <v-dialog
            v-model="dialogRole"
            persistent
            max-width="600px"
            scrollable
            >
            <v-card >
            <v-card-title  class="pb-0">
                <span class="fs-16">{{$t("taskManagement.managerRole")}}</span>
            </v-card-title>
            <v-card-text class="pa-0">
                <v-container class="py-0">
                    <v-list >
                        <v-list-item-group
                        >
                            <v-list-item
                            v-for="(item, i) in roles"
                            :key="i"
                            @click="handleDetailRole(item)"
                            >
                                <v-list-item-content>
                                    <v-list-item-title class="fs-13" v-text="item.name"></v-list-item-title>
                                    <span style="color:#777" class="fs-12">{{item.description}}</span>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-icon v-on="on" @click.prevent.stop="duplicateRole(item)" class="fs-16 mr-1">mdi-sticker-plus</v-icon>
                                        </template>
                                        <span>Duplicate role</span>
                                    </v-tooltip>

                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-icon v-on="on" @click.prevent.stop="handleDeleteRole(item)" style="font-size:20px">mdi-delete-outline</v-icon>
                                        </template>
                                        <span>Delete</span>
                                    </v-tooltip>
                                </v-list-item-icon>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="handleOpenAddRole()"
                >
                    {{$t("taskManagement.createRole")}}
                </v-btn>
                <v-btn
                    color="red darken-1"
                    text
                    @click="dialogRole = false"
                >
                    {{$t("common.close")}}
                </v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="dialogAddRole"
            persistent
            max-width="600px"
            scrollable
        >
            <v-card>
            <v-card-title>
                <span class="fs-16">Create role</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <div>
                        <form-tpl
                        :allInputs="nameAndDescriptionProps"/>
                    </div>
                    <div>
                        <b>Project permissions</b>
                        <!-- <p>People in this role can:</p> -->
                        <VuePerfectScrollbar >
                            <v-expansion-panels
                                v-model="panel"
                                multiple
                                class="s-expansion-panels"
                                style="overflow: hidden;"
                            >
                                <v-expansion-panel v-for="(obj, key) in statusDetail?detailActionRole:allActionRoles " :key="key"  class="pa-0">
                                    <v-expansion-panel-header class="v-expand-header py-0 px-0">
                                        <div  v-if="!obj.children" class="fs-13">
                                            <v-checkbox
                                                class="checkBox"
                                                ref="listCheck"
                                                v-model="obj.isAllow"
                                                :label="obj.title"
                                            ></v-checkbox>
                                            <div class="pl-8">
                                                <span style="color:#888">{{obj.description}}</span>
                                            </div>
                                        </div>
                                        <div v-else class="fs-13">
                                            <v-checkbox
                                                class="checkBox"
                                                ref="listCheck"
                                                v-model="obj.isAllow"
                                                @click="handleCheckAllActionIssue($event,obj)"
                                                :label="obj.title"
                                                :input-value="obj.isAllow"
                                                :indeterminate="checkIndeterminate(obj)"
                                            ></v-checkbox>
                                            <div class="pl-8">
                                                <span style="color:#888">{{obj.description}}</span>
                                            </div>
                                        </div>
                                    </v-expansion-panel-header>

                                    <v-expansion-panel-content v-if="obj.children" class="sym-v-expand-content">
                                        <v-list dense>
                                            <v-list-item-group
                                                color="primary"
                                            >
                                                <v-list-item
                                                    v-for="(item, i) in obj.children"
                                                    :key="i"
                                                >
                                                    <v-list-item-content style="font-size:13px">
                                                        <v-checkbox
                                                            class="checkBox"
                                                            v-model="item.isAllow"
                                                            :label="item.title"
                                                            @change="changeValueCheckBoxIssue(obj)"
                                                        ></v-checkbox>
                                                        <div class="pa-0 pl-8 " style="color:#888">{{item.description}}</div>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-list-item-group>
                                        </v-list>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </VuePerfectScrollbar>
                    </div>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    v-if="!statusDetail"
                    :loading="isLoadingAdd"
                    class="btn-add"
                    @click="handleAddRole"
                >
                    {{$t("common.add")}}
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    v-else
                    :loading="isLoadingAdd"
                    class="btn-add"
                    @click="handleUpdateRole()"
                >
                    {{$t("common.update")}}
                </v-btn>

                <v-btn
                color="red darken-1"
                text
                @click="dialogAddRole = false"
                >
                    {{$t("common.close")}}
                </v-btn>
           
            </v-card-actions>
            </v-card>
        </v-dialog>

        <addPeople
            ref="addPeopleView"
            :roles="roles"
            @add-people-success="addPeopleSuccess"
        />

        <v-dialog v-model="dialogRemoveUser" max-width="350">
            <v-card>
            <v-card-title class="headline">{{$t("common.remove_confirm_title")}}</v-card-title>
            <v-card-text>{{$t("taskManagement.dialog.removeUser")}}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="removeMember">Xóa</v-btn>
                <v-btn color="green darken-1" text @click="dialogRemoveUser = false">Hủy</v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
        
        <v-dialog v-model="dialogRemoveRole" max-width="350">
            <v-card>
            <v-card-title class="headline">{{$t("common.remove_confirm_title")}}</v-card-title>
            <v-card-text>{{$t("taskManagement.dialog.removeRole")}}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="removeRole">Xóa</v-btn>
                <v-btn color="green darken-1" text @click="dialogRemoveRole = false">Hủy</v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>


    </div>
</template>

<script>
import FormTpl from "@/components/common/FormTpl.vue";
import addPeople from "./AddPeople";
import { getAllRole ,convertRoleWithAction } from "./../role/RoleDefinition";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { taskManagementApi } from "@/api/taskManagement.js";
import infoUser from "@/components/common/user/InfoUser";
import { util } from "@/plugins/util";

export default {
    name:"add people",
    components:{
        'form-tpl' : FormTpl,
        VuePerfectScrollbar,
        addPeople,
        infoUser
    },
    name:"Access",
    computed:{
        allUserInProject(){
            let users=this.listUser;
            let allUser=this.$store.state.app.allUsers;
            for (let i = 0; i < users.length; i++) {
                let user=allUser.find(ele => ele.id == users[i].userId );
                if (user) {
                    users[i].userEmail=user.email;
                }
                users[i].infoUserRole=[];
                if (users[i].roles.length>0) {
                    for (let j = 0; j < users[i].roles.length; j++) {
                        let item={id:users[i].roles[j],name:''} ;
                        let role=this.roles.find(ele=> ele.id == users[i].roles[j]);
                        if (role) {
                            item.name=role.name;
                        }
                        users[i].infoUserRole.push(item);
                    }
                }

            }
            console.log("usersInproject",users);
            return users; 
        },
        flatAllRoles(){
            let roles= util.cloneDeep(this.roles);
            roles = roles.reduce((arr, obj)=>{
                let newObj = {id:obj.id,name:obj.name};
                arr.push(newObj);
                return arr
            },[]);
            return roles;
        }

    },
    props:{
        roles: {
            type: Array,
            default() {
                return [];
            }
        },
        listUser: {
            type: Array,
            default() {
                return [];
            }
        },
    },
    data(){
        return{
            dialogRemoveRole:false,
            memberSelected:{},
            roleSelected:{},
            dialogRemoveUser:false,
            loadingChangeRole:false,
            dialogAddPeople:false,
            statusDetail:false,
            isLoadingAdd:false,
            dialogRole:false,
            dialogAddRole:false,
            allActionRoles:getAllRole(),
            detailActionRole:{},
            panel: [0, 1, 2, 3, 4],
            nameAndDescriptionProps:{
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
            search: '',
            headers: [
                {
                text: this.$t("taskManagement.table.name"),
                align: "start",
                value: "name"
                },
                { text: this.$t("taskManagement.table.email"), value: "userEmail" },
                { text: this.$t("taskManagement.table.role"), value: "role" },
                { text: "", value: "action" },
            ],
         
        }
    },
    methods:{
        addPeopleSuccess(){
            this.$emit("add-people-success");
        },
        handleDeleteMember(item){
            this.memberSelected=item;
            this.dialogRemoveUser=true;
        },
        handleDeleteRole(item){
            this.roleSelected=item;
            this.dialogRemoveRole=true;
        },
        duplicateRole(item){
            alert("Tính năng đang phát triển!!!");
        },
        removeMember(){
            taskManagementApi
                .deleteUserInProject(this.memberSelected.id)
                .then(res => {
                    if (res.status == 200) {
                        this.$snotifySuccess("Remove member success!");
                        this.$emit("remove-member");
                    }else{
                        this.$snotifyError("", "Error! Have error !!!");
                    }
                })
                .catch(err => {
                    this.$snotifyError("", "Error! Have error !!!", err);
                });

            this.dialogRemoveUser=false;  
        },
        removeRole(){
            taskManagementApi
                .removeRole(this.roleSelected.id)
                .then(res => {
                    if (res.status == 200) {
                        this.$snotifySuccess("Remove role success!");
                        this.$emit("remove-role-success");
                    }else{
                        this.$snotifyError("", "Error! Have error !!!");
                    }
                })
                .catch(err => {
                    this.$snotifyError("", "Error! Have error !!!", err);
                });
            this.dialogRemoveRole=false;  
        },
        changeRoleUser(item){
            this.loadingChangeRole=true;
            if (item.roles.length!=item.infoUserRole.length) { // gửi api update
                let roleIds=[];
                for (let i = 0; i < item.infoUserRole.length; i++) {
                    roleIds.push(item.infoUserRole[i].id);
                }
                let data={};
                data.userInProjectId=item.id;
                data.roleIds=JSON.stringify(roleIds);
                taskManagementApi
                    .updateRoleUserInProject(data)
                    .then(res => {
                        if (res.status == 200) {
                            console.log("Change role success");
                            this.$emit("change-role-user");
                        }else{
                            this.$snotifyError("", "Error! Have error !!!");
                        }
                    })
                    .catch(err => {
                        this.$snotifyError("", "Error! Have error !!!", err);
                    })
                    .always(() => {});

            }
            this.loadingChangeRole=false;
        },
        handleClickAddPeople(){
            this.$refs.addPeopleView.show();
        },
        handleDetailRole(role){
            this.statusDetail = true;
            this.roleSelected=role;
            this.detailActionRole = convertRoleWithAction(JSON.parse(role.action));
            this.dialogAddRole  =   true;
            this.nameAndDescriptionProps.name.value=role.name;
            this.nameAndDescriptionProps.description.value=role.description;
        },
        handleOpenAddRole(){
            this.dialogAddRole=true;
            this.statusDetail = false;
            this.nameAndDescriptionProps.name.value="";
            this.nameAndDescriptionProps.description.value="";
        },
        handleUpdateRole(){
            this.isLoadingAdd = true;
            let isValid = this.validateData();
            if (isValid) {
                let data={};
                data.name=this.nameAndDescriptionProps.name.value;
                data.description=this.nameAndDescriptionProps.description.value;
                data.action=JSON.stringify(this.getActionRoleChecked("update"));

                taskManagementApi
                    .updateRole(this.roleSelected.id,data)
                    .then(res => {
                        if (res.status == 200) {
                            this.$snotifySuccess("Update role success!");
                            this.$emit("add-role-success"); // emit sự kiện coi như là update role :))
                            this.dialogAddRole=false;
                        }else{
                            this.$snotifyError("", "Can not update role!");
                        }
                    })
                    .catch(err => {
                        this.$snotifyError("", "Can not update role!", err);
                    })
                    .always(() => {});
                
            }else{
                this.$snotifyError("", "Have error!");
            }
            this.isLoadingAdd=false;
        },
        handleAddRole(){
            this.isLoadingAdd = true;
            let isValid = this.validateData();
            if (isValid) {
                let data={};
                data.name=this.nameAndDescriptionProps.name.value;
                data.description=this.nameAndDescriptionProps.description.value;
                data.action=JSON.stringify(this.getActionRoleChecked());

                taskManagementApi
                    .addRole(data)
                    .then(res => {
                        if (res.status == 200) {
                            this.$snotifySuccess("Add role success!");
                            this.$emit("add-role-success");
                            this.dialogAddRole=false;
                        }else{
                            this.$snotifyError("", "Can not add role!");
                        }
                    })
                    .catch(err => {
                        this.$snotifyError("", "Can not add role!", err);
                    })
                    .always(() => {});
                
            }else{
                this.$snotifyError("", "Have error!");
            }
            this.isLoadingAdd=false;
        },
        getActionRoleChecked(isCheck="add"){ // ham conver action da chon theo format ["administer","issue:addComment"]
            if (isCheck=="add") {
                var data=this.allActionRoles;
            }else if(isCheck=="update"){
                var data=this.detailActionRole;
            }
            let actions=[];
            for (var key in data) {
                if (data[key].isAllow) {
                    actions.push(key);
                }else{
                    if (data[key].children && Object.keys(data[key].children).length >0) {
                        let item=data[key].children;
                        for (var subKey in item) {
                            if (item[subKey].isAllow) {
                                let str=key+":"+subKey;
                                actions.push(str);
                            }   
                        }
                    }
                }
            }
            return actions;
        },
        validateData(){
            let data=this.nameAndDescriptionProps;
            for (var key in data) {
                data[key].validate();
                if (data[key].validateStatus.isValid==false) {
                    return false
                }
            }
            return true;
        },
        handleRoleManager(){
            this.dialogRole=true;
        },
        changeValueCheckBoxIssue(obj){
            let count=0;
            let data=obj.children;
            for (var key in data) {
                if (data[key].isAllow==true) {
                    count++;
                }
            }
            if (count == Object.keys(obj.children).length) {
                obj.isAllow=true;
            }else if (count==0) {
                obj.isAllow=false;
            }
        },
        checkIndeterminate(obj){
            let count=0;
            let data=obj.children;
            for (var key in data) {
                if (data[key].isAllow==true) {
                    count++;
                }
            }
            if (count>0 && count< Object.keys(obj.children).length) {
                return true;
            }else{
                return false;
            }
        },
        handleCheckAllActionIssue(event,obj){
            event.preventDefault();
            event.stopPropagation();
            if (!obj.isAllow) { // bỏ check
                this.unCheckOrCheckObjAction(obj,false);
            }else{
                this.unCheckOrCheckObjAction(obj,true);
            }
        },
        unCheckOrCheckObjAction(obj,isCheck){ // hàm check hoặc uncheck all obj
            let data=obj.children;
            for (var key in data) {
                data[key].isAllow=isCheck
            }

        }

     
    },
    activated(){
        let breadcrumbs = [
                {
                    text: 'Dashboard',
                    disabled: true,
                    to: '/report',
                },
                {
                    text: 'Link 1',
                    disabled: false,
                    to: 'breadcrumbs_link_1',
                },
                {
                    text: 'Link 2',
                    disabled: true,
                    to: 'breadcrumbs_link_2',
                },
            ]
        this.$store.commit("taskManagement/addToTaskManagementStore",{key:"headerBreadcrumbs",value:breadcrumbs})
    }
}
</script>

<style scoped>
.s-expansion-panels >>>.v-expansion-panel::before{
    box-shadow: none!important;
}
.checkBox {
    margin: 0px;
}
.checkBox >>> label{
    font-size: 13px;
    font-weight: bold;
}

.checkBox >>> .v-messages{
    display: none;
}

.v-expand-header >>> .v-input{
    margin: 0px;
}

.v-expand-header >>> .v-messages{
    display: none;
}

.checkBox >>>.v-input--selection-controls__ripple{
    height: 19px;
    width: 19px;
    left: -5px;
    top: calc(50% - 17px);
    margin: 7px;
}

.btn-add{
    background: var(--symper-background-default);
}
.select-role-user >>>.v-select__selections{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 150px;
    display: block;
}
.table-list-user >>> .v-data-table-header th:nth-child(3) {
    width: 340px;
}
.select-role-user >>> .v-input__control .v-input__slot{
    padding:0px!important;
}

.select-role-user >>> .v-input__control .v-input__slot .v-select__selections{
    margin-bottom: 3px;
}
.select-role-user >>> .v-chip--select {
    height: 20px;
    border-radius: 4px;
    padding: 6px;
}
</style>