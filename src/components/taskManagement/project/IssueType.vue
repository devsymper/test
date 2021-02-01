<template>
    <div class="w-100 h-100">
        <div class="h-100">
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
                    <v-btn v-if="checkRole('task_manager_issue_type','add')" small class="mx-1" solo depressed  @click="handleCreate">
                        <span>Create Issue Type</span>
                    </v-btn>
                </v-card-title>
                <v-data-table
                    :headers="headers"
                    :items="listIssue"
                    :search="search"
                    hide-default-footer
                    class="table-list-user"
                    @click:row="handelDetailIssueType"
                >
                    <template v-slot:[`item.name`]="{ item }">
                        <div class="d-flex">
                            <div class="d-flex">
                                <v-icon v-if="!!item.icon && item.icon.indexOf('mdi-') > -1" class="pt-0" style="font-size:24px">{{item.icon}}</v-icon>
                                <img class="img-fluid" style="object-fit: fill;border-radius:3px" v-else-if="!!item.icon && item.icon.indexOf('mdi-') < 0" :src="item.icon" width="24" height="24">
                            </div>
                            <span class="name-object pt-1 pl-2" style="color:#0000aa">
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
                                <v-icon v-if="checkRole('task_manager_issue_type','delete')" v-on="on" @click.prevent.stop="handleDeleteIssueType(item)" style="font-size:24px">mdi-delete-outline</v-icon>
                            </template>
                            <span>Delete</span>
                        </v-tooltip>
                    </template>
                    <template  v-slot:[`item.taskLifeCircleId`]="{ item }">
                        <div v-if="!item.taskLifeCircleId">
                            <v-btn v-if="checkRole('task_manager_issue_type','edit')" x-small class="px-1" solo depressed  @click.prevent.stop="handleShowPopupWorkflow(item)">
                                <v-icon color="blue" size="16">mdi-plus</v-icon>
                            </v-btn>
                        </div>
                        <div v-else>
                            <span class="name-object" style="color:blue" @click.prevent.stop="goToWorkflow(item)" v-if="item.workflowName">{{item.workflowName}}</span>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-icon v-if="checkRole('task_manager_issue_type','edit')" v-on="on" @click.prevent.stop="handleChangeWorkflow(item)" class="ml-1" size="16" color="grey">mdi-autorenew</v-icon>
                                </template>
                                <span>Change</span>
                            </v-tooltip>
                        </div>
                    </template>

                    <template  v-slot:[`item.documentId`]="{ item }">
                        <div v-if="!item.documentId">
                            <v-btn v-if="checkRole('task_manager_issue_type','edit')" x-small class="px-1" solo depressed  @click.prevent.stop="handleShowPopupConfigField(item)">
                                <v-icon color="blue" size="16">mdi-plus</v-icon>
                            </v-btn>
                        </div>
                        <div v-else>
                            <span class="name-object" style="color:blue" @click.prevent.stop="goToDocument(item)" v-if="item.documentName">{{item.documentName}}</span>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-icon v-if="checkRole('task_manager_issue_type','edit')" v-on="on" @click.prevent.stop="handleChangeDocConfigField(item)" class="ml-1" size="16" color="grey">mdi-autorenew</v-icon>
                                </template>
                                <span>Change</span>
                            </v-tooltip>
                        </div>
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
                    color="green darken-1"
                    text
                    v-if="isDetail"
                    :loading="isLoadingAdd"
                    class="btn-add"
                    @click="handleUpdateIssueType"
                >
                    {{$t("common.update")}}
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    v-else
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
        <v-dialog
            v-model="dialogAddWorkflow"
            persistent
            max-width="400px"
            scrollable
        >
            <v-card>
            <v-card-title>
                <span class="fs-16">Select workflow</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <div>
                        <form-tpl
                        style="width:300px"
                        :allInputs="selectWorkflowProps"/>
                    </div>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="green darken-1"
                    text
                    :loading="isLoadingAdd"
                    class="btn-add"
                    @click="handleCreateWorkflow"
                >
                    Create workflow
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    :loading="isLoadingAdd"
                    class="btn-add"
                    @click="handleUpdateIssueWorkflowOrDocumentId('workflow')"
                >
                    {{$t("common.add")}}
                </v-btn>

                <v-btn
                color="red darken-1"
                text
                @click="dialogAddWorkflow = false"
                >
                    {{$t("common.close")}}
                </v-btn>
           
            </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="dialogConfigField"
            persistent
            max-width="400px"
            scrollable
        >
            <v-card>
            <v-card-title>
                <span class="fs-16">Select format field issue</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <div>
                        <form-tpl
                        style="width:300px"
                        :allInputs="selectFieldIssue"/>
                    </div>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="green darken-1"
                    text
                    :loading="isLoadingAdd"
                    class="btn-add"
                    @click="handleCreateDocConfigField"
                >
                    Create
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    :loading="isLoadingAdd"
                    class="btn-add"
                    @click="handleUpdateIssueWorkflowOrDocumentId('documentId')"

                >
                    {{$t("common.add")}}
                </v-btn>

                <v-btn
                color="red darken-1"
                text
                @click="dialogConfigField = false"
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
                <v-btn color="red darken-1" text @click="removeIssue">Xóa</v-btn>
                <v-btn color="green darken-1" text @click="dialogRemove = false">Hủy</v-btn>
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
import { checkPermission } from "@/views/taskManagement/common/taskManagerCommon";

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
            let allWorkflow = this.$store.state.taskManagement.allWorkflow;
            let allDocConfigField = this.$store.state.taskManagement.listDocumentConfigFieldIssue;
            if (allWorkflow.length > 0) {
                for (let i = 0; i < listIssueType.length; i++) {
                    if (listIssueType[i].taskLifeCircleId) {
                        let workflow = allWorkflow.find(ele => ele.id == listIssueType[i].taskLifeCircleId);
                        if (workflow) {
                            listIssueType[i].workflowName=workflow.name;
                        }
                    }     
                    if (listIssueType[i].documentId) {
                        let document = allDocConfigField.find(ele => ele.id == listIssueType[i].documentId);
                        if (document) {
                            listIssueType[i].documentName=document.title;
                        }
                    }                  
                }
            }
            console.log("listIssueType",listIssueType);
            return listIssueType; 
        },
    },
    data(){
        return{
            isDetail:false,
            dialogRemove:false,
            isLoadingAdd:false,
            dialogAddIssueType:false,
            dialogAddWorkflow:false,
            dialogConfigField:false,
            issueTypeSelected:{},
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
                { text: this.$t("taskManagement.table.configField"), value: "documentId" },
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
            selectWorkflowProps:{
                workflow : { 
                    title: "workflow",
                    type: "autocomplete",
                    value: '',
                    multipleSelection:false,
                    showId:false,
                    options:[],
                },
            },
            selectFieldIssue:{
                document : { 
                    title: "Issue type",
                    type: "autocomplete",
                    value: '',
                    multipleSelection:false,
                    options:[],
                },
            },
            infoIssueType:{
                id:"",
                name: "",
                description: "",
                icon: "",
                taskLifeCircleId:""
            },
          
        }
    },
    methods:{
        checkRole(objectType,action){
            return checkPermission(objectType,action);
        },
        handleChangeWorkflow(item){
            this.selectWorkflowProps.workflow.value = item.taskLifeCircleId;
            this.issueTypeSelected=item;
            if (this.selectWorkflowProps.workflow.options.length == 0) {
                this.$set(this.selectWorkflowProps.workflow,"options",this.$store.state.taskManagement.allWorkflow);
            }
            this.dialogAddWorkflow = true;
        },
        handleChangeDocConfigField(item){
            this.selectFieldIssue.document.value = item.documentId;
            this.issueTypeSelected=item;
            if (this.selectFieldIssue.document.options.length == 0) {
                this.$set(this.selectFieldIssue.document,"options",this.$store.state.taskManagement.listDocumentConfigFieldIssue);
            }
            this.dialogConfigField = true;
        },
        handleUpdateIssueType(){
            this.isLoadingAdd = true;
            let isValid = this.validateData();
            if (isValid) {
                let data={};
                data.name=this.dataIssueTypeProps.name.value;
                data.icon=this.infoIssueType.icon;
                data.description=this.dataIssueTypeProps.description.value;
                data.taskLifeCircleId=this.infoIssueType.taskLifeCircleId;
                data.documentId=this.infoIssueType.documentId;

                taskManagementApi
                    .updateIssueType(this.infoIssueType.id,data)
                    .then(res => {
                        if (res.status == 200) {
                            this.$emit("add-issuetype");
                            this.$snotifySuccess("Add issue type success!");
                            this.dialogAddIssueType=false;
                        }else{
                            this.$snotifyError("", "Can not update issue type!");
                        }
                        this.isLoadingAdd=false;

                    })
                    .catch(err => {
                        this.$snotifyError("", "Can not update issue type!", err);
                        this.isLoadingAdd=false;
                    });
                
            }else{
                this.$snotifyError("", "Have error!");
                this.isLoadingAdd=false;
            }
        },
        handelDetailIssueType(item){
            if (!checkRole('task_manager_issue_type','edit')) {
                return ;
            }
            this.dataIssueTypeProps.name.value = item.name;
            this.dataIssueTypeProps.description.value = item.description;
            this.infoIssueType.icon=item.icon;
            this.infoIssueType.id=item.id;
            this.infoIssueType.taskLifeCircleId=item.taskLifeCircleId;
            this.infoIssueType.documentId=item.documentId;
            this.isDetail = true;
            this.dialogAddIssueType = true;

        },
        removeIssue(){
            taskManagementApi
                .deleteIssueType(this.issueTypeSelected.id)
                .then(res => {
                    if (res.status == 200) {
                        this.$emit("add-issuetype"); // emit sự kiện cho reload data
                        this.$snotifySuccess("Remove category success!");
                    }else{
                        this.$snotifyError("", "Error! Have error !!!");
                    }
                })
                .catch(err => {
                    this.$snotifyError("", "Error! Have error !!!", err);
                });
            this.dialogRemove=false;  
        },
        goToWorkflow(item){
            let projectId=this.$route.params.id;
            if (item.taskLifeCircleId) {
                this.$router.push("/task-management/projects/"+projectId+"/workflow/"+item.taskLifeCircleId);
            }
        },
        goToDocument(item){
            if (item.documentId) {
                this.$router.push("/documents/"+item.documentId+"/editor/edit");
            }
        },
        handleUpdateIssueWorkflowOrDocumentId(typeUpdate = "workflow"){
            this.isLoadingAdd = true;
            let id = this.issueTypeSelected.id;
            if (typeUpdate == "workflow") {
                var worflfowId = this.selectWorkflowProps.workflow.value;
            }else if(typeUpdate == "documentId"){
                var documentId = this.selectFieldIssue.document.value;
            }
            if (id && (worflfowId || documentId) ) {
                let data={};
                data.name = this.issueTypeSelected.name;
                data.icon = this.issueTypeSelected.icon;
                data.description = this.issueTypeSelected.description;
                if (typeUpdate == "workflow") {
                    data.documentId = this.issueTypeSelected.documentId;
                    data.taskLifeCircleId = worflfowId;
                }else if(typeUpdate == "documentId"){
                    data.documentId = documentId;
                    data.taskLifeCircleId = this.issueTypeSelected.taskLifeCircleId;
                }
                taskManagementApi
                    .updateIssueType(id,data)
                    .then(res => {
                        if (res.status == 200) {
                            this.$emit("add-issuetype"); // emit sự kiện cho reload data
                            this.dialogAddWorkflow=false;
                            this.dialogConfigField=false;
                        }else{
                            this.$snotifyError("", "Can not add workflow for issue type!");
                        }
                        this.isLoadingAdd = false;

                    })
                    .catch(err => {
                        this.$snotifyError("", "Can not add workflow for issue type!", err);
                        this.isLoadingAdd = false;

                    });
            }else{
                this.isLoadingAdd = false;
            }

        },
        handleShowPopupWorkflow(item){
            this.issueTypeSelected=item;
            this.$set(this.selectWorkflowProps.workflow,"options",this.$store.state.taskManagement.allWorkflow);
            this.dialogAddWorkflow = true;
        },
        handleShowPopupConfigField(item){
            this.issueTypeSelected=item;
            this.$set(this.selectFieldIssue.document,"options",this.$store.state.taskManagement.listDocumentConfigFieldIssue);
            this.dialogConfigField = true;
        },
        handleCreateWorkflow(){
            let projectId=this.$route.params.id;
            this.$router.push('/task-management/projects/'+projectId+'/workflow/create');
        },
        handleCreateDocConfigField(){
            this.$router.push('/document/editor');
        },
        handleCreate(){
            this.dataIssueTypeProps.name.value = "";
            this.dataIssueTypeProps.description.value = "";
            this.infoIssueType.icon="";
            this.infoIssueType.id="";
            this.infoIssueType.taskLifeCircleId="";
            this.isDetail = false;
            this.dialogAddIssueType = true;

        },
        handleDeleteIssueType(item){
            this.issueTypeSelected = item;
            this.dialogRemove = true;
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
                        this.isLoadingAdd=false;
                    })
                    .catch(err => {
                        this.$snotifyError("", "Can not add issue type!", err);
                        this.isLoadingAdd=false;

                    });
                
            }else{
                this.$snotifyError("", "Have error!");
                this.isLoadingAdd=false;
            }

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

    },
  
}
</script>

<style scoped>

.name-object:hover{
    cursor: pointer;
    text-decoration: underline;
}

</style>