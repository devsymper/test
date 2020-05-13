<template>
    <list-items
        ref="listModels"
        :useDefaultContext="true"
        :pageTitle="$t('process.list.title')"
        :tableContextMenu="tableContextMenu"
        :containerHeight="containerHeight"
        :getDataUrl="getListUrl"
        :customAPIResult="customAPIResult"
        :useActionPanel="false"
        :headerPrefixKeypath="'common'"
        @on-add-item-clicked="goToCreatePage()"
    ></list-items>
</template>
<script>
import { util } from "./../../plugins/util.js";
import { reformatGetListProcess } from "./../../components/process/reformatGetListData.js";
import { appConfigs } from "./../../configs.js";
import ListItems from "./../../components/common/ListItems.vue";
import bpmnApi from "./../../api/BPMNEngine.js";
import { deployProcess } from "./../../components/process/processAction.js";

export default {
    data() {
        let self = this;
        return {
            containerHeight: 300,
            listItemOptions: {},
            customAPIResult: {
                reformatData: reformatGetListProcess
            },
            getListUrl: appConfigs.apiDomain.bpmne.models,
            tableContextMenu: [
                {
                    name: "edit",
                    text: this.$t("common.edit"),
                    callback: (row, callback) => {
                        self.$goToPage(
                            "/bpmne/"+row.id+"/edit",
                            " Edit " + (row.name ? row.name : row.key)
                        );
                    }
                },
                {
                    name: "remove",
                    text: this.$t("common.delete"),
                    callback: (row, callback) => {
                        this.removeCallback = callback;
                        this.deleteSnippet(row);
                    }
                },
                {
                    name: "deploy",
                    text: this.$t("common.deploy"),
                    callback: (row, callback) => {
                        deployProcess(this, row);
                    }
                },
                {
                    name: "deployHistory",
                    text: this.$t("process.list.deploy_history"),
                    callback: (row, callback) => {
                        self.$goToPage(`/bpmne/${row.name}/deploy-history`,self.$t('process.deployment.list'));
                    }
                },
                {
                    name: "start",
                    text: this.$t("process.list.start"),
                    callback: (row, callback) => {
                        
                    }
                },
                {
                    name: "instances",
                    text: this.$t("process.list.instances"),
                    callback: (row, callback) => {

                    }
                },
            ]
        };
    },
    mounted() {
        this.calcContainerHeight();
    },
    created() {},
    watch: {},
    methods: {
        goToCreatePage(){
            this.$goToPage('/bpmne/create',this.$t("process.action.create"));
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
