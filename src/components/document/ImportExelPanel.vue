<template>
    <v-navigation-drawer
        v-model="showImportPanel"
        v-show="showImportPanel"
        absolute
        :class="{
            'navigation': true,
            'd-md-flex': showImportPanel,
            'manage-import-1020': showValidate,
            'manage-import-600': !showValidate,
        }"
        temporary
        right
        style="height: 100vh">
        <v-row class="h-100">
            <v-dialog v-model="dialog"
                width="500">
                    <v-card>
                        <v-card-title  class="card-title headline grey lighten-2">
                            <span class="mb-3">Thông báo</span>
                            </v-card-title>
                            <v-card-text class="pt-6" style="height:40px">
                        <v-icon class="color-green mdi mdi-check"></v-icon> Hoàn thành import
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
                <v-dialog 
                    v-model="dialogError"
                    width="500">
                    <v-card>
                        <v-card-title class=" card-title headline grey lighten-2">
                            <span class="mb-3">Thông báo</span>
                            </v-card-title>
                        <v-card-text  class="pt-6" style="height:40px">
                        <v-icon class="color-red mdi mdi-alert-circle"></v-icon> {{messageError}}
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
                    :options="options"
                    :tables="nameRows"
                    @stopSetInterval="setInterval=false"
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
            showImport:true,
            fileName:'',
            error:false,
            messageError:'',
        }
    },
    props: {
        options: {
            default: {}
        },
        nameRows:{
             default: []
        },
        open: {
            default: false
        },
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
.manage-import-600{
    width: 600px!important;
}
.manage-import-1020{
    width: 1020px!important  ;
}
.manage-import ::v-deep .v-card {
    box-shadow: none !important;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.manage-import ::v-deep .v-window {
    display: flex;
    flex-direction: column;
}

.manage-import ::v-deep .v-window__container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}
.card-title{
    height:50px; 
    margin-top:-10px
}
</style>

