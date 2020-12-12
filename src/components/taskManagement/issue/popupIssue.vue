<template>
     <v-dialog
        v-model="isShow"
        max-width="600px"
        scrollable
    >
        <v-card>
        <v-card-title>
            <div class="w-100 d-flex justify-space-between">
                <span class="fs-16">Create Issues</span>
                <div >
                    <v-btn>aa</v-btn>
                </div>
            </div>

        </v-card-title>
        <v-card-text class="pb-0">
            <v-container class="pa-0">
                <div>
                    <form-tpl
                    :allInputs="dataInfoIssueProps"/>
                </div>
            </v-container>
        </v-card-text>
        <v-card-actions class="px-4">
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                :loading="isLoading"
                class="btn-add"
            >
                {{$t("common.add")}}
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
</template>

<script>
import FormTpl from "@/components/common/FormTpl.vue";
import { taskManagementApi } from "@/api/taskManagement.js";

export default {
    name: "issue",
    components:{
        FormTpl,
    },
    data(){
        return{
            isLoading:false,
            isShow:false,
            dataInfoIssueProps:{
                name : { 
                    title: "Tiêu đề công việc",
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
                component : {
                    title: "Component",
                    type: "autocomplete",
                    value: '',
                    options: [
                    ],
                    validateStatus:{
                        isValid:true,
                        message:""
                    },
                    validate(){
                    }
                },
                description : {
                    title: "Mô tả",
                    type: "editor",
                    value: '',
                    validateStatus:{
                        isValid:true,
                        message:""
                    },
                    validate(){
                    }
                },
                priority : {
                    title: "Priority",
                    type: "autocomplete",
                    value: '',
                    options: [
                    ],
                    validateStatus:{
                        isValid:true,
                        message:""
                    },
                    validate(){
                    }
                },
                dueDate : {
                    title: "Due date",
                    type: "dateFormat",
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
        show(){
            this.isShow=true;
        },
    }

}
</script>

<style>

</style>