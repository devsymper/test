<template>
    <div class="w-100 h-100 pl-1">
        <v-card style="box-shadow:none">
            <v-card-title>
                {{$t("taskManagement.listPermission")}}
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
                <v-btn small class="px-1 ml-1" solo depressed @click="handleCreate">
                    <span>Create permission</span>
                </v-btn>
            </v-card-title>
            <!-- <v-data-table
                :headers="headers"
                :items="listActionPack"
                :search="search"
                hide-default-footer
                class="table-list-category"
            >
            </v-data-table> -->
        </v-card>

        <v-dialog
            v-model="isShow"
            max-width="600px"
            scrollable
        >
            <v-card>
            <v-card-title>
                <span class="fs-16">Thêm permission</span>
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
                            solo
                            style="max-width:255px;"
                            single-line
                            hide-details
                            class="sym-small-size sym-style-input"
                        ></v-text-field>
                    </div>
                    <div class="mt-2">
                        <v-list dense>
                            <v-list-item-group
                                color="primary"
                                class="list-control-autocomplete"
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
                                        ></v-checkbox>
                                        <div class="pa-0 pl-8 " style="color:#888">{{item.description}}</div>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </div>
                </v-container>
            </v-card-text>
            <v-card-actions class="py-0">
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    v-if="!statusDetail"
                    :loading="isLoading"
                    class="btn-add"
                >
                    {{$t("common.add")}}
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    v-else
                    :loading="isLoading"
                    :disabled="disabled"
                    class="btn-add"
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
    </div>
</template>

<script>
import { cloneObjectActionControls } from "./../role/RoleDefinition";
import FormTpl from "@/components/common/FormTpl.vue";
import { taskManagementApi } from "@/api/taskManagement.js";
import infoUser from "@/components/common/user/InfoUser";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
    components:{
        'form-tpl' : FormTpl,
        infoUser,
        VuePerfectScrollbar
    },
    computed:{
        listActionPack(){
            let allActionPack = [
                {
                    id  : 1,
                    name : "Nhóm hành động của admin",
                    description : "Các hành động về việc config quản lý hệ thống task management",
                    isCheck : false
                },
                {
                    id  :2,
                    name : "Nhóm hành động của admin",
                    description : "Các hành động về việc config quản lý hệ thống task management",
                    isCheck : false
                },
                {
                    id  : 3,
                    name : "Nhóm hành động của admin",
                    description : "Các hành động về việc config quản lý hệ thống task management",
                    isCheck : false
                },
                {
                    id  : 4,
                    name : "Nhóm hành động của admin",
                    description : "Các hành động về việc config quản lý hệ thống task management",
                    isCheck : false
                },
            ]
            return allActionPack
        },
    },
    data(){
        return{
            isLoading:false,
            isShow:false,
            search:'',
            statusDetail:false,
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
        handleCreate(){
            this.isShow = true;
        },
        onSearch(vl){
            let val = vl;
            $('.list-control-autocomplete .sym-control').removeClass('d-none');
            $('.list-control-autocomplete .sym-control').removeClass('first-active');
            $('.list-control-autocomplete .sym-control:not(:Contains("' + val + '"))').addClass('d-none');
            $('.list-control-autocomplete .sym-control:Contains("' + val + '")').first().addClass('first-active')
        },
    },
    created(){
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