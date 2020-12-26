<template>
     <v-dialog
        v-model="isShow"
        max-width="600px"
        scrollable
    >
        <v-card>
        <v-card-title class="px-4">
            <div class="w-100 d-flex justify-space-between">
                <span class="fs-16">Create Issues</span>
                <div class="d-flex">
                    <v-autocomplete 
                    return-object
                    item-text="name"
                    item-value="id"
                    :items="allProject" 
                    solo
                    class="project-select sym-small-size sym-style-input">

                        <template v-slot:selection="{item}">
                            <v-icon v-if="!!item.icon && item.icon.indexOf('mdi-') > -1" class="mr-1" style="font-size:18px">{{item.icon}}</v-icon>
                            <img  v-else-if="!!item.icon && item.icon.indexOf('mdi-') < 0" :src="item.icon" height="15" width="15" alt="" class="mr-2">
                            <div class="project-name">{{item.name}}</div>
                        </template>
                        <template v-slot:item="{item}">
                            <template>
                                <v-icon v-if="!!item.icon && item.icon.indexOf('mdi-') > -1" class="mr-1" style="font-size:18px">{{item.icon}}</v-icon>
                                <img  v-else-if="!!item.icon && item.icon.indexOf('mdi-') < 0" :src="item.icon" height="15" width="15" alt="" class="mr-2">
                                <div class="project-name">{{item.name}}</div>
                            </template>
                        </template>
                    </v-autocomplete>
                    <v-autocomplete solo class="task-type-select sym-small-size sym-style-input"></v-autocomplete>
                </div>
            </div>

        </v-card-title >
        <v-card-text class="pa-1 pb-0">
            <v-container class="pa-0">
                <div>
                    <!-- <form-tpl
                    :allInputs="dataInfoIssueProps"/> -->
                    <submit
                        ref="submitComponent"
                        class="doc_issue"
                        :action="'submit'"
                        :docId="Number(docId)"
                        :showSubmitButton="false"
                        @submit-document-success="onSubmitDone"
                     />
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
                @click="submitForm"
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
import { util } from '../../../plugins/util';
import Submit from '../../../views/document/submit/Submit.vue';

export default {
    name: "issue",
    components:{
        FormTpl,
        Submit,
    },
    data(){
        return{
            isLoading:false,
            isShow:false,
            docId:2131,
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
    computed:{
        allProject(){
            let projects = util.cloneDeep(this.$store.state.taskManagement.allProject);
            projects = projects.reduce((arr,obj)=>{
                arr.push({id:obj.id, name: obj.name, icon:obj.icon});
                return arr;
            },[])
            return projects;
        }
    },
    methods:{
        show(){
            this.isShow=true;
        },
        submitForm(){
            this.isLoading = true;
            this.$refs.submitComponent.handlerSubmitDocumentClick();
        },
        onSubmitDone(data){
            this.isLoading = false;
            this.$snotifySuccess("Add issue success!");

        },
    }

}
</script>

<style scoped>
   
    .project-select{
        width: 160px;
        margin-right: 8px;
    }
    .task-type-select{
        width: 140px;
    }
    .project-name{
        font-size: 13px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .project-select >>> .v-select__selections input{
        min-width: 1px;
    }
    ::v-deep .v-input__slot{
        box-shadow: none !important;
    }
    .doc_issue >>> table td span{
        width: 100%;
    }
    .doc_issue ::v-deep .s-control{
        font-size: 13px!important;
        margin-top: 0px;
        border-top: 1px solid #efefef!important;
        border: 1px solid #efefef!important;
    }
</style>