<template>
    <v-container fluid>
        <ListItems
            ref="listApp"
            :getDataUrl="apiUrl"
            :headerPrefixKeypath="'apps.header'"
            :pageTitle="$t('apps.title')"
            :containerHeight="tableHeight"
            :tableContextMenu="tableContextMenu"
            :useDefaultContext="false"
            :actionPanelWidth="600"
            @after-open-add-panel="showAddModal"
            :customAPIResult="customAPIResult"
        >
            <div slot="right-panel-content" class="h-100">
                <updateApp
                    ref="actionPanel"
                    :isEdit="isEdit"
                    @add-app="addApp"
                    @update-app="updateApp"
                ></updateApp>
            </div>
        </ListItems>
    </v-container>
</template>
<script>
import Api from "./../../api/api.js";
import ListItems from "../../components/common/ListItems";
import UpdateApp from "./Update";
import {appManagementApi} from './../../api/AppManagement.js'
import {orgchartApi} from './../../api/orgchart';
import {documentApi} from './../../api/Document';
import {dashboardApi} from './../../api/dashboard';
import BpmnEngine from './../../api/BPMNEngine';
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
        return {
            apiUrl: "https://core.symper.vn/application",
            appUrl: "apps",
            isEdit: false,
            customAPIResult: {
                reformatData(res){
                   return{
                         listObject: res.data.listObject,
                         columns: [
                                {name: "id", title: "id", 	type: "text", },
                                {name: "name", title: "name", type: "text"},
                                {name: "iconName", title: "icon", type: "text",
                                    renderer:  function(instance, td, row, col, prop, value, cellProperties) {
										let icon;
										icon = document.createElement('i');
										icon.classList.add('mdi');
										icon.classList.add(value[0]);
										icon.style.lineHeight = "15px";
										td.appendChild(icon);
                                            return td;
                                        },},
								{name: "status", title: "status", type: "text",
									renderer:  function(instance, td, row, col, prop, value, cellProperties) {
										let icon;
										if(value[0] == 1){
											icon = document.createElement('i');
											icon.classList.add('mdi mdi-check');
										// icon.classList.add(value[0]);
											icon.style.lineHeight = "15px";
											td.appendChild(icon);
											return td;
										}
										},
								},
                                {name: "createdAt", title: "created_at", type: "text"},
                                {name: "updatedAt", title: "updated_at", type: "text"},
                         ],
                   }
                }
            },
            tableContextMenu: [
               {
                    name: "edit",
                    text: this.$t("apps.contextMenu.edit"),
                    callback: (app, callback) => {
                        this.editCallback = callback;
                        appManagementApi.getAppDetails(app.id).then(res => {
                        if (res.status == 200) {
							 this.checkChildrenApp(res.data.listObject.childrenApp)
                             this.showEditAppPanel(res.data.listObject)   
                        }else {
                            this.showError()
                        }
                         }).catch((err) => {
                                this.showError()
                        });
                    },
                },
                {
                    name: "remove",
                    text: this.$t("apps.contextMenu.remove"),
                    callback: (app, callback) => {
                        this.removeCallback = callback;
                        this.deleteApp(app);
                    },
                },
            ],
            tableHeight: 0,
        };
    },
    mounted() {
        this.tableHeight = document.body.clientHeight - 0;
    },
    methods: {
        showEditAppPanel(app) {
            this.isEdit = true;
            this.$refs.actionPanel.setAppObject(app);
        },

        showAddModal() {
            this.isEdit = false;
            this.$refs.actionPanel.setAppObject({ 
                name: "",
                note: "",
                icon: "",
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
        deleteApp(app) {
            appManagementApi.deleteApp(app[0].id)
            .then(res => {
                if (res.status == 200) {
                    // callback here
                    this.removeCallback(res);   
                    this.$snotify({
                        type: 'success',
                        title: this.$t('notification.successTitle'),
                        text: this.$t('apps.deleted')
                    })
                } else {
                    this.showError()
                }
            }).catch((err) => {
                this.showError()
            });
        },
        addApp(res) {
            if (res.status == 200) {
                // callback come here
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
                // callback come here
                this.editCallback({
                    ...res,
                    data: {
                        ...this.currentApp,
                    },
                });
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
			if(data.hasOwnProperty('orgchart')){
						let dataOrg = data.orgchart;
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
							console.log(resOrg.data.listObject);
							this.$store.commit('appConfig/updateChildrenApps',{obj:resOrg.data.listObject,type:'orgcharts'});
						});
			}
			if(data.hasOwnProperty('document')){
						let dataDoc = data.document;
								
						documentApi.searchListDocuments(
							{
								search:'',
								pageSize:50,
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
							this.$store.commit('appConfig/updateChildrenApps',{obj:resDoc.data.listObject,type:'documents'});
							
						});
			}
			if(data.hasOwnProperty('workflow')){
						let dataW = data.workflow;
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
							this.$store.commit('appConfig/updateChildrenApps',{obj:resW.data.listObject,type:'workflows'});
						});
			}
			if(data.hasOwnProperty('report')){
						let dataRep = data.report;
						dashboardApi.getDashboards({
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
							this.$store.commit('appConfig/updateChildrenApps',{obj:resRp.data.listObject,type:'reports'});
						});
			}
		}
      
    },
};
</script>