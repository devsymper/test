<template>
    <div class="h-100 w-100" >
        <div style="height:100%">
             <v-card style="box-shadow:none">
                <v-card-title>
                    <div>
                        {{$t("taskManagement.listMember")}} của {{currentProject.name}}
                        <div class="d-flex justify-space-between"><span class="fs-13 grey--text">Tổng số thành viên: {{allUserInProject.length}}</span>
                            <div class="list-button">
                                <v-btn  v-if="checkRole('task_manager_permission','add')"  small depressed @click="handleCreateActionPack">
                                    Create action pack
                                </v-btn>
                                <v-btn  v-if="checkRole('task_manager_permission','add')"  small  depressed @click="handleCreatePermission">
                                    <span>Create permission</span>
                                </v-btn>
                                <v-btn  v-if="checkRole('task_manager_access','add')"  depressed small class="mx-2"  @click="handleClickAddPeople" >
                                    {{$t("taskManagement.addPeople")}}
                                </v-btn>
                                <v-btn depressed @click="handleRoleManager" small >
                                    {{$t("taskManagement.managerRole")}}
                                </v-btn>
                         
                            </div>
                        </div>
                    </div>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Tìm kiếm"
                        dense
                        solo
                        single-line
                        hide-details
                        class="sym-small-size sym-style-input"
                        style="max-width:255px;position: absolute;right: 10px;top: 18px;"
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
                            :disabled="!checkRole('task_manager_access','edit')"
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
                                <v-icon  v-if="checkRole('task_manager_access','delete')"  v-on="on" @click="handleDeleteMember(item)" style="font-size:24px">mdi-delete-outline</v-icon>
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
                                            <v-icon v-if="checkRole('task_manager_role','delete')" v-on="on" @click.prevent.stop="handleDeleteRole(item)" style="font-size:20px">mdi-delete-outline</v-icon>
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
                    v-if="checkRole('task_manager_role','add')" 
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
            max-width="800px"
            scrollable
        >
            <v-card>
            <v-card-title>
                <span class="fs-16">{{statusDetail != true ? 'Create role' :'Thông tin role' }}</span>
            </v-card-title>
            <v-card-text class="pb-0">
                    <v-container class="p-0">
                    <div>
                        <form-tpl
                        :allInputs="nameAndDescriptionProps"/>
                    </div>
                    <div class=" mt-2 d-flex justify-space-between">
                        <span class="font-weight-medium pt-1">Lựa chọn đối tượng permission</span>
                        <v-text-field
                            append-icon="mdi-layers-search-outline"
                            placeholder="Tìm kiếm đối tượng"
                            dense
                            solo
                            style="max-width:255px;"
                            single-line
                            hide-details
                            class="sym-small-size sym-style-input"
                        ></v-text-field>
                    </div>
                    <div class="d-flex mt-2">
                        <div style="width:390px">
                            <span class="font-weight-medium">Danh sách permission pack</span>
                            <VuePerfectScrollbar style=" height:250px" >
                                <v-list dense>
                                    <v-list-item-group
                                        color="primary"
                                    >
                                        <v-list-item
                                            v-for="(item, i) in listPermissionPack"
                                            :key="i"
                                            class="sym-control pl-0"
                                        >
                                            <v-list-item-content style="font-size:13px">
                                                <v-checkbox
                                                    class="checkBox"
                                                    v-model="item.isCheck"
                                                    :label="item.name"
                                                    @change="handleClickPermissionPack(item)"
                                                ></v-checkbox>
                                                <div class="pa-0 pl-8 " style="color:#888">{{item.description}}</div>
                                            </v-list-item-content>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                        <v-icon v-on="on" @click.prevent.stop="handleClickDetailPermission(item)" class="item-detail fs-15">mdi-file-document-multiple-outline</v-icon>
                                                    </template>
                                                <span>Detail</span>
                                            </v-tooltip>
                                        </v-list-item>
                                    </v-list-item-group>
                                </v-list>
                            </VuePerfectScrollbar>
                        </div>
                        <div style="width:390px; border-left: var(--symper-border)">
                            <span class="ml-1 font-weight-medium">Danh sách permission pack đã chọn</span>
                            <VuePerfectScrollbar style=" height:250px" >
                                <v-list dense>
                                    <v-list-item-group
                                        color="primary"
                                    >
                                        <v-list-item
                                            v-for="(item, i) in listPermissionPackSelected"
                                            :key="i"
                                            class="sym-control pl-0"
                                        >
                                            <v-list-item-content class="item-check-box" style="font-size:13px;">
                                                <v-checkbox
                                                    class="checkBox"
                                                    v-model="item.isCheck"
                                                    :label="item.name"
                                                    @change="handleRemovePermissionPack(item)"
                                                ></v-checkbox>
                                                <div class="pa-0 pl-8 " style="color:#888">{{item.description}}</div>
                                            </v-list-item-content>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                        <v-icon v-on="on" @click.prevent.stop="handleClickDetailPermission(item)" class="item-detail fs-15">mdi-file-document-multiple-outline</v-icon>
                                                    </template>
                                                <span>Detail</span>
                                            </v-tooltip>
                                        </v-list-item>
                                    </v-list-item-group>
                                </v-list>
                            </VuePerfectScrollbar>
                        </div>
                    </div>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    v-if="!statusDetail && checkRole('task_manager_role','add')"
                    :loading="isLoadingAdd"
                    class="btn-add"
                    @click="handleAddRole"
                >
                
                    {{$t("common.add")}}
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    v-else-if="statusDetail && checkRole('task_manager_role','edit')"
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
    
        <permission 
            ref="permission"
            @list-permission-change="changeListPermission"
            :statusDetail="statusDetailPermission"
            :infoPermission="infoPermission"
            :listActionPackInPermissionPack="listActionPackInPermissionPack"
        />
        <action-pack 
            ref="actionPack"
            :statusDetail="false"
            @list-actionpack-change="changeListActionPack"

        />
    </div>
</template>

<script>
import FormTpl from "@/components/common/FormTpl.vue";
import addPeople from "./AddPeople";
import { convertRoleWithAction } from "./../role/RoleDefinition";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { taskManagementApi } from "@/api/taskManagement.js";
import infoUser from "@/components/common/user/InfoUser";
import { util } from "@/plugins/util";
import Permission from './Permission.vue';
import ActionPack from './ActionPack.vue';
import { checkPermission } from "@/views/taskManagement/common/taskManagerCommon";

export default {
    name:"add people",
    components:{
        'form-tpl' : FormTpl,
        VuePerfectScrollbar,
        addPeople,
        infoUser,
        Permission,
        ActionPack,
    },
    name:"Access",
    computed:{
        sTaskManagement() {
            return this.$store.state.taskManagement;
        },
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
            statusDetailPermission:false,
            listPermissionPack:[],
            listPermissionPackOrigin:[],
            listPermissionPackSelected:[],
            infoPermission:{},
            listActionPackInPermissionPack:[],
            searchKey: "", //Từ khóa cần tìm kiếm trên tất cả các cột của actionpack,
            filter:{
                filter:[
                    {
                        column: 'type',
                        operation: 'and',
                        conditions: [
                            {
                                name: 'in',
                                value: 'taskMangement'
                            }
                        ]
                    }
                ],
                pageSize: 100,
                distinct: true,
                page: 1
            },
            currentProject:this.$store.state.taskManagement.currentProject,
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
            detailActionRole:{},
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
        checkRole(objectType,action){
            return checkPermission(objectType,action);
        },
        handleCreatePermission(){
            this.statusDetailPermission = false;
            this.infoPermission = {};
            this.listActionPackInPermissionPack = [];
            this.$refs.permission.show();
        },
        handleCreateActionPack(){
            this.$refs.actionPack.show();
        },
        getListActionPackInPermissionPack(item){
            taskManagementApi
                .getListActionPackInPermissionPack(item.id)
                .then(res => {
                    if (res.status == 200) {
                        this.listActionPackInPermissionPack = res.data;
                    }else{
                        this.$snotifyError("", "Error! Have error when get list action pack of permission pack !!!");
                    }
                })
                .catch(err => {
                    this.$snotifyError("", "Error! Have error when get list action pack of permission pack !!!", err);
                });

        },
        /**
         * Hành động khi click vào 1 permission pack -> show pupop detail permission pack
         */
        handleClickDetailPermission(item){
            this.statusDetailPermission = true;
            this.infoPermission = item;
            this.getListActionPackInPermissionPack(item);
            this.$refs.permission.show();
        },
        getIdsPermissionPack(){
            let ids = [];
            for (let i = 0; i < this.listPermissionPackSelected.length; i++) {
                ids.push(this.listPermissionPackSelected[i].id);                
            }
            return ids;
        },
        handleRemovePermissionPack(item){
            let index = this.listPermissionPackSelected.indexOf(item);
            if (index > -1) {
                this.listPermissionPackSelected.splice(index, 1);
            }
            let itemInListPermissionPack = this.listPermissionPack.find(ele => ele.id == item.id);
            if (itemInListPermissionPack) {
                itemInListPermissionPack.isCheck = false;
            }
        },
        handleClickPermissionPack(item){
            let itemCheck = this.listPermissionPackSelected.find(ele => ele.id == item.id);
            if (itemCheck) {
                var index = this.listPermissionPackSelected.indexOf(itemCheck);
                if (index > -1) {
                    this.listPermissionPackSelected.splice(index, 1);
                }
            }else{
                this.listPermissionPackSelected.unshift(item);
            }
        },
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
                        this.loadingChangeRole=false;
                    })
                    .catch(err => {
                        this.$snotifyError("", "Error! Have error !!!", err);
                        this.loadingChangeRole=false;

                    });

            }else{
                this.loadingChangeRole=false;
            }
        },
        /**
         * function set danh sách permission trong role detail
         */
        setListPermissionSelected(data){
            this.listPermissionPackSelected = [];
            this.listPermissionPack = util.cloneDeep(this.listPermissionPackOrigin);
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let permission = data[i];
                    permission.isCheck = true;
                    this.listPermissionPackSelected.push(permission);
                    let item = this.listPermissionPack.find(ele => ele.id == permission.id);
                    if (item) {
                        item.isCheck = true ;
                    }
                }
            }
        },
        /**
         * Layas danh sách permission in detail role để set cho biến listPermissionPackSelected
         */
        getListPermissionInRole(role){
            taskManagementApi
                .getListPermissionInRole("taskManagement:"+role.id)
                .then(res => {
                    if (res.status == 200) {
                        this.setListPermissionSelected(res.data);
                    }else{
                        this.$snotifyError("", "Can not get list permission in role!");
                    }
                })
                .catch(err => {
                    this.$snotifyError("", "Can not list permission in role!", err);
                })
                .always(() => {});
        },
        handleClickAddPeople(){
            this.$refs.addPeopleView.show();
        },
        handleDetailRole(role){
            this.statusDetail = true;
            this.roleSelected=role;
            this.getListPermissionInRole(role);
            this.dialogAddRole  =   true;
            this.nameAndDescriptionProps.name.value=role.name;
            this.nameAndDescriptionProps.description.value=role.description;
        },
        handleOpenAddRole(){
            this.dialogAddRole=true;
            this.statusDetail = false;
            this.listPermissionPackSelected = [];
            this.nameAndDescriptionProps.name.value="";
            this.nameAndDescriptionProps.description.value="";
        },
        handleUpdateRole(){
            this.isLoadingAdd = true;
            let isValid = this.validateData();
            if (isValid) {
                let data={};
                let listIdPermissionPack = this.getIdsPermissionPack();
                data.name = this.nameAndDescriptionProps.name.value;
                data.description = this.nameAndDescriptionProps.description.value;
                data.permissionIds = listIdPermissionPack.length >0 ? JSON.stringify(listIdPermissionPack) : "";
                taskManagementApi
                    .updateRole(this.roleSelected.id,data)
                    .then(res => {
                        if (res.status == 200) {
                            this.setPermissionForRole(this.roleSelected,listIdPermissionPack);
                            this.$snotifySuccess("Update role success!");
                            this.$emit("add-role-success"); // emit sự kiện coi như là update role :))
                            this.dialogAddRole=false;
                        }else{
                            this.$snotifyError("", "Can not update role!");
                        }
                        this.isLoadingAdd=false;
                    })
                    .catch(err => {
                        this.$snotifyError("", "Can not update role!", err);
                        this.isLoadingAdd=false;
                    });
            }else{
                this.$snotifyError("", "Have error!");
                this.isLoadingAdd=false;
            }
        },
        handleAddRole(){
            let self = this;
            this.isLoadingAdd = true;
            let isValid = this.validateData();
            if (isValid) {
                let listIdPermissionPack = this.getIdsPermissionPack();
                let data={};
                let projectId=this.$route.params.id;
                data.name = this.nameAndDescriptionProps.name.value;
                data.description = this.nameAndDescriptionProps.description.value;
                data.projectId = projectId;
                data.permissionIds = listIdPermissionPack.length >0 ? JSON.stringify(listIdPermissionPack) : "";

                taskManagementApi
                    .addRole(data)
                    .then(res => {
                        if (res.status == 200) {
                            self.setPermissionForRole(res.data,listIdPermissionPack);
                            this.$snotifySuccess("Add role success!");
                            this.$emit("add-role-success");
                            this.dialogAddRole=false;
                        }else{
                            this.$snotifyError("", "Can not add role!");
                        }
                        this.isLoadingAdd=false;
                    })
                    .catch(err => {
                        this.$snotifyError("", "Can not add role!", err);
                        this.isLoadingAdd=false;
                    });
                
            }else{
                this.$snotifyError("", "Have error!");
                this.isLoadingAdd=false;
            }
        },
        setPermissionForRole(role,listIdPermissionPack){
            let item = {};
            item.role_identifier = 'taskManagement:'+role.id;
            item.role_type = "taskManagement";
            item.permission_id = listIdPermissionPack;
            let data = [];
            data.push(item);
            taskManagementApi
                .setPermissionForRole({permissions:JSON.stringify(data)})
                .then(res => {
                    if (res.status == 200) {
                    }else{
                        this.$snotifyError("", "Can not add role!");
                    }
                })
                .catch(err => {
                    this.$snotifyError("", "Can not add role!", err);
                })
                .always(() => {});
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
        getListPermissionPack(){
            taskManagementApi
                .getListPermissionPack(this.filter)
                .then(res => {
                    if (res.status == 200) {
                        this.listPermissionPack = res.data ;
                        this.listPermissionPackOrigin = util.cloneDeep(res.data);
                    }else{
                        this.$snotifyError("", "Error! Have error !!!");
                    }
                });
        },
        /**
         * Do api khi add permission k trả về data vừa insert, nên phải call api set lại list permission
         */
        changeListPermission(){
            this.dialogAddRole = false;
            this.getListPermissionPack();
        },
        changeListActionPack(){
            this.$refs.permission.getListActionPack();
        }
        
     
    },
    created(){
        this.getListPermissionPack();
        let projectId=this.$route.params.id;
        let breadcrumbs = [
                {
                    text: 'Dashboard',
                    disabled: false,
                    to: '/task-management/projects/'+projectId+'/kanban-board',
                },
                {
                    text: 'Project',
                    disabled: true,
                    to: '',
                },
                {
                    text: 'Access',
                    disabled: true,
                    to: '',
                },
            ];
        this.$store.commit("taskManagement/addToTaskManagementStore",{key:"headerBreadcrumbs",value:breadcrumbs})
    },
    activated(){
     
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
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 300px;
}
.checkBox >>> .v-input__control {
    height: 24px;
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
.item-check-box {
    position: relative;
}
.list-button {
    position: absolute;
    right: 10px;
}

</style>