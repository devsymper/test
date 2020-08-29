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
            :commonActionProps="commonActionProps"
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
import Handsontable from 'handsontable';
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
            commonActionProps: {
                "module": "application",
                "resource": "application_definition",
                "scope": "application",
            },
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
										Handsontable.dom.empty(td);
										if(value === null || value == ""){
											return td;
										}
										if(value.includes("mdi-")){
											let icon;
											icon = document.createElement('i');	
											icon.classList.add('mdi');
											icon.classList.add(value);
											$(icon).css('font-size','16px')
											td.appendChild(icon);
                                       		 return td;
										}else{
											let img;
											img = document.createElement('img');
											$(img).attr('src',value)
											$(img).css('width','40px')
											$(img).css('height','40px')
											td.appendChild(img)
											return td;
										}
										
									},
								},
								{name: "status", title: "status", type: "text",
									renderer:  function(instance, td, row, col, prop, value, cellProperties) {
										let icon;
										Handsontable.dom.empty(td);
										if(value === "1"){
											icon = document.createElement('i');
											icon.classList.add('mdi');
											icon.classList.add('mdi-check');
											$(icon).css('color','green')
											$(icon).css('font-size','16px')
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
            tableContextMenu: {
               update: {
                    name: "edit",
                    text: this.$t("apps.contextMenu.edit"),
                    callback: (app, callback) => {
                        this.editCallback = callback;
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
				dasboard:[
				],
				workflow_definition:[
				]
			},
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
        deleteApp(app){
            appManagementApi.deleteApp(app[0].id)
            .then(res =>{
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
			let self = this
			console.log(self.arrType);
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
			if(data.hasOwnProperty('dasboard')){
				data.dasboard.forEach(function(e){
					self.arrType.dasboard.push(e.id)
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
					console.log(resOrg.data.listObject);
					this.$store.commit('appConfig/updateChildrenApps',{obj:resOrg.data.listObject,type:'orgcharts'});
				});
			}
			if(self.arrType.document_definition.length > 0){
						let dataDoc = self.arrType.document_definition;
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
							this.$store.commit('appConfig/updateChildrenApps',{obj:resW.data.listObject,type:'workflows'});
						});
			}
			if(self.arrType.dasboard.length > 0){
				let dataRep = self.arrType.dasboard;
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
			self.arrType.orgchart = []
			self.arrType.document_definition = []
			self.arrType.workflow_definition = []
			self.arrType.dasboard = []
		}
    },
};
</script>