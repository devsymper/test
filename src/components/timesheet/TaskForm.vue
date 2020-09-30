<template>
<v-card>
    <v-card-title class="pb-2 pt-2 headline lighten-2" 
    primary-title>
        <div class="w-100 pb-1" style=" font-size: 18px; border-bottom: 1px solid lightgrey;">
            {{$t('timesheet.task_form')}}
            </div>
    </v-card-title>
    <v-card-text  v-bind:style="cateError? 'height:80px' :'height:60px'" class="mt-1 h-65" >
        <span class="label pt-2 ">{{$t('timesheet.category_task')}}<span style="color:red"> *</span></span>
        <v-autocomplete 
         v-bind:style="cateError? 'margin-bottom:4px' :''"
            style="margin-top:2px!important; " 
            :menu-props="{'nudge-top':-40}" 
             v-model="categoryTask" 
            class="category-task" 
            :items="category" 
            placeholder="Tìm việc ..." 
            item-color="white" 
            background-color="#F7F7F7">
            <template v-slot:item="data" class="category-task">
                <!-- <img style='max-height: 40px; max-width: 30px; margin-right:5px' 
                :src="require('../../assets/icon/AD-IT.png')" /> -->
            <span style='color:black' >{{ data.item }}
                <v-icon v-if="data.item === categoryTask " color="success">
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
            <input type="text" placeholder="Tên ..." v-model= "name" class="w-100 input-logform"
            v-bind:style="nameError? 'margin-bottom:4px' :''">
        </div>
        <div class="w-100 mb-5" style="height:20px">
            <span class="red--text" v-show="nameError">{{nameError}}</span>
        </div>
    </v-card-text>
    
     <v-card-text class='task-form h-65'>
        <span class="label pt-2">Người nhận</span>
        <v-autocomplete 
            class="task" 
            style="width:100%;margin-top:8px!important;font-size:13px" 
            v-model="user"
             item-text="displayName"    
            item-value="id" 
            :items="listUser" 
            clearable
            :menu-props="{'nudge-top':-10, 'max-width': 300}" 
            label="Chọn người được giao việc">
                <template v-slot:item="data">
                     <SymperAvatar class="mr-2" style ="height: 30px!important; width: 30px!important;min-width: 30px!important" :userId="data.item.id"/>
                    <!-- </v-list-item-avatar> -->
                    <!-- <v-list-item-avatar>
                        {{data.item}}
                      <img :src="data.item.avatar|| require('@/assets/image/avatar_default.jpg')">
                    </v-list-item-avatar> -->
                    <v-list-item-content>
                      <v-list-item-title >{{data.item.displayName}}</v-list-item-title>
                      <v-list-item-subtitle class="fs-11 color-grey" >{{data.item.email}}</v-list-item-subtitle>

                    </v-list-item-content>
                  </template>
        </v-autocomplete>
    </v-card-text>
    <v-card-text>
        <span class="label pt-2">{{$t('timesheet.description')}}</span>
        <textarea class='pl-3' style="background-color:#F7F7F7"
         rows="4" cols="44" v-model= "desc"></textarea>
    </v-card-text>
     <v-card-text>
        <!-- <span>    <v-checkbox v-model="checkbox" class="fs-13 check-box" :label="`Riêng tư`"></v-checkbox></span> -->
       
    </v-card-text>
    <v-card-actions class="pb-5">
        <div class= "d-flex justify-end w-100">
             <v-btn color="success" class="mr-2" width="50" style="color:white" 
             @click="save()">{{$t('timesheet.save')}}</v-btn>
             <v-btn  width="50" class='mr-5' @click="cancel()">
                {{$t('timesheet.cancel')}}
            </v-btn>
        </div>
    </v-card-actions>
</v-card>
</template>  
<script>
import timesheetApi from '../../api/timesheet';
import userApi from '../../api/user';
import SymperAvatar from '../../components/common/SymperAvatar'

export default {
    components:{
        SymperAvatar
    },
    name: 'TaskForm',
    data: () => ({
        dialog: false,
        name: '',
        categoryTask:'',
        desc: '',
        cateError:'',
        search:null,
        checkbox:false,
        check:false,
        nameError: '',
        category:[],
        listUser: [],
         user:''
    }),
    created(){
        this.getCategory();
        this.getUser();
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
             if(this.check){
                if(this.categoryTask==''){
                }else{
                    this.cateError = '';
                    this.check = false;
                }
            }

        }
    },
    methods: {
        getUser(){
            
            let self= this;
             timesheetApi.getListUser({page:1,pageSize: 2000})
             .then(res => {
                if (res.status === 200) {
                    
                    self.listUser=res.data.listObject;
                    // for(let i = 0; i<res.data.listObject.length;i++){
                    //      self.listUser.push(res.data.listObject[i].displayName);
                    // }
                    console.log(self.listUser);
                    console.log('ádádád');
                    
                    }
                }).catch(console.log);


        },
        getCategory(){
            let self= this;
             timesheetApi.getAllCategory({}).then(res => {
                if (res.status === 200) {
                    
                    self.category=[];
                    let category = res.data.category;
                     // 
                     for(let i=0; i<category.length; i++){
                          self.category.push(
                             category[i].key+"-"+category[i].name
                          
                        )
                     }
                    }
                }).catch(console.log);

        },
        cancel(){
            // 
            this.categoryTask = "";
            this.user = "";
            this.checkbox ="";
            this.name="";
            this.cateError ="";
            this.desc="";
            this.nameError ="";
            this.$emit('cancel')
        },
        save(){
            // 
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
                
            timesheetApi.createTask({
                    task: this.name,
                    desc: this.desc,
                    cate: this.categoryTask,
                    userAssign: this.user,
                    isPublic: this.checkbox==''?1:0// 1 la co
                })
                .then(res => {
                    if (res.status === 200) {
                        self.$emit('loadTask');
                         self.cancel();

                        console.log(res);
                        alert('thêm thành công');
                    }
                })
                .catch(console.log);
             
                 
            }
          
           
        }
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
    background-color: #F7F7F7;
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
    background-color: #F7F7F7;
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

</style>
<style >
.v-label{
        font-size:13px!important;
        font-family:Roboto
    }
</style>
