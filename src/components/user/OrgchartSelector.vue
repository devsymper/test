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
    created() {
        this.getAllOrgChart();
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
         * hoangnd: 14/4/2020
         * Hàm thêm user vào vị trí của org chart để phân quyền
         */
        addOrgchartPosition(org, from) {
            console.log(this.user);

            if (from == "autocomplete") {
                org.selected = true;
            }
            if (from == "input") {
                org.selected = true;
            }
            if (org.selected == true) {
                console.log(this.isAddingToPosition);

                if (this.isAddingToPosition == false) {
                    this.isAddingToPosition = true;
                    permissionPositionOrgchartApi
                        .addUserToPosition({
                            userId: this.user.id,
                            positionId: org.id_node
                        })
                        .then(res => {
                            if (res.status == 200) {
                                this.isAddingToPosition = false;
                                this.positionOrgchartSelected.push(org);
                            }
                        })
                        .catch(err => {
                            console.log("error from add user api!!!", err);
                        })
                        .always(() => {});
                } else {
                    this.isAddingToPosition = false;
                }
            } else {
                this.deletePosition(org);
            }
        },
        getAllOrgChart() {
            if (this.permissionPosittionOrgChart.listNode.length == 0) {
                orgChartApi
                    .getAllNodes()
                    .then(res => {
                        if (res.status == 200) {
                            let treeData = res.data;
                            this.permissionPosittionOrgChart.listNode = treeData;
                            this.getUserPositionOrgchart();
                        }
                    })
                    .catch(err => {
                        console.log("error from get orgchart api!!!", err);
                    })
                    .always(() => {});
            }
        },

        getUserPositionOrgchart() {
            if (this.user.id != "" && this.user.id != null) {
                userApi
                    .getListUserPosition(this.user.id)
                    .then(res => {
                        if (res.status == 200) {
                            let listNode = this.permissionPosittionOrgChart
                                .listNode;
                            // lặp check các root
                            // this.setPositionOrgchartSelected(res.data);
                            for (
                                let index = 0;
                                index < listNode.length;
                                index++
                            ) {
                                let node = listNode[index];
                                let newA = res.data.filter(n => {
                                    return (
                                        n.id == node.id &&
                                        n.root_id == node.root_id &&
                                        n.id_orgchart == node.id_orgchart &&
                                        n.id_node == node.id_node
                                    );
                                });
                                this.permissionPosittionOrgChart.listNode[
                                    index
                                ].selected = false;
                                if (newA.length > 0) {
                                    this.permissionPosittionOrgChart.listNode[
                                        index
                                    ].selected = true;
                                }
                                let children = node.children;
                                // lặp check các children
                                for (let i = 0; i < children.length; i++) {
                                    let childNode = children[i];
                                    let newArr = res.data.filter(n => {
                                        return (
                                            n.id == childNode.id &&
                                            n.root_id == childNode.root_id &&
                                            n.id_node == childNode.id_node
                                        );
                                    });
                                    this.permissionPosittionOrgChart.listNode[
                                        index
                                    ].children[i].source = "";
                                    this.permissionPosittionOrgChart.listNode[
                                        index
                                    ].children[i].selected = false;
                                    if (newArr.length > 0) {
                                        this.permissionPosittionOrgChart.listNode[
                                            index
                                        ].children[i].selected = true;
                                    }
                                }
                            }
                            this.setDataOrgchartTotreeView(
                                this.permissionPosittionOrgChart.listNode,
                                res.data
                            );
                        }
                    })
                    .catch(err => {
                        console.log("error from get pack api!!!", err);
                    })
                    .always(() => {});
            }
        },

        /**
         * Hoangnd: 14/4/2020
         * hàm đưa danh sách các node của orgchart về dạng hiển thị cho treeview
         * @param Array listNodes: danh sách các orgchart
         */
        setDataOrgchartTotreeView(listNodes, listPosition) {
            this.listNodesOrgChart = [];
            for (let index = 0; index < listNodes.length; index++) {
                let orgName = listNodes[index].name;
                let listChild = listNodes[index].children;
                this.listNodesOrgChart = this.listNodesOrgChart.concat(
                    listChild
                );
                this.checkSelectedPosition(listPosition, listNodes[index]);
                var map = {},
                    node,
                    roots = [],
                    i;
                for (i = 0; i < listChild.length; i++) {
                    map[listChild[i].id_node] = i; // initialize the map
                    listChild[i].children = []; // initialize the children
                }
                for (i = 0; i < listChild.length; i++) {
                    node = listChild[i];
                    if (node.id_parent_node !== "general") {
                        node.source =
                            listChild[map[node.id_parent_node]].source +
                            " / " +
                            listChild[map[node.id_parent_node]].name;
                        listChild[map[node.id_parent_node]].children.push(node);
                    } else {
                        node.source = orgName;
                        roots.push(node);
                    }
                    this.checkSelectedPosition(listPosition, node);
                }
                this.permissionPosittionOrgChart.listNode[
                    index
                ].children = roots;
            }
            console.log(this.listNodesOrgChart);
        },
        checkSelectedPosition(listPosition, position) {
            let newList = listPosition.filter(node => {
                return (
                    node.root_id == position.root_id &&
                    node.id_parent_node == position.id_parent_node &&
                    node.id_node == position.id_node
                );
            });
            if (newList.length > 0)
                this.positionOrgchartSelected = this.positionOrgchartSelected.concat(
                    position
                );
        },
        
		/**
		 * Hàm xóa user ra khỏi vị trí của org chart
		 * @param Object org : org cần xóa
		 */
		deletePosition(org){
			userApi.deleteUserPosition({userId:this.user.id,positionId:org.id_node}).then(res => {
				if (res.status == 200) {
					let currentPosition = this.positionOrgchartSelected.find(x => x.id === org.id);
					var index = this.positionOrgchartSelected.indexOf(currentPosition);
					this.positionOrgchartSelected.splice(index,1);
				}
			})
			.catch(err => {
				console.log("error from add delete api!!!", err);
			})
			.always(() => {

			});
		},
    },
    props: {
        user: {
            type: Object,
            default(){
                return {}
            }
        }
    }
};
</script>

<style>
</style>