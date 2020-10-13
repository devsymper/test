<template>
	<div class="h-100 ml-4 mr-3 mt-3">
        <div><span class="ml-3 mt-3 fs-15" style="font-weight:430px">Import {{importInfo.status}} </span></div>
        <div>
            <span class="ml-3 mt-3 fs-13">Tên đối tượng: </span>
            <span class="ml-3 mt-3 fs-13"  style="color:grey">{{importInfo.nameImport}} </span>
        </div>
        <div>
            <span class="ml-3 mt-3 fs-13">Thông tin chi tiết: </span>
            <span class="ml-3 mt-3 fs-13"  style="color:grey"> {{importInfo.fileName}}</span>
        </div>
        <div>
        <v-data-table 
             v-if="JSON.parse(importInfo.infoImport).validating.errors.length>0"
            dense
            style="font-size:13px!important"
            :headers="headers"
            :items="dataImport"
            class="import-table"
        >
      </v-data-table>
        </div>
	</div>
</template>
<script>
import {documentApi} from "./../../api/Document";
export default {
	props:['importInfo'],
	computed: {
        sapp() {
            return this.$store.state.app;
        },
        headers () {
            return [{
                text: 'STT',
                align: 'start',
                sortable: false,
                value: 'stt',
                },
                {
                text: 'Dòng',
                value: 'row',
                },
                {
                text: 'Giá trị',
                value: 'value',
                },
                { text: 'Trang', value: 'sheet' },
                { text: 'Trạng thái', value: 'status' },
            ]
        },
  },

	data(){
		return {
            nameDocument:'',
             dataImport: [],
        }
     },
     created(){
         debugger
         this.getDetailDocument();
     },
     watch:{
         importInfo(){
             this.getDetailDocument();
             this.pushImportDataToTable();
         }
     },
     methods:{
         async getDetailDocument(){
            let self = this;
            let id = self.importInfo.id;
            let docInfo = await documentApi.detailDocument(id);
             if(docInfo.status == 200){
                    this.nameDocument = docInfo.name;
                }
        },
        // getValue(index){
        //      for(let i=0; i<dataImport[index].length; i++){

        //      }
        // },
        pushImportDataToTable(){
            debugger
            this.dataImport = [];
            let dataImport = this.importInfo.infoImport?JSON.parse( this.importInfo.infoImport).validating.errors:'';
            let dem = 0;
            for(let i=0; i<dataImport.length; i++){
                for(let j = 0; j<dataImport[i].errors.length; j++){
                    for(let k = 0; k<dataImport[i].errors[j].info.length; k++){
                        this.dataImport.push({
                        stt: dem+1,
                       // value: this.getValue(i),
                        row: dataImport[i].errors[j].info[k].row,
                        sheet: dataImport[i].sheet,
                        value:dataImport[i].errors[j].type,
                        status:dataImport[i].errors[j].info[k].value
                        // status: dataImport[i].status,
                    })
                    dem++;
                    } 
                }
            }

        }
    }
}
</script>
<style>
    .v-data-table{
        font-size:13px!important
    }
</style>