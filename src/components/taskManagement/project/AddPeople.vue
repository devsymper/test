<template>
    <v-dialog
            v-if="isShow"
            v-model="isShow"
            persistent
            max-width="500px"
        >
        <v-card>
            <v-card-title>
                <span class="fs-16">Add people</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <span class="fs-11">Thành viên</span>
                     <userSelector
                        class="selectUser"
                        :isMulti="true"
                        :compactChip="true"
                        :color="'transparent'"
                        :textColor="''"
                        :flat="true"
                        @input="inputUser"
                    ></userSelector>

                    <form-tpl
                        :allInputs="roleSelect"/>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    :loading="isLoadingAdd"
                    class="btn-add"
                    @click="addPeopleToProject"
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
import userSelector from "../../user/UserSelector";
import FormTpl from "@/components/common/FormTpl.vue";
import { taskManagementApi } from "@/api/taskManagement.js";

export default {
    components:{
        userSelector,
        'form-tpl' : FormTpl,
    },
    props:{
        roles: {
            type: Array,
            default() {
                return [];
            }
        },
    },
    watch:{
        roles:function(vl){
            if (vl.length>0) {
                this.setRoleSelect();
            }
        }
    },
    data(){
        return{
            isLoadingAdd:false,
            isShow:false,
            roleSelect:{
                roles : { 
                    title: "Role",
                    type: "select",
                    value:"",
                    options: [
                    ],
                    validateStatus:{
                        isValid:true,
                        message:"Error"
                    },
                    validate(){
                    
                    }
                },
            },
            userSelect:[]
        }
    },
    methods:{
        show(){
            this.isShow=true;
        },
        inputUser(users){
            this.userSelect=users;
        },
        addPeopleToProject(){
            this.isLoadingAdd=true;
            if (this.userSelect.length==0) {
                this.$snotifyError("", "None user selected!");
            }else{
                let isValid = this.validateData();
                if (isValid) {
                    let projectId=this.$route.params.id;
                    let data={};
                    data.userIds=JSON.stringify(this.userSelect);
                    data.projectId=projectId;
                    data.roleId=this.roleSelect.roles.value;

                    taskManagementApi
                        .addUserToProject(data)
                        .then(res => {
                            if (res.status == 200) {
                                this.$snotifySuccess("Add people success!");
                                this.$emit("add-people-success");
                                this.isShow=false;

                            }else{
                                this.$snotifyError("", "Can not add people!");
                            }
                        })
                        .catch(err => {
                            this.$snotifyError("", "Can not add people!", err);
                        }) ;

                    console.log("aa",projectId);

                    this.$snotifySuccess("Add people success!");
                    
                }else{
                    this.$snotifyError("", "Chưa có role nào được chọn!");
                }
            }

            this.isLoadingAdd=false;
        },
        validateData(){
            let data=this.roleSelect;
            if (data.roles.value=="") {
                data.roles.validateStatus.isValid=false;
                data.roles.validateStatus.message="Chưa có role nào được chọn";
                return false
            }else{
                data.roles.validateStatus.isValid=true;
                data.roles.validateStatus.message="";
            }
            return true;
        },
        setRoleSelect(){
            setTimeout((self) => {
                let role = self.roles;
                role = role.reduce((arr, obj)=>{
                    let newObj = {text:obj.name,value:obj.id};
                    arr.push(newObj);
                    return arr
                },[]);
                self.roleSelect.roles.options = role
            }, 200,this);
        }
    },
    created(){
        this.setRoleSelect;
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
    min-height: 30px!important;
}
</style>