<template>
<div class="w-100">
     <list-items
        ref="listCategory"
        :showImportHistory="false"
        @after-open-add-panel="addCategory"
        :headerPrefixKeypath="'timesheet'"
        :useDefaultContext="false"
        :pageTitle="$t('timesheet.table.category')"
        :containerHeight="containerHeight"
        :showExportButton="false"
        :customAPIResult="customAPIResult"
        :tableContextMenu="tableContextMenu"
        :getDataUrl="getListUrl">
    </list-items>
        <v-dialog 
            v-model="showPanel"
            persistent
            max-width="350"
      >
       <CategoryForm
            style="background:white!important"
            ref="category"
            :listDoc="listDoc"
            :isAddView="isAddView"
            @cancel="cancel()"/>
      </v-dialog>
     
</div>
</template>
<script>
import ActionPanel from "./../../views/import/Detail.vue";
import ListItems from "./../../components/common/ListItems.vue";
import { util } from "./../../plugins/util.js";
import { appConfigs } from '../../configs';
import timesheetApi from '../../api/timesheet';
import CategoryForm from "./../../components/timesheet/CategoryForm";
import {documentApi} from "../../api/Document"
export default {
    components: {
        "list-items": ListItems,
        "action-panel": ActionPanel,
        CategoryForm,
    },
    data(){
        const self = this
        return {
            listDoc:[],
            showPanel:false,
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
                    data.listObject = res.data.category;
                    data.columns.push(
                        {
                            name:'id',
                            title:'table.id',
                            type:"numeric"
                        },
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
                        // {
                        //     name:'user_created',
                        //     title:'table.user_created',
                        //     type:"text"
                        // },
                        {
                            name:'createAt',
                            title:'table.date_created',
                            type:"text"
                        },
                        // {
                        //     name:'status',
                        //     title:'table.status',
                        //     type:"numeric"
                        // },
                        // {
                        //     name:'user_updated',
                        //     title:'table.user_updated',
                        //     type:"text"
                        // },
                        {
                            name:'updateAt',
                            title:'table.date_updated',
                            type:"text"
                        },
                      
                   );
                    return  data;
                } 
            },
             tableContextMenu:{
                // view: {
                //     name:"view",
                //     text:this.$t('timesheet.table.view'),
                //     callback: (cate, callback) => {
                //         this.showDetail(cate);
                //     }
                // },
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
            actionPanelWidth:800,
            containerHeight: 200,
            columns: [],
        }
    },
    mounted() {
        this.calcContainerHeight();
    },
    created(){
        this.getDocument();
        this.getListUrl = appConfigs.apiDomain.timesheet+'category';
    },
    methods:{
        getDocument(){
            const self = this;
            documentApi.getSmallListDocument().then(res=>{
                if(res.status==200){
                    self.listDoc = res.data.listObject;
                }
            })
        },
        deleteOne(cate){
            this.$refs.category.id = cate.id;
            this.$refs.category.key= cate.key;
            this.$refs.category.keyDoc= cate.key;
            this.$refs.category.name= cate.name;
            this.$refs.category.description= cate.description;
            this.$refs.category.status= 0;
            this.$refs.category.updateAPI();
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
            this.$refs.category.key = category.key;
            this.$refs.category.name = category.name;
            this.$refs.category.description = category.description;
            this.$refs.category.id = category.id;
        },
        addCategory(){
            this.showPanel = true;
            this.$refs.listCategory.closeactionPanel();
            this.$refs.category.refreshAll();
            this.isAddView = true;
            this.showAddCategory = true;
        },
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        },
        cancel(){
            this.$refs.category.refreshAll();
            this.showPanel = false
        }
    }
}
</script>