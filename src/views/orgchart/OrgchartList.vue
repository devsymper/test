<template>
    <div class="w-100 h-100">
        <list-items
            ref="listOrgchart"
            :useDefaultContext="false"
            :pageTitle="$t('orgchart.list.title')"
            :tableContextMenu="tableContextMenu"
            :commonActionProps="commonActionProps"
            :containerHeight="containerHeight"
            :getDataUrl="getListUrl"
            :customAPIResult="customAPIResult"
            :useActionPanel="false"
            :headerPrefixKeypath="'common'"
            @on-add-item-clicked="goToCreatePage()"
        ></list-items>
    </div>
</template>
<script>
import { util } from "./../../plugins/util.js";
import { appConfigs } from "./../../configs.js";
import ListItems from "./../../components/common/ListItems.vue";
import { orgchartApi } from '../../api/orgchart';
import Handsontable from 'handsontable';
export default {
    data() {
        let self = this;
        return {
            commonActionProps: {
                "module": "orgchart",
                "resource": "orgchart",
                "scope": "orgchart",
            },
            containerHeight: 300,
            listItemOptions: {},
            getListUrl: appConfigs.apiDomain.orgchart+'orgchart',
            customAPIResult:{
                 reformatData(res){
                     debugger
                   return{
                       columns:[
                            {name: "id", title: "id", type: "numeric"},
                            {name: "code", title: "code", type: "text"},
                            {name: "name", title: "name", type: "text"},
                            {name: "isDefault", title: "isDefault", type: "text",
                                renderer:  function(instance, td, row, col, prop, value, cellProperties) {
                                    let span;
                                    Handsontable.dom.empty(td);
                                    span = document.createElement('span')
                                    if(value == "1"){
                                        $(span).text('Mặc định')
                                    }else{
                                        $(span).text('')
                                    }
                                    td.appendChild(span);
                                    return td
                                },
                            },
                            {name: "description", title: "description", type: "text"},
                            {name: "createAt", title: "create_at", type: "date"},
                            {name: "lastUpdateAt", title: "last_update_at", type: "date"}
                       ],
                       listObject:res.data.listObject,
                       total: res.data.listObject.length
                   }
                }
            },
            tableContextMenu: {
                update: {
                    name: "edit",
                    text: this.$t("common.edit"),
                    callback: (row, callback) => {
                        self.$goToPage(
                            "/orgchart/"+row.id+"/edit",
                            " Edit " + (row.name ? row.name : row.key)
                        );
                    }
                },
                drop: {
                    name: "remove",
                    text: this.$t("common.delete"),
                    callback: async (rows, refreshList) => {
                        let ids = [];
                        for(let item of rows){
                            ids.push(item.id);
                        }
                        try {
                            let res = await orgchartApi.deleteOrgcharts(ids);
                            if(res.status == 200){
                                self.$snotifySuccess("Deleted "+ids.length+' items');
                            }else{
                                self.$snotifyError(res, "Can not delete selected items");
                            }
                        } catch (error) {
                            self.$snotifyError(error, "Can not delete selected items");
                        }
                        refreshList();
                    }
                },
                detail: {
                    name: "detail",
                    text: this.$t("common.detail"),
                    callback: (row, callback) => {
                        self.$goToPage(
                            "/orgchart/"+row.id+"/view",
                            self.$t("common.detail") + "  " + (row.name ? row.name : row.key)
                        );
                        
                    }
                },
                  clone:{
                    name:"clone",
                    text: this.$t("common.clone"),
                    callback:(row, callback) => {
                        self.$goToPage(
                            "/orgchart/"+row.id+"/clone",
                            "Clone " + (row.name ? row.name : row.key)
                        );
                    }
                }
            }
        };
    },
    mounted() {
        this.calcContainerHeight();
    },
    created() {},
    watch: {},
    methods: {
        goToCreatePage(){
            this.$goToPage('/orgchart/create',this.$t("orgchart.create.title"));
        },
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        },
        getDataAnddeploy(processId){
          
        },
    },
    components: {
        ListItems: ListItems
    }
};
</script>