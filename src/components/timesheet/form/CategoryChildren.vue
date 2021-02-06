<template>
    <div>
        <div :style="nameError? 'height:80px' :'height:60px'">
            <span v-if="type=='normal'" class="label pt-2"> {{$t('timesheet.name')}}
            </span>
            <span v-else class="label pt-2">
                Tên Doc 
            </span>
        <span style="color:red"> *</span>
        <div  v-if="type=='normal'" >
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
                :menu-props="{ maxHeight:300, minWidth:330,maxWidth:330,dense:true}"
                style="margin-top:-7px!important; width:332px " 
                v-model="name" 
                class="w-100 autocomplete"
                :items="listDoc" 
                item-color="white" 
                background-color="#f2f2f2">
                    <template v-slot:item="data" >
                        <span class="fs-13" style="color:black!important">{{ data.item.title }} </span>
                </template>
            </v-autocomplete >
        </div>
        <div class="w-100 mb-5" style="height:20px">
            <span class="red--text" v-show="nameError">{{nameError}}</span>
        </div>
    </div>
    <div>
        <span class="label pt-2">Key<span style="color:red"> *</span></span>
            <input type="text" v-model="key" class="w-100 input-logform">
    </div>
    <div>
        <span v-if="type=='normal'" class="label pt-2">Mô tả</span>
        <span v-else class="label pt-2">Công thức</span>
      <div>
        <input type="text" v-model="description" class="w-100 input-logform">
        </div>
    </div>     
    </div>
</template>
<script>
import { documentApi } from '../../../api/Document';
export default {
  watch: {
    searchCategory(){
        this.findCategory();
    },
    name(){
        if(this.type=='doc'){
             this.listDoc.map(doc=>{
                if(doc.title==this.name.title){
                    this.key=doc.id
                }
            })
        }
        if(this.check){
            if(this.name==''){
            }else{
                this.nameError = '';
                this.check = false;
            }
        }
    },
  },    
  data () {
    return {
        searchCategory:null,
        nameError: '',
        status:1,
        description:'',
        name: '',
        id:-1,
        key: '',
        check:false
    }
  },
  props: {
    type:{
        type: String,
        default:'normal'
    },
    listDoc:{
        type: Array,
        default:[]
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
    checkValidate(){
        debugger
        let check = false;
        if(this.name==''){
            this.nameError = this.$t('timesheet.required_value'); 
        }
        if(this.key==''){
            this.key = this.name.slice(0, 1);
        }
        if(this.key&&this.name){
            check = true
        }
        return check;
    },
    save(){
        let check = this.checkValidate();
        let data = {};
        if(check){
            data.taskName = this.type=='doc'?this.name.title:this.name;
            data.key = this.key;
            data.status= 1;
            data.description = this.description;
            data.type = this.type=='doc'?1:0
        }
        return data
    }
  },
    
}
</script>
<style scoped>
    
.v-input__control {
    font-size: 13px;
    font-family: Roboto;
    color: grey;
}
.autocomplete ::v-deep .v-select__slot{
    font-size:13px!important;
    padding-left: 10px;

}
.autocomplete ::v-deep .v-list-item--active {
        color:black!important
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

.v-menu__content .v-list {
    padding-top: 10px;
    top: 120px !important;
}
</style>