<template>
    <div class="w-100 upload-panel">
        <v-row class="fs-13 ml-0">
            <v-col cols='3'>
                Tên import
                <span class="color-red">*</span>
            </v-col>
            <v-col cols='8'>
                <v-text-field
                    background-color="#F7F7F7"
                    class="auto-complete ml-3 mt-4 mb-3" 
                    filled
                    flat
                    hide-details
                    v-model="nameImport"
                >                
                </v-text-field>
            </v-col>
        </v-row>
        <v-row style="margin-top:-20px" class="fs-13 ml-0">
            <v-col cols='3'>
                Ghi chú
            </v-col>
            <v-col cols='8'>
                <v-text-field
                    filled
                    background-color="#F7F7F7"
                    class="auto-complete mt-4 ml-3" 
                    flat
                    hide-details
                    v-model="description"
                >                
                </v-text-field>
            </v-col>
        </v-row>
        <v-row class="ml-1 mt-1 mb-4" style="height:32px">
            <v-col class="col-md-4" style="margin-left:-5px; margin-top:-10px">
            <span class="font fs-13"> Chọn kiểu import:</span>
            </v-col>
            <v-col class="col-md-8" style="margin-top:-30px; margin-left:-37px">
                <v-select 
                    class="select-type ml-3 pr-3 w-100" 
                    v-model="selectType"
                    :menu-props="{'nudge-top':-40,'fixed':false}" 
                    :items="selectTypeImport" 
                    item-color="white" 
                    label="--- Chọn ---" 
                    background-color="#F7F7F7">
                </v-select>
            </v-col>
        </v-row>
        <div class=" mt-2 justify-center text-center mr-15 ml-3 mr-3 custom-upload" v-show="selectType" >
            <uploader 
                class="mb-3"
                :options="options" 
                :autoStart="true"
                @dragover="handleDrop"
                @file-success="handleFileUploaded"
                @change="handleChange" 
                ref="upload"
            >
                <uploader-unsupport></uploader-unsupport>
                <uploader-drop style="width:405px!important; height: 200px" >
                    <p class="font-normal mb-3">Kéo thả file vào đây để upload</p>
                    <uploader-btn  v-show="selectType=='Excel'" 
                        depressed class="mt-10 font-normal btn-upload fs-13"
                        :single="true"
                        style="background-color:#3092E6; color:white; border-radius:2px; border:1px solid #3092E6">
                        Chọn file
                    </uploader-btn>
                    <uploader-btn  
                        v-show="selectType=='CSV'" 
                        depressed 
                        class=" mt-10 font-normal btn-upload fs-13"
                        :single="false"
                        style="background-color:green; color:white; border-radius:2px; border:1px solid green">
                        Chọn file
                    </uploader-btn>
                    <v-btn 
                        v-show ="dem > 0" 
                        color ="error" class="ml-1 fw-400" 
                        style ="margin-bottom:3px; border-radius: 0px!important" 
                        small 
                        depressed 
                        @click = "clearFiles">
                        Xoá 
                    </v-btn>
                </uploader-drop>
                <uploader-list style="width:405px!important"></uploader-list>
            </uploader>
        </div>
        <div class="color-red">
            {{errorMessage}}
        </div>
        <v-row class="mr-3 ">
            <v-col class="col-md-9 "></v-col>
            <v-col>
                <v-btn 
                    class="ml-4 next-step-button" 
                    small 
                    @click="nextStep()" 
                    depressed 
                    color="info" 
                    >
                    <span class='fs-13 fw-400'>Tiếp</span>
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>
<script>
import { util } from '../../plugins/util';
import uploader from 'vue-simple-uploader'

export default {
    props: ['errorMessage','importInfo'],
    computed: {
        newImport() {
            return this.$store.state.importExcel.newImport;
        }
    },
    watch: {
        importInfo(value){
            this.nameImport = value.nameImport;
            this.description = value.description;
        },
        newImport(val) {
          if (val) {
            this.selectType='Excel';
            this.$refs.upload.uploader.cancel();
          }
        },
        selectType(){
          this.clearFiles();
        }
    },
    data() {
        return {
            selectType:'Excel',
            event:{},
            dem:0,
            nameImport:'',
            description:'',
            check:false,
            selectTypeImport:['Excel','CSV']
        }
    },
    computed: {
      options() {
        return {
          target: 'https://io.dev.symper.vn/upload-file',
          testChunks: false,
          chunkSize:100*1024*1024,
          query: {
            key: "",
            total: 0,
            objId:0,
            objType: '',
            nameImport:'',
            description:'',
            subObjType:-1

          },
            headers:{
            'Authorization': `Bearer ${util.auth.getToken()}`,
          },
          autoStart: true,
          //singleFile: true
        }
      },
    },
    created(){
        this.nameImport = " ";
        this.description =" ";
        this.selectType ="Excel" ;
    },
    methods: {
        nextStep(){
            let data = {
                selectType:this.selectType,
                data: this.options.query,
                nameImport: this.nameImport
            }
            this.$emit("showMapping",data);
        },
        clearFiles() {
            this.$refs.upload.uploader.cancel()
            this.dem = 0
            this.options.query.key = "";
            this.options.query.objId = 0;
            this.$emit('clearFiles')
        },
        handleFileUploaded(rootFile, file, response, chunk) {
            //this.$refs.upload.uploader.resume();
            response = JSON.parse(response);
            this.$emit('dataExcel', response);
            this.$emit('keyUpload', this.options.query.key);
        },
        handleDrop(event){
            this.handelEventImport(event);
            this.dem = event.dataTransfer.items.length;
            this.options.query.total = event.dataTransfer.items.length;
        },
        handelEventImport(event){
            this.$refs.upload.uploader.cancel();
            this.options.query.key = util.str.randomString(6)+Date.now();
            this.options.query.typeImport = this.selectType;
            this.options.query.subObjType= this.importInfo.options.subObjType;
            this.options.query.objType = this.importInfo.options.objType;
            this.options.query.nameImport = this.nameImport;
            this.options.query.description = this.description;
             if(this.importInfo.options.objType=='document'){
                this.options.query.objId = this.importInfo.options.objId;
            }
             this.$emit('clearFiles');
        },
        handleChange(event) {
            this.handelEventImport(event);
            this.options.query.total = event.currentTarget.files.length;
            this.dem = event.currentTarget.files.length;
        },
    }
}
</script>
<style scoped>
.upload-file {
    color: white !important
}
.btn-upload {
    height: 27px !important;
    border-radius: 0px !important
}
.custom-upload ::v-deep .uploader-file {
    font-size: 13px;
    height: 37px !important;
}
.custom-upload ::v-deep .uploader-file-icon {
    display: none !important
}
.custom-upload ::v-deep .uploader-file-name {
    display: flex;
    width: 250px !important;
    font-size: 12px;
    padding-left: 5px;
    margin-top: -5px
}
.custom-upload ::v-deep .uploader-file-meta {
    display: none
}
.custom-upload ::v-deep .uploader-file-size,
.custom-upload ::v-deep .uploader-file-status {
    margin-top: -5px
}
.auto-complete ::v-deep .v-input__slot {
    margin-top: -19px;
    min-height: 30px!important;
    height: 30px!important;
    font-size:13px
    
}
.next-step-button{
    height:27px; 
    width: 60px;
     border-radius:2px!important
}
.auto-complete ::v-deep .v-input__slot:after {
    border-color: transparent !important
}

.auto-complete ::v-deep .v-input__slot:before {
    border-color: transparent !important
}
.auto-complete ::v-deep  .v-text-field--filled{
      min-height: 25px!important
}
.select-type ::v-deep .v-label {
    font-size: 13px!important;
    padding-left: 10px;
    margin-bottom: 5px!important;
}
.select-type ::v-deep .v-list-item__title {
    color:black
    
}
.select-type {
    height: 15px !important;
    font-size: 13px !important;
    border-radius: 1px;
     font-family: Roboto !important;
}
.select-type ::v-deep .v-input__control .v-input__slot {
    font-size: 13px !important;
    font-family: Roboto !important;
}
.select-type ::v-deep .v-input__control .v-select__selection {
    margin-left: 5px;
     font-size: 13px !important;
    font-family: Roboto !important;
}
.select-type ::v-deep .v-label--active {
    display: none;
    font-family: Roboto !important;
}
.select-type ::v-deep .v-list-item__title {
    font-size: 13px !important;
    font-family: Roboto !important;
}
.select-type ::v-deep .v-input__slot:before {
    border-color: transparent !important;
}
.select-type ::v-deep .v-input__slot:after {
    border-color: transparent !important;
}
.select-type-item {
    color: rgba(0, 0, 0, 0.87) !important;
    caret-color: rgba(0, 0, 0, 0.87) !important;
}
.select-type ::v-deep .v-select__slot{
    height:28px!important
}

.v-list-item__content{
    font-size:13px!important;
    color:black!important
}
</style>
<style >
.v-list-item__title{
    font-size:13px!important;
    color:black!important
}
.v-select__slot{
    padding-left:7px;
    font-size:13px!important;
    font-family: Roboto;
}
</style>