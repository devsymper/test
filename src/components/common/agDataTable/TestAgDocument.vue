<template>
<div style="width:100%">
    <list-items
        ref="listDocument"
        :customAPIResult="customAPIResult"
        :getDataUrl="sDocumentManagementUrl+'documents'"  
        :useDefaultContext="false"
		:getContextMenuItems="getContextMenuItems"
        :pageTitle="$t('document.title')"
        :containerHeight="containerHeight"
        :actionPanelWidth="actionPanelWidth"
        :showExportButton="false"
        :showImportButton="false"
        @after-open-add-panel="addDocument"
        @close-panel="closePanel"
        :headerPrefixKeypath="'document'"
        :commonActionProps="commonActionProps"
    >
        <div slot="right-panel-content" class="h-100">
            <submit-view 
                v-if="isShowQuickSubmit"
                ref="submitView" 
                :isQickSubmit="true" 
                :action="'submit'" 
                @submit-document-success="aftersubmitDocument" 
                :docId="documentId"/>
        </div> 
    </list-items>
         <ImportExcelPanel
            :options="options"
            :nameRows="listRowDocument"
            :open="showImportPanel" />

</div>
</template>
<script>

import ImportExcelPanel from "@/components/document/ImportExelPanel";
import { documentApi } from "@/api/Document.js";
import ListItems from "@/components/common//agDataTable/ListItems.vue";
import ActionPanel from "@/views/users/ActionPanel.vue";
import ChangePassPanel from "@/views/users/ChangePass.vue";
import Submit from '@/views/document/submit/Submit'
import { util } from "@/plugins/util.js";
import { appConfigs } from '@/configs';
export default {
    components: {
        ImportExcelPanel: ImportExcelPanel,
        "list-items": ListItems,
        "action-panel": ActionPanel,
        'submit-view':Submit
    },
    data(){
		let self = this
        return {
            sDocumentManagementUrl:appConfigs.apiDomain.sdocumentManagement,
            documentId:0,
            options:{
            },
            propertyDocument:[],
            listRowDocument:[],
            commonActionProps: {
                "module": "document",
                "resource": "document_definition",
                "scope": "document",
			},
			getContextMenuItems(params){
				let obj = params.node.data
				var result = [
					{
						name: " <i class= 'mdi mdi-file-document-edit-outline' > </i>&nbsp; Sửa",
						action: function () {
							self.$goToPage('/documents/'+obj.id+'/editor/edit',obj.title);
						},
						cssClasses: ['redFont', 'bold'],
					},
					{
						name: "<i class= 'mdi mdi-file-document-multiple-outline' > </i>&nbsp; Nhân bản",
						action: function () {
							self.$goToPage('/documents/'+obj.id+'/editor/clone',"Nhân bản "+obj.title);
						},
						cssClasses: ['redFont', 'bold'],
					},
					{
						name: "<i class= 'mdi mdi-file-document-outline' > </i>&nbsp; Nhập liệu",
						action: function () {
							self.$goToPage('/documents/'+obj.id+'/submit',obj.title);
						},
						cssClasses: ['redFont', 'bold'],
					},
					{
						name: " <i class= 'mdi mdi-text-box-plus-outline' > </i>&nbsp; Nhập liệu nhanh",
						action: function () {
							self.isShowQuickSubmit = true
							self.$refs.listDocument.openactionPanel();
                        	self.documentId = parseInt(obj.id)
						},
						cssClasses: ['redFont', 'bold'],
					},
					{
						name: "<i class= 'mdi mdi-format-list-checkbox' > </i>&nbsp; Danh sách bản ghi",
						action: function () {
							this.$goToPage('/documents/'+obj.id+'/objects',"Danh sách bản ghi");
							this.$store.commit('document/setCurrentTitle',obj.title)
						},
						cssClasses: ['redFont', 'bold'],
					},
					{
						name: "<i class= 'mdi mdi-playlist-edit' > </i>&nbsp; Danh sách bản nháp",
						action: function () {
							self.$goToPage('/documents/'+obj.id+'/draft-objects',"Danh sách bản nháp");
						},
						cssClasses: ['redFont', 'bold'],
					},
					{
						name: "<i class= 'mdi mdi-printer-3d-nozzle-outline' > </i>&nbsp; Cấu hình in",
						action: function () {
							self.$goToPage('/documents/'+obj.id+'/editor/print-config',obj.title);
						},
						cssClasses: ['redFont', 'bold'],
					},
					{
						name: "<i class= 'mdi mdi-format-list-checkbox' > </i>&nbsp; Danh sách bản in",
						action: function () {
							self.$goToPage('/documents/'+obj.id+'/print-config',"Danh sách bản in");
						},
						cssClasses: ['redFont', 'bold'],
					},
					{
						name: " <i class= 'mdi mdi-delete-outline' > </i>&nbsp; Xóa",
						action: function () {
							documentApi
							.moveToTrash({ids:obj.id})
							.then(res => {
								if (res.status == 200) {
									self.$snotify({
										type: "success",
										title: "Delete document success!"
									});  
									self.$refs.listDocument.refreshList();
								}
								else{
									self.$snotify({
										type: "error",
										title: res.messagr
									});  
								}
							})
							.catch(err => {
								console.log("error from delete document api!!!", err);
							})
							.finally(() => {});
							},
						cssClasses: ['redFont', 'bold'],
					},
					{
						name: " <i class= 'mdi mdi-file-upload-outline' > </i>&nbsp; Lấy mẫu Import Excel",
						action: function () {
							self.documentId = Number(obj.id);
							let exportUrl = self.sDocumentManagementUrl+'documents/'+self.documentId+'/export-excel?isTemplate="1"'
							if(!exportUrl){
								if(self.getDataUrl[self.getDataUrl.length - 1] == '/'){
									exportUrl = self.getDataUrl+'export';
								}else{
									exportUrl = self.getDataUrl+'/export';
								}
							}
							window.open(exportUrl,'_blank');
						},	
						cssClasses: ['redFont', 'bold'],
					},
					{
						name: " <i class= 'mdi mdi-file-upload-outline' > </i>&nbsp; Import Excel",
						action: function () {
                       		 self.showImportPanel = !self.showImportPanel; 
                       		 self.documentId = Number(obj.id);
						},	
						cssClasses: ['redFont', 'bold'],
					},
				];
				return result;
			},
            showImportPanel:false,
            actionPanelWidth:830,
            containerHeight: 200,
            isShowQuickSubmit:false,
            tableContextMenu:{
               
                templateExcel:{
                    name: "templateExcel",
                    text: function() {
                        return " <i class= 'mdi mdi-file-upload-outline' > </i>&nbsp; Lấy mẫu Import Excel";
                    },
                    callback: (document, callback) => {
                        this.documentId = Number(document.id);
                        let exportUrl = this.sDocumentManagementUrl+'documents/'+this.documentId+'/export-excel?isTemplate="1"'
                        if(!exportUrl){
                            if(this.getDataUrl[this.getDataUrl.length - 1] == '/'){
                                exportUrl = this.getDataUrl+'export';
                            }else{
                                exportUrl = this.getDataUrl+'/export';
                            }
                        }
                        window.open(exportUrl,'_blank');
                    },
                },
                importExcel:{
                    name: "importExcel",
                    text: function() {
                        return " <i class= 'mdi mdi-file-upload-outline' > </i>&nbsp; Import Excel";
                    },
                    callback: (document, callback) => {
                        const self = this;
                        self.showImportPanel = !self.showImportPanel; 
                        self.documentId = Number(document.id);
                    },
                },
            },
            customAPIResult:{
                 reformatData(data){
                    return data.data
                 }
            }
        }
    },
    mounted() {
        this.calcContainerHeight();
    },
    created(){
        let thisCpn = this;
        this.$evtBus.$on('change-user-locale',(locale)=>{
            thisCpn.tableContextMenu = [
                {name:"passwordsetting",text:this.$t('user.table.contextMenu.passwordSetting')},
                {name:"edit",text:this.$t('user.table.contextMenu.edit')}
            ]
        });
    },
    watch:{
        documentId(){
            this.getApiDocument();
        }
    },
    methods:{
        closePanel(){
            this.isShowQuickSubmit = false;
        },
        getApiDocument(){
            const self = this;
            documentApi.detailDocument(this.documentId)
            .then(res => {
                if (res.status === 200) {
                   self.options.objId =self.documentId;
                   self.options.objType = 'document';
                   self.options.subObjType = res.data.document.type;
                  
                   self.options.nameObj = res.data.document.title;
                   self.propertyDocument = Object.values(res.data.fields);
                    let tableNames = [];
                    let tableTitle = [];
                    for (let i = 0; i < self.propertyDocument.length; i++) {
                        if (this.propertyDocument[i].type === 'table') {
                            tableNames.push(self.propertyDocument[i].properties.name);
                            tableTitle.push(self.propertyDocument[i].properties.title);
                        };
                    };
                       self.createTable(tableNames, tableTitle);
                }
            })
            .catch(err => {
               // console.log(err)
            })
        },
        getDataType(controlType) {
            let typeMap = {
                number: 'number',
                month: 'number',
                percent: 'number',
                date: 'date',
                time: 'time',
                datetime: 'datetime',
                table: 'table'
            }
            if (typeMap[controlType]) {
                return typeMap[controlType];
            } else {
                return 'text';
            }
        },
        createTable(tableNames,tableTitle) {
            // general
            let controls = [];
            for (let i = 0; i < this.propertyDocument.length; i++) {
                if(['submit','approvalHistory','reset','draft'].includes(this.propertyDocument[i].type)){
                    continue
                }
                controls.push({
                    name: this.propertyDocument[i].properties.name,
                    title: this.propertyDocument[i].properties.title,
                    isKeyControl: false,
                    isNull:this.checkIsRequired(this.propertyDocument[i].properties.isRequired),
                    dataColumn: null,
                    dataType: this.getDataType(this.propertyDocument[i].type)
                });
             
            };
            let tables = [{
                sheetMap: '',
                name: 'Thông tin chung',
                title: 'Thông tin chung',
                controls,
            }]
            // tables
            for (let i = 0; i < tableNames.length; i++) {
                tables.push({
                    sheetMap: '',
                    title:tableTitle[i],
                    keyColumn: {
                        index: -1,
                        name: ''
                    },
                    name: tableNames[i],
                    controls: this.findControlsForTable(tableNames[i]),
                 })
            }
            this.listRowDocument = tables;
        },
        checkIsRequired(isRequired){
            if(isRequired==0){
                return true
            }else{
                return false
            }
        },
         findControlsForTable(nameTable) {
            let controls = [];
            let property = this.propertyDocument.filter(p => p.listFields && p.properties.name == nameTable);
            for (let i = 0; i < property.length; i++) {
                let list = Object.values(property[i].listFields);
                for (let j = 0; j < list.length; j++) {
                    controls.push({
                        name: list[j].properties.name,
                        title:list[j].properties.title,
                        isKeyControl: false,
                        isNull:this.checkIsRequired(list[j].properties.isRequired),
                        dataColumn: null,
                        dataType: this.getDataType(list[j].type)
                    });
                }
            }
            return controls;
        },
        addDocument(){
            this.$router.push('/document/editor');
        },
     
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        },
        aftersubmitDocument(){
            this.$refs.listDocument.closeactionPanel();
        }
    }
}
</script>

