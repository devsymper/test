<template>
    <v-row>
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
                 <v-card-text v-if="showError"  class="pt-6" style="height:40px">
                <v-icon style="color:red" class="mdi-alert-circle"></v-icon> Lỗi
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        text
                        @click="dialog = false, showError=false">
                        Thoát
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-col class="col-md-7">
            <ImportFile 
                :documentId="documentId"
                 @stopSetInterval ="setInterval=false"
                :deleteFileName="deleteFileName" 
                @setInterval='setInterval=true' 
                @cancel="cancel()"
                @closeValidate="showValidate=false"
                @import="importFile=i++"
                @fileName="setFileName" 
                @showValidate="showValidate=true"/>
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
        }
    },
    props: {
        documentId: {
            default: 0
        },
        drawerImportExelPanel: {
            default: false
        },
    },
    methods: {
        showError(){
            this.error =true;
            this.dialogError = true; 
        },
        cancel(){
            this.$emit('cancel');
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
        showValidate(){
             this.$emit('showValidate',this.showValidate);
        },
        drawerImportExelPanel(val) {
            if (val) {
                this.$store.commit('importExcel/setNewImport', false);
            } else {
                this.$store.commit('importExcel/setNewImport', true);
                this.fileName = '';
            }
            this.showValidate = false;
        }
    }
}
</script>
