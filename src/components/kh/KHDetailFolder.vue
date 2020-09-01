<template>
  <div class="kh-homepage">
    <k-h-header />
    <div class="kh-table">
      <template>
        <v-data-table
          :headers="headers"
          :items="listChildren"
          :items-per-page="5"
          :search="skh.search"
          class="elevation-1 kh-table"
          
        >
          <template v-slot:[`item.name`]="{ item }">
            <v-list-item-group >
              <v-list-item
                dense
                active-class="v-item--active"
                @click="doubleClick(item.path,item.id,item.hash)"
                @contextmenu="show($event,item.id,item.name,item.path,item.parent_path,item.hash,item.content)"
              >
                <!-- <v-icon class="fs-14">mdi-folder</v-icon> -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" class="fs-14" v-if="item.id == undefined">mdi-folder</v-icon>
                    <v-icon v-on="on" class="fs-14" v-else>mdi-file-document-outline</v-icon>
                    <p
                      v-on="on"
                      v-if="item.id!=undefined"
                      class="fs-13"
                      style="margin:0px;padding-left:5px; color:#757575"
                      :id="'tb'+item.id"
                      v-text="item.name"
                    ></p>
                    <p
                      v-on="on"
                      v-if="item.id==undefined"
                      class="fs-13"
                      style="margin:0px;padding-left:5px; color:#757575"
                      :id="'tb'+item.path"
                      v-text="item.name"
                    ></p>
                  </template>
                  <span>{{ item.name }}</span>
                </v-tooltip>
              </v-list-item>
            </v-list-item-group>

            <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
              <v-list class="context-menu">
                <v-list-item
                  v-for="(item, index) in contextMenu"
                  :key="index"
                  @click="item.menuAction(item.title)"
                  dense
                >
                  <v-icon class="fs-15">{{item.icon}}</v-icon>
                  <v-list-item-title class="fs-13">{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </template>
    </div>

    <v-dialog v-model="dialog_remove" max-width="290">
      <v-card>
        <v-card-title class="headline">kh.symper.vn</v-card-title>
        <v-card-text>{{$t("common.remove_confirm_title")}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog_remove = false">Hủy</v-btn>
          <v-btn color="red darken-1" text @click="removeNode">Xóa</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import KHHeader from "./../../components/kh/KHHeader.vue";
import { knowledgeApi } from "./../../api/kh.js";

export default {
  data() {
    return {
      path: "",
      hash: "",
      content: "",
      id: -1,
      parentPath: "",
      name: "",
      showMenu: false,
      dialog_remove: false,
      x: 0,
      y: 0,
      contextMenu: [
        {
          title: "Đổi tên",
          menuAction: action => {
            this.rename(
              this.path,
              this.id,
              this.name,
              this.parentPath,
              this.content,
              this.hash
            );
          },
          icon: "mdi-border-color"
        },
        {
          title: "Xóa",
          menuAction: action => {
            this.dialog_remove = true;
          },
          icon: "mdi-delete-forever"
        }
      ],
      headers: [
        {
          text: this.$t("document.table.title"),
          align: "start",
          value: "name"
        },
        { text: this.$t("common.created_by"), value: "displayName" },
        { text: this.$t("common.last_updated_by"), value: "displayNameEdit" },
        { text: this.$t("user.table.createAt"), value: "created_at" },
        { text: this.$t("user.table.updateAt"), value: "updated_at" },
     
        { text: this.$t("kh.table.totalDoc"), value: "total_document" }
      ]
    };
  },
  components: {
    "k-h-header": KHHeader
  },
  watch: {
    $route(to, from) {
      this.hash = to.params.hash;
    },
    hash: function(nevVL) {
      this.$store.dispatch("kh/getDirectoryChildren", nevVL);
    }
  },
  computed: {
    sapp() {
      return this.$store.state.app;
    },
    skh() {
      return this.$store.state.kh;
    },
    listChildren() {
      let root = this.skh.listDataTableChildren;
      root = this.listToTable(
        this.skh.listDataTableChildren,
        this.sapp.allUsers
      );
      return root;
    }
  },
  methods: {
    rename(path, id, name, parentPath) {
      let self = this;
      if (id > 0) {
        var renameInput = $("<input id=" + "tb" + id + " value=" + name + " >");
        $("#tb" + id).replaceWith(renameInput);
        $("#tb" + id).val(name);
        renameInput.on("blur", function(evt) {
          $(this).replaceWith(
            "<p id=" +
              "tb" +
              id +
              " style='padding-left: 5px; margin: 0px; color: rgb(117, 117, 117);'>" +
              name +
              " </p>"
          );
        });
        setTimeout(function() {
          $("#tb" + id)
            .focus()
            .val(name)
            .select();
        }, 200);
        $("#tb" + id).keyup(function(e) {
          if (e.keyCode === 13) {
            var text = $("#tb" + id)
              .val()
              .trim();
            if (text != "" &&text != name) {
              let data = {};
              data.id=id;
              data.name = text;
              data.parentPath = parentPath;
              knowledgeApi
                .renameDocument(data)
                .then(res => {
                  if (res.status == 200) {
                    $("#tb" + id).replaceWith(
                      "<p id=" +
                        "tb" +
                        id +
                        " style='padding-left: 5px; margin: 0px; color: rgb(117, 117, 117);'>" +
                        res.data +
                        " </p>"
                    );
                    self.$store.dispatch(
                      "kh/updateDocumentToTreeViewStore",
                      data
                    );
                  }
                })
                .catch(err => {
                  console.log("error from rename document api!!!", err);
                })
                .always(() => {});
            }else{
                $(this).replaceWith(
                "<p id=" +
                  "tb" +
                  id +
                  " style='padding-left: 5px; margin: 0px; color: rgb(117, 117, 117);'>" +
                  name +
                  " </p>"
              );
            }
          }
        });
      } else {
        // rename thư mục
        var renameInput = $("<input id="+'tb' + path + " value=" + name + " >");
       
        $("#tb" + path).replaceWith(renameInput);
        $("#tb" + path).val(name);
        renameInput.on("blur", function(evt) {
          $(this).replaceWith(
            "<p id="+'tb' +
              path +
              " style='padding-left: 5px; margin: 0px; color:#757575'>" +
              name +
              " </p>"
          );
        });

        setTimeout(function() {
          $("#tb" + path)
            .focus()
            .val(name)
            .select();
        }, 200);
        $("#tb" + path).keyup(function(e) {
          if (e.keyCode === 13) {
            var text = $("#tb" + path)
              .val()
              .trim();
            if (text != "" && text != name) {
              let data = {};
              data.name = text;
              data.path = path;
              data.parentPath = parentPath;
              knowledgeApi
                .renameDirectory(data)
                .then(res => {
                  if (res.status == 200) {
                    $("#tb" + path).replaceWith(
                      "<p id="+'tb' +
                        path +
                        " style='padding-left: 5px; margin: 0px; color:#757575;'>" +
                        res.data +
                        " </p>"
                    );
                    self.$store.dispatch("kh/updateNodeToTreeViewStore", data);
                  }
                })
                .catch(err => {
                  console.log("error from update folder api!!!", err);
                })
                .always(() => {});
            }else{
                $(this).replaceWith(
                "<p id="+'tb' +
                  path +
                  " style='padding-left: 5px; margin: 0px; color:#757575'>" +
                  name +
                  " </p>"
              );
            }
          }
        });
      }
    },
    removeNode() {
      let thisCpn = this;
      var path = this.path;
      var id = this.id;
      if (id > 0) {
        knowledgeApi
          .deleteDocument(id)
          .then(res => {
            if (res.status == 200) {
              thisCpn.dialog_remove = false;
              this.$store.dispatch("kh/removeDocToTreeViewStore", id);
              this.$store.dispatch("kh/removeDocToListChildTableStore", id);
            }
          })
          .catch(err => {
            console.log("error from delete folder user api!!!", err);
          })
          .always(() => {});
      } else {
        knowledgeApi
          .deleteDirectory(path)
          .then(res => {
            if (res.status == 200) {
              thisCpn.dialog_remove = false;
              this.$store.dispatch("kh/removeNodeToTreeViewStore", path);
              this.$store.dispatch("kh/removeDirToListChildTableStore", path);
            }
          })
          .catch(err => {
            console.log("error from delete folder user api!!!", err);
          })
          .always(() => {});
      }
    },
    /**
     * Hiển thị dialog thêm sửa xóa
     */
    show(e, id, name, path, parentPath, content) {
      e.preventDefault();
      this.id = id;
      this.path = path;
      this.content = content;
      this.name = name;
      this.parentPath = parentPath;
      this.showMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
    doubleClick(path, id, hash) {
      this.$store.commit("kh/setCurrentDocument", hash);
      if (id == undefined) {
        this.$store.commit("kh/changeHeaderSlugKH", 1);
        this.$router.push("/knowledge/folder/" + hash);
      } else {
        this.$router.push("/knowledge/document/" + hash);
      }
    },
    /**
     * Lấy danh sách Directory và merge userName to Directory
     */
    listToTable(directory, users) {
      for (let i = 0; i < directory.length; i++) {
        var uid = directory[i]["user_id"];
        if (directory[i]["user_editing"]!=undefined) {
          var uidEdit = directory[i]["user_editing"];
        }else{
          var uidEdit = directory[i]["user_edit"];
        }
       
        let obj = users.find(data => data.id === uid);
        let objEdit = users.find(data => data.id === uidEdit);
        if (obj) {
          var index = users.indexOf(obj);
          directory[i]["displayName"] = users[index].displayName;
          directory[i]["created_at"] = this.convertDate(directory[i]["created_at"]);
          directory[i]["updated_at"] = this.convertDate(directory[i]["updated_at"]);
        }
        if (objEdit) {
          var index = users.indexOf(objEdit);
          directory[i]["displayNameEdit"] = users[index].displayName;
        }
      }
      return directory;
    },
    getData() {
      this.hash = this.$route.params.hash;
      this.$store.dispatch("app/getAllUsers");
      this.$store.dispatch("kh/getDirectoryChildren", this.hash);
    },
    convertDate(date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear(),
        h = "" + d.getHours(),
        i = "" + d.getMinutes(),
        s = "" + d.getSeconds();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;
      if (h.length < 2) h = "0" + h;
      if (i.length < 2) i = "0" + i;
      if (s.length < 2) s = "0" + s;

      return [year, month, day].join("-") + " " + [h, i].join(":");
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style scoped>
.kh-table {
  margin-left: 10px;
  margin-top: 10px;
}
.v-item--active{
  color:white;
}
</style>