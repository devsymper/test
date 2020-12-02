<template>
    <div class="w-100 h-100">
        <div class="w-100 justify-space-between d-flex" style="height:40px">
            <div class="symper-title pl-2">{{title}}</div>
            <div class="d-flex mt-2 mr-4">
                <v-btn class="px-1" small solo depressed @click="handleCreate" color="#0052CC">
                    <v-icon color="white" size="18">mdi-plus</v-icon>
                    <span  style="color:white">Create project</span>
                </v-btn>
            </div>
        </div>
        <!-- list project -->
        <div style="height:calc(100% - 41px)">
            <v-row class="ml-0 mr-0">
                <v-col cols="12" class="list-tasks pt-0 pb-0">
                    <v-row>
                    <v-col
                        cols="1"
                        class="pl-3 fs-13 font-weight-medium"
                        style=" flex: 0 0 3%; max-width: 3%;"         
                    >
                        <v-icon class="pl-3" style="font-size:17px">mdi-star</v-icon>
                    </v-col>
                     <v-col
                        cols="2"
                        class="pl-3 fs-13 font-weight-medium"
                    >
                        {{$t("taskManagement.table.name")}}
                    </v-col>
                    <v-col
                        cols="1"
                        class="fs-13 font-weight-medium"
                    > 
                        Key
                    </v-col>
                    <v-col
                        cols="2"
                        class="fs-13 font-weight-medium"
                    >
                         {{$t("taskManagement.table.description")}}
                    </v-col>
                    <v-col
                        cols="2"
                        class="fs-13 font-weight-medium"

                    > {{$t("taskManagement.table.createAt")}}
                    </v-col>
                    <v-col
                        cols="2"
                        class="fs-13 font-weight-medium"
                    > {{$t("taskManagement.table.lead")}}
                    </v-col>
                    <v-col
                        cols="2"
                        class="fs-13 font-weight-medium"
                    > {{$t("taskManagement.table.category")}}
                    </v-col>
                
                    </v-row>
                </v-col>
            </v-row>
            <v-divider></v-divider>

            <VuePerfectScrollbar
            v-if="!loadingTaskList"
            @ps-y-reach-end="handleReachEndList"
            :style="{height: listItemHeight+'px'}"
            >
                <v-row
                    v-for="(obj, idx) in listProject"
                    :key="idx"
                    @click="onProjectItemClick(obj)"
                    :class="{
                        'mr-0 ml-0 single-row': true ,
                    }"
                    :style="{
                        minHeight: '42px'
                    }"
                    style="border-bottom: 1px solid #eeeeee!important;"
                        
                >
                    <v-col
                        cols="1"
                        class="fs-13"
                        style=" flex: 0 0 3%; max-width: 3%;"         
                    >
                        <v-icon v-if="obj.isFavorite==1" class="ml-2 favorite" color="yellow" @click="updateFavorite(obj)">mdi-star</v-icon>
                        <v-icon v-else class="ml-2 favorite" @click="updateFavorite(obj)" >mdi-star-outline</v-icon>
                    </v-col>
                    <v-col cols="2" class="fs-13 pl-3 d-flex ">
                        <div class="d-flex">
                            <v-icon v-if="!!obj.icon && obj.icon.indexOf('mdi-') > -1" class="pt-0" style="font-size:24px">{{obj.icon}}</v-icon>
                            <img class="img-fluid" style="object-fit: fill;border-radius:3px" v-else-if="!!obj.icon && obj.icon.indexOf('mdi-') < 0" :src="obj.icon" width="24" height="24">
                        </div>
                        <span class="name-project pt-1 pl-2" style="color:#0000aa">
                            {{obj.name}}
                        </span>
                    </v-col>
                    <v-col
                        cols="1"
                        class="fs-13 "
                    >
                        {{obj.key}}
                    </v-col> 
                    <v-col
                        cols="2"
                        class="fs-13 "
                    >
                        {{obj.description}}
                    </v-col>
                    <v-col
                        cols="2"
                        class="fs-13"
                    >
                        {{obj.createAt}}
                    </v-col>
                    <v-col
                        cols="2"
                        class="fs-12 pt-3"
                    >
                        <infoUser class="userInfo" :userId="obj.infoUserLead.userId" :roleInfo="obj.infoUserLead.roleInfo?obj.infoUserLead.assigneeRole:{}" />
                    </v-col>
                    <v-col
                        cols="2"
                        class="fs-13 "
                    >
                        {{obj.categoryName}}
                    </v-col>
                
                </v-row>
            </VuePerfectScrollbar>
        </div>

        <v-dialog
            v-model="dialogCreate"
            persistent
            max-width="600px"
        >
        <v-card>
          <v-card-title>
            <span class="headline">Create project</span>
          </v-card-title>
          <v-card-text>
            <v-container>
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                    <v-col
                        cols="12"
                    >
                        <v-text-field
                            outlined
                            dense
                            placeholder="Name*"
                            v-model="infoProject.name"
                            :rules="nameRules"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        md="6"
                        class="float-left"
                    >
                        <v-text-field
                            placeholder="Key*"
                            outlined
                            dense
                            v-model="infoProject.key"
                            :rules="keyRules"
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        md="6"
                        class="d-flex justify-space-between"
                    >
                        <pick-icon
                            @selected="selectedIcon"
                            class="mt-3"
                        />
                        <div class="mr-10">
                            <v-icon v-if="!!infoProject.iconName && infoProject.iconName.indexOf('mdi-') > -1" class="display-3 pt-0">{{infoProject.iconName}}</v-icon>
                            <img v-else-if="!!infoProject.iconName && infoProject.iconName.indexOf('mdi-') < 0" :src="infoProject.iconName" width="90">
                        </div>
                    </v-col>
                    <v-col cols="12" style="clear:both">
                        <v-text-field
                            outlined
                            dense
                            placeholder="Description"
                            v-model="infoProject.description"
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                    >
                        <v-autocomplete
                            outlined
                            dense
                            :items="$store.state.taskManagement.allCategory"
                            placeholder="Category*"
                            item-text="name"
                            item-value="id"
                            :multiple="false"
                            :rules="[v => !!v || 'Category is required']"
                            @change="applyChangeValue"
                        ></v-autocomplete>
                    </v-col>
                </v-form>
                <small style="color:red">*{{$t("taskManagement.requiredField")}}</small>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-1"
              text
              @click="dialogCreate = false"
            >
                {{$t("common.close")}}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="validateAddProject"
            >
                {{$t("common.add")}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { util } from "@/plugins/util";
import infoUser from "@/components/common/user/InfoUser";
import pickIcon from "@/components/common/iconPicker";
import { taskManagementApi } from "@/api/taskManagement.js";

export default {
    components:{
        VuePerfectScrollbar: VuePerfectScrollbar,
        infoUser,
        pickIcon
    },
    computed:{
        listProject(){
            let allUserById = this.$store.getters['app/mapIdToUser'];
            let projects=this.$store.state.taskManagement.allProject;
            let categories=this.$store.state.taskManagement.allCategory;
            for (let i = 0; i < projects.length; i++) {
                let roleInfo={};
                projects[i].infoUserLead={};
                if (projects[i].userLeader) {
                    let userId=projects[i].userLeader;
                    if (userId.indexOf(":")>0) {  //check là userId hay userId:role
                        let arrDataUserIden=userId.split(":");
                        userId=arrDataUserIden[0];
                        if (arrDataUserIden.length>3) { // loại trừ trường hợp role=0
                            let roleIdentify=projects[i].userLeader.slice(userId.length+1);
                            roleInfo=this.getRoleUser(roleIdentify);
                        }
                    }
                    projects[i].infoUserLead.userId= userId;
                    projects[i].infoUserLead.userName = allUserById[projects[i].userLeader] ? allUserById[projects[i].userLeader].displayName : '';
                    projects[i].infoUserLead.roleInfo = roleInfo;
                }
                //
                let categoryName="";
                let category=categories.find(element => element.id==projects[i].categoryId);
                if (category) {
                    categoryName= category.name;
                }
                projects[i].categoryName=categoryName;
            }
            console.log("project",projects);
            return projects;
        }
    },
    data(){
        return{
            title:"Project",
            dialogCreate:false,
            data:[],
            totalObject:0,
            loadingTaskList: false,
            loadingMoreTask: false,
            listItemHeight: 300,
            infoProject: {
                name: "",
                description: "",
                key:"",
				iconName: "",
                iconType:"",
                categoryId:"",
            },
            valid: false,
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length >= 3) || 'Name must be less than 10 characters',
            ],
            keyRules: [
                v => !!v || 'Key is required'
            ],
          
        }
    },
    methods:{
        /**
         * hoangnd:chuyển view mở chi tiết 1 project
         */
        onProjectItemClick(obj){
            this.$router.push('/task-management/projects/'+obj.id+'/kanban-board')
        },
        validateAddProject () {
            this.$refs.form.validate();
            setTimeout((self) => {
                if (self.valid) {
                    if (!self.infoProject.name || !self.infoProject.key ||!self.infoProject.categoryId ) {
                        self.$snotifyError("", "Can not add project!");
                    }else{
                        let data = {};
                        data.name = self.infoProject.name;
                        data.description =self.infoProject.description;
                        data.categoryId = self.infoProject.categoryId;
                        data.icon = self.infoProject.iconName;
                        data.key = self.infoProject.key;
                        taskManagementApi
                            .addProject(data)
                            .then(res => {
                                if (res.status == 200) {
                                    self.$snotifySuccess("Add project completed!");
                                    self.$store.dispatch("taskManagement/addProjectToStore", res.data);
                                    self.dialogCreate=false;
                                }else if(res.status==400){
                                    self.$snotifyError("", "Validate key error",res.message);
                                }
                            })
                            .catch(err => {
                                self.$snotifyError("", "Can not add project!", err);
                            })
                            .always(() => {});

                    }
                }
            }, 200,this);
          
        },
        updateFavorite(obj){
            let self=this;
            taskManagementApi
                .updateProjectFavorite(obj.id)
                .then(res => {
                    if (res.status == 200) {
                        self.$snotifySuccess("Update project completed!");
                        self.$store.commit("taskManagement/updateStatusFavoriteProject", obj.id);

                    }else{
                        self.$snotifyError("", "Can not update project!");
                    }
                })
                .catch(err => {
                    self.$snotifyError("", "Can not update project!", err);
                })
                .always(() => {});
        },
        applyChangeValue(vl){
            this.$set(this.infoProject,"categoryId",vl);
        },
        selectedIcon(data) {
            this.$set(this.infoProject, 'iconName', data.icon.trim() )
            this.$set(this.infoProject, 'iconType' , data.type)
		},
        handleReachEndList() {
            if (
                this.data.length < this.totalObject &&
                this.data.length > 0  && !this.loadingTaskList && !this.loadingMoreTask
            ) {
                this.page +=1;
                this.getData();
            }
        },
        reCalcListTaskHeight() {
            this.listItemHeight =util.getComponentSize(this.$el.parentElement).h - 85;
        },
        /**~~~~~~~~~~~~~~~~~~~~ */
        getRoleUser(roleIdentify){
            let arrDataRole=roleIdentify.split(":");
            let allSymperRole=this.$store.state.app.allSymperRoles;
            if (allSymperRole[arrDataRole[0]]) {
                let role=(allSymperRole[arrDataRole[0]]).find(element => element.roleIdentify===roleIdentify);
                return role;
            }else{
                return {};
            }
        },  
        handleCreate(){
            this.dialogCreate=true;
        },
    },
    created(){
    },
    mounted(){
        this.reCalcListTaskHeight();
    }
}
</script>

<style scoped>
.single-row:hover {
    background: #f5f5f5;
    cursor: pointer;
}
.name-project:hover{
    cursor: pointer;
    text-decoration: underline;
}
.favorite:hover{
    color: rgb(226, 226, 59);
}
</style>