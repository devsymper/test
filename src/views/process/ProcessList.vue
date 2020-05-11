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
        @on-add-item-clicked="goToCreatePage()"
    ></list-items>
</template>
<script>
import { util } from "./../../plugins/util.js";
import { reformatGetListData } from "./../../components/process/reformatGetListData.js";
import { appConfigs } from "./../../configs.js";
import ListItems from "./../../components/common/ListItems.vue";
export default {
    components: {},
    data() {
        let self = this;
        return {
            containerHeight: 300,
            listItemOptions: {},
            customAPIResult: {
                reformatData: reformatGetListData
            },
            getListUrl: appConfigs.apiDomain.bpmne,
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
                    callback: (snippet, callback) => {
                        this.removeCallback = callback;
                        this.deleteSnippet(snippet);
                    }
                }
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
        }
    },
    components: {
        ListItems: ListItems
    }
};
</script>
