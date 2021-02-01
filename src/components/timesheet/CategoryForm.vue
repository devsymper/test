<template>
<div>
    <div class="pb-2 pt-2 headline lighten-2" 
    primary>
        <div class="w-100 pb-1 fs-16" style="border-bottom: 1px solid lightgrey;">
            Loại công việc</div>
    </div>
    <div v-bind:style="nameError? 'height:80px' :'height:60px'">
        <span class="label pt-2"> {{$t('timesheet.name')}}<span style="color:red"> *</span></span>
        <div>
            <input type="text" v-model= "name" class="w-100 input-logform"
            v-bind:style="nameError? 'margin-bottom:4px' :''">
        </div>
        <div class="w-100 mb-5" style="height:20px">
            <span class="red--text" v-show="nameError">{{nameError}}</span>
        </div>
    </div>
    <div>
        <span class="label pt-2">Key<span style="color:red"> *</span></span></span>
      <div>
        <input type="text" v-model="key" class="w-100 input-logform">
        </div>
    </div>
    <div>
        <span class="label pt-2">Mô tả<span style="color:red"> *</span></span></span>
      <div>
        <input type="text" v-model="description" class="w-100 input-logform">
        </div>
    </div>
    <div class="pb-5 pt-2">
        <div class= "d-flex justify-end w-100">
             <v-btn small v-if="!isAddView" color="success" class="mr-2" width="50" style="color:white" 
             @click="updateAPI()">Sửa</v-btn>
              <v-btn small v-else color="primary" class="mr-2" width="50" style="color:white" 
             @click="save()">Thêm</v-btn> 
        </div>
    </div>
</div>
</template>  
<script>
import timesheetApi from '../../api/timesheet';

export default {
    props:['isAddView'],
    name: 'CategoryForm',
    data: () => ({
        dialog: false,
        name: '',
        key: '',
        id:-1,
        check:false,
        nameError: '',
        status:1,
        description:''
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
    },
    methods: {
        refreshAll(){
            this.name="";
            this.key="";
            this.nameError ="";
        },
        updateAPI(){
            let self = this;
             if(this.name==''){
                 this.nameError = this.$t('timesheet.required_value'); 
             }
            else{
                let data = {
                    taskName: this.name,
                    key: this.key,
                    id: this.id,
                    status: this.status,
                    description: this.description
                }
                debugger
                 timesheetApi.updateCategory(data)
                .then(res => {
                    if (res.status === 200) {
                        self.$emit('cancel');
                        self.$snotify({
                            type: "success",
                            title: this.$t("notification.successTitle"),
                        });
                    }else{
                          self.$snotify({
                            type: "error",
                            title: this.$t("notification.errorTitle"),
                        });
                    }
                })
                .catch(console.log);
            }
        },
        save(){
            this.check = true;
            const self = this;
            if(this.name==''){
                 this.nameError = this.$t('timesheet.required_value'); 
             }
            else{
            timesheetApi.createCategory({
                    taskName: this.name,
                    key: this.key,
                    status: 1,
                    description: this.description
                })
                .then(res => {
                    if (res.status === 200) {
                        self.$emit('cancel');
                        self.$snotify({
                            type: "success",
                            title: this.$t("notification.successTitle"),
                        });
                    }else{
                        self.$snotify({
                            type: "error",
                            title: this.$t("notification.errorTitle"),
                        });
                    }
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>

.v-input__control {
    font-size: 13px;
    font-family: Roboto;
    color: grey;
}

.input-logform {
    float: flex;
    background-color: #F7F7F7;
    width: 97%;
    font-size:13px!important;
    height: 32px !important;
    border-radius: 2px;
    padding-left: 12px;
}

.v-menu__content .v-list {
    padding-top: 10px;
    top: 120px !important;
}

</style>
