<template>
    <div>
        <div class="tree-orgchart-content">
            <v-autocomplete
                class="mt-2"
                v-model="searchNode"
                @change="handleNodeSelectedOnInput"
                dense
                :items="listNodeAsFlat"
                item-value="gid"
                item-text="name"
                return-object
                outlined
                hide-details
                clearable
            >
                <template v-slot:item="position">
                    <v-list-item-content >
                        <v-list-item-title>{{ position.item.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ position.item.path }}</v-list-item-subtitle>
                    </v-list-item-content>
                </template>
            </v-autocomplete>
            <v-treeview
                :items="listNodeAsTree"
                dense
                open-all
                class="sym-small-size mt-2">
                <template v-slot:label="props">
                    <div class="treeCheckBox" >
                        <label
                            v-if="props.item.id_node == 'general'"
                            class="treeCheckBox label-root-org"
                        >{{props.item.name}}</label>
                        <v-checkbox
                            @change="(vl)=>{handleNodeSelectedOnTree(props.item, vl)}"
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
                        v-for="(node,idx) in selectedNodesData"
                        :key="idx"
                    > 
                        <v-list-item-content>
                            <v-list-item-title>{{ node.name }}</v-list-item-title>
                            <v-list-item-subtitle>{{ node.path }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-icon @click="deleteSelectedNode(idx)">
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
import { util } from '../../plugins/util';

export default {
    computed: {
        listNodeAsTree(){
            let orcharts = util.cloneDeep(this.$store.state.app.orgchartNodes);
            let treeData = [];
            let mapSelectedNodes = {};
            for(let node of this.value){
                let idOrgc = 'orgcid'+node.idOrgchart;
                if(!mapSelectedNodes[idOrgc]){
                    mapSelectedNodes[idOrgc] = {}
                }
                mapSelectedNodes[idOrgc][node.idNode] = true;
            }
            
            for(let idOrgc in orcharts){
                let nodes = orcharts[idOrgc].children;
                let orchartTree = {
                    id: orcharts[idOrgc].id,
                    name: orcharts[idOrgc].name,
                    id_node: 'general',
                    children: []
                };
                for(let nodeId in nodes){
                    let idParent = nodes[nodeId].id_parent_node;
                    nodes[nodeId].selected = mapSelectedNodes[idOrgc] ? mapSelectedNodes[idOrgc][nodeId] : false;
                    if(idParent != 'general'){
                        if(!nodes[idParent].children){
                            nodes[idParent].children = [];
                        }
                        nodes[idParent].children.push(nodes[nodeId]);
                    }else {
                        orchartTree.children.push(nodes[nodeId]);
                    }
                }
                treeData.push(orchartTree);
            }
            return treeData;
        },  
        listNodeAsFlat(){
            let nodes = [];
            let orcharts = this.$store.state.app.orgchartNodes;
            for(let idOrgc in orcharts){
                nodes = nodes.concat(Object.values(orcharts[idOrgc].children));
            }
            return nodes;
        },
        selectedNodesData(){
            let orcharts = this.$store.state.app.orgchartNodes;
            let nodes = [];
            for(let node of this.value){
                nodes.push(orcharts['orgcid'+node.idOrgchart].children[node.idNode]);
            }
            return nodes;
        }
    },
    created() {
        this.getAllOrgChartData();
    },
    components: {
        'vue-resizable': VueResizable
    },
    data() {
        return {
            searchNode: {name: '', gid: ''},
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
        handleNodeSelectedOnTree(node, selected){
            console.log(node, selected, 'xxxxxxxx');
            if(selected){
                this.handleNodeSelectedOnInput(node);
            }else{
                let idx = -1;
                for(let i in this.value){
                    let sn = this.value[i];
                    if(sn.gid == (sn.idOrgchart+'-'+sn.idNode)){
                        idx = i;
                        break;
                    }
                }
                this.value.splice(idx,1);
            }
        },
        /**
         * Xử lý khi người dùng chọn được một node bất kỳ từ danh sách autocomplete
         */
        handleNodeSelectedOnInput(node){
            this.$emit('input',this.value.concat({
                idNode: node.id_node,
                idOrgchart: node.gid.split('-')[0]
            }));
        },
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
        // Thêm đường đi (breadscrum) từ root đến node
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
                    id: orgc['id'], // thêm _ ở đầu để có thể khởi động reactive của vue
                    id_node: orgc['id_node'],
                    id_node: orgc['id_node'],
                    id_parent_node: orgc['id_parent_node'],
                    name: orgc['name'],
                    root_id: orgc['root_id'],
                    children: {}
                };

                for(let node of orgc.children){
                    node.gid = orgc['id']+'-'+node.id_node; // gid là general id là kết hợp giữa id orgchart và id node tạo thành key duy nhất để xác định một node bất kỳ giữa tất cả các orgchart 
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
        },
        /**
         * Xóa một node khỏi danh sách được chọn
         */
        deleteSelectedNode(idx){
            this.value.splice(idx,1);
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
            type: Array,
            default(){
                return []
            }
        }
    }
};
</script>

<style>


.autocomplete-package-item{
    padding: 0;
    min-height: 40px;
}


.treeCheckBox{
    margin-top: 0px;
    max-height: 30px;
}
.sym-stepper-content .v-tab{
    font-size: 13px;
}

.sym-stepper-content{
    padding-top: 0;
}
.content-orgchart-selected{
    background: white;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    /* padding-bottom: 8px; */
}
.content-orgchart-resize{
    overflow: hidden;
    border-top: 2px solid #888;
    margin: 8px 0;
}
.tree-orgchart-content{
    height: 100%;
}
.tree-orgchart-content .sym-small-size{
    height: calc(100% - 50px);
    overflow: auto;
}
.label-root-org{
    font-size: 14px;
    color: #797979;
    font-weight: 600;
}
</style>