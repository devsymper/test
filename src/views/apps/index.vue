<template>
    <div class="h-100 w-100">
        <ListItems
            ref="listApp"
            :getDataUrl="apiUrl"
            :headerPrefixKeypath="'apps.header'"
            :pageTitle="$t('apps.titleApplication')"
            :containerHeight="tableHeight"
            :tableContextMenu="tableContextMenu"
            :useDefaultContext="false"
            :actionPanelWidth="600" 
            @after-open-add-panel="showAddModal"
            :customAPIResult="customAPIResult"
            :showActionPanelInDisplayConfig="true"
            :commonActionProps="commonActionProps"
			:customRenderForFilter="customRenderForFilter"
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
import ListItems from "@/components/common/ListItems";
import UpdateApp from "./Update";
import {appManagementApi} from '@/api/AppManagement.js'
import {orgchartApi} from '@/api/orgchart';
import {documentApi} from '@/api/Document';
import {dashboardApi} from '@/api/dashboard';
import BpmnEngine from '@/api/BPMNEngine';
import Handsontable from 'handsontable';
import ApplicationWorker from 'worker-loader!@/worker/application/Application.Worker.js';
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
    created(){
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
			customRenderForFilter(columnName,items){
				if(columnName == 'status'){
					items.forEach(function(e){
						if(e.value == "0"){
							e.label = "Không kích hoạt"
						}else{
							e.label = "Kích hoạt"
						}
					})
				}
				return items
			},
            apiUrl: appConfigs.apiDomain.appManagement+"application",
			isEdit: false,
			applicationWorker: null,
            customAPIResult: {
                reformatData(res){
                   return{
						 listObject: res.data.listObject,
						 total: res.data.listObject.length,
                         columns: [
                                {name: "id", title: "id", 	type: "text", },
                                {name: "name", title: "name", type: "text", flex:1},
                                {name: "iconName", title: "icon", type: "text",flex:1,
                                     cellRenderer: function(params) {
										return params.value.includes('mdi-') ? '<span class="mdi '+params.value+'"></span>' : '<img src="'+ params.value +'" alt="Girl in a jacket" width="20px" height="20px">'
									}
								},
								{name: "status", title: "status", type: "text",flex:1,
									cellRenderer: function(params) {
										return params.value == "1" ? '<span>Kích hoạt</span>' : '<span>Không kích hoạt</span>'
									}
								},
								{name: "createdAt", title: "created_at", type: "text",flex:1,
									cellRenderer: function(params) {
										let newValue = params.value.slice(0, params.value.length - 3)
										return  '<span>'+ newValue +'</span>'
									}
								},
								{name: "updatedAt", title: "updated_at", type: "text",flex:1, 
									cellRenderer: function(params) {
										let newValue = params.value.slice(0, params.value.length - 3)
										return  '<span>'+ newValue +'</span>'
									}
								},
                         ],
                   }
                }
            },
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
		let self = this
		this.applicationWorker = new ApplicationWorker();
        this.applicationWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'deleteApp':
					self.handlerDeleteAppMessage(data.dataAfter)
					break;
                case 'getChildItemInApp':
					for(let i in data.dataAfter){
						let newObj = {
							obj:data.dataAfter[i],
							type: i
						}
						self.$store.commit('appConfig/updateChildrenApps',newObj);
					}
					break;
                default:
                    break;
            }
        });
    },
    methods: {
		handlerDeleteAppMessage(res){
			if (res.status == 200) {
				this.removeCallback(res);   
				this.$snotify({
					type: 'success',
					title: this.$t('notification.successTitle'),
					text: this.$t('apps.deleted')
				})
			} else {
				this.showError()
			}
		},
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
			if(this.$refs.listApp.alwaysShowActionPanel){
				this.$refs.listApp.openactionPanel();
				this.openUpdateApp(row);
            }
		},
        showEditAppPanel(app) {
            this.isEdit = true;
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
			this.applicationWorker.postMessage({
				action: 'deleteApp',
				data:{
					id: app[0].id
				}
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
			for(let i in data){
				data[i].forEach(function(e){
					self.arrType[i].push(e.id)
				})
			}
			this.applicationWorker.postMessage({
				action: 'getChildItemInApp',
				data:{
					data: self.arrType
				}
			});
			for(let i in self.arrType){
				self.arrType[i] = []
			}
		}
    },
};
</script>