<template>
    <v-navigation-drawer
        v-model="showImportPanel"
        absolute
        class="d-none d-sm-none d-md-flex"
        temporary
        right
        style="height: 100vh"
        v-bind:class="[showValidate==true?'manage-timesheet-1020':'manage-timesheet-620']"  >
        <v-row class="h-100">
            <v-dialog v-model="dialog"
                width="500">
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
                                @click="cancel()">
                                Thoát
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogError"
                width="500">
                    <v-card>
                        <v-card-title style="height:50px; margin-top:-10px" class="headline grey lighten-2">
                            <span class="mb-3">Thông báo</span>
                            </v-card-title>
                        <v-card-text  class="pt-6" style="height:40px">
                        <v-icon style="color:red" class="mdi mdi-alert-circle"></v-icon> {{messageError}}
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="primary"
                                text
                                @click="dialogError = false">
                                Thoát
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            <v-col class="col-md-7">
                <ImportFile 
                    :objId="objId"
                    :subObjType="subObjType"
                    :tables="nameRows"
                    :nameDocument="nameDocument"
                    :objType="objType"
                    @stopSetInterval ="setInterval=false"
                    :deleteFileName="deleteFileName" 
                    @cancel="cancel()"
                    @closeValidate="showValidate=false"
                    @import="importFiles"
                    />
                </v-col>  
            <v-col v-show="showValidate" class="col-md-5">
                <ValidateImport 
                    @deleteFileName="deleteFileName=true"  
                    @cancel="cancel()" 
                    @showNotification="showNotification()"
                    :setInterval="setInterval"
                    :importFile="importFile"
                    @error="showError"
                    :fileName="fileName" />
            </v-col>
        </v-row>
    </v-navigation-drawer>
</template>
<script>
import ValidateImport from "./../importExcel/ValidateImport";
import ImportFile from "./../importExcel/ImportFile";
export default {
    components: {
        ImportFile,
        ValidateImport
    },
    data(){
        return {
            i:0,
            showImportPanel:false,
            dialogError:false,
            showValidate:false,
            dialog:false,
            importFile:false,
            deleteFileName:false,
            setInterval:false,
            drawer: null,
            showImport:true,
            fileName:'',
            error:false,
            messageError:'',
        }
    },
    props: {
        objId: {
            default: 0
        },
        nameRows:{
             default: []
        },
        open: {
            default: false
        },
        objType:{
            default:'document'
        },
        nameDocument:{
            default:''
        },
        subObjType:{
            default:''
        }
    },
    methods: {
        importFiles(data){
            this.importFile=this.i++;
            this.showValidate=true;
            this.setFileName(data.fileName);
            this.setInterval=true;
        },
        showError(data){
            this.error =true;
            this.dialogError = true; 
            this.messageError = data;
        },
        cancel(){
            this.showImportPanel = false;
            this.dialog = false
        },
        showNotification(){
            this.dialog = true;
            let i = 0;
            if(i = 0){
            setTimeout(()=>this.dialog= false, 5000);i++};

        },
        setFileName(data){
            this.fileName = data
        },
    },
    watch: {
        open(val) {
            if (val) {
                this.$store.commit('importExcel/setNewImport', false);
            } else {
                this.$store.commit('importExcel/setNewImport', true);
                this.fileName = '';
            }
            this.showImportPanel = true;
            this.showValidate = false;
        }
    }
}
</script>
<style lang="scss" scoped>
.manage-timesheet-620{
    width: 620px!important;
}
.manage-timesheet-1020{
    width: 1020px!important  ;
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
<style>
.v-list-item__title{
    font-size:13px!important;
}
.v-select__slot{
    padding-left:7px;
    font-size:13px!important;
    font-family: Roboto;
}

</style>
