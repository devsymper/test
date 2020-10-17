<template>
	<div class=" ml-4 mr-3 mt-3">
        <div class="mb-1"><span class="ml-3 mt-3 fs-15" style="font-weight:430px">
             Import: 
            <span style="color:orange" v-if="importInfo.status=='Chưa import'">
                 {{importInfo.status}}
            </span>
             <span style="color:blue" v-if="importInfo.status=='Đang xử lý'">
                 {{importInfo.status}} 
            </span>
             <span style="color:green" v-if="importInfo.status=='Hoàn thành'">
                 {{importInfo.status}}
            </span>
             <span style="color:red" v-if="importInfo.status=='Lỗi'">
                {{importInfo.status}}
            </span>
    
         
         </span></div>
        <div class="mb-1">
            <span class="ml-3 mt-3 fs-13">Tên đối tượng: </span>
            <span class="ml-3 mt-3 fs-13"  style="color:grey">{{importInfo.objId}} </span>
        </div>
          <div class="mb-1">
            <span class="ml-3 mt-3 fs-13">Nội dung: </span>
            <span class="ml-3 mt-3 fs-13"  style="color:grey">{{importInfo.nameImport}} </span>
        </div>
             <div>
            <span class="ml-3 mt-3 fs-13">Ghi chú: </span>
            <span class="ml-3 mt-3 fs-13"  style="color:grey">{{importInfo.description}} </span>
        </div>
        <div class="mb-1">
            <span class="ml-3 mt-3 fs-13">Thông tin chi tiết: </span>
            <span class="ml-3 mt-3 fs-13"  style="color:grey"> {{importInfo.fileName}}</span>
        </div>
        <div class="mb-1">
              <div v-if="importInfo.status=='Đang xử lý'" class="fs-13 ml-3">
                  Dừng import Excel:
           </div>
        </div>
        <div class="mb-1">
              <div v-if="importInfo.status=='Đang xử lý'">
               <v-btn small   color="primary" class="mt-4 ml-3" @click="stopImport()">Stop</v-btn>
           </div>
        <v-data-table 
             v-if="errorImport&&errorImport.validating.errors.length>0"
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
import importApi from "./../../api/ImportExcel";

export default {
	props:['importInfo'],
	computed: {
        sapp() {
            return this.$store.state.app;
        },
        errorImport(){
            return JSON.parse(this.importInfo.infoImport)
        },
        headers () {
            return [
                {
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
         this.getDetailDocument();
     },
     watch:{
         importInfo(){
             this.getDetailDocument();
             this.pushImportDataToTable();
         }
     },
     methods:{
         stopImport(){
             importApi.cancelImport(this.importInfo.fileName)
              .then(res => {
                        if (res.status === 200) {
                        }
                    })
                    .catch(console.log);
         },
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
            this.dataImport = [];
            let dataImport = JSON.parse( this.importInfo.infoImport).validating?JSON.parse( this.importInfo.infoImport).validating.errors:'';
            let dem = 0;
            for(let i=0; i<dataImport.length; i++){
                for(let j = 0; j<dataImport[i].errors.length; j++){
                    for(let k = 0; k<dataImport[i].errors[j].info.length; k++){
                        this.dataImport.push({
                        stt: dem+1,
                       // value: this.getValue(i),
                        row: dataImport[i].errors[j].info[k].row,
                        sheet: dataImport[i].sheet,
                        status:dataImport[i].errors[j].type,
                        value:dataImport[i].errors[j].info[k].value
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