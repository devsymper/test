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
        <div slot="right-panel-content" class="h-100">
           <CategoryForm 
            ref="category"
            :isAddView="isAddView"
            @cancel="cancel()"/>
        </div>
    </list-items>
    
     
</div>
</template>
<script>
import ActionPanel from "./../../views/import/Detail.vue";
import ListItems from "./../../components/common/ListItems.vue";
import { util } from "./../../plugins/util.js";
import { appConfigs } from '../../configs';
import timesheetApi from '../../api/timesheet';
import CategoryForm from "./../../components/timesheet/CategoryForm";

export default {
    components: {
        "list-items": ListItems,
        "action-panel": ActionPanel,
        CategoryForm,
    },
    data(){
        const self = this
        return {
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
                view: {
                    name:"view",
                    text:this.$t('timesheet.table.view'),
                    callback: (cate, callback) => {
                        this.showDetail(cate);
                    }
                },
                 update: {
                    name:"update",
                    text:this.$t('timesheet.table.update'),
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
        this.getListUrl = appConfigs.apiDomain.timesheet+'category';
    },
    methods:{
        deleteOne(cate){
            this.$refs.category.id = cate.id;
            this.$refs.category.key= cate.key;
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
            this.isAddView = false;
            this.$refs.listCategory.openactionPanel();
            this.$refs.category.key = category.key;
            this.$refs.category.name = category.name;
            this.$refs.category.description = category.description;
            this.$refs.category.id = category.id;
        },
        addCategory(){
            this.$refs.category.refreshAll();
            this.isAddView = true;
            this.showAddCategory = true;
        },
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        },
        cancel(){
            this.$refs.listCategory.refreshList()
            this.$refs.category.refreshAll();
            this.$refs.listCategory.closeactionPanel();
        }
    }
}
</script>