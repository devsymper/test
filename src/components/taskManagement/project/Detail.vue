<template>
    <div class="h-100" style="width:40%;margin:auto">
        <v-card class="h-100" style="box-shadow: none;">
          <v-card-title  style="height:45px">
            <span class="headline ml-6">{{$t("taskManagement.detailProject")}}</span>
          </v-card-title>
          <v-card-text style="height:calc(100% - 45px)">
            <v-container class="h-100">
                <div style="text-align:center">
                    <v-icon v-if="!!projectNew.icon && projectNew.icon.indexOf('mdi-') > -1" class="display-3 pt-0">{{projectNew.icon}}</v-icon>
                    <img class="img-fluid" style="object-fit: fill;border-radius:3px" v-else-if="!!projectNew.icon && projectNew.icon.indexOf('mdi-') < 0" :src="projectNew.icon" width="60" height="60">
                    <pick-icon
                        @selected="selectedIcon"
                        class="mt-2 pick-icon"
                    />
                </div>
                <div>
                    <form-tpl
                    :allInputs="dataProjectProps"/>
                </div>
                <span class="fs-11">Leader</span>
                <userSelector
                    class="selectUser"
                    ref="userSelector"
                    :label="`Leader`"
                    :solo="true"
                    :isMulti="false"
                    :compactChip="true"
                    :color="'transparent'"
                    :disabled="disabled"
                    :textColor="''"
                    :flat="true"
                    :valueObj="currentUserLeader"
                    @input="inputLeader"
                ></userSelector>
                <div style="text-align:right">
                    <v-btn
                        v-if="statusEdit && !disabled"
                        class="mt-2 pa-2"
                        :loading="isLoadingAdd"
                        color="blue darken-1"
                        text
                        @click="validateEditProject"
                    >
                        {{$t("common.save")}}
                    </v-btn>
                </div>
               
            </v-container>
          </v-card-text>
        </v-card>
    </div>
</template>

<script>
import infoUser from "@/components/common/user/InfoUser";
import userSelector from "@/components/user/UserSelector.vue";
import pickIcon from "@/components/common/iconPicker";
import { taskManagementApi } from "@/api/taskManagement.js";
import { util } from "@/plugins/util";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import FormTpl from "@/components/common/FormTpl.vue";
import { checkPermission } from "@/views/taskManagement/common/taskManagerCommon";

export default {
    components:{
        infoUser,
        pickIcon,
        userSelector,
        VuePerfectScrollbar,
        FormTpl
    },
    data(){
        return{
            disabled:true,
            isLoadingAdd:false,
            statusEdit:false,
            currentUserLeader:{id:''},
            projectNew:{},
            dataProjectProps:{
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
                key : { 
                    title: "Key",
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
                    disabled:false,
                    validateStatus:{
                        isValid:true,
                        message:""
                    },
                    validate(){
                    }
                },
                categories : { 
                    title: "Category",
                    type: "select",
                    value:"",
                    disabled:false,
                    options: [
                    ],
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
            },
        }
    },
    watch:{
        dataProjectProps: {
            deep: true,
            immediate: true,
            handler(after) {
                if (Object.keys(after).length>0) {
                    this.checkChangeValueEdit(after);
                }
            }
        },
        projectNew: {
            deep: true,
            immediate: true,
            handler(after) {
                if (Object.keys(after).length>0) {
                    this.checkChangeValueEdit(after,"checkIconAndLeader");
                }
            }
        },
    },
    props:{
        infoProject: {
            type: Object,
            default() {
                return {};
            }
        },
    },
    computed:{
        allCategory(){
            return this.$store.state.taskManagement.allCategory;
        }
    },
    methods:{
        inputLeader(data) {
            console.log("userId", data);
            this.$set(this.projectNew,"userLeader",data);
        },
        checkChangeValueEdit(newVl,str=''){
            let oldVl=this.infoProject;
            if (str=="checkIconAndLeader") {
                if (newVl.userLeader!= oldVl.userLeader || newVl.icon!= oldVl.icon  ) {
                    this.statusEdit=true;
                }else{
                    this.statusEdit=false;
                }
                
            }else{
                if (newVl.name.value != oldVl.name || newVl.key.value!= oldVl.key||newVl.description.value!= oldVl.description||newVl.categories.value!= oldVl.categoryId ) {
                    this.statusEdit=true;
                }else{
                    this.statusEdit=false;
                }
            }
        

        },
        validateData(){
            let data=this.dataProjectProps;
            for (var key in data) {
                data[key].validate();
                if (data[key].validateStatus.isValid==false) {
                    return false
                }
            }
            return true;
        },
        validateEditProject () {
            this.isLoadingAdd = true;
            let self=this;
            let isValid = this.validateData();
            if (isValid) {
                if (!self.dataProjectProps.name.value || !self.dataProjectProps.key.value ||!self.dataProjectProps.categories.value || !self.projectNew.userLeader ) {
                    self.$snotifyError("", "Can not add project!");
                }else{
                    let data = {};
                    data.name = self.dataProjectProps.name.value;
                    data.description =self.dataProjectProps.description.value;
                    data.categoryId = self.dataProjectProps.categories.value;
                    data.icon = self.projectNew.icon;
                    data.key = self.dataProjectProps.key.value;
                    data.userLeader = self.projectNew.userLeader;
                    taskManagementApi
                        .updateProject(self.projectNew.id,data)
                        .then(res => {
                            if (res.status == 200) {
                                self.$snotifySuccess("Update project completed!");
                                data.id=self.projectNew.id;
                                self.$store.dispatch("taskManagement/updateProjectToStore", data);
                                self.infoProject.name=data.name;
                                self.infoProject.description=data.description;
                                self.infoProject.categoryId=data.categoryId;
                                self.infoProject.icon=data.icon;
                                self.infoProject.key=data.key;
                                self.infoProject.userLeader=data.userLeader;
                                
                            }else{
                                self.$snotifyError("", "Can not update project!");
                            }
                            this.isLoadingAdd = false;
                        })
                        .catch(err => {
                            self.$snotifyError("", "Can not update project!", err);
                            this.isLoadingAdd = false;
                        });
                }
            }else{
                this.isLoadingAdd = false;
            }
        },
        selectedIcon(data) {
            this.$set(this.projectNew, 'icon', data.icon.trim() )
        },
        applyChangeValue(vl){
            this.$set(this.projectNew,"categoryId",vl.id);
        },
        getDataProps(infoProject){
            this.dataProjectProps.name.value=infoProject.name;
            this.dataProjectProps.key.value=infoProject.key;
            this.dataProjectProps.description.value=infoProject.description;
        },
        setCategorySelect(){
            setTimeout((self) => {
                let category = this.$store.state.taskManagement.allCategory;
                category = category.reduce((arr, obj)=>{
                    let newObj = {text:obj.name,value:obj.id};
                    arr.push(newObj);
                    return arr
                },[]);
                    self.dataProjectProps.categories.options = category;
                    self.dataProjectProps.categories.value = self.infoProject.categoryId;
            }, 500,this);
        },
        checkRoleIsAllowEdit(){
            let isAllow = checkPermission("task_manager_project","edit");
            this.disabled = !isAllow;
            if (!isAllow) {
                this.$set(this.dataProjectProps.name,"disabled",true);
                this.$set(this.dataProjectProps.key,"disabled",true);
                this.$set(this.dataProjectProps.description,"disabled",true);
                this.$set(this.dataProjectProps.categories,"disabled",true);
            }
        }
    },
    created(){
        this.setCategorySelect();
        this.projectNew=util.cloneDeep(this.infoProject);
        this.getDataProps(util.cloneDeep(this.infoProject));
        this.currentUserLeader.id=this.projectNew.userLeader;
        this.checkRoleIsAllowEdit();

    }


}
</script>

<style scoped>
.selectUser{
    border-radius: 3px!important;
}
.selectUser >>> label{
    font-size: 17px!important;
}
.selectUser >>> .v-input__slot{
    height: 36px!important;
}
</style>