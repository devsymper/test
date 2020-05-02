<template>
    <div>
        <div class="tree-orgchart-content">
            <v-autocomplete
                class="mt-2"
                v-model="search"
                dense
                :items="listNodesOrgChart"
                item-value="name"
                item-text="name"
                return-object
                outlined
                hide-details
                clearable
                @input="addOrgchartPosition(search,'input')"
            >
                <template v-slot:item="position">
                    <v-list-item-content @click="addOrgchartPosition(position.item,'autocomplete')">
                        <v-list-item-title>{{ position.item.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ position.item.source }}</v-list-item-subtitle>
                    </v-list-item-content>
                </template>
            </v-autocomplete>
            <v-treeview
                :items="permissionPosittionOrgChart.listNode"
                dense
                open-all
                :search="search.name"
                class="sym-small-size mt-2"
            >
                <template v-slot:label="props">
                    <div class="treeCheckBox" @click="addOrgchartPosition(props.item,'treeview')">
                        <label
                            v-if="props.item.id_node == 'general'"
                            class="treeCheckBox label-root-org"
                        >{{props.item.name}}</label>
                        <v-checkbox
                            v-else
                            class="treeCheckBox"
                            v-model="props.item.selected"
                            :label="props.item.name"
                        ></v-checkbox>
                    </div>
                </template>
            </v-treeview>
        </div>
        <vue-resizable
            class="content-orgchart-resize mt-2"
            :min-height="100"
            :height="100"
            :max-height="400"
            :width="530"
            :active="['t']"
        >
            <div class="content-orgchart-selected">
                <v-list dense>
                    <v-list-item
                        class="permission-item"
                        v-for="org in positionOrgchartSelected"
                        :key="org.id"
                    > 
                        <v-list-item-content>
                            <v-list-item-title>{{ org.name }}</v-list-item-title>
                            <v-list-item-subtitle>{{ org.source }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-icon @click="deletePosition(org)">
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-icon v-on="on" small>mdi-delete</v-icon>
                                </template>
                                <span>{{$t('common.delete')}}</span>
                            </v-tooltip>
                        </v-list-item-icon>
                    </v-list-item>
                </v-list>
            </div>
        </vue-resizable>
    </div>
</template>

<script>
import VueResizable from 'vue-resizable';
import { permissionPositionOrgchartApi } from "./../../api/PermissionPositionOrgchart.js";
import { orgChartApi } from "./../../api/OrgChart.js";
import { userApi } from "./../../api/user.js";

export default {
    computed: {

    },
    created() {
        this.getAllOrgChartData();
    },
    components: {
        'vue-resizable': VueResizable
    },
    data() {
        return {
            search: {name: ''},
            listNodesOrgChart: [],
            permissionPosittionOrgChart: {
                title: "vị trí orgchart",
                listNode: [],
                noteSelected: []
            },
            positionOrgchartSelected: []
        };
    },
    methods: {
        /**
         * Lấy đường dẫn từ root trong orgchart (orgc) xuống tới node (node)
         */
        addPathInfoForANode(orgc, node){
            if(!node.path){
                if(node.id_parent_node == 'general'){
                    node.path = `${orgc.name} / ${node.name}`;
                }else{
                    let parentId = node.id_parent_node;
                    let parentNode = orgc.children[parentId];
                    if(parentNode.path){
                        node.path = `${parentNode.path} / ${node.name}`;
                    }else{
                        this.addPathInfoForANode(orgc, parentNode);
                    }
                }
            }
        },
        // Thêm đường dẫn (breadscrum) từ root đến node
        addPathInfoForAllNodes(orgchartNodes){
            for(let idOrgc in orgchartNodes){
                let orgc = orgchartNodes[idOrgc];
                for(let nodeId in orgc.children){
                    this.addPathInfoForANode(orgc, orgc.children[nodeId]);
                }
            }
            return orgchartNodes;
        },
        // Chuyển data của orchart từ dạng phẳng sang dạng map key-value
        makeNodesMap(orgchartNodes){
            let rsl = {};
            for(let orgc of orgchartNodes){
                let newOrgc = {
                    id: orgc['id'],
                    id_node: orgc['id_node'],
                    id_node: orgc['id_node'],
                    id_parent_node: orgc['id_parent_node'],
                    name: orgc['name'],
                    root_id: orgc['root_id'],
                    children: {}
                };

                for(let node of orgc.children){
                    node.orgchartId = orgc['id'];
                    newOrgc.children[node.id_node] = node;
                }
                rsl[orgc.id] = newOrgc;
            }
            return rsl;
        },
        /**
         * Lấy data của tất cả orgchart ở server
         */
        getAllOrgChartData() {
            let self = this;
            orgChartApi.getAllNodes()
            .then(res => {
                if (res.status == 200) {
                    let orgchartNodes = self.makeNodesMap(res.data);
                    orgchartNodes = self.addPathInfoForAllNodes(orgchartNodes);
                    console.log(orgchartNodes);
                    self.$store.commit('app/setOrgchartNodes',orgchartNodes);
                }
            })
            .catch(err => {
                console.warn(err);
                self.$snotify({
                    type:'error',
                    title: 'Error!',
                    text: 'Error when get and prepare data for orchart selector component',
                });
            });
        }
    },
    props: {
        /** 
         * Danh sách các node được tích chọn trong orgchar, có dạng:
         * {
         *      id orgchart 1: [ idNode1, idNode2, ....],
         *      id orgchart 2: [ idNode1, idNode2, ....],
         * }
         * 
         **/ 
        value: {
            type: Object,
            default(){
                return {

                }
            }
        }
    }
};
</script>

<style>
</style>