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
            getListUrl: appConfigs.apiDomain.bpmne.models+'?filter=processes&modelType=0&sort=modifiedDesc',
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
                    callback: (rows, refreshList) => {
                        let removeArrPromise = [];
                        for(let item of rows){
                            removeArrPromise.push(bpmnApi.deleteModel(item.id));
                        }
                        Promise.all(removeArrPromise).then((res)=>{
                            self.$snotifySuccess(self.$t('common.remove_msg_success',{count: rows.length}));
                            refreshList();
                        }).catch((err)=>{
                            self.$snotifyError(err, self.$t('common.remove_msg_err'));
                            refreshList();
                        });
                    }
                },
                {
                    name: "deploy",
                    text: this.$t("common.deploy"),
                    callback: (row, callback) => {
                        deployProcess(self, row);
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
                    callback: async function (row, callback){
                        let lastestDeployment = await bpmnApi.getDeployments({
                            name: row.name,
                            sort: 'deployTime',
                            size: 1,
                            order: 'desc'
                        });
                        let deploymentId = '';
                        if(lastestDeployment.data.length > 0){
                            lastestDeployment = lastestDeployment.data[0];
                            deploymentId = lastestDeployment.id;
                            if(lastestDeployment.deploymentTime < row.lastUpdated){
                               let deploymentData = await deployProcess(self, row);
                               deploymentId = deploymentData.id;
                            }
                        }else{
                            let deploymentData = await deployProcess(self, row);
                            deploymentId = deploymentData.id;
                        }

                        let defData = await bpmnApi.getDefinitions({
                            deploymentId: deploymentId
                        });

                        if(defData.data[0]){
                            self.$goToPage(`/bpmne/process-definition/${defData.data[0].id}/run`,'Start process instance');
                        }else {
                            self.$snotifyError({},"Can not find process definition having deployment id "+deploymentId);
                        }
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
