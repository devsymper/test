<template>
    <div class="h-100 w-100 orgchart-table-view">
        <v-toolbar v-show="showToolbar">
            <v-toolbar-title>{{titleToolbar}}</v-toolbar-title>
             <v-menu
                :max-width="500"
                :max-height="700"
                :nudge-width="200"
                offset-y
                >
                <template v-slot:activator="{ on }">
                    <v-btn icon tile x-small v-on="on">
                        <v-icon>mdi-chevron-down</v-icon>
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
                           <div style="" class="h-100 ">
                               <div style="height:31px;display:flex;align-items:center;margin-bottom:8px" class=" tree-orgchart">
                                   <span style="font:17px roboto;font-weight:500">{{titleToolbar}}</span>
                                    <v-menu
                                        :max-width="500"
                                        :max-height="700"
                                        :nudge-width="200"
                                        offset-y
                                        >
                                        <template v-slot:activator="{ on }">
                                            <v-btn icon tile x-small v-on="on">
                                                <v-icon>mdi-chevron-down</v-icon>
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
                               </div>
                        <VueResizable :width="400" :max-width="500" :min-width="300" :active ="['r']" @resize:end="resizeEnd">

                                <AgDataTable
                                    :tableHeight="'calc(100% - 100px)'"
                                    :likeHandsonTable="true"
                                    :rowData="dataTable"
                                    :editable="false"
                                    :customComponents="customAgComponents"  
                                    :hideRowBorderCss="true"
                                    @on-cell-dbl-click="onCellDblClick"
                                    @on-cell-context-menu="onCellContextMenu"
                                    :minWidth="500"
                                    :cellRendererParams="{
                                        innerRenderer:'nodeName',
                                        suppressDoubleClickExpand: true,
                                    }">
                                </AgDataTable>
                        </VueResizable>
          <!-- @on-cell-mouse-over="onCellMouseOver" -->
                           </div>
                       <ListItems 
                             ref="listUser"
                            :pageTitle="'Danh sách người dùng'"
                            :getDataUrl="apiUrl"
                            :containerHeight="containerHeight"
                            :tableContextMenu="tableContextMenu"
                            :widthContentCustom="widthContentCustom"
                            :useDefaultContext="false"
                            :useActionPanel="true"
                            :actionPanelWidth="850"
                            :headerPrefixKeypath="'user.table'"
                            :customAPIResult="customAPIResult"
                            :showButtonAdd="false"
                            :showExportButton="false"
                            :showImportButton="false"
                            :showImportHistoryBtn="false"
                            :showActionPanelInDisplayConfig="false"
                            :showPagination="false"
                            :lazyLoad="true"
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
                    @current-tab="changeTab"
                    :currentTab="currentTab"
                    :showMenuPickTab="true"
                    :id="$route.params.id">
                </OrgchartEditor>
            </v-tab-item>

        </v-tabs-items>
        <div class="description-department" v-show="showDescriptionDepartment">
            <Detail :quickView="true" :docObjInfo="docObjDescriptionInfo"  />
        </div>
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
        this.containerHeight = util.getComponentSize(this).h
        this.currentSize =  util.getComponentSize(this)
        $('.item-no-permission').on('click',function(e){
            e.preventDefault()
            e.stopPropagation()
            this.$snotify({
                type: 'error',
                title: "Ban khong co quyen"
            })
        })
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
                if(self.$refs.orgStructureView){
                  self.$refs.orgStructureView.reDrawDiagram();
                }
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
        resizeEnd(params){
            let value = params.width - this.currentWidthContentCustom
            if(value < 0 ){
                this.widthContentCustom = 0
                this.$refs.listUser.refreshList()
            }else{
                this.widthContentCustom = $(window).width() - $(".resizable-component").width()  - 100
            }
            this.currentWidthContentCustom =  params.width 
        },
        changeTab(val){
            this.currentTab = val  
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
        // onCellClick(params){
        //     let self = this
        //     let objId = "orgchart:"+this.$route.params.id+':'+params.data.vizId
        //         orgchartApi.getDescriptionNode({object_identifier:objId}).then(res=>{
        //              if(res.data.length > 0){
        //                 let idDoc = res.data[0].documentObjectId
        //                 self.docObjInfo = {docObjId:idDoc,docSize:'21cm'}
        //                 self.$refs.listUser.actionPanel = true;
        //             }else{
        //                 self.$snotify({
        //                     type: "error",
        //                     title: "Không tìm thấy hồ sơ nhân sự",
        //                 });
        //             }
        //             // self.docObjInfo = {docObjId:objId,docSize:'21cm'}
        //             // self.$refs.listUser.actionPanel = true;
        //         }).catch(err=>{
        //         })
        // },
        onCellContextMenu(params){
             let self = this
             let objId = "orgchart:"+this.$route.params.id+':'+params.data.vizId
                orgchartApi.getDescriptionNode({object_identifier:objId}).then(res=>{
                    if(res.data.length > 0){
                        let idDoc = res.data[0].documentObjectId
                        self.docObjInfo = {docObjId:idDoc,docSize:'21cm'}
                        self.$refs.listUser.actionPanel = true;
                    }else{
                        self.$snotify({
                            type: "error",
                            title: "Không tìm thấy document mô tả ",
                        });
                    }
                }).catch(err=>{
                })
        },
        // onCellMouseOver: _.debounce(function(params){
        //     let self = this
        //     let objId = "orgchart:"+this.$route.params.id+':'+params.data.vizId
        //         orgchartApi.getDescriptionNode({object_identifier:objId}).then(res=>{
        //             self.docObjInfo = {docObjId:objId,docSize:'21cm'}
        //             self.$refs.listUser.actionPanel = true;
        //         }).catch(err=>{
        //         })
        // },500),
        onTabClicked(data){
            this.currentTab = data.action
            this.titleToolbar = data.title
        }
    },
    data(){
        let self = this
        return {
            currentTab: 1,
            showDescriptionDepartment: false,
            agApi:null,
            widthContentCustom:0,
            currentWidthContentCustom:400,
            showToolbar:false,
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
            docObjDescriptionInfo:{docObjId:5100681,docSize:'21cm'},
            apiUrl: '',
            mapNameToDynamicAttr: null,
            titleToolbar:"SĐTC dạng cây",
            mapDpmToPos: null,
            menuPickTab:[
                {
                    icon: "mdi-grid",
                    title:"SĐTC dạng bảng",
                    action:"tableView"
                },
                {
                    icon: "mdi-account-multiple",
                    title:"SĐTC dạng cây",
                    action:"tableSideBySideView"
                },
                {
                    icon: "mdi-share-variant",
                    title:"SĐTC dạng lưu đồ",
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
                       listObject:res.data.listObject,
                       total:res.data.listObject.length,
                         

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
            if(val == 0 ){
                this.showToolbar = true
                if(this.agApi){
                    this.agApi.sizeColumnsToFit()
                }
            }else{
                  this.showToolbar = false
            }
        }
    }
}
</script>

<style scoped>
.description-department{
    position: fixed;
	z-index: 10000;
    width: 200px;
    height: 200px;
	font:13px roboto;
	background-color: #fff;
	-webkit-box-shadow: 2px 0px 24px 0px rgba(0,0,0,0.75);
	-moz-box-shadow: 2px 0px 24px 0px rgba(0,0,0,0.75);
	box-shadow: 2px 0px 24px 0px rgba(0,0,0,0.75);
}
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
}
.orgchart-table-view >>> .row.pb-2{
    margin-top:-12px;
}
.orgchart-table-view >>> .v-toolbar .v-toolbar__title{
    font-size:17px !important;
    font-weight: 500;
}
.orgchart-table-view >>> .v-toolbar .v-toolbar__content{
    height:unset !important;
    padding-top:6px;
}
.orgchart-table-view >>> .v-toolbar .v-toolbar__content button{
}
.orgchart-table-view >>> .v-menu__content .v-list-item .v-list-item__icon{
    min-width: unset;
    width: 15px;
    margin-right:20px !important;
}
</style>


