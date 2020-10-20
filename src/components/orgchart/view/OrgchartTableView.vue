<template>
    <div class="h-100 w-100 orgchart-table-view">
        <v-toolbar>
            <v-toolbar-title>{{titleToolbar}}</v-toolbar-title>
             <v-menu
                :max-width="500"
                :max-height="700"
                :nudge-width="200"
                offset-y
                >
                <template v-slot:activator="{ on }">
                    <v-btn icon tile v-on="on">
                        <v-icon>mdi-menu-down-outline</v-icon>
                    </v-btn>
                </template>
                  <v-list
                        nav
                        dense
                    >
                        <v-list-item-group
                            v-model="currentTab"
                            color="primary"
                            >
                            <v-list-item
                                v-for="(item, i) in menuPickTab"
                                :key="i"
                            >
                                <v-list-item-icon>
                                <v-icon v-text="item.icon"></v-icon>
                                </v-list-item-icon>

                                <v-list-item-content>
                                <v-list-item-title v-text="item.title"></v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                </v-list>
            </v-menu>
        </v-toolbar>
        <v-tabs-items v-model="currentTab" class="h-100">
            <v-tab-item :key="'tableView'" class="px-2 pt-2 h-100">
                <div class="h-100 symper-orgchart-table-view">
                    <AgDataTable
                        :tableHeight="'calc(100% - 100px)'"
                        ref="displayTable" 
                        :allColumns="allColumns"
                        :likeHandsonTable="true"
                        :rowData="dataTable"
                        :editable="false"
                         @grid-ready="onGridReady"
                        :customComponents="customAgComponents"
                        :cellRendererParams="{
                            innerRenderer:'nodeName'
                        }">
                    </AgDataTable>
                </div>
            </v-tab-item>
              <v-tab-item :key="'tableSideBySideView'" class="px-2 pt-2 h-100">
                <div class="h-100 symper-orgchart-table-side-by-side-view">
                    <!-- <TableSideBySildeView /> -->
                        <VueResizable :width="500" :max-width="600" :min-width="300" :active ="['r']">
                           <div style="display:flex;flex-direction:column" class="h-100 w-100">
                               <div style="height:52px;display:flex;align-items:center">
                                     <h2 style="font:17px roboto ;font-weight:500" >Sơ đồ tổ chức</h2>
                               </div>
                                <AgDataTable
                                    :tableHeight="'calc(100% - 100px)'"
                                    :likeHandsonTable="true"
                                    :rowData="dataTable"
                                    :editable="false"
                                    :customComponents="customAgComponents"  
                                    @on-cell-dbl-click="onCellDblClick"
                                    :minWidth="500"
                                    :cellRendererParams="{
                                        innerRenderer:'nodeName',
                                        suppressDoubleClickExpand: true,
                                    }">
                                </AgDataTable>
                           </div>
                        </VueResizable>
                       <ListItems 
                             ref="listUser"
                            :pageTitle="'Danh sách người dùng'"
                            :getDataUrl="apiUrl"
                            :containerHeight="containerHeight"
                            :tableContextMenu="tableContextMenu"
                            :useDefaultContext="false"
                            :useActionPanel="true"
                            :actionPanelWidth="850"
                            :headerPrefixKeypath="'user.table'"
                            :customAPIResult="customAPIResult"
                            :showButtonAdd="false"
                            :showExportButton="false"
                            :showImportButton="false"
                            :showActionPanelInDisplayConfig="false"
                        >
                            <template slot="right-panel-content" slot-scope="{}">  
                                <Detail :quickView="true" :docObjInfo="docObjInfo" />
                            </template>
                       </ListItems>  
                        
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
import Detail from '@/views/document/detail/Detail.vue'
import { orgchartApi } from "@/api/orgchart.js";
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
        VueResizable,
        Detail
    },
    mounted(){
        this.containerHeight = util.getComponentSize(this).h - 50
        this.currentSize =  util.getComponentSize(this)
    },
    computed: {
        allUserInOrgchart(){
             return  this.$store.state.orgchart.allUserInOrgChart[this.$route.params.id]
        },    
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
            let size = Math.floor(this.currentSize.w)
            if(!isNaN(size)){
                
                 let defaultColDefs = [
                    {
                        "headerName": this.$t('common.code'),
                        "field": "code",
                        "width": size/9,
                        "colId": "code",
                        "resizable":true,
                    },
                    {
                        "headerName": this.$t('common.manager'),
                        "field": "managers",
                        "width":  size/5+50,
                        "colId": "managers",
                        "cellRenderer": "UserInNodeView",
                         "resizable":true,
                    },
                    {
                        "headerName": this.$t('common.users'),
                        "field": "users",
                        "width":size/2.3,    
                        "colId": "users",
                        "cellRenderer": "UserInNodeView",
                         "resizable":true,
                    },
                ];

                let colDefs = defaultColDefs;
                for(let name in this.mapNameToDynamicAttr){
                    colDefs.push({
                        "headerName": name,
                        "field": this.mapNameToDynamicAttr[name],
                        "width": size/6,
                        "colId": this.mapNameToDynamicAttr[name],
                    });
                }
                setTimeout((self) => {
                    if(self.$refs.displayTable){
                        self.$refs.displayTable.refreshData(colDefs);
                    }
                }, 0, this);
                return colDefs;
            }
        }
    },
    methods: {
         onGridReady(params) {
            this.agApi = params.api; 
        },
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
        onCellDblClick(params){
            params.data.orgchartId =  this.$route.params.id;
            this.$store.commit('orgchart/emptyListChildrenNode',this.$route.params.id)
            this.$store.dispatch('orgchart/updateUserInNode',params.data)
            this.listUserInNode = this.$store.getters['orgchart/listUserInChildrenNode'](this.$route.params.id);
            this.$store.commit('orgchart/setAllUserInOrgchart',{
                orgchartId:  this.$route.params.id,
                listUsers: this.listUserInNode
            })
        },
        onTabClicked(data){
            this.currentTab = data.action
            this.titleToolbar = data.title
        }
    },
    data(){
        let self = this
        return {
            currentTab: 2,
            agApi:null,
            currentSize: {},
            customAgComponents: {
                nodeName: NodeNameInTable,
                UserInNodeView: UserInNodeView,
            },
            listTitle:[
                "SĐTC dạng bảng",
                "SĐTC dạng cây",
                "SĐTC dạng lưu đồ",
            ],
            columnTree:{
                "headerName": this.$t('common.code'),
                "field": "code",
                "width": 300,
                "colId": "code"
           },
            showNavigation:false,
            listUserInNode:[],
            docObjInfo:{},
            apiUrl: '',
            mapNameToDynamicAttr: null,
            titleToolbar:"SĐTC dạng cây",
            mapDpmToPos: null,
            menuPickTab:[
                {
                    icon: "mdi-grid",
                    title:"SDDTC dạng bảng",
                    action:"tableView"
                },
                {
                    icon: "mdi-account-multiple",
                    title:"SDDTC dạng cây",
                    action:"tableSideBySideView"
                },
                {
                    icon: "mdi-share-variant",
                    title:"SDDTC dạng lưu đồ",
                    action:"diagramView"
                },

            ],
            customAPIResult:{
                reformatData(res){
                   return{
                       columns:[
                            {name: "id", title: "id", type: "numeric"},
                            {name: "firstName", title: "firstName", type: "text"},
                            {name: "displayName", title: "displayName", type: "text"},
                            {name: "email", title: "email", type: "text"},
                            {name: "phone", title: "phone", type: "text"},
                            {name: "createAt", title: "createAt", type: "text"},
                            {name: "updateAt", title: "updateAt", type: "text"},
                       ],
                       listObject:res.data.listObject
                         

                   }
                }
            },
            containerHeight:null,
            tableContextMenu: {
               viewDetails: {
                    name: "View details",
                    text: "Xem chi tiết",
                    callback: (user, callback) => {
                        let data = {
                            // object_identifier: "account:971"
                            object_identifier: "account:"+user.id
                        }
                        let self = this
                        orgchartApi.getDocumentByUserId(data).then(res=>{
                            if(res.data.length > 0){
                                let idDoc = res.data[0].documentObjectId
                               self.docObjInfo = {docObjId:idDoc,docSize:'21cm'}
                               self.$refs.listUser.actionPanel = true;
                            }else{
                                self.$snotify({
                                    type: "error",
                                    title: "Không tìm thấy hồ sơ nhân sự",
                                });
                            }
                        }).catch(err=>{})
                    },
                },
             
            },
        }
    },
    watch:{
        allUserInOrgchart:{
            deep: true,
            immediate: true,
            handler: function(after){
                if (typeof after !== 'undefined'){
                    if(after.length == 0){
                        after = 131237173123717323713277
                    }
                    this.apiUrl = 'https://account.symper.vn/users?limitIds=['+after+']'
                }
               
            }
        },
        currentTab(val){
            this.titleToolbar = this.listTitle[val]
            if(val == 0){
                this.agApi.sizeColumnsToFit()
            }
        }
    }
}
</script>

<style scoped>
.symper-orgchart-table-view .ag-group-child-count{
    position: absolute;
    right: 5px;
}
.symper-orgchart-table-side-by-side-view{
    display:flex
}
.orgchart-table-view >>> .v-toolbar{
    height:45px !important;
    border-bottom:1px solid lightgray;
    border-left:1px solid lightgray
}
.orgchart-table-view >>> .v-toolbar .v-toolbar__content{
    height:unset !important;
    padding-top:6px;
}
.orgchart-table-view >>> .v-toolbar .v-toolbar__content button{
    height:32px;
    width:32px;
}
.orgchart-table-view >>> .v-menu__content .v-list-item .v-list-item__icon{
    min-width: unset;
    width: 15px;
    margin-right:20px !important;
}
</style>


