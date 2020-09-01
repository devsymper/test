<template>
<v-card>
    <v-card-title class="pb-2 pt-2 headline lighten-2" 
    primary-title>
        <div class="w-100 pb-1" style=" font-size: 18px; border-bottom: 1px solid lightgrey;">
            <span>{{JSON.stringify(update) != '{}'?'Sửa':'Thêm'}}</span> loại công việc</div>
    </v-card-title>
    <v-card-text v-bind:style="nameError? 'height:80px' :'height:60px'">
        <span class="label pt-2"> {{$t('common.name')}}<span style="color:red"> *</span></span>
        <div>
            <input type="text" v-model= "name" class="w-100 input-logform"
            v-bind:style="nameError? 'margin-bottom:4px' :''">
        </div>
        <div class="w-100 mb-5" style="height:20px">
            <span class="red--text" v-show="nameError">{{nameError}}</span>
        </div>
    </v-card-text>
    <v-card-text>
        <span class="label pt-2">Key<span style="color:red"> *</span></span></span>
      <div>
        <input type="text" v-model= "key" class="w-100 input-logform">
        </div>
    </v-card-text>
    <v-card-actions class="pb-5">
        <div class= "d-flex justify-end w-100">
             <v-btn v-if="JSON.stringify(update) != '{}'" color="success" class="mr-2" width="50" style="color:white" 
             @click="updateAPI()">{{$t('common.update')}}</v-btn>
              <v-btn v-else color="success" class="mr-2" width="50" style="color:white" 
             @click="save()">{{$t('common.save')}}</v-btn>
             <v-btn  width="50" class='mr-5' @click="cancel()">
                {{$t('common.cancel')}}
            </v-btn>
        </div>
    </v-card-actions>
</v-card>
</template>  
<script>
import timesheetApi from '../../api/timesheet';

export default {
    props:['update'],
    name: 'CategoryForm',
    data: () => ({
        dialog: false,
        name: '',
        key: '',
        id:-1,
        check:false,
        nameError: '',
    }),
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
        update(){
            debugger
            this.updateCategory();
        }
    },
    created(){
        if(this.update){
            this.updateCategory();
            
        }
    },
    methods: {
        cancel(){
            // debugger
            this.name="";
            this.key="";
            this.nameError ="";
            this.$emit('cancel')
        },
        updateAPI(){
            let self = this;
             if(this.name==''){
                 this.nameError = this.$t('common.required_value'); 
             }
            else{
                debugger
            timesheetApi.updateCategory({
                    taskName: this.name,
                    key: this.key,
                    id: this.id,
                })
                .then(res => {
                    if (res.status === 200) {
                        alert('Cập nhậ thành công');
                        debugger
                        self.$emit('updateList')
                    }
                })
                .catch(console.log);
             
                 this.cancel();
            }
        },
        updateCategory(){
            this.name = this.update.name;
            this.key = this.update.key;
            this.id = this.update.id
        },
        save(){
            // debugger
            this.check = true;
            const self = this;
            if(this.name==''){
                 this.nameError = this.$t('common.required_value'); 
             }
            else{
            timesheetApi.createCategory({
                    taskName: this.name,
                    key: this.key,
                })
                .then(res => {
                    if (res.status === 200) {
                        console.log(res);
                        self.$emit('updateList')
                    }
                })
                .catch(console.log);
             
                 this.cancel();
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
    width: 97%;
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

</style>
