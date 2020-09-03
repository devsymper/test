<template>
  <div class="w-100">
    <v-skeleton-loader v-if="loading" class="mx-auto" width="100%" height="100%" type="table"></v-skeleton-loader>
    <k-h-header />
    <div v-show="skh.statusEdit" class="kh-editor-view"  v-html="content"></div>
    <div v-show="!skh.statusEdit" class="kh-editor" ref="printMe">
      <editor
        id="myeditablediv"
        api-key="x7abgywktsdoz7uca2ogf5xikxkrz9w999t7cu9oi0wu6isq"
        initial-value="Nhập văn bản..."
        ref="editor"
        v-model="content"
        :inline="true"
        :disabled="skh.statusEdit"
        :init="{
              menubar: false,
              toolbar: false,
              plugins: [
              'autolink',
              'codesample',
              'link',
              'lists',
              'media',
              'image',
              'quickbars',
              'paste',
              'advcode',
              'table',
              'fullscreen',
              'emoticons',
              'casechange',
              'codesample'
              ],
              quickbars_insert_toolbar: false,
              quickbars_selection_toolbar: ' addHandsonTableBtn | bold italic underline strikethrough | fontselect fontsizeselect formatselect  |numlist bullist checklist| forecolor backcolor casechange| blockquote quicklink| alignleft aligncenter alignright alignjustify| codesample | outdent indent quickimage media|  emoticons | table',
              media_live_embeds: true,
              setup: function (editor) {
                editor.ui.registry.addButton('addHandsonTableBtn', {
                  text: 'Handson',
                  onAction: function () {
                    //editor.insertContent('&nbsp;<strong>It\'s my button!</strong>&nbsp;');
                    addSizeTable();
                    
                  }
                });
              },
              init_instance_callback: function(editor) {
                getData()
              }
            }"
      />
    </div>
    <KHAddSizeTable ref="dialogAddSizeTable" />
    <KHHandsonTable />
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
import { knowledgeApi } from "./../../api/kh.js";
import KHHeader from "./../../components/kh/KHHeader.vue";
import KHAddSizeTable from "./../../components/kh/KHAddSizeTable.vue";
import KHHandsonTable from "./../../components/kh/KHHandsonTable.vue";
import { SYMPER_APP } from "./../../main.js";

export default {
  data() {
    let self = this;
    return {
      loading: true,
      id: "",
      hash: "",
      name: "",
      parentPath: "",
      content: "",
      previewImage: null
    };
  },
  components: {
    "k-h-header": KHHeader,
    editor: Editor,
    KHAddSizeTable,
    KHHandsonTable
  },
  watch: {
    "skh.statusEdit": function(newVl) {
      if (this.skh.statusEdit == true) {
        //lưu vào csdl
        if (this.content != null) {
          let data = {};
          data.hash = this.hash;
          data.name = this.name;
          data.parentPath = this.parentPath;
          data.content = this.content;
          data.previewImage = this.previewImage;
          console.log(data);
          knowledgeApi
            .updateDocument(data)
            .then(res => {
              if (res.status == 200) {
                this.$store.dispatch("kh/updateDocumentToTreeViewStore", data);
              } else if (res.status == 403) {
                SYMPER_APP.$snotifyError("Error", res.message);
              }
            })
            .catch(err => {
              console.log("error from edit doc!!!", err);
            })
            .always(() => {});
        }
      } else {
        if (this.content != null) {
          let data = {};
          data.docId = this.id;
          data.docName = this.name;
          data.docContent = this.content;
          knowledgeApi
            .addBackupDocument(data)
            .then(res => {
              if (res.status == 200) {
                console.log("add backup success !!!");
              }
            })
            .catch(err => {
              console.log("error add document backup!!!", err);
            })
            .always(() => {});
        }
        this.captureImage();
      }
    },
    "skh.statusRestore": function(newVl) {
      if (newVl == true) {
        this.getData();
        this.$store.commit("kh/changeStatusRestore", false);
      }
    },
    "skh.statusBackup": function(newVl) {
      if (newVl == true) {
        if (this.content != null) {
          let data = {};
          data.docId = this.id;
          data.docName = this.name;
          data.docContent = this.content;
          knowledgeApi
            .addBackupDocument(data)
            .then(res => {
              if (res.status == 200) {
                console.log("add backup success !!!");
              }
            })
            .catch(err => {
              console.log("error add document backup!!!", err);
            })
            .always(() => {});
        }
        this.$store.commit("kh/changeStatusBackup", false);
      }
    },
    "skh.hotData": function(newVl) {
      if (newVl != null) {
        var data = newVl;
        var idTable = this.skh.idTable;
        if (idTable != "") {
          var content =
            "<div class='mceTable'><table class='mce-item-table' id=" +
            idTable +
            " >";
          for (let row = 0; row < data.length - 1; row++) {
            content += `<tr>`;
            for (let col = 0; col < data[row].length; col++) {
              content += `<td>` + data[row][col] + `</td>`;
            }
            content += `</tr>`;
          }
          content += `</table></div>`;
          $('.kh-editor').find( "#" + idTable).replaceWith(content);
          this.$store.commit("kh/setIdTable", "");
        } else {
          var uuid = this.create_UUID();
          var content = "<div class='mceTable''><table  id=" + uuid + " >";
          for (let row = 0; row < data.length - 1; row++) {
            content += `<tr>`;
            for (let col = 0; col < data[row].length; col++) {
              content += `<td>` + data[row][col] + `</td>`;
            }
            content += `</tr>`;
          }
          content += `</table><div>`;
          tinymce
            .get("myeditablediv")
            .execCommand("mceInsertContent", false, content);
        }
      }
    },
    "skh.currentDocument": function(newVl) {
      var url = window.location.href;
      var pos = url.search("document");
      if (pos > 0) {
        this.getData(newVl);
      }
    }
  },
  methods: {
    create_UUID() {
      var dt = new Date().getTime();
      var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function(c) {
          var r = (dt + Math.random() * 16) % 16 | 0;
          dt = Math.floor(dt / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    },
    getData(hash = false) {
      this.loading = true;
      if (hash == false) {
        hash = this.$route.params.hash;
        this.hash = hash;
      }
      let self = this;
      knowledgeApi
        .getDetailDocument(hash)
        .then(res => {
          if (res.status == 200) {
            if (res.data.listObject.content == "") {
              self.$refs.editor.editor.setContent("Nhập văn bản...");
            } else {
              self.$refs.editor.editor.setContent(res.data.listObject.content);
            }
            self.id = res.data.listObject.id;
            self.name = res.data.listObject.name;
            self.parentPath = res.data.listObject.parentPath;
            self.content = res.data.listObject.content;
            self.hash = res.data.listObject.hash;
            // this.$store.commit("kh/changeHeaderSlugKH", 2);
          } else if (res.status == 403) {
            self.$store.commit("kh/resetData", true);
            this.$router.push("/knowledge");
            SYMPER_APP.$snotifyError("Error", res.message);
          }
          self.loading = false;
        })
        .catch(err => {
          console.warn(err, "error when get document");
          this.$store.commit("kh/setFlagErrEditor", this.skh.flagErrEditor + 1);
          if (this.skh.flagErrEditor > 2 || this.skh.flagErrEditor == 1) {
            this.$snotify({
              type: "error",
              title: this.$t("document.error")
            });
          }
        });
    },
    addSizeTable() {
      var pos = $(".tox-pop--align-left").offset();
      this.$refs.dialogAddSizeTable.setPosition(pos);
      this.$store.commit("kh/changeStatusFormAddSizeTable", true);
    },
    async captureImage() {
      const el = this.$refs.printMe;
      const options = {
        type: "dataURL"
      };
      this.previewImage = await this.$html2canvas(el, options);
    }
  },
  computed: {
    sapp() {
      return this.$store.state.app;
    },
    skh() {
      return this.$store.state.kh;
    }
  },
  mounted() {
    let self = this;
    $(".kh-editor").on("dblclick", "table", function(event) {
      console.log($(this));
      var p = $(this);
      var idTable = p.attr("id");
      self.$store.commit("kh/setIdTable", idTable);
      var result = [].reduce.call(
        p[0].rows,
        function(result, row) {
          result.push(
            [].reduce.call(
              row.cells,
              function(res, cell) {
                res.push(cell.textContent);
                return res;
              },
              []
            )
          );
          return result;
        },
        []
      );
      self.$store.commit("kh/setDataTable", result);
      self.$store.commit("kh/changeStatusHansonTable", true);
    });
    $(".kh-editor").on("click", "table", function(event) {
      var p = $(this);
      var position=p.position();
      console.log(position);
      document.getElementById("mceResizeHandlenw").style.left =position.left;
      document.getElementById("mceResizeHandlene").style.left = p.width();
    });
    $(".kh-editor").on("click", "img", function(event) {
      var p = $(this);
      var position=p.position();
      document.getElementById("mceResizeHandlenw").style.left =position.left;
      document.getElementById("mceResizeHandlene").style.left = p.width();
    });
  }
};
</script>

<style  scoped>
.kh-editor {
  height: calc(98vh - 65px);
  overflow: auto;
  padding: 8px;
}
.kh-editor-view{
  height: calc(98vh - 65px);
  overflow: auto;
  padding: 8px;
}

</style>