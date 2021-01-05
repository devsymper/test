<template>
    <div class="h-100 w-100">
        <ListItems
            ref="listApp"
            :getDataUrl="apiUrl"
            :headerPrefixKeypath="'apps.header'"
            :pageTitle="$t('apps.titleApplication')"
            :containerHeight="tableHeight"
            :useDefaultContext="false"
            :actionPanelWidth="600" 
			:getContextMenuItems="getContextMenuItems"
            @after-open-add-panel="showAddModal"
            :customAPIResult="customAPIResult"
            :tableContextMenu="tableContextMenu"
			:rowHeight="50"
            :showActionPanelInDisplayConfig="true"
            :commonActionProps="commonActionProps"
            @row-selected="onRowSelected"
        >
            <div slot="right-panel-content" class="h-100">
                <updateApp
                    ref="actionPanel"
                    :isEdit="isEdit"
                    @add-app="addApp"
                    @update-app="updateApp"
					@close-app-form="closeAppForm"
                ></updateApp>
            </div>
        </ListItems>
    </div>
</template>
<script>
import Api from "@/api/api.js";
import ListItems from "@/components/common/agDataTable/ListItems";
import UpdateApp from "@/views/apps/Update";
import {appManagementApi} from '@/api/AppManagement.js'
import {orgchartApi} from '@/api/orgchart';
import {documentApi} from '@/api/Document';
import {dashboardApi} from '@/api/dashboard';
import BpmnEngine from '@/api/BPMNEngine';
import Handsontable from 'handsontable';
import { util } from '@/plugins/util.js';
import {
    appConfigs
} from "@/configs";

export default {
    name: "listApps",
    components: {
        ListItems,
        UpdateApp,
    },
    computed: {
        baseUrl: function() {
            return this.apiUrl + this.appUrl ;
        }, 
    },
    created(){
		let self = this;
		this.$store.dispatch('actionPack/getAllActionByObjectType')
    },
    data: function() {
		let self = this;
        return {
            commonActionProps: {
                "module": "application",
                "resource": "application_definition",
                "scope": "application",
            },
            apiUrl: appConfigs.apiDomain.appManagement+"application",
            appUrl: "apps",
			isEdit: false,
			tableContextMenu: {
               update: {
                    name: "edit",
                    text: this.$t("apps.contextMenu.edit"),
                    callback: (app, callback) => {
                        this.editCallback = callback;
                        self.openUpdateApp(app);
                    },
                },
                remove: {
                    name: "remove",
                    text: this.$t("apps.contextMenu.remove"),
                    callback: (app, callback) => {
                        this.removeCallback = callback;
                        this.deleteApp(app);
                    },
                },
            }, 
            customAPIResult: {
                reformatData(res){
                   return{
						 listObject: res.data.listObject,
						 total: res.data.listObject.length,
                         columns: [
                                {name: "id", title: "id", type: "text", width: 50 },
                                {name: "name", title: "name", type: "text"},
                                {name: "iconName", title: "icon", type: "text",
                                    cellRenderer: function(params) {
										return params.value.includes('mdi-') ? '<span class="mdi '+params.value+'"></span>' : '<img src="'+ params.value +'" alt="Girl in a jacket" width="50" height="50">'
									}
								},
								{name: "status", title: "status", type: "text",
									 cellRenderer: function(params) {
										return params.value == "1" ? '<span>Kích hoạt</span>' : '<span>Không kích hoạt</span>'
									}
								},
								{name: "createdAt", title: "created_at", type: "text",
									cellRenderer: function(params) {
										let newValue = params.value.slice(0, params.value.length - 3)
										return  '<span>'+ newValue +'</span>'
									}
								},
								{name: "updatedAt", title: "updated_at", type: "text",
									cellRenderer: function(params) {
										let newValue = params.value.slice(0, params.value.length - 3)
										return  '<span>'+ newValue +'</span>'
									}
								},
                         ],
                   }
                }
			},
			getContextMenuItems(params) {
				var result = [
					{
						name: self.$t("apps.contextMenu.edit"),
						action: function () {
							self.openUpdateApp(params.node.data);
						},
						cssClasses: ['redFont', 'bold'],
					},
					{
						name: self.$t("apps.contextMenu.remove"),
						action: function () {
							self.deleteApp(params.node.data);
						},
						cssClasses: ['redFont', 'bold'],
					},
				];
				return result;
			},
			tableHeight: 0,
			arrType:{
				document_definition:[
				],
				orgchart:[
				],
				dashboard:[
				],
				workflow_definition:[
				]
			},
        };
    },
    mounted() {
		this.tableHeight = util.getComponentSize(this).h;
    },
    methods: {
		closeAppForm(){
			this.$refs.listApp.closeactionPanel();
		},
		openUpdateApp(app){
			this.$store.commit('appConfig/emptyItemSelected')
			appManagementApi.getAppDetailBa(app.id).then(res => {
				if (res.status == 200) {
					if(Object.keys(res.data.listObject.childrenApp).length > 0){
						this.checkChildrenApp(res.data.listObject.childrenApp)
					}else{
						this.$store.commit('appConfig/emptyItemSelected')
					}
					this.showEditAppPanel(res.data.listObject)   
				}else {
					this.showError()
				}
			}).catch((err) => {
				this.showError()
			});
		},
		onRowSelected(row){
			this.$refs.listApp.openactionPanel();
			this.openUpdateApp(row);
		},
        showEditAppPanel(app) {
			this.isEdit = true;
			this.$refs.listApp.actionPanel = true
            this.$refs.actionPanel.setAppObject(app);
        },

        showAddModal() {
            this.isEdit = false;
            this.$refs.actionPanel.setAppObject({ 
                name: "",
                status: false
			});
			this.$store.commit('appConfig/emptyItemSelected')
        },
        closeSidebar() {
            this.$refs.listApp.actionPanel = false;
        },
        showError(){
            this.$snotify({
                type: 'error',
                title: this.$t('notification.errorTitle'),
                text: this.$t('notification.error')
            })
        },
        deleteApp(app){
            appManagementApi.deleteApp(app.id)
            .then(res =>{
                if (res.status == 200) {
                    this.$snotify({
                        type: 'success',
                        title: this.$t('notification.successTitle'),
                        text: this.$t('apps.deleted')
					})
					this.$refs.listApp.refreshList()
                } else {
                    this.showError()
                }
            }).catch((err) => {
                this.showError()
            });
        },
        addApp(res) {
            if (res.status == 200) {
                this.$refs.listApp.getData();
                this.closeSidebar();
                this.$snotify({
                    type: 'success',
                    title: this.$t('notification.successTitle'),
                    text: this.$t('apps.added')
                })
            } else {
                this.showError()
            }
        },
        updateApp(res) {
            if (res.status == 200) {
				this.$refs.listApp.refreshList()
                this.closeSidebar();
                this.$snotify({
                    type: 'success',
                    title: this.$t('notification.successTitle'),
                    text: this.$t('apps.updated')
                })
            } else {
                this.showError()
            }
		},
		checkChildrenApp(data){
			let self = this
			if(data.hasOwnProperty('orgchart')){
				data.orgchart.forEach(function(e){
					self.arrType.orgchart.push(e.id)
				});
			}
			if(data.hasOwnProperty('document_definition')){
				data.document_definition.forEach(function(e){
					self.arrType.document_definition.push(e.id)
				});
			}
			if(data.hasOwnProperty('dashboard')){
				data.dashboard.forEach(function(e){
					self.arrType.dashboard.push(e.id)
				});
			}
			if(data.hasOwnProperty('workflow_definition')){
				data.workflow_definition.forEach(function(e){
					self.arrType.workflow_definition.push(e.id)
				});
			}
			if(self.arrType.orgchart.length > 0){
				let dataOrg = self.arrType.orgchart;
				orgchartApi.getOrgchartList({
								search:'',
								pageSize:50,
								filter: [
								{
									column: 'id',
									valueFilter: {
										operation: 'IN',
										values: dataOrg						
									}
								}
				]}).then(resOrg => {
					this.$store.commit('appConfig/updateChildrenApps',{obj:resOrg.data.listObject,type:'orgchart'});
				});
			}
			if(self.arrType.document_definition.length > 0){
						let dataDoc = self.arrType.document_definition;
						documentApi.searchListDocuments(
							{
								search:'',
								pageSize:400,
								filter: [
								{
									column: 'id',
									valueFilter: {
										operation: 'IN',
										values: dataDoc						
									}
								}
								]
							}
						).then(resDoc => {
							let arrCategory = []
							let arrMajor = []
							resDoc.data.listObject.forEach(function(e){
								if(e.type == "Nghiệp vụ"){
									arrMajor.push(e)
								}else if( e.type == "Danh mục"){
									arrCategory.push(e)
								}
							})
							this.$store.commit('appConfig/updateChildrenApps',{obj:arrMajor,type:'document_major'});
							this.$store.commit('appConfig/updateChildrenApps',{obj:arrCategory,type:'document_category'});
						});
			}
			if(self.arrType.workflow_definition.length > 0){
						let dataW = self.arrType.workflow_definition;
						BpmnEngine.getListModels({
										search:'',
										pageSize:50,
										filter: [
										{
											column: 'id',
											valueFilter: {
												operation: 'IN',
												values: dataW						
											}
										}
						]}).then(resW => {
							this.$store.commit('appConfig/updateChildrenApps',{obj:resW.data.listObject,type:'workflow_definition'});
						});
			}
			if(self.arrType.dashboard.length > 0){
				let dataRep = self.arrType.dashboard;
				dashboardApi.getDashboardsApp({
								search:'',
								pageSize:50,
								filter: [
								{
									column: 'id',
									valueFilter: {
										operation: 'IN',
										values: dataRep						
									}
								}
				]}).then(resRp => {
					this.$store.commit('appConfig/updateChildrenApps',{obj:resRp.data.listObject,type:'dashboard'});
				});
			}
			self.arrType.orgchart = []
			self.arrType.document_definition = []
			self.arrType.workflow_definition = []
			self.arrType.dashboard = []
		}
    },
};
</script>