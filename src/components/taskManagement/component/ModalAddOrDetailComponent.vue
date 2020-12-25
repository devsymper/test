<template>
    <v-dialog
        v-if="isShow"
        v-model="isShow"
        persistent
        max-width="500px"
        scrollable
    >
        <v-card>
        <v-card-title>
            <span class="fs-16">Component</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <div>
                    <form-tpl
                    :allInputs="dataComponentProps"/>
                </div>
                <span class="fs-11">Component lead</span>
                <userSelector
                    class="selectUser"
                    :isMulti="false"
                    :compactChip="true"
                    :color="'transparent'"
                    :textColor="''"
                    :flat="true"
                    :valueObj="currentUserLeader"
                    @input="inputUser"
                ></userSelector>
                
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                v-if="!statusDetail"
                :loading="isLoadingAdd"
                class="btn-add"
                @click="handleAddComponent"
            >
                {{$t("common.add")}}
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                v-else
                :loading="isLoadingAdd"
                :disabled="disabled"
                class="btn-add"
                @click="handleUpdateComponent()"
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
</template>

<script>
import FormTpl from "@/components/common/FormTpl.vue";
import { taskManagementApi } from "@/api/taskManagement.js";
import userSelector from "@/components/user/UserSelector.vue";

export default {
    components:{
        FormTpl,
        userSelector
    },
    props:{
        dataComponentProps: {
            type: Object,
            default() {
                return {
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
                }
            }
        },
        infoComponent: {
            type: Object,
            default() {
                return {
                    id:"",
                    name: "",
                    description: "",
                    userLeader: "",
                }
            }
        },
        statusDetail:{
            type:Boolean,
            default:false,
        },
        currentUserLeader:{
            type: Object,
            default() {
                return {
                    id:""
                }
            }
        }
    },
    watch: {
        dataComponentProps: {
            deep: true,
            immediate:true,
            handler(newVl){
                if (newVl.name.value == this.infoComponent.name &&
                    newVl.description.value == this.infoComponent.description )
                {
                    this.disabled=true;
                }else{
                    this.disabled=false;
                }
            }
        },
        currentUserLeader:{
            deep: true,
            immediate:true,
            handler(newVl){
                if (newVl.id == this.infoComponent.userLeader)
                {
                    this.disabled=true;
                }else{
                    this.disabled=false;
                }
            }
        }
    },
    data(){
        return{
            isLoadingAdd:false,
            disabled:true,
            isShow:false,
        
        }
    },
    methods:{
        inputUser(userId){
            this.$set(this.currentUserLeader,"id",userId);
        },
        handleAddComponent(){
            this.isLoadingAdd = true;
            let isValid = this.validateData();
            if (isValid) {
                let data={};
                let projectId=this.$route.params.id;
                data.name=this.dataComponentProps.name.value;
                data.description=this.dataComponentProps.description.value;
                data.projectId=projectId;
                if (this.currentUserLeader.id) {
                    data.userLeader=this.currentUserLeader.id;
                }
                taskManagementApi
                    .addComponentForProject(data)
                    .then(res => {
                        if (res.status == 200) {
                            this.$emit("add-component");
                            this.$snotifySuccess("Add component completed!");
                            this.isShow=false;
                        }else{
                            this.$snotifyError("", "Can not add component!");
                        }
                        this.isLoadingAdd=false;
                    })
                    .catch(err => {
                        this.$snotifyError("", "Can not add component!", err);
                        this.isLoadingAdd=false;
                    });
            }else{
                this.isLoadingAdd=false;
            }

        },
        handleUpdateComponent(){
            this.isLoadingAdd = true;
            let isValid = this.validateData();
            if (isValid) {
                let data={};
                data.name=this.dataComponentProps.name.value;
                data.description=this.dataComponentProps.description.value;
                data.userLeader=this.currentUserLeader.id;
                taskManagementApi
                    .updateComponentForProject(this.infoComponent.id,data)
                    .then(res => {
                        if (res.status == 200) {
                            this.$snotifySuccess("Update Component success!");
                            data.id=this.infoComponent.id;
                            this.$emit("add-component"); // emit sự kiện để reload data
                            this.isShow=false;
                        }else{
                            this.$snotifyError("", "Can not update Component!");
                        }
                        this.isLoadingAdd=false;
                    })
                    .catch(err => {
                        this.$snotifyError("", "Can not update Component!", err);
                        this.isLoadingAdd=false;
                    });
            }else{
                this.$snotifyError("", "Have error!");
                this.isLoadingAdd=false;
            }
        },
        show(){
            this.isShow=true;
        },
        validateData(){
            let data=this.dataComponentProps;
            for (var key in data) {
                data[key].validate();
                if (data[key].validateStatus.isValid==false) {
                    return false
                }
            }
            return true;
        },
    },
    
}
</script>

<style>

</style>