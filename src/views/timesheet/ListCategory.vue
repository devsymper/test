<template>
<div class="w-100 h-100">
     <list-items
        class="h-100"
        ref="listCategory"
        :containerHeight="containerHeight"
        @after-open-add-panel="addCategory"
        :headerPrefixKeypath="'timesheet'"
        :showTimesheetBtn="true"
        :pageTitle="$t('timesheet.table.category')"
        :showExportButton="false"
        :customAPIResult="customAPIResult"
        :tableContextMenu="tableContextMenu"
        :getDataUrl="getListUrl">
    </list-items>
        <v-dialog 
            v-model="showPanel"
            max-width="400" >
       <CategoryForm
            class="bg-white"
            style="over-flow:hidden"
            ref="category"
            :cate="cate"
            :listDoc="listDoc"
            :isAddView="isAddView"
            @cancel="cancel()"/>
      </v-dialog>
     
</div>
</template>
<script>
import { util } from "@/plugins/util.js";
import ListItems from "./../../components/common/ListItems.vue";
import { appConfigs } from '../../configs';
import timesheetApi from '../../api/timesheet';
import CategoryForm from "./../../components/timesheet/CategoryForm";
import {documentApi} from "../../api/Document"
export default {
    components: {
        "list-items": ListItems,
        CategoryForm,
    },
    data(){
        const self = this
        return {
            listDoc:[],
            containerHeight:0,
            showPanel:false,
            cate:{},
            isAddView:true,
            listCategory:[],
            categoryTask: [],
            updateCategory:{},
            showAddCategory:false,
            customAPIResult: {
                reformatData(res){
                    let data={
                        listObject:[],
                        columns:[]
                    };
                    data.listObject = res.data.listObject;
                    data.columns.push(
                        {
                            name:'name',
                            title:'table.name',
                            type:"text"
                        },
                        {
                            name:'key',
                            title:'table.key',
                            type:"text"
                        },
                         {
                            name:'description',
                            title:'table.description',
                            type:"text"
                        },
                        {
                            name:'userCreate',
                            title:'table.user_created',
                            type:"text"
                        },
                        {
                            name:'createAt',
                            title:'table.date_created',
                            type:"text"
                        },
                        {
                            name:'type',
                            title:'table.type',
                            type:"numeric"
                        },
                        {
                            name:'userUpdate',
                            title:'table.user_updated',
                            type:"text"
                        },
                        {
                            name:'updateAt',
                            title:'table.date_updated',
                            type:"text"
                        },
                      
                   );
                    let i = 0;
                    let listUser = self.$store.state.app.allUsers;
                    data.listObject.map(d=>{
                        d.stt=++i;
                        if(d.type==1){
                            d.type="DO"
                        }else{
                            d.type="TI"
                        }
                        listUser.map(user=>{
                            if(d.userCreate==user.id){
                                d.userCreate=user.displayName
                             }
                              if(d.userUpdate==user.id){
                                d.userUpdate=user.displayName
                             }
                        });           
                    })
                    return  data;
                }
            },
             tableContextMenu:{
                 update: {
                    name:"update",
                    text:this.$t('common.update'),
                    callback: (cate, callback) => {
                        this.update(cate);
                    }
                },
                delete: {
                    name:"delete",
                    text:this.$t('timesheet.table.delete'),
                    callback: (cate, callback) => {
                        this.delete(cate);
                    }
                }
            },
            getListUrl: '',
            columns: [],
        }
    },
    mounted() {
        this.calcContainerHeight();
    },
    created(){
        this.getDocument();
        // this.test();
        this.getListUrl = appConfigs.apiDomain.timesheet+'category';
    },
    methods:{
        calcContainerHeight(){
			this.containerHeight = util.getComponentSize(this).h;
		},
        async test(){
            let filter={};
            filter.page = 1;
            filter.pageSize = 500;
            filter.filter = '123';
            filter.distinct = true;
            let res = await timesheetApi.getAllCategory1(filter);
            if(res.status==200){
            }
        },
        getDocument(){
            const self = this;
            documentApi.getSmallListDocument().then(res=>{
                if(res.status==200){
                    self.listDoc = [];
                    res.data.listObject.map(data=>{
                        self.listDoc.push({id:data.title,docId:data.id})
                    })

                }
            })
        },
        deleteOne(cate){
            let data = {docObjId: cate.docObjId};
            const self = this;
            timesheetApi.deleteCategory(data).then(res=>{
                if(res.status==200){
                    self.$snotify({
                        type: "success",
                        title:" Xóa thành công",
                    });
                    self.$refs.listCategory.refreshList();
                }else{
                     self.$snotify({
                        type: "error",
                        title: "Xóa thất bại",
                    });
                }
            }
        )
            
        },
        delete(category){
            category.map(cate=>{
                this.deleteOne(cate)
                }
            )
        },
        update(category){
            this.showPanel = true;
            this.isAddView = false;
            if(this.$refs.category){
                this.$refs.category.id= category.id;
                this.$refs.category.allInputs.key.value = category.key;
                this.$refs.category.allInputs.taskName.value = category.name;
                this.$refs.category.allInputs.description.value  = category.description;
                this.$refs.category.typeCate=category.type=='TI'?"normal":"doc";
                this.$refs.category.docObjId = category.docObjId;
            }else{
                this.cate.id = category.id;
                this.cate.key = category.key;
                this.cate.name = category.name;
                this.cate.description = category.description;
                this.cate.type=category.type=='TI'?"normal":"doc";
                this.cate.docObjId = category.docObjId
            }
        },
        addCategory(){
            this.showPanel = true;
            this.$refs.listCategory.closeactionPanel();
            this.$refs.category.refreshAll();
            this.isAddView = true;
            this.showAddCategory = true;
        },
        cancel(){
            this.$refs.listCategory.refreshList();
            this.showPanel = false
        }
    }
}
</script>