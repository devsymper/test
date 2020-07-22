<template>
    <div class="w-100 h-100">
        <list-items
            ref="listModels"
            :useDefaultContext="false"
            :pageTitle="$t('process.list.title')"
            :tableContextMenu="tableContextMenu"
            :containerHeight="containerHeight"
            :getDataUrl="getListUrl"
            :useActionPanel="false"
            :headerPrefixKeypath="'common'"
            @on-add-item-clicked="goToCreatePage()"
        ></list-items>
    </div>
</template>
<script>
import { util } from "./../../plugins/util.js";
import { reformatGetListProcess } from "./../../components/process/reformatGetListData.js";
import { appConfigs } from "./../../configs.js";
import ListItems from "./../../components/common/ListItems.vue";
import bpmnApi from "./../../api/BPMNEngine.js";
import { deployProcess, deployProcessFromXML } from "./../../components/process/processAction.js";

function getLastestDefinition(row, needDeploy = false) {
    return new Promise(async (resolve, reject) => {
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
        }else if(needDeploy){
            let deploymentData = await deployProcess(self, row);
            deploymentId = deploymentData.id;
        }else{
            reject("this model have no deployment");
        }

        let defData = await bpmnApi.getDefinitions({
            deploymentId: deploymentId
        });
        resolve(defData);
    });
}

export default {
    data() {
        let self = this;
        return {
            containerHeight: 300,
            deployProcessFromXML: deployProcessFromXML,
            listItemOptions: {},
            getListUrl: appConfigs.apiDomain.bpmne.models,
            tableContextMenu: [
                {
                    name: "edit",
                    text: this.$t("common.edit"),
                    callback: (row, callback) => {
                        self.$goToPage(
                            "/workflow/"+row.id+"/edit",
                            this.$t("common.edit")+" " + (row.name ? row.name : row.key)
                        );
                    }
                },
                {
                    name: "clone",
                    text: this.$t("common.clone"),
                    callback: (row, callback) => {
                        self.$goToPage(
                            "/workflow/"+row.id+"/clone",
                            this.$t("common.clone")+" " + (row.name ? row.name : row.key)
                        );
                    }
                },
                {
                    name: "remove",
                    text: this.$t("common.delete"),
                    callback: async (rows, refreshList) => {
                        let ids = [];
                        for(let item of rows){
                            ids.push(item.id);
                        }
                        try {
                            let res = await bpmnApi.deleteModels(ids);
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
                        self.$goToPage(`/workflow/${row.name}/deploy-history`,self.$t('process.deployment.list'));
                    }
                },
                {
                    name: "start",
                    text: this.$t("process.list.start"),
                    callback: async function (row, callback){
                        let defData = await getLastestDefinition(row, true);
                        if(defData.data[0]){
                            self.$goToPage(`/workflow/process-definition/${defData.data[0].id}/run`,'Start process instance');
                        }else {
                            self.$snotifyError({},"Can not find process definition having deployment id "+deploymentId);
                        }
                    }
                },
                {
                    name: "instances",
                    text: this.$t("process.list.instances"),
                    callback: async function (row, callback) {
                        let lastestDefinition = await getLastestDefinition(row, false);
                        if(lastestDefinition.data[0]){
                            self.$goToPage('/workflow/process-definition/'+lastestDefinition.data[0].id+'/instances')
                        }
                    }
                },
                {
                    name: "detail",
                    text: this.$t("common.detail"),
                    callback: (row, callback) => {
                        
                        self.$goToPage(
                            "/workflow/"+row.id+"/view",
                            self.$t("common.detail") + "  " + (row.name ? row.name : row.key)
                        );
                    }
                },
                {
                    name: "listTask",
                    text: this.$t("tasks.header.list"),
                    callback: async (row, callback) => {
                        let lastestDefinition = await getLastestDefinition(row, false);
                        if(lastestDefinition.data[0]){
                            self.$goToPage('/tasks?processDefinitionId='+lastestDefinition.data[0].id)
                        }
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
            this.$goToPage('/workflow/create',this.$t("process.action.create"));
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
