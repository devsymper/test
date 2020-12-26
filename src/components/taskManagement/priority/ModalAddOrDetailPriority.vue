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
            <span class="fs-16">Priority</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <div style="position: relative;">
                    <span class="fs-11 mr-2 " style="color:rgb(0 0 0 / 0.6)">Chọn icon</span>
                    <v-btn height="25" class="px-1" depressed small @click="handleClickIcon">
                        <v-icon :color="dataPriorityProps.color.value" small>{{infoPriority.icon}}</v-icon>
                    </v-btn>
                    <MaterialIcon class="pick-icon" @selected="selectedIcon" :float="true" ref="materialIconPicker"/>

                </div>
                <div>
                    <form-tpl
                    :allInputs="dataPriorityProps"/>
                </div>
                
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                v-if="statusDetail && infoPriority.common == 0"
                :loading="isLoadingAdd"
                :disabled="disabled"
                class="btn-add"
                @click="handleUpdatePriority()"
            >
                {{$t("common.update")}}
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                v-else-if="!statusDetail"
                :loading="isLoadingAdd"
                class="btn-add"
                @click="handleAddPriority"
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
import MaterialIcon from "@/components/common/MaterialIcon";

export default {
    components:{
        FormTpl,
        MaterialIcon
    },
    props:{
        dataPriorityProps: {
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
                    color : {
                        title: "Color",
                        type: "color",
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
        infoPriority: {
            type: Object,
            default() {
                return {
                    id:"",
                    name: "",
                    description: "",
                    icon: "mdi-arrow-up",
                    color: "",
                    common: 0
                }
            }
        },
        statusDetail:{
            type:Boolean,
            default:false,
        }
    },
    watch: {
        dataPriorityProps: {
            deep: true,
            immediate:true,
            handler(newVl){
                if (newVl.name.value == this.infoPriority.name &&
                    newVl.description.value == this.infoPriority.description )
                {
                    this.disabled=true;
                }else{
                    this.disabled=false;
                }
            }
        },
    },
    data(){
        return{
            isLoadingAdd:false,
            disabled:true,
            isShow:false,
        }
    },
    methods:{
        handleClickIcon(){
            this.$refs.materialIconPicker.show({top:'40px',left:'60px'});
        },
        handleAddPriority(){
            this.isLoadingAdd = true;
            let isValid = this.validateData();
            if (isValid) {
                let data={};
                data.name=this.dataPriorityProps.name.value;
                data.description=this.dataPriorityProps.description.value;
                data.color=this.dataPriorityProps.color.value;
                data.icon=this.infoPriority.icon;
                taskManagementApi
                    .addPriority(data)
                    .then(res => {
                        if (res.status == 200) {
                            this.$snotifySuccess("Add priority completed!");
                            this.$store.commit("taskManagement/addPriorityToStore", res.data);
                            this.isShow=false;
                        }else{
                            this.$snotifyError("", "Can not update priority!");
                        }
                        this.isLoadingAdd=false;
                    })
                    .catch(err => {
                        this.$snotifyError("", "Can not update priority!", err);
                        this.isLoadingAdd=false;
                    });
                
            }else{
                this.$snotifyError("", "Have error!");
                this.isLoadingAdd=false;
            }

        },
        handleUpdatePriority(){
            this.isLoadingAdd = true;
            let isValid = this.validateData();
            if (isValid) {
                let data={};
                data.name=this.dataPriorityProps.name.value;
                data.description=this.dataPriorityProps.description.value;
                data.color=this.dataPriorityProps.color.value;
                data.icon=this.infoPriority.icon;

                taskManagementApi
                    .updatePriority(this.infoPriority.id,data)
                    .then(res => {
                        if (res.status == 200) {
                            this.$snotifySuccess("Update priority success!");
                            data.id=this.infoPriority.id;
                            this.$store.commit("taskManagement/updatePriorityToStore",data);
                            this.isShow=false;
                        }else{
                            this.$snotifyError("", "Can not update priority!");
                        }
                        this.isLoadingAdd=false;
                    })
                    .catch(err => {
                        this.$snotifyError("", "Can not update priority!", err);
                        this.isLoadingAdd=false;
                    });
            }else{
                this.$snotifyError("", "Have error!");
                this.isLoadingAdd=false;
            }
        },
        selectedIcon(data) {
            this.disabled=false;
            this.$set(this.infoPriority, 'icon', data );
            this.$refs.materialIconPicker.hide();
        },
        show(){
            this.isShow=true;
        },
        validateData(){
            let data=this.dataPriorityProps;
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

<style scoped>
.pick-icon {
    box-shadow: var(--symper-box-shadow)!important;
}
</style>