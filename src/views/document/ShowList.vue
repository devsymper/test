<template>
<div style="width:100%">
    <list-items
        ref="listDocument"
        :getDataUrl="'https://sdocument-management.symper.vn/documents'"   
        :useDefaultContext="false"
        :tableContextMenu="tableContextMenu"
        :pageTitle="$t('document.title')"
        :containerHeight="containerHeight"
        :actionPanelWidth="actionPanelWidth"
        @after-open-add-panel="addDocument"
    >   </list-items>
    <v-navigation-drawer 
        v-model="drawer" 
        absolute
        class="d-none d-sm-none d-md-flex"
        temporary
        style="height: 100vh"
        v-bind:class="[showValidate==true?'manage-timesheet-800':'manage-timesheet-500']" 
        right>
        <v-row >
        <v-dialog
        v-model="dialog"
        width="500"
      >
        <v-card>
          <v-card-title style="height:50px; margin-top:-10px" class="headline grey lighten-2">
            <span class="mb-3">Thông báo</span>
          </v-card-title>
        <v-card-text class="pt-6" style="height:40px">
           <v-icon style="color:green" class="mdi mdi-check"></v-icon> Hoàn thành import
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="dialog = false"
            >
              Thoát
            </v-btn>
          </v-card-actions>
        </v-card>      </v-dialog>

            <v-col class="col-md-7">
                <ImportFile 
                    :documentId="documentId"
                    :deleteFileName="deleteFileName" 
                    @setInterval='setInterval=true' 
                    @cancel="cancel()"
                    @closeValidate="showValidate=false"
                    @import="importFile=i++"
                    @fileName="getFileName" 
                    @showValidate="showValidate=true"/>
            </v-col>  
            <v-col v-show="showValidate" class="col-md-5">
                <ValidateImport 
                    @deleteFileName="deleteFileName=true"  
                    @cancel="cancel()" 
                    @showNotification="showNotification()"
                    :setInterval="setInterval"
                    :importFile="importFile"
                    :fileName="fileName" />
            </v-col>
        </v-row>
    </v-navigation-drawer>

</div>
</template>
<script>
import { documentApi } from "./../../api/Document.js";
import ListItems from "./../../components/common/ListItems.vue";
import ActionPanel from "./../../views/users/ActionPanel.vue";
import ChangePassPanel from "./../../views/users/ChangePass.vue";
import { util } from "./../../plugins/util.js";
import ImportFile from "./../../components/importExcel/ImportFile";
import ValidateImport from "./../../components/importExcel/ValidateImport";

export default {
    components: {
        "list-items": ListItems,
        "action-panel": ActionPanel,
        ImportFile,
        ValidateImport,
    },
    data(){
        return {
            i:0,
            dialog:false,
            documentId:0,
            importFile:false,
            deleteFileName:false,
            setInterval:false,
            drawer: null,
            showValidate:false,
            showImport:true,
            fileName:'',
            actionPanelWidth:800,
            containerHeight: 200,
            tableContextMenu:[
                {name:"delete",text:'Xóa',
                    callback: (document, callback) => {
                        let ids = document.reduce((arr,obj)=>{
                            arr.push(obj.id);
                            return arr;
                        },[]);
                        let thisCpn = this;
                        documentApi
                        .deleteDocument({ids:ids.join()})
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
                                    title: res.messagr
                                });  
                            }
                        })
                        .catch(err => {
                            console.log("error from detail document api!!!", err);
                        })
                        .always(() => {});
                    },
                },
                {
                    name: "editdoc",
                    text: "Sửa",
                    callback: (document, callback) => {
                        this.$goToPage('/document/editor/'+document.id,document.title);
                    },
                },
                {
                    name: "submit",
                    text: "Nhập liệu",
                    callback: (document, callback) => {
                        this.$goToPage('/document/submit/'+document.id,document.title);
                    },
                },
                {
                    name: "listObject",
                    text: "Danh sách bản ghi",
                    callback: (document, callback) => {
                        this.$goToPage('/documents/'+document.id+'/objects',"Danh sách bản ghi");
                    },
                },
                 {
                    name: "importExcel",
                    text: "Import excel",
                    callback: (document, callback) => {
                        this.drawer =! this.drawer; 
                        this.documentId = Number(document.id);
                        console.log( document.id);
                    },
                },
            ],
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
        drawer(val) {
            if (val) {
                this.$store.commit('importExcel/setNewImport', false);
            } else {
                this.$store.commit('importExcel/setNewImport', true);
                this.fileName = '';
                this.documentId = 0;
            }
            this.showValidate = false;
        }
    },
    methods:{
        showNotification(){
            this.dialog = true;
          
            setTimeout(()=>this.dialog= false, 5000);
        },
        cancel(){
            this.drawer = false;
        },
        getFileName(data){
            this.fileName = data
        },
        addDocument(){
            this.$router.push('/document/editor');
        },
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        }
    }
}
</script>
<style lang="scss" scoped>
.manage-timesheet-500{
    width: 500px!important;
}
.manage-timesheet-800{
    width: 800px!important  ;
}
.manage-timesheet ::v-deep .v-card {
    box-shadow: none !important;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.manage-timesheet ::v-deep .v-window {
    display: flex;
    flex-direction: column;
}

.manage-timesheet ::v-deep .v-window__container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}
</style>
<style>
.v-list-item__title{
    font-size:13px!important;
}
.v-select__slot{
    padding-left:7px;
    font-size:13px!important;
    font-family: Roboto;
}
.fw-500 {
    font-weight: 500;
}
.fw-400{
    font-weight: 400;
}

.fw-300 {
    font-weight: 300;
}
.font-normal {
    font-size: 13px!important;
    font-family: Roboto!important;
    font-weight: normal!important;
}
.font{
    font-size: 13px!important;
    font-family: Roboto!important;
}

.color-normal {
    color: #707070
}
</style>