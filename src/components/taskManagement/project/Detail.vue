<template>
    <div class="h-100" style="width:40%;margin:auto">
        <v-card class="h-100" style="box-shadow: none;">
          <v-card-title  style="height:45px">
            <span class="headline ml-6">{{$t("taskManagement.detailProject")}}</span>
          </v-card-title>
          <v-card-text style="height:calc(100% - 90px)">
            <v-container class="h-100">
                <v-form
                    class="h-100"
                    ref="formEdit"
                    v-model="valid"
                    lazy-validation
                >
                <VuePerfectScrollbar
                    style="height:100%"
                    >
                    <v-col
                        cols="12"
                    >
                        <div style="text-align:center">
                            <v-icon v-if="!!projectNew.icon && projectNew.icon.indexOf('mdi-') > -1" class="display-3 pt-0">{{projectNew.icon}}</v-icon>
                            <img class="img-fluid" style="object-fit: fill;border-radius:3px" v-else-if="!!projectNew.icon && projectNew.icon.indexOf('mdi-') < 0" :src="projectNew.icon" width="128" height="128">
                            <pick-icon
                                @selected="selectedIcon"
                                class="mt-3"
                            />
                        </div>

                      
                    </v-col>
                    <v-col
                        cols="12"
                    >
                        <v-text-field
                            v-model="projectNew.name"
                            :rules="nameRules"
                            label="Name*"
                            outlined
                            dense
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                    >
                        <v-text-field
                            label="Key*"
                            outlined
                            dense
                            v-model="projectNew.key"
                            :rules="keyRules"
                        ></v-text-field>
                    </v-col>
                 
                    <v-col cols="12">
                        <v-text-field
                            label="Description"
                            outlined
                            dense
                            v-model="projectNew.description"
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                    >
                        <v-autocomplete
                            :items="allCategory"
                            v-model="currentCategory"
                            return-object
                            label="Category*"
                            outlined
                            dense
                            item-text="name"
                            item-value="id"
                            :multiple="false"
                            :rules="[v => !!v || 'Category is required']"
                            @change="applyChangeValue"
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                        <userSelector
                            class="selectUser"
                            ref="userSelector"
                            :outlined="true"
                            :label="`Leader`"
                            :solo="false"
                            :isMulti="false"
                            :compactChip="true"
                            :color="'transparent'"
                            :textColor="''"
                            :flat="true"
                            :valueObj="currentUserLeader"
                            @input="inputLeader"
                        ></userSelector>
                    </v-col>
                    </VuePerfectScrollbar>
                </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions  style="height:45px">
            <v-spacer></v-spacer>
            <v-btn
                v-if="statusEdit"
                class="mr-4"
                color="blue darken-1"
                text
                @click="validateEditProject"
            >
                {{$t("common.save")}}
            </v-btn>
          </v-card-actions>
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

export default {
    components:{
        infoUser,
        pickIcon,
        userSelector,
        VuePerfectScrollbar
    },
    data(){
        return{
            statusEdit:false,
            valid: false,
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length >= 3) || 'Name must be less than 10 characters',
            ],
            keyRules: [
                v => !!v || 'Key is required'
            ],
            currentCategory:{id:'',name:'Workflow'},
            currentUserLeader:{id:''},
            projectNew:{},
        }
    },
    watch:{
        projectNew: {
            deep: true,
            immediate: true,
            handler(after) {
                if (Object.keys(after).length>0) {
                    this.checkChangeValueEdit(after);
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
        checkChangeValueEdit(newVl){
            let oldVl=this.infoProject;
            if (newVl.name != oldVl.name || newVl.key!= oldVl.key||newVl.description!= oldVl.description||newVl.categoryId!= oldVl.categoryId ||newVl.icon!= oldVl.icon ||newVl.userLeader!= oldVl.userLeader ) {
                this.statusEdit=true;
            }else{
                this.statusEdit=false;
            }
        },
        validateEditProject () {
            this.$refs.formEdit.validate();
               setTimeout((self) => {
                if (self.valid) {
                    if (!self.projectNew.name || !self.projectNew.key ||!self.projectNew.categoryId || !self.projectNew.userLeader ) {
                        self.$snotifyError("", "Can not add project!");
                    }else{
                        let data = {};
                        data.name = self.projectNew.name;
                        data.description =self.projectNew.description;
                        data.categoryId = self.projectNew.categoryId;
                        data.icon = self.projectNew.icon;
                        data.key = self.projectNew.key;
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
                            })
                            .catch(err => {
                                self.$snotifyError("", "Can not update project!", err);
                            })
                            .always(() => {});
                    }
                }
            }, 200,this);
          
        },
        selectedIcon(data) {
            this.$set(this.projectNew, 'icon', data.icon.trim() )
        },
        applyChangeValue(vl){
            this.$set(this.projectNew,"categoryId",vl.id);
        },
        getNameCategory(){
            let allCategories=this.$store.state.taskManagement.allCategory;
            let item=allCategories.find(ele => ele.id == this.infoProject.categoryId);
            if (item) {
                this.currentCategory=item;
            }
        }
    },
    created(){
        this.projectNew=util.cloneDeep(this.infoProject);
        this.currentUserLeader.id=this.projectNew.userLeader;
        setTimeout((self) => {
            self.getNameCategory();
        }, 150,this);
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