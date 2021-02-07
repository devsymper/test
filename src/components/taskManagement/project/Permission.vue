<template>
    <div>
        <v-dialog
            v-model="isShow"
            max-width="800px"
            scrollable
        >
            <v-card>
            <v-card-title>
                <span class="fs-16">{{statusDetail != true ? 'Thêm permission' :'Thông tin permission' }}</span>
            </v-card-title>
            <v-card-text class="pb-0">
                <v-container class="p-0">
                    <div>
                        <form-tpl
                        :allInputs="permissionProps"/>
                    </div>
                    <!-- div search -->
                    <div class=" mt-2 d-flex justify-space-between">
                        <span class="font-weight-medium pt-1">Lựa chọn action pack</span>
                        <v-text-field
                            v-on:input="onSearch($event)"
                            append-icon="mdi-layers-search-outline"
                            placeholder="Tìm kiếm đối tượng"
                            dense
                            outlined
                            style="max-width:255px;"
                            single-line
                            hide-details
                            class="sym-small-size sym-style-input"
                        ></v-text-field>
                    </div>
                    <div class="d-flex mt-2">
                        <div style="width:390px">
                            <span class="font-weight-medium">Danh sách action pack</span>
                            <VuePerfectScrollbar style=" height:280px" >
                                <v-list dense>
                                    <v-list-item-group
                                        color="primary"
                                    >
                                        <v-list-item
                                            v-for="(item, i) in listActionPack"
                                            :key="i"
                                            class="sym-control pl-0"
                                        >
                                            <v-list-item-content style="font-size:13px">
                                                <v-checkbox
                                                    class="checkBox"
                                                    v-model="item.isCheck"
                                                    :label="item.name"
                                                    @click.prevent.stop="handleClickActionPack(item)"
                                                ></v-checkbox>
                                                <div class="pa-0 pl-8 " style="color:#888">{{item.description}}</div>
                                            </v-list-item-content>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                        <v-icon v-on="on" @click.prevent.stop="handleClickDetailActionPack(item)" class="item-detail fs-15">mdi-file-document-multiple-outline</v-icon>
                                                    </template>
                                                <span>Detail</span>
                                            </v-tooltip>
                                        </v-list-item>
                                    </v-list-item-group>
                                </v-list>
                            </VuePerfectScrollbar>
                        </div>
                        <div style="width:390px; border-left: var(--symper-border)">
                            <span class="ml-1 font-weight-medium">Danh sách action pack đã chọn</span>
                            <VuePerfectScrollbar style=" height:280px" >
                                <v-list dense>
                                    <v-list-item-group
                                        color="primary"
                                    >
                                        <v-list-item
                                            v-for="(item, i) in listActionPackSelected"
                                            :key="i"
                                            class="sym-control pl-0"
                                        >
                                            <v-list-item-content style="font-size:13px">
                                                <v-checkbox
                                                    class="checkBox"
                                                    v-model="item.isCheck"
                                                    :label="item.name"
                                                    @click.prevent.stop="handleRemoveActionPack(item)"
                                                ></v-checkbox>
                                                <div class="pa-0 pl-8 " style="color:#888">{{item.description}}</div>
                                            </v-list-item-content>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                        <v-icon v-on="on" @click.prevent.stop="handleClickDetailActionPack(item)" class="item-detail fs-15">mdi-file-document-multiple-outline</v-icon>
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
            <v-card-actions class="py-0">
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    v-if="!statusDetail && checkRole('task_manager_permission','add')"
                    :loading="isLoading"
                    class="btn-add"
                    @click="addPermissionPack"
                >
                    {{$t("common.add")}}
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    v-else-if="statusDetail && checkRole('task_manager_permission','edit')"
                    :loading="isLoading"
                    :disabled="disabled"
                    class="btn-add"
                    @click="updatePermissionPack"
                >
                    {{$t("common.update")}}
                </v-btn>

                <v-btn
                color="red darken-1"
                text
                @click="isShow = false"
                >
                    {{$t("common.close")}}
                </v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>

        <action-pack 
            ref="actionPack"
            :statusDetail="statusDetailActionPack"
            :infoActionPack="infoActionPack"
            :listOperatorInActionPack="listOperatorInActionPack"
            @list-actionpack-change="listActionpackChange"
        />
    </div>
</template>

<script>
import { cloneObjectActionControls } from "./../role/RoleDefinition";
import FormTpl from "@/components/common/FormTpl.vue";
import { taskManagementApi } from "@/api/taskManagement.js";
import infoUser from "@/components/common/user/InfoUser";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import ActionPack from './ActionPack.vue';
import { util } from '../../../plugins/util';
import { checkPermission } from "@/views/taskManagement/common/taskManagerCommon";

export default {
    components:{
        'form-tpl' : FormTpl,
        infoUser,
        VuePerfectScrollbar,
        ActionPack
    },
    props:{
        statusDetail:{
            type:Boolean,
            default:false,
        },
        infoPermission:{
            type: Object,
            default(){
                return {}
            }
        },
        listActionPackInPermissionPack:{
            type: Array,
            default(){
                return []
            }
        }
    },
    watch:{
        infoPermission:function(vl){
            if (Object.keys(vl).length > 0) {
                this.setDataForPermissionDetail();
            }
        },
        listActionPackInPermissionPack:function(vl){
            this.setListActionPackSelected();
        }
    },
    computed:{
    },
    data(){
        return{
            statusDetailActionPack:false,
            infoActionPack:{},
            debounceGetData:null,
            isLoading:false,
            isShow:false,
            disabled:false,
            listActionPack:[],
            listActionPackOrigin:[],
            listActionPackSelected:[],
            listOperatorInActionPack:[],
            search:'',
            searchKey: "", //Từ khóa cần tìm kiếm trên tất cả các cột của actionpack,
            filter:{
                pageSize: 100,
                distinct: true,
                page: 1
            },
            permissionProps:{
                name : { 
                    title: "Tên permission",
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
        getListOperatorInActionPack(item){
            taskManagementApi
                .getListOperatorInActionPack(item.id)
                .then(res => {
                    if (res.status == 200) {
                        this.listOperatorInActionPack = res.data;
                    }else{
                        this.$snotifyError("", "Error! Have error when get list operator in pack !!!");
                    }
                })
                .catch(err => {
                    this.$snotifyError("", "Error! Have error when get list operator in pack !!!", err);
                });

        },
        handleClickDetailActionPack(item){
            this.statusDetailActionPack = true;
            this.infoActionPack = item;
            this.getListOperatorInActionPack(item);
            this.$refs.actionPack.show();
        },
        getIdsActionpack(){
            let ids = [];
            for (let i = 0; i < this.listActionPackSelected.length; i++) {
                ids.push(this.listActionPackSelected[i].id);                
            }
            return ids;
        },
        addPermissionPack(){
            this.isLoading = true;
            let isValid = this.validateData();
            if (isValid) {
                let data={};
                let listIdActionPack = this.getIdsActionpack();
                data.name=this.permissionProps.name.value;
                data.description=this.permissionProps.description.value;
                data.status = 1;
                data.type = 'taskManagement';
                data.listActionPacks =  listIdActionPack.length >0 ? JSON.stringify(listIdActionPack) : "";
                taskManagementApi
                    .addPermissionPack(data)
                    .then(res => {
                        if (res.status == 200) {
                            this.$snotifySuccess("Add permisson pack success!");
                            this.$emit("list-permission-change");
                            this.isShow=false;
                        }else{
                            this.$snotifyError("", "Can not add permisson pack!");
                        }
                        this.isLoading=false;

                    })
                    .catch(err => {
                        this.$snotifyError("", "Can not add permisson pack!", err);
                        this.isLoading=false;

                    });
                
            }else{
                this.$snotifyError("", "Have error!");
                this.isLoading=false;

            }
        },
        updatePermissionPack(){
            this.isLoading = true;
            let isValid = this.validateData();
            if (isValid) {
                let data={};
                let listIdActionPack = this.getIdsActionpack();
                data.name=this.permissionProps.name.value;
                data.description=this.permissionProps.description.value;
                data.status = 1;
                data.type = 'taskManagement';
                data.listActionPacks =  listIdActionPack.length >0 ? JSON.stringify(listIdActionPack) : "";
                taskManagementApi
                    .updatePermissionPack(this.infoPermission.id,data)
                    .then(res => {
                        if (res.status == 200) {
                            this.$snotifySuccess("update permisson pack success!");
                            this.$emit("list-permission-change");
                            this.isShow=false;
                        }else{
                            this.$snotifyError("", "Can not update permisson pack!");
                        }
                        this.isLoading=false;
                    })
                    .catch(err => {
                        this.$snotifyError("", "Can not update permisson pack!", err);
                        this.isLoading=false;
                    });
                
            }else{
                this.$snotifyError("", "Have error!");
                this.isLoading=false;
            }
        },
        handleRemoveActionPack(item){
            let index = this.listActionPackSelected.indexOf(item);
            if (index > -1) {
                this.listActionPackSelected.splice(index, 1);
            }
            let itemInListActionPack = this.listActionPack.find(ele => ele.id == item.id);
            if (itemInListActionPack) {
                itemInListActionPack.isCheck = false;
            }
        },
        handleClickActionPack(item){
            let itemCheck = this.listActionPackSelected.find(ele => ele.id == item.id);
            if (itemCheck) {
                var index = this.listActionPackSelected.indexOf(itemCheck);
                if (index > -1) {
                    this.listActionPackSelected.splice(index, 1);
                }
            }else{
                this.listActionPackSelected.unshift(item);
            }
        },
        handleCreate(){
            this.isShow = true;
        },
        onSearch(vl){
            if(this.debounceGetData){
                clearTimeout(this.debounceGetData);
            }
            this.debounceGetData = setTimeout((self) => {
                self.filter.search = '%'+vl+'%';
                self.getListActionPack();
            }, 300, this);
        },
        getListActionPack(){
            taskManagementApi
                .getListActionPack(this.filter)
                .then(res => {
                    if (res.status == 200) {
                        this.listActionPack = res.data ;
                        this.listActionPackOrigin = util.cloneDeep(res.data);
                    }else{
                        this.$snotifyError("", "Error! Have error !!!");
                    }
                });
        },
        listActionpackChange(){
            this.isShow = false;
            this.getListActionPack();
        },
        validateData(){
            let data=this.permissionProps;
            for (var key in data) {
                data[key].validate();
                if (data[key].validateStatus.isValid==false) {
                    return false
                }
            }
            return true;
        },
        show(){
            this.isShow=true;
        },
        setDataForPermissionDetail(){
            this.permissionProps.name.value = this.infoPermission.name;
            this.permissionProps.description.value = this.infoPermission.description;
            this.setListActionPackSelected();
        },
        /**
         * Function set trạng thái isCheck cho list permisstion in role
         */
        setListActionPackSelected(){
            setTimeout((self) => {
                self.listActionPackSelected=[];
                self.listActionPack = util.cloneDeep(self.listActionPackOrigin);
                if (self.listActionPackInPermissionPack.length > 0) {
                    for (let i = 0; i < self.listActionPackInPermissionPack.length; i++) {
                        let permission = util.cloneDeep(self.listActionPackInPermissionPack[i]);
                        permission.isCheck = true;
                        self.listActionPackSelected.push(permission);
                        let item = self.listActionPack.find(ele => ele.id == permission.id);
                        if (item) {
                            item.isCheck = true ;
                        }
                    }
                }
            }, 200,this);
           
        }
    },
    created(){
        this.getListActionPack();
        if (this.statusDetail && this.infoPermission) {
            this.setDataForPermissionDetail();
        }
    }

}
</script>

<style scoped>
.checkBox >>>.v-input--selection-controls__ripple{
    height: 19px;
    width: 19px;
    left: -5px;
    top: calc(50% - 17px)!important;
    margin: 7px;
}
.checkBox {
    margin: 0px;
    padding: 0px;
}
.checkBox >>> label{
    font-size: 13px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 200px;
}
.checkBox >>> .v-input__control {
    height: 24px;
}
.checkBox >>> .v-messages{
    display: none;
}

</style>