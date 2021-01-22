<template>
    <div style="width:100%">
        <list-items
            ref="listDocument"
            :customAPIResult="customAPIResult"
            :getDataUrl="sDocumentManagementUrl+'documents'"  
            :useDefaultContext="false"
            :tableContextMenu="tableContextMenu"
            :pageTitle="$t('document.title')"
            :containerHeight="containerHeight"
            :actionPanelWidth="actionPanelWidth"
            :showExportButton="false"
            :showImportButton="false"
            @get-list-id="getListId"
            @cell-mouse-over="getRowSelected"
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
                
                <div v-if="isDocumentIndex" class="h-100">
                    <div class="header-panel">
                        Lựa chọn cột muốn đánh chỉ mục
                    </div>
                        <VuePerfectScrollbar class="listControl">
                            <v-expansion-panels
                                multiple
                                >
                                <v-expansion-panel class="m-0" v-for="(doc,index) in listControlInDoc" :key="index">
                                    <v-expansion-panel-header class="v-expand-header">
                                        <div class="d-flex">
                                            <div>
                                                {{doc.name + ' - ' + doc.title}}
                                            </div>
                                        </div>

                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content class="sym-v-expand-content">
                                        <table class="w-100">
                                            <tr style="text-align: left;background: #f2f2f2;">
                                                <th style="padding: 8px;width: 200px;">Index 
                                                    <v-btn height="20" width="20" min-width="25" depressed @click="onCreateIndexClick(doc)">
                                                        <v-icon size="16">mdi-plus</v-icon>
                                                    </v-btn>
                                                </th>
                                                <th style="padding: 8px;">Danh sách cột</th>
                                            </tr>
                                            <tr>
                                                <td style="display: flex;flex-flow: column;">
                                                    <div v-for="(index,i) in doc.indexs" 
                                                    :key="i" 
                                                    class="index-item" 
                                                    :style="{background:(index.active) ? '#f2f2f2' : ''}"
                                                    @click="onIndexItemClick(doc,index)">
                                                        <span>{{index.name}}</span>
                                                        <v-icon size="16" @click="onRemoveIndex(doc.indexs,i,index)">mdi-trash-can-outline</v-icon>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="control" v-for="control in doc.control" :key="control.name" @click="onClickControl(doc,control)">
                                                        <div>
                                                            {{control.name}} - {{control.title}}                            
                                                        </div>
                                                        <v-icon v-if="control.checked" size="16" color="green">mdi-check-bold</v-icon>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                                
                            </v-expansion-panels>
                            </VuePerfectScrollbar>
                    <div class="footer-action">
                        <v-btn depressed @click="onSaveIndex">
                            Lưu
                        </v-btn>
                    </div>
                </div>
                <div v-if="showTaskDetail">
                    <TaskDetail
                        :taskInfo="data.taskInfo"
                        :originData="data.originData"
                        :parentHeight="taskDetailHeight" 
                        :allVariableProcess="variableProcess"
                        @task-submited="handleTaskSubmited"
                        />
                </div>
            </div> 
        </list-items>
            <ImportExcelPanel
                :options="options"
                :nameRows="listRowDocument"
                :open="showImportPanel" />
    </div>
</template>
<script>
import { runProcessDefinition,extractTaskInfoFromObject,addMoreInfoToTask} from '../../components/process/processAction';
import { getLastestDefinition } from "./../../components/process/processAction.js";
import { formulasApi } from '../../api/Formulas';
import BPMNEApi from "./../../api/BPMNEngine";
import { taskApi } from "./../..//api/task.js";
import ImportExcelPanel from "./../../components/document/ImportExelPanel";
import { documentApi } from "./../../api/Document.js";
import bpmnApi from "./../../api/BPMNEngine.js";
import ListItems from "./../../components/common/ListItems.vue";
import ActionPanel from "./../../views/users/ActionPanel.vue";
import ChangePassPanel from "./../../views/users/ChangePass.vue";
import Submit from './submit/Submit'
import { util } from "./../../plugins/util.js";
import { appConfigs } from '../../configs';
import TaskDetail from "./../../components/myItem/TaskDetail";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
export default {
    components: {
        ImportExcelPanel: ImportExcelPanel,
        "list-items": ListItems,
        "action-panel": ActionPanel,
        'submit-view':Submit,
        VuePerfectScrollbar,
        TaskDetail
    },
    data(){
        return {
            listWorkflows:[],
            listId:[],
            listProcess:[],
            startProcess:{
                name: "startProcess",
                subMenu:[],
                text: "<i class= 'mdi mdi-bike-fast' > </i>&nbsp; Bắt đầu nhanh quy trình",
            },
            paramId:'',
            data: {
                taskInfo: {},
                originData: {}
            },
            taskDetailHeight: 800,
            sDocumentManagementUrl:appConfigs.apiDomain.sdocumentManagement,
            documentId:0,
            listWorkFollow:[],
            rowActive:null,
            showTaskDetail:false,
             variableProcess:[],
            filterVariables:{
                names:"symper_application_id",
                page:1,
                processInstanceIds:[]
            },
            options:{
            },
            proccessRow:{},
            isDocumentIndex:false,
            allIndexSelected:[],
            listControlInDoc:{},
            propertyDocument:[],
            listRowDocument:[],
            commonActionProps: {
                "module": "document",
                "resource": "document_definition",
                "scope": "document",
            },
            showImportPanel:false,
            actionPanelWidth:830,
            containerHeight: 200,
            isShowQuickSubmit:false,
            tableContextMenu:{
                edit: {
                    name: "editdoc",
                    text:  "<i class= 'mdi mdi-file-document-edit-outline' > </i>&nbsp; Sửa",
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/editor/edit',document.title);
                    },
                },
               
                clone: {
                    name: "cloneDoc",
                    text: " <i class= 'mdi mdi-file-document-multiple-outline' > </i>&nbsp; Nhân bản",
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/editor/clone',"Nhân bản "+document.title);
                    },
                },
                submit: {
                    name: "submit",
                    text:  " <i class= 'mdi mdi-file-document-outline' > </i>&nbsp; Nhập liệu",
                    callback: (document, callback) => {
                        const self = this;
                             self.$goToPage('/documents/'+document.id+'/submit',document.title);
                        // }else{
                        //     self.$snotify({
                        //         type: "error",
                        //         title: "Không cho phép nhập liệu"
                        //     })
                        // }
                       
                    },
                },
                quick_submit :{
                    name: "quickSubmit",
                    text:  "<i class= 'mdi mdi-text-box-plus-outline' > </i>&nbsp; Nhập liệu nhanh",
                    callback: (document, callback) => {
                        this.isShowQuickSubmit = true
                        this.$refs.listDocument.openactionPanel();
                        this.documentId = parseInt(document.id)
                    },
                },
                list: {
                    name: "listObject",
                    text:" <i class= 'mdi mdi-format-list-checkbox' > </i>&nbsp; Danh sách bản ghi",
                    callback: (document, callback) => {
						this.$goToPage('/documents/'+document.id+'/objects',"Danh sách bản ghi");
						this.$store.commit('document/setCurrentTitle',document.title)
                    },
                },
                list_draft: {
                    name: "listDraftObject",
                    text: " <i class= 'mdi mdi-playlist-edit' > </i>&nbsp; Danh sách bản nháp",
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/draft-objects',"Danh sách bản nháp");
                    },
                },
                 print_config: {
                    name: "printConfig",
                    text:  " <i class= 'mdi mdi-printer-3d-nozzle-outline' > </i>&nbsp; Cấu hình in",
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/editor/print-config',document.title);
                    },
                },
                list_print_config: {
                    name: "listPrintConfig",
                    text:" <i class= 'mdi mdi-format-list-checkbox' > </i>&nbsp; Danh sách bản in",
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/print-config',"Danh sách bản in");
                    },
                },
                // drop: {
                //     name:"delete",
                //     text:function() {
                //         return " <i class= 'mdi mdi-delete-outline' > </i>&nbsp; Xóa";
                //     },
                //     callback: (document, callback) => {
                //         let ids = document.reduce((arr,obj)=>{
                //             arr.push(obj.id);
                //             return arr;
                //         },[]);
                //         let thisCpn = this;
                //         documentApi
                //         .deleteDocument({ids:ids.join()})
                //         .then(res => {
                //             if (res.status == 200) {
                //                 thisCpn.$snotify({
                //                     type: "success",
                //                     title: "Delete document success!"
                //                 });  
                //                 thisCpn.$refs.listDocument.refreshList();
                //             }
                //             else{
                //                 thisCpn.$snotify({
                //                     type: "error",
                //                     title: res.messagr
                //                 });  
                //             }
                //         })
                //         .catch(err => {
                //             console.log("error from delete document api!!!", err);
                //         })
                //         .finally(() => {});
                //     },
                // },
                trash:{
					name:"remove",
					text:" <i class= 'mdi mdi-delete-outline' > </i>&nbsp; Xóa",
                    callback: (document, callback) => {
                        let ids = document.reduce((arr,obj)=>{
                            arr.push(obj.id);
                            return arr;
                        },[]);
                        let thisCpn = this;
                        documentApi
                        .moveToTrash({ids:ids.join()})
                        .then(res => {
                            if (res.status == 200) {
                                thisCpn.$snotify({
                                    type: "success",
                                    title: "Delete document success!"
                                });  
                                thisCpn.$refs.listDocument.refreshList();
                            }
                            else{
                                thisCpn.$snotify({
                                    type: "error",
                                    title: res.message
                                });  
                            }
                        })
                        .catch(err => {
                            console.log("error from delete document api!!!", err);
                        })
                        .finally(() => {});
                    },
                },
                templateExcel:{
                    name: "templateExcel",
                    text:  " <i class= 'mdi mdi-file-upload-outline' > </i>&nbsp; Lấy mẫu Import Excel",
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
                    text: " <i class= 'mdi mdi-file-upload-outline' > </i>&nbsp; Import Excel",
                    callback: (document, callback) => {
                        const self = this;
                        self.showImportPanel = !self.showImportPanel; 
                        self.documentId = Number(document.id);
                    },
                },
                documentIndex:{
                    name: "documentIndex",
                    text: "<i class= 'mdi mdi-bike-fast' > </i>&nbsp; Tối ưu nhập liệu",
                    callback: (document, callback) => {
                        this.rowActive = document;
                        this.isDocumentIndex = true;
                        this.allIndexSelected = []
                        this.$refs.listDocument.openactionPanel();
                        this.getListControl(document);
                        
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
        this.tableContextMenu.startProcess = this.startProcess;
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
        },
        listId(){
            if(this.listId.length>0){
               this.getAllProcess(this.listId)
            }
        }
    },
    methods:{
        getListId(data){
            this.listId = data;
        },
        // lấy ra tất cả các quy trình liên quan dựa theo id doc
        getAllProcess(data){
            this.listProcess = [];
            let listId = data.join(",");
            const self = this;
            bpmnApi.getProcessByDocId(listId).then(res=>{
                if(res.status==200){
                    Object.keys(res.data).map(idDoc=>{
                        self.listId.map(l=>{
                            if(idDoc==l){
                                this.tableContextMenu.startProcess = this.startProcess;
                                self.listProcess.push({
                                    id:idDoc,
                                    listProcess:res.data[idDoc]
                                })
                            }
                        })
                    })
                }
            })
        },
         handleTaskSubmited(){
            this.$store.commit("task/setIsStatusSubmit",true);
         },
         getRowSelected(param){
            this.getListWorkFollowName(param.data.id);
         },
         async setTaskInfo(taskId){
            if(taskId){
                let filter={};
                filter.taskId = taskId;
                let res = await BPMNEApi.postTaskHistory(filter);
                if (res.total>0) {
                    let task=res.data[0];
                    let taskInfo = extractTaskInfoFromObject(task);
                    task = addMoreInfoToTask(task);
                    this.$set(this.data, 'taskInfo', taskInfo);
                    this.$set(this.data, 'originData', task);
                    if (task.processInstanceId && task.processInstanceId!=null) {
                        await this.getVariablesProcess(task.processInstanceId)
                    }
                }
            }
        },
        async getVariablesProcess(processInstanceId){
            let arrProcess=[];
            arrProcess.push(processInstanceId);
            this.filterVariables.processInstanceIds = JSON.stringify(arrProcess);
            let resVariable = {};
            resVariable = await taskApi.getVariableWorkflow(this.filterVariables);
            this.variableProcess = resVariable.data;
             this.$snotifySuccess("Khởi tạo quy trình  thành công!");

        },
          async getInstanceName(dataInput, definitionModel){
            let self = this;
            return new Promise((resolve, reject) => {
                let dataObjs = definitionModel.processes[0].dataObjects;
                let dataObjsMap = {};
                for(let obj of dataObjs){
                    let objKey = obj.id.replace(definitionModel.mainProcess.id+'_','');
                    dataObjsMap[objKey] = obj;
                }
                let formula = dataObjsMap.instanceDisplayText ? dataObjsMap.instanceDisplayText.value : '';
                if(!formula || String(formula).trim() == ''){
                    resolve('');
                }else{
                    if(dataObjsMap.instanceDisplayText){
                        formulasApi.getDataByAllScriptType(
                            dataObjsMap.instanceDisplayText.value, 
                            JSON.stringify(dataInput)
                        ).then((formulaData) => {
                            resolve(formulaData);
                        }).catch(err=>{
                            reject(err);
                        });                    
                    }else{
                        resolve('');
                    }
                }

            })
        },
         getStartDocId(definitionModel){
            return Number(definitionModel.mainProcess.initialFlowElement.formKey);
        },
        async getFirstNodeData(paramId){
            let self=this;
            let idDefinition = paramId;
            self.paramId = paramId;
            let definitionModel = await BPMNEApi.getDefinitionModel(idDefinition);
            let documentToStart = this.getStartDocId(definitionModel);
            if(documentToStart && documentToStart != 'null' ){
                this.taskInfo.action.parameter.documentId = documentToStart;
            }else{
                let processDef = await BPMNEApi.getDefinitionData(idDefinition);
                try {
                    let instanceName = await self.getInstanceName([],definitionModel);
                    let newProcessInstance = await runProcessDefinition(this, processDef, [], instanceName);
                    await self.checkAndGotoMyTask(newProcessInstance);
                    this.showTaskDetail = true;
                } catch (error) {
                    this.$snotifyError(error);
                }
            }
        },
        async checkAndGotoMyTask(newProcessInstance){
            let filter={};
            let arrTask = [];
            filter.processInstanceId = newProcessInstance.id;
            let dataTaskNew = await BPMNEApi.getTask(filter); // lấy task theo quy trình hiện tại
            if (dataTaskNew.total>0) {
                arrTask = dataTaskNew.data;
            }else { // lấy task theo quy trình con 
                let childProcessInstances = await BPMNEApi.getProcessInstance({
                    superProcessInstanceId: newProcessInstance.id
                });
                if(childProcessInstances.data.length > 0){
                    let myTasks = [];
                    for(let instance of childProcessInstances.data){
                        myTasks.push(
                            BPMNEApi.getTask({
                                processInstanceId: instance.id,
                            })
                        ); 
                    }
                    myTasks = await Promise.all(myTasks);
                    for(let res of myTasks){
                        arrTask = arrTask.concat(res.data);
                    }
                }
            }
            for(let task of arrTask){
                let assignee=task.assignee;
                if (assignee && assignee.indexOf(":")>0) {
                    assignee=assignee.split(":")[0];
                }
                if (assignee == this.$store.state.app.endUserInfo.id) {
                    this.setTaskInfo(task.id);
                }
            }
            
        },
        getListWorkFollowName(docId){
            this.tableContextMenu.startProcess={};
            const self = this;
            this.listProcess.map(process=>{
               if(process.id==docId){
                   this.tableContextMenu.startProcess=this.startProcess;
                   this.tableContextMenu.startProcess.subMenu=[];
                   process.listProcess.map(p=>{
                        let row = p;
                        self.proccessRow = p;
                        self.tableContextMenu.startProcess.subMenu.push({
                            name:p.name,
                            action: async function (row, action){
                                let defData = await getLastestDefinition(self.proccessRow, true);
                                if(defData.data[0]){
                                    self.$refs.listDocument.openactionPanel();
                                    self.paramId = defData.data[0].id;
                                    self.getFirstNodeData(defData.data[0].id)
                                }else {
                                    self.$snotifyError({},"Can not find process definition having deployment id "+deploymentId);
                                }
                            }
                    })
                   
                })
               }
           })
        },
        onRemoveIndex(indexs, i, index){
            indexs.splice(i,1);
            if(index.uid){
                let indexRemove = [];
                indexRemove.push({parent:index.parent, name:index.name});
                documentApi.deleteIndex(index.uid, {indexs:JSON.stringify(indexRemove)}).then(res=>{
                })
            }
            
        },
        onIndexItemClick(doc,index){
            this.$set(doc,'indexActive',index);
            for (let index = 0; index < doc.indexs.length; index++) {
                if(doc.indexs[index].active){
                    doc.indexs[index].active = false;
                }
            }
            let columnActive = index.column;
            for (let index = 0; index < doc.control.length; index++) {
                if(columnActive.includes(doc.control[index].name)){
                    this.$set(doc.control[index],'checked',true)
                }
                else{
                    this.$set(doc.control[index],'checked',false)
                }
            }
            this.$set(index,'active',true)
        },
        onCreateIndexClick(doc){
            doc.indexs.push({
                name:'new_index_'+ eval(doc.indexs.length + 1),
                parent:doc.key,
                column:[]
            });
        },
        getListControl(document){
            let self = this;
            documentApi.getFieldStruct(document.id).then(res=>{
                if(res.status == 200){
                    console.log(res);
                    self.listControlInDoc = res.data;
                }
            });
        },
      
        onSaveIndex(){
            for(let key in this.listControlInDoc){
                let document = this.listControlInDoc[key];
                if(document.indexs.length == 0){
                    continue;
                }
                for (let i = 0; i < document.indexs.length; i++) {
                    const index = document.indexs[i];
                    if(index.hasChange && index.column.length > 0){
                        this.allIndexSelected.push(index);
                    }
                }
            }
            if(this.allIndexSelected.length == 0){
                return;
            }
            let self = this;
            let dataPost = {documentName:this.rowActive.name,indexs:JSON.stringify(this.allIndexSelected)}
            documentApi.saveColumnIndex(dataPost).then(res=>{
                if(res.status == 200){
                    self.$refs.listDocument.closeactionPanel();
                    self.$snotify({
                                type: "success",
                                title: "Thêm index thành công"
                            })
                }
                else{
                    self.$snotify({
                                type: "error",
                                title: res.message
                            })
                }
            });
        },
        onClickControl(doc,control){
            if(doc.indexActive){
                this.$set(control,'checked',!control.checked );
                if(control.checked){
                    doc.indexActive.column.push(control.name);
                }
                else{
                    doc.indexActive.column.splice(doc.indexActive.column.indexOf(control.name), 1);
                }
                this.$set(doc.indexActive,'hasChange',true );
            }
        },
        closePanel(){
            this.isShowQuickSubmit = false;
            this.isDocumentIndex = false;
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
                    // lưu tên của các property từ API document vào mảng  
                    let tableNames = [];
                    let tableTitle = [];
                    for (let i = 0; i < self.propertyDocument.length; i++) {
                        if (this.propertyDocument[i].type === 'table') {
                            tableNames.push(self.propertyDocument[i].properties.name);
                            tableTitle.push(self.propertyDocument[i].properties.title);
                        };
                    };
                    // khởi tạo mảng lưu các giá trị của table document
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
            this.$goToPage('/document/editor/'+Date.now(),"Danh sách bản in");
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

<style scoped>
    .control{
        display: flex;
        height: 25px;
        padding: 5px 4px;
        cursor: pointer;
        transition: background ease-in-out 200ms;
    }
    .control:hover{
        background: var(--symper-background-hover);
    }
    .control >>> .v-icon{
        margin-left: auto;
    }
    .listControl{
        height: calc(100% - 80px);
    }
    .footer-action{
        text-align: right;
    }
    .header-panel{
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 8px;
        border-bottom: var(--symper-border);
    }
    .index-name{
        height: 25px;
        width: 150px;
        background: var(--symper-background-default);
        border-radius: 4px;
        margin-left: 4px;
        padding: 0 8px;
    }
    .index-name:hover{
        outline: none;
    }
    ::v-deep .v-expand-header{
        padding: 12px 4px;
    }
    table {
        border-collapse: collapse;
        width: 100%;
    }

   ::v-deep .v-expansion-panel-content__wrap{
       padding: 0 !important;
   }
   .index-item{
        padding: 8px;
        margin: 1px 0;
        display: flex;
        cursor: pointer;
        transition: background ease-in-out 200ms;
   }
   .index-item:hover{
        background: var(--symper-background-hover);
   }
   .index-item >>> .v-icon{
       margin-left: auto;
   }
</style>

