<template>
<div class="pl-2" style="background:white!important">
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
    <Category ref="normal" v-show="typeCate=='normal'" :type="typeCate"/>
    <Category ref="doc" v-show="typeCate=='doc'" :type="typeCate" :listDoc='listDoc' />
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
import Category from '../../components/timesheet/form/CategoryChildren';
import { documentApi } from '../../api/Document';

export default {
    components:{
        Category
    },
    props:['isAddView','listDoc','type'],
    name: 'CategoryForm',
    data: () => ({
        typeCate:'normal',
        id:-1,
        bgDocCate:'',
        bgNewCate:'lightgrey'
    }),
    methods: {
        showDocCate(){
            this.bgDocCate = 'lightgrey';
            this.bgNewCate = '';
           this.typeCate = "doc";

        },
        showNewCate(){
            this.bgNewCate = 'lightgrey';
            this.bgDocCate = '';
            this.typeCate = "normal";
        },
        cancel(){
            this.$emit('cancel');
        },
        refreshAll(){
            this.$refs.normal.name="";
            this.$refs.normal.description="";
            this.$refs.normal.key="";
            this.$refs.normal.nameError ="";
            this.$refs.doc.name="";
            this.$refs.doc.key="";
            this.$refs.doc.description = "";
        },
        updateAPI(){
            let self = this;
            if(this.typeCate=='normal'){
               let data = this.$refs.normal.save()
               if(data&&JSON.stringify(data)!= '{}'){
                   data.id = this.id;
                   this.updateCategory(data)
               }
            }else{
                 let data = this.$refs.doc.save();
                if(data&&JSON.stringify(data) != '{}'){
                     data.id = this.id;
                    this.updateCategory(data)
                }else{

                }
            }
           
        },
        updateCategory(data){
            const self = this;
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
        createCatogry(data){
            const self = this;
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
        },
        saveCategory(){
            const self = this;
            // let data = this.typeCate =='normal'?this.
            if(this.typeCate=='normal'){
               let data = this.$refs.normal.save()
               if(data&&JSON.stringify(data)!= '{}'){
                   this.createCatogry(data)
               }
            }else{
                 let data = this.$refs.doc.save();
                if(data&&JSON.stringify(data) != '{}'){
                    this.createCatogry(data)
                }else{

                }
            }
               
        }
    }
}
</script>
<style lang="scss" scoped>

.btn{
   letter-spacing: 0px;
   font-weight:420
}
</style>

