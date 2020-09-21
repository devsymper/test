<template>
   <div style="display:flex">
        <VueResizable :width="500" :max-width="600" :min-width="300" :active ="['r']">
            <AgDataTable
                :tableHeight="'calc(100% - 100px)'"
                :likeHandsonTable="true"
                :rowData="dataTable"
                :editable="false"
                :customComponents="customAgComponents"
                @on-cell-dbl-click="onCellDblClick"
                :cellRendererParams="{
                    innerRenderer:'nodeName'
                }">
            </AgDataTable>
        </VueResizable>
        <ListItems 
            ref="listUser"
            :pageTitle="'Danh sách người dùng'"
            :getDataUrl="apiUrl"
            :containerHeight="containerHeight"
            :tableContextMenu="tableContextMenu"
            :useDefaultContext="false"
            :useActionPanel="true"
            :currentItemData="currentItemData"
            :customAPIResult="customAPIResult"
        >
            <template slot="right-panel-content" slot-scope="{itemData}">  
                <navigation-detail-user  :itemData="itemData" style="z-index:10001"  />
            </template>
        </ListItems>  
                        
   </div>
</template>

<script>
import ListItems from '@/components/common/ListItems.vue'
import VueResizable from 'vue-resizable';
import { util } from "./../../../plugins/util.js";
export default {
    components:{
        ListItems,
        VueResizable
    },
    props:{
        dataTable:{

        },
        customAgComponents:{

        }
    },
    data(){
        return {
            listUserInNode: [],
            apiUrl: 'https://account.symper.vn/users',
            containerHeight:null,
            tableContextMenu: {
               viewDetails: {
                    name: "View details",
                    text: "View details",
                    callback: (app, callback) => {
                       self.$refs.listUser.actionPanel = true;
                       this.$emit('view-details',app)
                    },
                },
             
            },
        }
    },
    mounted(){
        this.containerHeight = util.getComponentSize(this).h - 50
    },
    methods:{
        onCellDblClick(params){
            params.data.orgchartId =  this.$route.params.id;
            this.$store.dispatch('orgchart/updateUserInNode',params.data)
            this.listUserInNode = this.$store.getters['orgchart/listUserInChildrenNode'](this.$route.params.id);
        }
    },
     watch:{
        listUserInNode:{
            deep: true,
            immediate: true,
            handler: function(after){
                debugger
            }
        }
    }
}
</script>

<style>

</style>