<template>
<div class="pl-2 pr-2 w-100 h-100" style="background:white!important">
    <div class="pb-2 pt-2 headline lighten-2" 
    primary>
        <div class="w-100 fs-16 fw-430" >
            Loại công việc
        </div>
    </div>
    <div v-show="forBa"  style="margin-top: -10px">
        <v-btn @click="showNewCate()" x-small text class="fs-13 btn" :style="{background:typeCate=='doc'?'':'lightgrey'}">
            Tạo mới
        </v-btn>
        <v-btn @click="showDocCate()" x-small text class="fs-13 btn" :style="{background:typeCate=='doc'?'lightgrey':''}">
            Loại công việc từ doc
        </v-btn>
    </div>
    <FormTpl
        class="mr-2"
        :labelWidth="'60px'"
        :allInputs="allInputs"
        :single-line="true"
    />
    <div class="pb-5 pt-2">
        <div class= "d-flex justify-end w-100">
             <v-btn small v-if="!isAddView" color="success" class="mr-2" width="50" style="color:white" 
             @click="updateAPI()">Sửa</v-btn>
              <v-btn small v-else color="primary" class="mr-2" width="50" style="color:white" 
             @click="saveCategory()">Thêm</v-btn>
              <v-btn small  class="mr-2" width="50" 
             @click="cancel()">Thoát</v-btn> 
        </div>
    </div>
</div>
</template>  
<script>
import timesheetApi from '../../api/timesheet';
import { documentApi } from '../../api/Document';
import FormTpl from "./../../components/common/FormTpl";
export default {
    created () {
        this.allInputs.key.value = this.cate.key;
        this.allInputs.taskName.value = this.cate.name;
        this.id = this.cate.id;
        this.allInputs.description.value = this.cate.description;
        this.typeCate = this.cate.type

    },
    watch: {
        typeCate(){
            if(this.typeCate=='doc'){
                this.allInputs.taskName.type="autocomplete";
                this.allInputs.description.type="script"
            }else{
                this.allInputs.taskName.type="text";
                this.allInputs.description.type="textarea"

            }
        },
    },
    components:{
         FormTpl
    },
    props:['isAddView','listDoc','type','cate'],
    name: 'CategoryForm',
    data () {
        return {
        allInputs:{
            taskName: {
                title: "Tên",
                type: "text",
                value: "",
                info: "",
                options: this.listDoc,
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
            key: {
                title: "Key",
                type: "text",
                value: "",
                info: "",
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
            description: {
                title: "Mô tả",
                type: "textarea",
                value: "",
                info: ""
            }
        },
        typeCate:'normal',
        check:false,
        id:-1,
        forBa:true,
     }
    },
    methods: {
        checkValidate(){
            let check = false;
            if(this.allInputs.taskName.value==''){
                this.allInputs.key.value = this.allInputs.taskName.value.slice(0, 1);
            }
            if(this.allInputs.taskName.value&&this.allInputs.key.value){
                check = true
            }
            return check;
        },
        showDocCate(){
            this.typeCate = "doc";
        },
        saveCategory(){
            let data = this.save()
            if(data&&JSON.stringify(data)!= '{}'){
                this.createCatogry(data)
            }
        },
        save(){
            let check = this.checkValidate();
            let data = {};
            if(check){
                for(let i in this.allInputs){
                    data[i] = this.allInputs[i].value;
                    data.status= 1;
                    // this.listDoc.map(doc=>{
                    //     if(doc.id==data[i]){
                    //         this.allInputs[i].value=doc.title
                    //     }
                    // })
                    data.type = this.typeCate=='doc'?1:0
                }
            }
            return data
        },
        showNewCate(){
            this.typeCate = "normal";
        },
        cancel(){
            this.refreshAll();
            this.$emit('cancel');
        },
        refreshAll(){
            this.allInputs.taskName.value="";
            this.allInputs.description.value="";
            this.allInputs.key.value="";
        },
        updateAPI(){
            let data = this.save();
            if(data&&JSON.stringify(data) != '{}'){
                data.id = this.id;
                this.updateCategory(data)
            }else{
                this.notify(false)

            }
        },
        setCategory(){
        },
        updateCategory(data){
            const self = this;
            timesheetApi.updateCategory(data)
            .then(res => {
                if (res.status === 200) {
                    self.$emit('cancel');
                    self.notify(true)
                }else{
                     self.notify(false)
                }
            })
            .catch(console.log);

        },
        notify(success=false){
            if(success){
                this.$snotify({
                        type: "success",
                        title: this.$t("notification.successTitle"),
                    });
            }else{
                 this.$snotify({
                    type: "error",
                    title: this.$t("notification.errorTitle"),
                });
            }
        },
        async createCatogry(data){
            let res = await timesheetApi.createCategory(data);
            // let formulas = [data.description];
            // if(this.typeCate=="doc"){
            //     let fomulas = await timesheetApi.compileBulk({formulas:JSON.stringify(formulas),variables:{}})
            // }
            if (res.status === 200) {
                this.$emit('cancel');
                this.notify(true);
            }else{
                this.notify(false);
            }
        },
      
    }
}
</script>
<style lang="scss" scoped>

.btn{
   letter-spacing: 0px;
   font-weight:420
}
</style>

