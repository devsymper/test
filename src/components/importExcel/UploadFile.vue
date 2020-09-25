<template>
<div class="flex items-center justify-center w-full h-screen text-center mr-15 ml-3 mr-3 custom-upload">
    <div v-show="selectType" class="mt-2">
        <uploader 
          :options="options" 
          :autoStart="true"
          @dragover="handleDrop"
           @file-success="handleFileUploaded"
          @change="handleChange" 
          ref="upload">
            <uploader-unsupport></uploader-unsupport>
            <uploader-drop  >
                <p class="font-normal mb-3">Kéo thả file vào đây để upload</p>
                <uploader-btn  v-show="selectType=='Excel'" depressed class="font-normal btn-upload"
                :single="true"
                style="background-color:#3092E6; color:white; border-radius:2px; border:1px solid #3092E6; font-size:13px">
                    Chọn file
                </uploader-btn>
                <uploader-btn   v-show="selectType=='CSV'" depressed class="font-normal btn-upload"
                :single="false"
                style="background-color:green; color:white; border-radius:2px; border:1px solid green; font-size:13px">
                    Chọn file
                </uploader-btn>
                <v-btn 
                  v-show ="dem > 0" 
                  color ="error" class="ml-1" 
                  style ="margin-bottom:3px; font-weight: 400; border-radius: 0px !important" 
                  small depressed 
                  @click = "clearFiles">
                  Xoá 
                </v-btn>
            </uploader-drop>
            <uploader-list></uploader-list>
        </uploader>
    </div>
</div>
</template>
<script>
import { util } from '../../plugins/util';
import uploader from 'vue-simple-uploader'

export default {
    props: ["selectType","objId","objType"],
    computed: {
        newImport() {
            return this.$store.state.importExcel.newImport;
        }
    },
    watch: {
        newImport(val) {
          if (val) {
            this.selectType='';
            this.$refs.upload.uploader.cancel();
          }
        },
        selectType(){
          this.clearFiles();
        }
    },
    data() {
        return {
            dem:0,
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
            documentId:0,
            objType: ''
          },
            headers:{
            'Authorization': `Bearer ${util.auth.getToken()}`,
          },
          autoStart: true,
          //singleFile: true
        }
      },
    },
    methods: {
        clearFiles() {
            this.$refs.upload.uploader.cancel()
            this.dem = 0
            this.options.query.key = "";
            this.options.query.documentId = 0;
            this.$emit('clearFiles')
        },
        handleFileUploaded(rootFile, file, response, chunk) {
            this.$refs.upload.uploader.resume();
            response = JSON.parse(response);
            this.$emit('dataExcel', response);
            this.$emit('keyUpload', this.options.query.key);
        },
        handleDrop(event){
            this.$refs.upload.uploader.cancel()
            this.dem = event.dataTransfer.items.length;
            this.options.query.total = event.dataTransfer.items.length;
            this.options.query.key = util.str.randomString(6)+Date.now();
            this.options.query.typeImport = this.selectType;
            this.options.query.documentId = this.objId;
            this.options.query.objType = this.objType;
            this.$emit('clearFiles');
        },
        handleChange(event) {
            this.$refs.upload.uploader.cancel()
            this.options.query.total = event.currentTarget.files.length;
            this.dem = event.currentTarget.files.length;
            this.options.query.key = util.str.randomString(6)+Date.now();
            this.options.query.typeImport = this.selectType;
            this.options.query.documentId = this.objId;
            this.options.query.objType = this.objType;

            this.$emit('clearFiles');
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
</style>
