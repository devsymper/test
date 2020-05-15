<template>
    <list-items
        ref="listProcessInstances"
        :useDefaultContext="false"
        :pageTitle="$t('process.instance.list')"
        :tableContextMenu="tableContextMenu"
        :containerHeight="containerHeight"
        :getDataUrl="getListUrl()"
        :customAPIResult="customAPIResult"
        :useActionPanel="false"
        :headerPrefixKeypath="'process.instance'"
        @on-add-item-clicked="goToCreatePage()"
    ></list-items>
</template>
<script>
import { util } from "./../../plugins/util.js";
import { reformatGetListInstances } from "./../../components/process/reformatGetListData.js";
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
                reformatData: reformatGetListInstances
            },
            tableContextMenu: [
                {
                    name: "remove",
                    text: this.$t("common.delete"),
                    callback: (row, callback) => {
                        this.removeCallback = callback;
                        this.deleteSnippet(row);
                    }
                },
                {
                    name: "detail",
                    text: this.$t("common.tracking"),
                    callback: (row, callback) => {
                        self.$goToPage(`/bpmne/process-instances/${row.id}/tracking`);
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
        getListUrl(){
            let processDefId = this.$route.params.idProcessDef;
            return appConfigs.apiDomain.bpmne.instances+'?processDefinitionId='+processDefId;
        },
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        },
    },
    components: {
        ListItems: ListItems
    }
};
</script>
