<template>
<div class="flex items-center justify-center w-full h-screen text-center mr-15 ml-3" id="app">
  <!-- excel
        -->
    <div class="mt-2">
        <uploader 
          :options="options" 
          :autoStart="true"
           @file-success="handleFileUploaded"
          @change="handleChange"
         
          ref="upload">
            <uploader-unsupport></uploader-unsupport>
            <uploader-drop>
                <p class="font-normal">Thả file ở đây để upload</p>
                <uploader-btn depressed class="font-normal btn-upload"
                :single="false"
                style="background-color:#3092E6; color:white; border-radius:2px; border:1px solid #3092E6; font-size:13px">
                    Chọn file
                </uploader-btn>
                <v-btn 
                  v-show="options.query.total > 0" 
                  color="error" class="ml-1" 
                  style="font-weight: 400; border-radius: 0px !important" 
                  small depressed 
                  @click="clearFiles">
                  Clear
                </v-btn>
            </uploader-drop>
            <uploader-list></uploader-list>
        </uploader>
    </div>
</div>
</template>
<script>
import {v4 as uuidv4} from 'uuid'

export default {
    props: ["selectType"],
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
            this.options.query.total = 0;
          }
        },
        selectType(){
          if(this.selectType=='Excel'){
            this.single = true;
            this.$refs.upload.uploader.cancel()
            this.options.query.total = 0;

          }
          else{
            this.single = false;
            this.$refs.upload.uploader.cancel()
            this.options.query.total = 0;
            }
          }
    },
    data() {
        return {
            file: null,
            model: '',
            single: false,
        }
    },
    computed: {
      options() {
        return {
          target: 'https://io.dev.symper.vn/upload-file',
          testChunks: false,
          query: {
              key: "",
              total: 0,
          },
          autoStart: true,
          //singleFile: true
        }
      },
    },

    methods: {
        clearFiles() {
            this.$refs.upload.uploader.cancel()
            this.options.query.total = 0
            this.options.query.key = ""
        },
        handleFileUploaded(rootFile, file, response, chunk) {
            this.$refs.upload.uploader.resume();
            // console.log(response);
            response = JSON.parse(response);
            this.$emit('dataExcel', response);
            this.$emit('keyUpload', this.options.query.key);

        },
        handleChange(event) {
            this.$refs.upload.uploader.cancel()
            this.options.query.total = event.currentTarget.files.length;
            this.options.query.key = uuidv4();
            this.options.query.typeImport = this.selectType;

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
</style><style>
.uploader-file {
    font-size: 13px;
    height: 37px !important;
}

.uploader-file-icon {
    display: none !important
}

.uploader-file-name {
    display: flex;
    width: 250px !important;
    font-size: 12px;

    padding-left: 5px;
    margin-top: -5px
}

.uploader-file-meta {
    display: none
}

.uploader-file-size,
.uploader-file-status {
    margin-top: -5px
}
</style>
