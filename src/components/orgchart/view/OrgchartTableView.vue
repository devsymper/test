<template>
    <div class="h-100 w-100">
        <v-tabs 
            v-model="currentTab"  
            background-color="transparent"
            color="grey"
            light
            height="42"
            flat
            grow>
            <v-tab 
                :key="'tableView'" >
                <v-icon size="17">mdi-home</v-icon>
                <span>Table view</span>
            </v-tab>
            <v-tab 
                :key="'tableSideBySideView'" >
                <v-icon size="17">mdi-home</v-icon>
                <span>Table side by side view</span>
            </v-tab>
            <v-tab 
                :key="'diagramView'" >
                <v-icon size="17">mdi-home</v-icon>
                <span>Diagram view</span>
            </v-tab>
        </v-tabs>

        <v-tabs-items v-model="currentTab" class="h-100">
            <v-tab-item :key="'tableView'" class="px-2 pt-2 h-100">
                <div class="h-100 symper-orgchart-table-view">
                    <AgDataTable
                        :tableHeight="'calc(100% - 100px)'"
                        ref="displayTable" 
                        :likeHandsonTable="true"
                        :allColumns="allColumns"
                        :rowData="dataTable"
                        :editable="false"
                        :customComponents="customAgComponents"
                        :cellRendererParams="{
                            innerRenderer:'nodeName'
                        }">
                    </AgDataTable>
                </div>
            </v-tab-item>
              <v-tab-item :key="'tableSideBySideView'" class="px-2 pt-2 h-100">
                <div class="h-100 symper-orgchart-table-side-by-side-view">
                        <VueResizable :width="500" :max-width="600" :min-width="300" :active ="['r']">
                            <AgDataTable
                                    :tableHeight="'calc(100% - 100px)'"
                                    :likeHandsonTable="true"
                                    :rowData="dataTable"
                                    :editable="false"
                                    :customComponents="customAgComponents"
                                    @on-cell-db-click="onCellDbClick"
                                    :cellRendererParams="{
                                        innerRenderer:'nodeName'
                                    }">
                            </AgDataTable>
                        </VueResizable>
                       <ListItems 
                             ref="listApp"
                            :pageTitle="'Danh sách người dùng'"
                            :getDataUrl="apiUrl"
                            :containerHeight="containerHeight"
                            :tableContextMenu="tableContextMenu"
                            :useDefaultContext="false"
                            :customAPIResult="customAPIResult"
                        />

                </div>
            </v-tab-item>

            <v-tab-item :key="'diagramView'" class="px-2 pt-2 h-100">
               
                <OrgchartEditor
                    :action="'view'"
                    :id="$route.params.id">
                </OrgchartEditor>
            </v-tab-item>

        </v-tabs-items>

    </div>
</template>

<script>
import AgDataTable from "@/components/common/agDataTable/AgDataTable.vue"
import { getMapDpmIdToPosition } from '../editor/nodeAttrFactory'
import NodeNameInTable  from "./NodeNameInTable.vue";
import UserInNodeView  from "./UserInNodeView.vue";
import OrgStructureView from './OrgStructureView.vue';
import OrgchartEditor from "@/components/orgchart/editor/OrgchartEditor.vue";
import TableSideBySildeView from './TableSideBySildeView.vue'
import ListItems from '@/components/common/ListItems.vue'
import VueResizable from 'vue-resizable';
import { util } from "./../../../plugins/util.js";
export default {
    props: {
        allDepartments: {
            default(){
                return []
            }
        },

        allPositions: {
            default(){
                return []
            }
        },
    },
    components: {
        'AgDataTable' : AgDataTable,
        'OrgStructureView': OrgStructureView,
        OrgchartEditor,
        TableSideBySildeView,
        ListItems,
        VueResizable
    },
    mounted(){
        this.containerHeight = util.getComponentSize(this).h - 50
    },
    computed: {
        dataTable(){
            let data = [];
            if(this.allDepartments == null){
                return []
            }
            let mapDpmToPos = getMapDpmIdToPosition(this.allPositions);
            this.mapDpmToPos = null;         
            this.mapDpmToPos = mapDpmToPos;         
            this.createMapNameToDynamicAttr();
            

            let mapDepartments = this.allDepartments.reduce((map, el) => {
                map[el.vizId] = el;
                return map;
            }, {});
            this.addPathForAllNode(mapDepartments);


            
            for(let dpmId in mapDpmToPos){
                let mapIdToPos = mapDpmToPos[dpmId];
                this.addPathForAllNode(mapIdToPos);
            }

            for(let dpmId in mapDepartments){
                let dpm = mapDepartments[dpmId];
                let row = {
                    name: dpm.path,
                    vizId: dpm.vizId,
                    code: dpm.code,
                    managers: typeof dpm.users == 'string' ? JSON.parse(dpm.users) : dpm.users,
                    users: [],
                    nodeType: 'department'
                };
                row = this.addDynamicValue(row, dpm);
                data.push(row);
            }

            for(let dpmId in mapDpmToPos){
                let mapPos = mapDpmToPos[dpmId];
                let dpm = mapDepartments[dpmId];
                for(let posId in mapPos){
                    let pos = mapPos[posId];
                    let row = {
                        name: dpm.path.concat(pos.path),
                        vizId: pos.vizId,
                        code: pos.code,
                        users: typeof pos.users == 'string' ? JSON.parse(pos.users) : pos.users,
                        managers: [],
                        nodeType: 'position'
                    };
                    row = this.addDynamicValue(row, pos);
                    data.push(row);
                }
            }

            setTimeout((self) => {
                self.$refs.orgStructureView.reDrawDiagram();
            }, 1000, this);
            return data;
        },
        allColumns(){

            let defaultColDefs = [
                {
                    "headerName": this.$t('common.code'),
                    "field": "code",
                    "width": 100,
                    "colId": "code"
                },
                {
                    "headerName": this.$t('common.manager'),
                    "field": "managers",
                    "width": 600,
                    "colId": "managers",
                    "cellRenderer": "UserInNodeView"
                },
                {
                    "headerName": this.$t('common.users'),
                    "field": "users",
                    "width": 600,
                    "colId": "users",
                    "cellRenderer": "UserInNodeView"
                },
            ];

            let colDefs = defaultColDefs;
            for(let name in this.mapNameToDynamicAttr){
                colDefs.push({
                    "headerName": name,
                    "field": this.mapNameToDynamicAttr[name],
                    "width": 300,
                    "colId": this.mapNameToDynamicAttr[name],
                });
            }
            setTimeout((self) => {
                if(self.$refs.displayTable){
                    self.$refs.displayTable.refreshData(colDefs);
                }
            }, 0, this);
            console.log(colDefs,'colDefscolDefscolDefs');
            return colDefs;
        }
    },
    methods: {
        
        addDynamicValue(row, node){
            if(node.dynamicAttributes){
                for(let attr of node.dynamicAttributes){
                    let colId = this.mapNameToDynamicAttr[attr.name];
                    if(colId){
                        row[colId] = attr.value
                    }
                }
            }
            return row;
        },
        addPathForAllNode(mapNode){
            for(let id in mapNode){
                let node = mapNode[id];

                if(!node.vizParentId){
                    node.path = [node.name];
                }else{
                    if(node.path === undefined){
                        node.path = this.getPathOfNode(node, mapNode);
                    }
                }
            }
        },
        createMapNameToDynamicAttr(){
            let mapNameToDynamicAttr = {};
            let count = 0;

            for(let dpm of this.allDepartments){
                if(dpm.dynamicAttributes){
                    for(let attr of dpm.dynamicAttributes){
                        mapNameToDynamicAttr[attr.name] = 'attr_'+count;
                        count += 1;
                    }
                }
            }

            for(let pos of this.allPositions){
                if(pos.dynamicAttributes){
                    for(let attr of pos.dynamicAttributes){
                        mapNameToDynamicAttr[attr.name] = 'attr_'+count;
                        count += 1;
                    }
                }
            }

            this.mapNameToDynamicAttr = null;
            this.mapNameToDynamicAttr = mapNameToDynamicAttr;

            // for(let key in mapNameToDynamicAttr){
            //     this.$set(this.mapNameToDynamicAttr, key, mapNameToDynamicAttr[key]);
            // }
        },
        getPathOfNode(node, mapNode){
            if(!node){
                return [];
            }
            if(!node.vizParentId){
                return [node.name];
            }else{
                if(node.path !== undefined){
                    return node.path;
                }else{
                    return this.getPathOfNode(mapNode[node.vizParentId], mapNode).concat([node.name]);
                }
            }
        },
        onCellDbClick(params){
            console.log(params);
            debugger
        }
    },
    data(){
        return {
            currentTab: 1,
            customAgComponents: {
                nodeName: NodeNameInTable,
                UserInNodeView: UserInNodeView,
            },
            mapNameToDynamicAttr: null,
            mapDpmToPos: null,
            apiUrl: 'https://account.symper.vn/users',
            customAPIResult:{
                reformatData(res){
                   return{
                         listObject: res.data.listObject,
                         columns: res.data.columns,
                         total: res.data.total
                   }
                }
            },
            containerHeight:null,
            tableContextMenu: {
               viewDetails: {
                    name: "View details",
                    text: "View details",
                    callback: (app, callback) => {
                      
                    },
                },
             
            },
        }
    }
}
</script>

<style>
.symper-orgchart-table-view .ag-group-child-count{
    position: absolute;
    right: 5px;
}
.symper-orgchart-table-side-by-side-view{
    display:flex
}
</style>


