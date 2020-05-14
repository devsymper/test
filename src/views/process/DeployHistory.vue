<template>
    <list-items
        ref="listDeployments"
        :useDefaultContext="false"
        :pageTitle="$t('process.deployment.list')"
        :tableContextMenu="tableContextMenu"
        :containerHeight="containerHeight"
        :getDataUrl="getListUrl"
        :customAPIResult="customAPIResult"
        :useActionPanel="false"
        :headerPrefixKeypath="'common'"
    ></list-items>
</template>
<script>
import { util } from "./../../plugins/util.js";
import { reformatGetListDeployments } from "./../../components/process/reformatGetListData.js";
import { appConfigs } from "./../../configs.js";
import ListItems from "./../../components/common/ListItems.vue";
import bpmnApi from "./../../api/BPMNEngine.js";
import { deployProcess } from "./../../components/process/processAction.js";
import { runProcessDefinition } from "./../../components/process/processAction.js";


export default {
    components: {},
    data() {
        let self = this;
        return {
            containerHeight: 300,
            customAPIResult: {
                reformatData: reformatGetListDeployments
            },
            getListUrl: this.getDeploymentUrl(),
            tableContextMenu: [
                {
                    name: "start",
                    text: this.$t("process.deployment.run"),
                    callback: (row, callback) => {
                        runProcessDefinition(self, row);
                    }
                },
                { 
                    name: "statistics",
                    text: this.$t("common.statistics"),
                    callback: (row, callback) => {
                        
                    }
                },
                {
                    name: "viewDetail",
                    text: this.$t("common.detail"),
                    callback: (row, callback) => {
                        
                    }
                },
                {
                    name: "processInstance",
                    text: this.$t("process.instance.list"),
                    callback: (row, callback) => {
                        self.$goToPage(`/bpmne/process-definition/${row.id}/instances`);
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
        getDeploymentUrl(){
            let processName = this.$route.params.name;
            return appConfigs.apiDomain.bpmne.definitions+'?name='+processName;
        },
        calcContainerHeight(){
            this.containerHeight = util.getComponentSize(this).h;
        }
    },
    components: {
        ListItems: ListItems
    }
};
</script>
