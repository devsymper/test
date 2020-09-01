<template>
    <v-btn icon :loading="isSelecting" @click="onButtonClick" class="upload-file">
      <v-icon class="fs-16" >mdi-plus</v-icon>
      <input ref="uploader" class="d-none" type="file" @change="onFileChanged" />
    </v-btn>
</template>

<script>
export default {
  data() {
    return {
      isSelecting: false
    };
  },
  methods: {
    onButtonClick() {
      this.isSelecting = true;
      window.addEventListener(
        "focus",
        () => {
          this.isSelecting = false;
        },
        { once: true }
      );
      this.$refs.uploader.click();
    },
    onFileChanged(e) {
      this.selectedFile = e.target.files[0];
      let formData = new FormData();
      formData.append("file", this.selectedFile);
      formData.append("user", this.$store.state.app.endUserInfo.displayName);
      let thisCpn = this;
      $.ajax({
        url: "https://file.symper.vn/uploadS",
        dataType: "text",
        contentType: false,
        processData: false,
        data: formData,
        type: "post",
        success: function(res) {
          let resObj = JSON.parse(res);
			    thisCpn.$emit("uploaded-file", resObj);
        }
      });
    }
  }
};
</script>

<style scoped>
.upload-file{
	float: right!important;

}
.upload-file i{
	margin: 0px!important;
	position: absolute!important;
	bottom: -9px!important;
	
}
</style>