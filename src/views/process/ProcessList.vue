<template>
    <div class="w-100 h-100">
        <list-items
            ref="listModels"
            :useDefaultContext="false"
            :pageTitle="$t('process.list.title')"
            :tableContextMenu="tableContextMenu"
            :containerHeight="containerHeight"
            :customAPIResult="customAPIResult"
            :getDataUrl="getListUrl"
            :useActionPanel="false"
            :exportLink="exportLink"
            :headerPrefixKeypath="'common'"
            :commonActionProps="commonActionProps"
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
import { deployProcess, deployProcessFromXML, getLastestDefinition } from "./../../components/process/processAction.js";
import { config } from 'rxjs';
import {taskApi} from './../../api/task.js'

export default {
    data() {
        let self = this;
        return {
            commonActionProps: {
                "module": "workflow",
                "resource": "workflow_definition",
                "scope": "workflow",
            },
            exportLink: appConfigs.apiDomain.bpmne.models+'/export',
            containerHeight: 300,
            deployProcessFromXML: deployProcessFromXML,
            listItemOptions: {},
            getListUrl: appConfigs.apiDomain.bpmne.models,
            tableContextMenu: {
               update: {
                    name: "edit",
                    text: this.$t("common.edit"),
                    callback: (row, callback) => {
                        self.$goToPage(
                            "/workflow/"+row.id+"/edit",
                            this.$t("common.edit")+" " + (row.name ? row.name : row.key)
                        );
                    }
                },
                clone: {
                    name: "clone",
                    text: this.$t("common.clone"),
                    callback: (row, callback) => {
                        self.$goToPage(
                            "/workflow/"+row.id+"/clone",
                            this.$t("common.clone")+" " + (row.name ? row.name : row.key)
                        );
                    }
                },
                drop: {
                    name: "remove",
                    text: this.$t("common.delete"),
                    multipleSelection:true,
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
                deploy: {
                    name: "deploy",
                    text: this.$t("common.deploy"),
                    callback: (row, callback) => {
                        deployProcess(self, row);
                    }
                },
                deploy_history: {
                    name: "deployHistory",
                    text: this.$t("process.list.deploy_history"),
                    callback: (row, callback) => {
                        self.$goToPage(`/workflow/${row.name}/deploy-history`,self.$t('process.deployment.list'));
                    }
                },
                start_instance: {
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
                list_instance: {
                    name: "instances",
                    text: this.$t("process.list.instances"),
                    callback: async function (row, callback) {
                        
                        self.$goToPage('/workflow/process-key/'+row.processKey+'/instances', self.$t('process.instance.listModelInstance')+row.name)
                    }
                },
                detail:{
                    name: "detail",
                    text: this.$t("common.detail"),
                    callback: (row, callback) => {
                        
                        self.$goToPage(
                            "/workflow/"+row.id+"/view",
                            self.$t("common.detail") + "  " + (row.name ? row.name : row.key)
                        );
                    }
                },
                list_task: {
                    name: "listTask",
                    text: this.$t("tasks.header.list"),
                    callback: async (row, callback) => {
                        let lastestDefinition = await getLastestDefinition(row, false);
                        if(lastestDefinition.data[0]){
                            self.$goToPage('/tasks?processDefinitionId='+lastestDefinition.data[0].id, self.$t('process.taskList')+row.name)
                        }
                    }
                },
            },
             customAPIResult: {
                 getListKey(res){
                     let listKey = [];
                     res.map(x=>listKey.push(x.processKey));
                     return listKey
                 },
                reformatData(res){
                    let listKey = this.getListKey(res.data.listObject);
                    // debugger
                     res.data.columns.push(
                        {
                            name:'number_instance',
                            title:'number_instance',
                            type:"numeric"
                        },
                   )
                   let listWork = res.data;
                    taskApi.countInstant({keys:JSON.stringify(listKey)}).then(res=>{
                         if (res.status === 200) {
                              debugger
                              for(let i = 0; i<listWork.listObject.length; i++){
                                  for(let j =0; j<res.data.length;j++){
                                      if(listWork.listObject[i].processKey==res.data[j].key){
                                          listWork.listObject[i].number_instance=res.data[j].number_of_process_instance
                                      }
                                  }
                            }
                              self.$refs.listModels.rerenderTable();
                         }
                    })
                        //debugger
                   
                   
                    return  listWork;
                } 
            },
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
