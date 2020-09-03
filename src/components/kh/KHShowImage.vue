<template>
  <div id="modalImage" class="modal kh-handson">
    <div class="modal-content">
      <div class="kh-handson-header kh-showFile">
        <h2 style="width:970px">{{name+'.'+type}}</h2>
        <v-icon
          class="btn-save-handson mr-1 fs-16"
          v-if="skh.statusEdit==false"
          @click.stop="saveData"
        >mdi-content-save</v-icon>
        <v-icon class="btn-closes-handson fs-17" style="margin-left: 40px;" @click="invertStatusShowImage">mdi-close</v-icon>
      </div>
      <div v-if="type==='jpg' ||type==='png' ||type==='jpeg'">
        <img class="image-modal" :src="serverPath" alt />
      </div>
      <div class="div-show-content" v-if="type==='doc' ||type==='docx' ||type==='xlsx'">
        <iframe class="show-content" :src="`https://docs.google.com/gview?url=${serverPath}&embedded=true`"></iframe>
      </div>
       <div class="div-show-content" v-if="type==='txt'">
        <iframe  class="show-content" :src="serverPath" ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'Image'
    },
    serverPath:{
      type: String,
      default: ''
    },
    type:{
      type: String,
      default: ''
    },
  },
  data() {
    return {
      // src: "https://file.symper.vn/readFile/"
    };
  },
  methods: {
    invertStatusShowImage() {
      this.$store.commit("kh/changeStatusShowImage", !this.skh.statusShowImage);
    }
  },
  watch: {
    "skh.statusShowImage": function(newVl) {
      var modal = document.getElementById("modalImage");
      if (newVl == true) {
        modal.style.display = "block";
        setTimeout(() => {
          //   let size = this.skh.arrSizeTable;
          //   this.configTable(size);
        }, 100);
        //document.getElementById("hot-display-license-info").style.display = "none";
      } else {
        modal.style.display = "none";
      }
    }
  },

  computed: {
    skh() {
      return this.$store.state.kh;
    }
  }
};
</script>

<style scoped>
.kh-handson {
  background: white;
}

.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}
.kh-showFile{
  padding:0px;
}
/* Modal Content */
.modal-content {
  height: 95%;
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  padding-top:5px;
  border: 1px solid #888;
  width: 80%;
  overflow: scroll;
}
/* The Close Button */
.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
.image-modal {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.div-show-content{
  height: 95%;
}
.show-content{
  border: none!important;
  border-top:1px solid #aaaaaa!important ;
  width: 100%;
  height: 95%;
}
#modalImage {
  padding-top: 40px !important;
}
</style>