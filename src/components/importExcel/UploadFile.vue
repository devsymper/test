<template>
<div class="flex items-center justify-center w-full h-screen text-center" id="app">
  <div class="p-12 bg-gray-100 border border-gray-300 d-flex"
   @dragover="dragover" @dragleave="dragleave" @drop="drop">
    <v-btn depressed class="font-normal btn-upload" color="info" @click="onUploadPressed">
        <v-btn
            icon 
            class="upload-file" 
            :loading="isUploading">
            <v-icon>mdi-upload</v-icon>
            <input type="file" name="fields[assetsFieldHandle][]" 
              id="assetsFieldHandle"
              class="d-none" :value="model"
              @change="onChange" ref="file" accept=".xls,.xlsx" />
        </v-btn>
        <span @change="e => onFileChanged(e.target.files[0])" class="fs-12 fw-400">
          {{file === null ? 'Chọn file' : format(file.name)}} 
          <v-icon :color="uploadSuccess ? 'white' : 'error'" v-if="file !== null && !isUploading">
            {{uploadSuccess ? 'mdi-check' : 'mdi-alert-circle'}}
            </v-icon>
        </span>
    </v-btn>
  </div>
</div>
</template>
<script>

  export default {
    computed: {
      newImport() {
        return this.$store.state.importExcel.newImport;
      }
    },
    watch:{
      newImport(val) {
        if(val)
        {
          this.file=null;
          this.model=''
        }
      }
    },
    data() {
      return {
        file: null,
        isUploading: false,
        uploadSuccess: false, 
        model:'',
      }
    },
    methods: {
      format(name){
        if(name.length>20){
          return name.substr(0,20) +'...'
        }
        else{
          return name;
        }

      },
      onChange() {
        this.onFileChanged(this.$refs.file.files);
      },
      onUploadPressed() {
        this.$refs.file.click();
      },
      onFileChanged(files) {
        if (this.isUploading) return;
        this.isUploading = true;
        this.file = files[0]
        let formData = new FormData()
        formData.append('file', this.file)
        let self = this
        $.ajax({
            url: 'https://io.dev.symper.vn/upload-file', // api upload 
            dataType: 'text',
            contentType: false,
            processData: false,
            data: formData,
            type: 'post',
            success: function (response) {
              response = JSON.parse(response);
              self.isUploading = false
              self.uploadSuccess = true
              self.$emit('dataExcel',response)
            },
            error: function (request, status, error) {
              self.isUploading = false
              self.uploadSuccess = false
              console.log('upload error', error);
            }
        });
      },
      dragover(event) {
        event.preventDefault();
        // Add some visual fluff to show the user can drop its files
        if (!event.currentTarget.classList.contains('bg-green-300')) {
          event.currentTarget.classList.add('bg-green-300');
        }
      },
      dragleave(event) {
        // Clean up
        event.currentTarget.classList.add('bg-gray-100');
      },
      drop(event) {
        event.preventDefault();
        this.$refs.file.files = event.dataTransfer.files;
        this.onChange(); // Trigger the onChange event manually
        // Clean up
        event.currentTarget.classList.add('bg-gray-100');
      }
    }
  }
</script>
<style scoped>
.upload-file {
    color: white !important
}
.btn-upload{
    height:27px!important;
    border-radius:0px!important
} 
</style>