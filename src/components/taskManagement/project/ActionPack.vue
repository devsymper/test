<template>
    <div class="w-100 h-100 pl-1">
        <v-card style="box-shadow:none">
            <v-card-title>
                {{$t("taskManagement.listActionPack")}}
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
                    <span>Create action pack</span>
                </v-btn>
            </v-card-title>
            <v-data-table
                :headers="headers"
                :items="listActionPack"
                :search="search"
                hide-default-footer
                class="table-list-category"
            >
            </v-data-table>
        </v-card>

        <v-dialog
            v-model="isShow"
            persistent
            max-width="600px"
            scrollable
        >
            <v-card>
            <v-card-title>
                <span class="fs-16">Thêm action pack</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <div>
                        <form-tpl
                        :allInputs="actionPackProps"/>
                    </div>
                    <!-- div search -->
                    <div class=" mt-2 d-flex justify-space-between">
                        <span class="font-weight-medium pt-1">Cấu hình quyền truy cập</span>
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
                    <div class="w-100 float-left">
                        <div class="width:60px">
                            <VuePerfectScrollbar >
                                
                            </VuePerfectScrollbar>
                        </div>
                        <div class="width:40%">

                        </div>
                    </div>
                </v-container>
            </v-card-text>
            <v-card-actions>
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
            listActionPack:[],
            actionPackProps:{
                name : { 
                    title: "Tên action pack",
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
    },
    created(){
        console.log(cloneObjectActionControls(),"agsdgs");
    }

}
</script>

<style>

</style>