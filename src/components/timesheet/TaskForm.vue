<template>
    <v-card>
        <v-card-title class="pt-2 headline lighten-2" primary-title>
            <div class="w-100 fs-18 " >
                {{$t('timesheet.task_form')}}
            </div>
        </v-card-title>
        <v-card-text  v-bind:style="cateError? 'height:80px' :'height:60px'" class="h-65" >
            <span class="label pt-2 ">{{$t('timesheet.category_task')}}<span class="color-red"> *</span></span>
            <v-autocomplete 
                v-bind:style="cateError? 'margin-bottom:4px' :''"
                style="margin-top:2px!important; "
                item-text="fullName"
                item-value="id"
                v-model="categoryTask" 
                class="category-task"
                return-object
                :items="category" 
                item-color="white" 
                background-color="#f2f2f2">
                <template v-slot:item="data" class="category-task">
                    <!-- <img style='max-height: 40px; max-width: 30px; margin-right:5px' 
                    :src="require('../../assets/icon/AD-IT.png')" /> -->
                <span style='color:black' >{{ data.item.fullName }}
                    <v-icon v-if="data.item.id == categoryTask.id" color="success">
                    mdi-check</v-icon></span>
            </template>
            </v-autocomplete >
            <div class="w-100 mb-5" style="height:20px">
                <span class="red--text" v-show="cateError">{{cateError}}</span>
            </div>
        </v-card-text>
        <v-card-text v-bind:style="nameError? 'height:80px' :'height:60px'">
            <span class="label pt-2"> {{$t('timesheet.name')}}<span style="color:red"> *</span></span>
            <div>
                <input 
                    type="text" 
                    v-model="name" 
                    class="w-100 input-logform"
                    v-bind:style="nameError? 'margin-bottom:4px' :''">
            </div>
            <div class="w-100 mb-5" style="height:20px">
                <span class="red--text" v-show="nameError">{{nameError}}</span>
            </div>
        </v-card-text>
        <v-card-text class='task-form h-65'>
            <span class="label pt-2">{{$t('timesheet.assignee')}}</span>
            <v-autocomplete 
                class="task mt-2 w-100" 
                v-model="user"
                item-text="displayName"    
                item-value="id" 
                :items="listUser" 
                :menu-props="{'nudge-top':-10, 'max-width': 300}" 
                label="Tìm kiếm">
                    <template v-slot:selection="data">
                        <SymperAvatar 
                            class="mr-2" 
                            style ="height: 20px!important; width: 20px!important;min-width: 30px!important; margin-left:-15px" 
                            :userId="data.item.id"/>
                        <v-list-item-content style="margin-left:-10px">
                            <v-list-item-title >{{data.item.displayName}}</v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <template v-slot:item="data">
                        <SymperAvatar class="mr-2" style ="height: 30px!important; width: 30px!important;min-width: 30px!important" :userId="data.item.id"/>
                        <v-list-item-content>
                        <v-list-item-title >{{data.item.displayName}}</v-list-item-title>
                        <v-list-item-subtitle class="fs-11 color-grey" >{{data.item.email}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </template>
            </v-autocomplete>
        </v-card-text>
        <v-card-text>
            <span class="label pt-2">{{$t('timesheet.description')}}</span>
            <textarea 
                class='pl-3' 
                style="background-color:#f2f2f2"
                rows="4" cols="44" v-model= "desc">
            </textarea>
        </v-card-text>
        <v-card-actions class="pb-2">
            <div class= "d-flex justify-end w-100">
                <v-btn text class="fs-13" width="50"  
                @click="save()">{{$t('timesheet.save')}}</v-btn>
                <v-btn  width="50" class='mr-1 fs-13' text @click="cancel()">
                    {{$t('timesheet.cancel')}}
                </v-btn>
            </div>
        </v-card-actions>
    </v-card>
</template>  
<script>
import timesheetApi from '../../api/timesheet';
import userApi from '../../api/user';
import SymperAvatar from '../../components/common/SymperAvatar';
import BPMNEngine from "../../api/BPMNEngine";
import { defaultTaskDescription } from "../../components/process/elementDefinitions/customExtToModel";
import { util } from "../../plugins/util" ;
import TaskFormWorker from 'worker-loader!@/worker/timesheet/TaskForm.Worker.js';

export default {
    components:{
        SymperAvatar
    },
    name: 'TaskForm',
    data: () => ({
        name: '',
        categoryTask:'',
        desc: '',
        cateError:'',
        search:null,
        taskFormWorker:null,
        checkbox:false,
        check:false,
        showSubmitTask:false,
        nameError: '',
        category:[],
        listUser: [],
        user:''
    }),
    created(){
        debugger
        this.category = this.$store.state.timesheet.listCate;
        this.taskFormWorker = new TaskFormWorker();
        this.listUser = this.$store.state.app.allUsers;
    },
    watch:{
        name(){
            if(this.check){
                if(this.name==''){
                }else{
                    this.nameError = '';
                    this.check = false;
                }
            }
        },
        categoryTask(){
            if(this.categoryTask.type==1){
                this.showSubmitTask = true;
                this.$emit('cancel');
                this.$emit('docId',this.categoryTask.docId);
                this.$store.commit("timesheet/showListProcess", true);
            }
             if(this.check){
                if(this.categoryTask==''){
                }else{
                    this.cateError = '';
                    this.check = false;
                }
            }
        },
    },
    mounted() {
        const self = this;
        this.taskFormWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                 case 'createTask':
                    self.checkCreateTask(data.dataAfter)
                    break;
                default:
                    break;
            }
        });
    },
    methods: {
        // showSubmitTaskForm(){
          
        // },
        checkCreateTask(check){
             if (check) {
                this.$emit('loadTask');
                this.cancel();
                this.$snotify({
                    title:"success",
                    text: "Thêm thành công"
                })
             }else{
                 this.$snotify({
                    title:"error",
                    text: "Lỗi"
                })
             }
        },
        cancel(){
            this.categoryTask = "";
            this.user = "";
            this.checkbox ="";
            this.name="";
            this.cateError ="";
            this.desc="";
            this.nameError ="";
            this.$emit('cancel')
        },
        async saveTaskSymper(){
            let description = util.cloneDeep(defaultTaskDescription);
            description.action.module = "task";
            description.action.resource = "task";
            description.content = this.name;
            if ( this.desc == "" ||this.desc == null) {
                description.extraLabel = this.$t("tasks.header.alertDescription");
            } else {
                description.extraLabel = this.desc;
            }
            description.action.action = "submitAdhocTask";
            let data = {
                assignee:this.user,
                description: description,
                 owner: this.$store.state.app.endUserInfo.id+":"+this.$store.state.app.endUserInfo.currentRole.id
            };
            data.description = JSON.stringify(description);
            let res = await BPMNEngine.addTask(JSON.stringify(data));
        },
        save(){
            let self = this;
            this.check = true;
            if(this.name==''&&this.categoryTask==''){
                 this.nameError = this.$t('timesheet.required_value'); 
                  this.cateError = this.$t('timesheet.required_value'); 
             }
             else if(this.categoryTask==''){
                this.cateError = this.$t('timesheet.required_value'); 
             }
             else if(this.name==''){
                this.nameError = this.$t('timesheet.required_value'); 
             }
            else{
             self.saveTaskSymper();
             let data = {
                task: this.name,
                desc: this.desc,
                cate: this.categoryTask,
                userAssign: this.user,
                isPublic:this.checkbox==''?1:0
             }
              self.taskFormWorker.postMessage({
                action:'createTask',
                data:data
            })
            }
        }
    },
    computed:{
        // category(){
        //     return this.$store.state.timesheet.listCate
        // }
    }
}
</script>
<style lang="scss" scoped>
.v-btn:not(.v-btn--round).v-size--default {
    height: 30px;
    font-weight: 400!important;
    font-family: Roboto !important;
    padding: 0 16px;
    border-radius:3px!important
}
.v-card ::v-deep .v-card__text {
    padding-bottom: 0px;
    padding-top: 0px;
    margin-bottom: 0px;
    font-size: 13px;
    font-family: Roboto;
    color: black
}
.v-input__control {
    font-size: 13px;
    font-family: Roboto;
    color: grey;
}
.input-logform {
    float: flex;
    background-color: #f2f2f2;
    width: 60px;
    height: 32px !important;
    border-radius: 2px;
    padding-left: 12px;
}
.v-menu__content .v-list {
    padding-top: 10px;
    top: 120px !important;
}
.v-dialog {
    width: 450px;
}
.category-task ::v-deep .v-label--active {
    display: none;
    height: 37px !important;
    font-size: 13px !important;
    border-radius: 4px;
    padding-left: 0px;
}
.category-task {
    padding-top: 0px !important;
    height: 37px !important;
    font-size: 13px !important;
    border-radius: 4px;
}
.category-task ::v-deep .v-input__slot:before {
    border-color: transparent !important;
}
.category-task ::v-deep .v-input__slot:after {
    border-color: transparent !important;
}
.task {
    font-size: 13px;
    margin-top: 10px !important;
}
.task ::v-deep .v-input__slot {
    background-color: #f2f2f2;
    margin-top: -19px;
      padding-left: 10px;
}
.h-65{
    height:65px
}
.task ::v-deep .v-label {
    font-size: 13px;
}
.task ::v-deep .v-input__slot:after {
    border-color: transparent !important;
      padding-left: 10px;
}

.task ::v-deep .v-input__slot:before {
    border-color: transparent !important;
      padding-left: 10px;
}

.task ::v-deep .v-label--active {
    display: none;
}

.task ::v-deep .v-list {
    width: 385px !important;
}
.category-task ::v-deep .v-select__slot{
    padding-left: 10px;
}
.task-form ::v-deep .input{
    display:none!important
}
</style>
<style >
.v-label{
        font-size:13px!important;
        font-family:Roboto
    }
</style>
