<template>
<div class="pl-2">
    <div class="pb-2 pt-2 headline lighten-2" 
    primary>
        <div class="w-100 fs-16 fw-430" >
            Loại công việc
        </div>
    </div>
    <div style="border-bottom: 1px solid lightgrey;margin-top: -10px">
        <v-btn @click="showNewCate()" x-small text class="fs-13 btn" :style="{background:bgNewCate}">
            Tạo mới
        </v-btn>
         <v-btn @click="showDocCate()" x-small text class="fs-13 btn" :style="{background:bgDocCate}">
            Loại công việc từ doc
        </v-btn>
    </div>
    <div :style="nameError? 'height:80px' :'height:60px'">
        <span v-if="bgNewCate" class="label pt-2"> 
            {{$t('timesheet.name')}}
         </span>
         <span v-else class="label pt-2">
             Tên Doc
         </span>
        <span style="color:red"> *</span>
        <div  v-if="bgNewCate" >
            <input type="text" v-model="name" class="w-100 input-logform"
                    :style="nameError? 'margin-bottom:4px' :''">
        </div>
        <div v-else>
             <v-autocomplete
                return-object
                hide-details
                :search-input.sync="searchCategory"
                item-value="title"
                item-text="title"
                style="margin-top:-7px!important; width:332px " 
                v-model="docName" 
                class="w-100 autocomplete"
                :items="listDoc" 
                item-color="white" 
                background-color="#f2f2f2">
                    <template v-slot:item="data">
                        <span class="fs-13">{{ data.item.title }} </span>
                </template>
            </v-autocomplete >
        </div>
        <div class="w-100 mb-5" style="height:20px">
                <span class="red--text" v-show="nameError">{{nameError}}</span>
        </div>
    </div>
    <div>
        <span class="label pt-2">Key<span style="color:red"> *</span></span>
        <div v-if="bgNewCate" >
            <input type="text" v-model="key" class="w-100 input-logform">
        </div>
        <div v-else>
            <input type="text" v-model="keyDoc" class="w-100 input-logform">
        </div>
    </div>
    <div>
        <span v-if="bgNewCate" class="label pt-2">Mô tả</span>
        <span v-else class="label pt-2">Công thức</span>
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
              <v-btn small  class="mr-2" width="50" 
             @click="cancel()">Thoát</v-btn> 
        </div>
    </div>
</div>
</template>  
<script>
import timesheetApi from '../../api/timesheet';
import { documentApi } from '../../api/Document';

export default {
    props:['isAddView','listDoc'],
    name: 'CategoryForm',
    data: () => ({
        dialog: false,
        name: '',
        key: '',
        keyDoc:'',
        searchCategory:null,
        id:-1,
        docName:'',
        check:false,
        nameError: '',
        status:1,
        description:'',
        bgDocCate:'',
        bgNewCate:'lightgrey'
    }),
    watch:{
        docName(){
            this.listDoc.map(doc=>{
                if(doc.title==this.docName.title){
                    this.keyDoc=doc.id
                }
            })
        },
        name(){
            if(this.check){
                if(this.name==''){
                }else{
                    this.nameError = '';
                    this.check = false;
                }
            }
        },
        searchCategory(){
            this.findCategory();

        }
    },
    methods: {
         async findCategory(){
             const self = this;
             let data = {
                 search: this.searchCategory
             }
             let res = await documentApi.searchListDocuments(data);
             if(res.status==200){
                 self.listDoc = res.data.listObject;
                 
             }

        },
        showDocCate(){
            this.bgDocCate = 'lightgrey';
            this.bgNewCate = ''

        },
        showNewCate(){
            this.bgNewCate = 'lightgrey';
            this.bgDocCate = '';

        },
        cancel(){
            this.$emit('cancel');
        },
        refreshAll(){
            this.name="";
            this.key="";
            this.nameError ="";
        },
        updateAPI(){
            let self = this;
            let data={
                taskName: this.name,
                key: this.key,
                status: 1,
                description: this.description
            }
            if(this.bgDocCate){
                data.taskName = this.docName.title;
                data.key = this.keyDoc;
                
            }
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
        },
        save(){
            this.check = true;
            const self = this;
            if(this.name==''&&this.docName==''){
                 this.nameError = this.$t('timesheet.required_value'); 
             }
            else{
            let data={
                taskName: this.name,
                key: this.key,
                status: 1,
                description: this.description
            }
            if(this.bgDocCate){
                data.taskName = this.docName.title;
                data.key = this.keyDoc;
                
            }
            timesheetApi.createCategory(data)
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
.btn{
   letter-spacing: 0px;
   font-weight:420
}
.autocomplete ::v-deep .v-input__slot:before {
    border-color: transparent !important;
}
.autocomplete ::v-deep .v-input__slot:after {
    border-color: transparent !important;
}
.autocomplete ::v-deep .v-input__slot {
    padding-left: 10px;
    font-size:13px!important
}

</style>
<style >
    .v-list-item,.v-list-item--active {
        color:black!important
    }
</style>
