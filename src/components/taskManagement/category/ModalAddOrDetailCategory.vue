<template>
    <v-dialog
        v-if="isShow"
        v-model="isShow"
        max-width="500px"
        scrollable
    >
        <v-card>
        <v-card-title>
            <span class="fs-16">Category</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <div style="text-align:center">
                    <v-icon v-if="!!infoCategory.icon && infoCategory.icon.indexOf('mdi-') > -1" class="display-3 pt-0">{{infoCategory.icon}}</v-icon>
                    <img class="img-fluid" style="object-fit: fill;border-radius:3px" v-else-if="!!infoCategory.icon && infoCategory.icon.indexOf('mdi-') < 0" :src="infoCategory.icon" width="80" height="80">
                    <pick-icon
                        @selected="selectedIcon"
                        class="mt-3"
                    />
                </div>
                <div>
                    <form-tpl
                    :allInputs="dataCategoryProps"/>
                </div>
                
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
                @click="handleAddCategory"
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
                @click="handleUpdateCategory()"
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
import pickIcon from "@/components/common/iconPicker";

export default {
    components:{
        FormTpl,
        pickIcon
    },
    props:{
        dataCategoryProps: {
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
        infoCategory: {
            type: Object,
            default() {
                return {
                    id:"",
                    name: "",
                    description: "",
                    icon: "",
                }
            }
        },
        statusDetail:{
            type:Boolean,
            default:false,
        }
    },
    watch: {
        dataCategoryProps: {
            deep: true,
            immediate:true,
            handler(newVl){
                if (newVl.name.value == this.infoCategory.name &&
                    newVl.description.value == this.infoCategory.description )
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
        handleAddCategory(){
            this.isLoadingAdd = true;
            let isValid = this.validateData();
            if (isValid) {
                let data={};
                data.name=this.dataCategoryProps.name.value;
                data.description=this.dataCategoryProps.description.value;
                data.icon=this.infoCategory.icon;
                taskManagementApi
                    .addCategory(data)
                    .then(res => {
                        if (res.status == 200) {
                            this.$snotifySuccess("Add category completed!");
                            this.$store.dispatch("taskManagement/addCategoryToStore", res.data);
                            this.isShow=false;
                        }else{
                            this.$snotifyError("", "Can not update category!");
                        }
                        this.isLoadingAdd=false;
                    })
                    .catch(err => {
                        this.$snotifyError("", "Can not update category!", err);
                        this.isLoadingAdd=false;
                    });
                
            }else{
                this.$snotifyError("", "Have error!");
                this.isLoadingAdd=false;
            }

        },
        handleUpdateCategory(){
            this.isLoadingAdd = true;
            let isValid = this.validateData();
            if (isValid) {
                let data={};
                data.name=this.dataCategoryProps.name.value;
                data.description=this.dataCategoryProps.description.value;
                data.icon=this.infoCategory.icon;

                taskManagementApi
                    .updateCategory(this.infoCategory.id,data)
                    .then(res => {
                        if (res.status == 200) {
                            this.$snotifySuccess("Update category success!");
                            data.id=this.infoCategory.id;
                            this.$store.dispatch("taskManagement/updateCategoryToStore",data);
                            this.isShow=false;
                        }else{
                            this.$snotifyError("", "Can not update category!");
                        }
                        this.isLoadingAdd=false;
                    })
                    .catch(err => {
                        this.$snotifyError("", "Can not update category!", err);
                        this.isLoadingAdd=false;
                    });
            }else{
                this.$snotifyError("", "Have error!");
                this.isLoadingAdd=false;
            }
        },
        selectedIcon(data) {
            this.disabled=false;
            this.$set(this.infoCategory, 'icon', data.icon.trim() )
        },
        show(){
            this.isShow=true;
        },
        validateData(){
            let data=this.dataCategoryProps;
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