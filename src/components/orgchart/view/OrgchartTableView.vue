<template>
    <AgDataTable
        ref="displayTable"
        :allColumns="allColumns"
        :rowData="dataTable"
        :editable="false"
        :customComponents="customAgComponents"
        :cellRendererParams="{
            innerRenderer:'nodeName'
        }">

    </AgDataTable>
</template>

<script>
import AgDataTable from "@/components/common/agDataTable/AgDataTable.vue"
import { getMapDpmIdToPosition } from '../editor/nodeAttrFactory'
import NodeNameInTable  from "./NodeNameInTable.vue";
import UserInNodeView  from "./UserInNodeView.vue";

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
    },
    computed: {
        dataTable(){
            let data = [];
            if(this.allDepartments == null){
                return []
            }
            this.createMapNameToDynamicAttr();
            

            let mapDepartments = this.allDepartments.reduce((map, el) => {
                map[el.vizId] = el;
                return map;
            }, {});
            this.addPathForAllNode(mapDepartments);


            let mapDpmToPos = getMapDpmIdToPosition(this.allPositions);
            
            for(let dpmId in mapDpmToPos){
                let mapIdToPos = mapDpmToPos[dpmId];
                this.addPathForAllNode(mapIdToPos);
            }

            for(let dpmId in mapDepartments){
                let dpm = mapDepartments[dpmId];
                let row = {
                    name: dpm.path,
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
                        name: dpm.path.concat(['Positions']).concat(pos.path),
                        code: pos.code,
                        users: typeof pos.users == 'string' ? JSON.parse(pos.users) : pos.users,
                        managers: [],
                        nodeType: 'position'
                    };
                    row = this.addDynamicValue(row, pos);
                    data.push(row);
                }
            }
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
                    "width": 100,
                    "colId": "managers",
                    "cellRenderer": "UserInNodeView"
                },
                {
                    "headerName": this.$t('common.users'),
                    "field": "users",
                    "width": 100,
                    "colId": "users",
                    "cellRenderer": "UserInNodeView"
                },
            ];

            let colDefs = defaultColDefs;
            for(let name in this.mapNameToDynamicAttr){
                colDefs.push({
                    "headerName": name,
                    "field": this.mapNameToDynamicAttr[name],
                    "width": 100,
                    "colId": this.mapNameToDynamicAttr[name],
                });
            }
            setTimeout((self) => {
                self.$refs.displayTable.refreshData(colDefs);
            }, 0, this);
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
        }
    },
    data(){
        return {
            customAgComponents: {
                nodeName: NodeNameInTable,
                UserInNodeView: UserInNodeView,
            },
            mapNameToDynamicAttr: null
        }
    }
}
</script>

<style>

</style>


