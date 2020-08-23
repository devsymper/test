<template>
    <v-row >
        <v-dialog
        v-model="dialog"
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
                        @click="dialog = false">
                        Thoát
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
            <v-col class="col-md-7">
                <ImportFile 
                    :documentId="documentId"
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
            dialog:false,
            importFile:false,
            deleteFileName:false,
            setInterval:false,
            drawer: null,
            showImport:true,
            fileName:'',
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
        cancel(){
            this.$emit('cancel');
        },
        showNotification(){
            this.dialog = true;
          
            setTimeout(()=>this.dialog= false, 5000);
        },
        setFileName(data){
            this.fileName = data
        },
    },
    watch: {
        drawerImportExelPanel(val) {
            if (val) {
                this.$store.commit('importExcel/setNewImport', false);
            } else {
                this.$store.commit('importExcel/setNewImport', true);
                this.fileName = '';
                this.documentId = 0;
            }
            this.showValidate = false;
        }
    }
}
</script>
<style >

</style>