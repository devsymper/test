<template>
    <div class="w-100 h-100">
        <div class="w-100 justify-space-between d-flex" style="height:40px">
            <div class="symper-title pl-2">{{title}}</div>
            <div class="d-flex pt-2 pr-4">
                <v-btn small class="px-1" solo depressed  @click="handleCreate" color="#0052CC">
                    <v-icon color="white" size="18">mdi-plus</v-icon>
                    <span style="color:white">Create Issue Type</span>
                </v-btn>
            </div>
        </div>
            <!-- list category -->
        <div style="height:calc(100% - 40px)">
             <v-card style="box-shadow:none">
                <v-card-title>
                    {{$t("taskManagement.listIssueType")}}
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
                    :items="listIssue"
                    :search="search"
                    hide-default-footer
                    class="table-list-user"
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
                                <v-icon v-on="on" @click.prevent.stop="handleDeleteIssueType(item)" style="font-size:24px">mdi-delete-outline</v-icon>
                            </template>
                            <span>Delete</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-card>
        </div>

        <v-dialog
            v-model="dialogAddIssueType"
            persistent
            max-width="500px"
            scrollable
        >
            <v-card>
            <v-card-title>
                <span class="fs-16">Create issue type</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <div style="text-align:center">
                        <v-icon v-if="!!infoIssueType.icon && infoIssueType.icon.indexOf('mdi-') > -1" class="display-3 pt-0">{{infoIssueType.icon}}</v-icon>
                        <img class="img-fluid" style="object-fit: fill;border-radius:3px" v-else-if="!!infoIssueType.icon && infoIssueType.icon.indexOf('mdi-') < 0" :src="infoIssueType.icon" width="80" height="80">
                        <pick-icon
                            @selected="selectedIcon"
                            class="mt-3"
                        />
                    </div>
                    <div>
                        <form-tpl
                        :allInputs="dataIssueTypeProps"/>
                    </div>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    :loading="isLoadingAdd"
                    class="btn-add"
                    @click="handleAddIssueType"
                >
                    {{$t("common.add")}}
                </v-btn>

                <v-btn
                color="red darken-1"
                text
                @click="dialogAddIssueType = false"
                >
                    {{$t("common.close")}}
                </v-btn>
           
            </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
import { util } from "@/plugins/util";
import { taskManagementApi } from "@/api/taskManagement.js";
import infoUser from "@/components/common/user/InfoUser";
import pickIcon from "@/components/common/iconPicker";
import FormTpl from "@/components/common/FormTpl.vue";

export default {
    name:"list-issue-type",
    components:{
       infoUser,
       pickIcon,
       FormTpl
    },
    props:{
        listIssueType: {
            type: Array,
            default() {
                return [];
            }
        }
  
    },
    computed:{
        listIssue(){
            let listIssueType=util.cloneDeep(this.listIssueType);
            console.log("listIssueType",listIssueType);
            return listIssueType; 
        },
    },
    data(){
        return{
            isLoadingAdd:false,
            dialogAddIssueType:false,
            search:'',
            title:"Issue Type",
            headers: [
                {
                text: this.$t("taskManagement.table.name"),
                align: "start",
                value: "name"
                },
                { text: this.$t("taskManagement.table.description"), value: "description" },
                { text: this.$t("common.created_by"), value: "user" },
                { text: this.$t("taskManagement.table.createAt"), value: "createAt" },
                { text: this.$t("taskManagement.table.workflow"), value: "taskLifeCircleId" },
                { text: "", value: "action" },
            ],
            dataIssueTypeProps:{
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
            infoIssueType:{
                name: "",
                description: "",
                icon: "",
            },
          
        }
    },
    methods:{
        handleCreate(){
            this.dialogAddIssueType=true;

        },
        handleDeleteIssueType(item){

        },
        handleAddIssueType(){
            this.isLoadingAdd = true;
            let isValid = this.validateData();
            if (isValid) {
                let data={};
                data.name=this.dataIssueTypeProps.name.value;
                data.icon=this.infoIssueType.icon;
                data.description=this.dataIssueTypeProps.description.value;
                data.projectId=this.$route.params.id;

                taskManagementApi
                    .addIssueTypeForProject(data)
                    .then(res => {
                        if (res.status == 200) {
                            this.$emit("add-issuetype");

                            this.$snotifySuccess("Add issue type success!");
                            this.dialogAddIssueType=false;
                        }else{
                            this.$snotifyError("", "Can not add issue type!");
                        }
                    })
                    .catch(err => {
                        this.$snotifyError("", "Can not add issue type!", err);
                    })
                    .always(() => {});
                
            }else{
                this.$snotifyError("", "Have error!");
            }
            this.isLoadingAdd=false;

        },
        selectedIcon(data) {
            this.$set(this.infoIssueType, 'icon', data.icon.trim() )
        },

        validateData(){
            let data=this.dataIssueTypeProps;
            for (var key in data) {
                data[key].validate();
                if (data[key].validateStatus.isValid==false) {
                    return false
                }
            }
            return true;
        },
   
    },
    created(){
        console.log("aa",this.listIssueType);
    },
  
}
</script>

<style scoped>

.name-project:hover{
    cursor: pointer;
    text-decoration: underline;
}

</style>