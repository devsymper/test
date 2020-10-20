<template>
    <div class="w-100 h-100">
        <list-items
            ref="listOrgchart"
            :useDefaultContext="false"
            :pageTitle="$t('orgchart.list.titleTrash')"
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
                  restore:{
                    name:"restore",
                    text: this.$t("common.restore"),
                    callback:(row, callback) => {
                       
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