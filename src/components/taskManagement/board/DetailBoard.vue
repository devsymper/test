<template>
    <div class="w-100 h-100">
        <div class="symper-title" >Thông tin board</div>
        <form-tpl
            style="width:500px"
            :allInputs="infoBoardProps"/>
        <span class="mt-3 fs-11">Project</span>
        <v-text-field
            style="width:500px"
            v-model="currentProject.name"
            dense
            readonly
            class="input-project"
            outlined
            prepend-inner-icon="mdi-map-marker"
        >
            <template v-slot:prepend-inner>
                <v-fade-transition leave-absolute>
                    <v-icon v-if="!!currentProject.icon && currentProject.icon.indexOf('mdi-') > -1" class="pt-0" style="font-size:24px">{{currentProject.icon}}</v-icon>
                    <img class="img-fluid" style="object-fit: fill;border-radius:3px" v-else-if="!!currentProject.icon && currentProject.icon.indexOf('mdi-') < 0" :src="currentProject.icon" width="24" height="24">
                        
                </v-fade-transition>
            </template>
        </v-text-field>
        <div style="width:500px; text-align:right">
            <v-btn
                :loading="isLoading"
                v-if="statusEdit && checkRole('task_manager_kanban_board','edit')"
                color="blue darken-1"
                text
                @click="updateBoard"
            >
                {{$t("common.save")}}
            </v-btn>
        </div>
      
    </div>
</template>

<script>
import FormTpl from "@/components/common/FormTpl.vue";
import { taskManagementApi } from "@/api/taskManagement.js";
import { checkPermission } from "@/views/taskManagement/common/taskManagerCommon";
import KanbanWorker from 'worker-loader!@/worker/taskManagement/kanban/Kanban.Worker.js';

export default {
    name:"detailBoard",
    components:{
        FormTpl
    },
    props:{
        infoBoard:{
            type:Object,
            default() {
                return {};
            }
        }
    },
    watch:{
        infoBoard(newVl){
            this.getData();
        },
        infoBoardProps: {
            deep: true,
            immediate: true,
            handler(after) {
                if (Object.keys(after).length>0) {
                    this.checkChangeValueEdit(after);
                }
            }
        },
    },
    data(){
        return{
            kanbanWorker:null,
            isLoading:false,
            statusEdit:false,
            currentProject:{},
            infoBoardProps:{
                name : { 
                    title: "Name",
                    type: "text",
                    value: '',
                    disabled:false,
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
                    disabled: false,
                    validateStatus:{
                        isValid:true,
                        message:""
                    },
                    validate(){
                    }
                },
                type : {
                    title: "Loại board",
                    type: "select",
                    value: '',
                    validateStatus:{
                        isValid:true,
                        message:""
                    },
                    disabled: true,
                    options:[{value:'kanban',text:'kanban'},{value:'scrum',text:'scrum'}],
                    validate(){
                        if (this.value=="") {
                            this.validateStatus.isValid=false;
                            this.validateStatus.message="Không bỏ trống";
                        }else{
                            this.validateStatus.isValid=true;
                            this.validateStatus.message="";
                        }
                    }
                }

            },
        }
    },
    methods:{
        checkRole(objectType,action){
            return checkPermission(objectType,action);
        },
        updateBoard(){
            this.isLoading = true;
            let isValid = this.validateData();
            if (isValid) {
                let data={};
                data.name=this.infoBoardProps.name.value;
                data.description=this.infoBoardProps.description.value;
                data.type=this.infoBoardProps.type.value;
                data.id=this.infoBoard.id;

                this.kanbanWorker.postMessage({
                    action:'updateBoard',
                    data:data
                });

            }else{
                this.$snotifyError("", "Have error!");
                this.isLoading=false;   
            }
        },
        checkChangeValueEdit(newVl){
            let oldVl=this.infoBoard;
            if (newVl.name.value != oldVl.name ||newVl.description.value!= oldVl.description ) {
                this.statusEdit=true;
            }else{
                this.statusEdit=false;
            }
        },
        getData(){
            if (this.infoBoard.id) {
                this.infoBoardProps.name.value=this.infoBoard.name;
                this.infoBoardProps.description.value=this.infoBoard.description;
                this.infoBoardProps.type.value=this.infoBoard.type;
                this.currentProject=this.$store.state.taskManagement.currentProject;
            }
        },
        validateData(){
            let data=this.infoBoardProps;
            for (var key in data) {
                data[key].validate();
                if (data[key].validateStatus.isValid==false) {
                    return false
                }
            }
            return true;
        },
        checkRoleIsAllowEdit(){
            let isAllow = checkPermission("task_manager_kanban_board","edit");
            this.disabled = !isAllow;
            if (!isAllow) {
                this.$set(this.infoBoardProps.name,"disabled",true);
                this.$set(this.infoBoardProps.description,"disabled",true);
            }
        }
    },
    created(){
        let self = this;
        this.getData()
        this.checkRoleIsAllowEdit();

        this.kanbanWorker = new KanbanWorker();
        this.kanbanWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'actionError':
                    self.$snotifyError("", "Update status error!");
                    self.isLoading = false;
                    break;
                case 'updateBoard':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit("taskManagement/updateBoardToStore", res);
                        self.$snotifySuccess("Update board success!");
                        self.statusEdit=false;
                        self.isLoading = false;
                    }
                    break;
             
                default:
                    break;
            }
        });

    }
}
</script>

<style scoped>
.input-project >>> fieldset  {
    border-color: #eeeeee;
}
</style>