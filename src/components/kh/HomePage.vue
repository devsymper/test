<template>
    <div class="kh-homepage">
        <k-h-header />
        <div class="kh-recentAccess">
            <div class="symper-title pl-3 pt-3">Mới truy cập</div>
            <v-sheet id="scrolling-techniques" class="overflow-y-auto" :style="{'width':widthHome+'px'}">
                <v-container  style=" max-width: unset;">
                    <VuePerfectScrollbar   >
                        <div class="image-recentAccess" style="display:flex; ">
                        <div
                            class="quickAccessItem"
                            v-for="item of listQuickAccess"
                            :key="item.id"
                            @click.stop="goDocumentQuickAccess(item.hash)"
                        >
                            <div class="preview">
                            <img v-bind:src="item.previewImage" alt />
                            </div>
                            <div class="quickTitle">
                            <p>{{item.name}}</p>
                            </div>
                        </div>
                        </div>
                    </VuePerfectScrollbar>
                </v-container>
            </v-sheet>
            <div class="kh-table pl-3 pt-3">
                    <template>
                    <v-data-table
                        :headers="headers"
                        :items="listRoot"
                        :items-per-page="5"
                        :search="skh.search"
                        class="elevation-1 kh-sub-table"
                    >
                        <template v-slot:[`item.name`]="{ item }">
                        <v-list-item-group>
                            <v-list-item
                            class="pa-0"
                            active-class="v-item--active"
                            dense
                            @click="doubleClick(item.hash)"
                            @contextmenu="show($event,item.path,item.name)"
                            >
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                <v-icon v-on="on" class="fs-14">mdi-folder</v-icon>
                                <!-- <v-list-item-title class="fs-13" v-text="item.name"></v-list-item-title> -->
                                <p
                                    v-on="on"
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
                        <!-- contextMenu -->
                        <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
                            <v-list class="context-menu">
                            <v-list-item
                                dense
                                v-for="(item, index) in contextMenu"
                                :key="index"
                                @click="item.menuAction(item.title)"
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
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
    data() {
        return {
        widthHome:700,
        idRowTable: -1,
        nameNode: "",
        path: "",
        listQuickAccess: null,
        showMenu: false,
        x: 0,
        y: 0,
        dialog_remove: false,
        contextMenu: [
            {
            title: "Đổi tên",
            menuAction: action => {
                this.rename(this.path, this.nameNode, this.parentPath);
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
        "k-h-header": KHHeader,
        VuePerfectScrollbar
    },
    watch: {
        "sapp.collapseSideBar": function(newVl) {
            this.setWidthQuickView();
        }
    },
  computed: {
    sapp() {
      return this.$store.state.app;
    },
    skh() {
      return this.$store.state.kh;
    },
    listRoot() {
      let root = this.skh.listDataTableRoot;
      root = this.listToTable(this.skh.listDataTableRoot, this.sapp.allUsers);
      return root;
    }
  },
  methods: {
    setWidthQuickView(sizeBar=0){
        let width=$('.kh-recentAccess').width();
        if (sizeBar>0) {
            this.widthHome=$(".layout").width() - sizeBar;
        }else{
            this.widthHome=width-50;
        }
    },
    goDocumentQuickAccess(hash) {
        this.$store.commit("kh/setCurrentDocument", hash);
        this.$router.push("/knowledge/document/" + hash);
    },
    /**
     * Hiển thị dialog thêm sửa xóa
     */
    show(e, path, name, parentPath) {
      //console.log("KH-id node:", path); // get node được trỏ
        e.preventDefault();
        this.path = path;
        this.nameNode = name;
        this.showMenu = false;
        this.x = e.clientX;
        this.y = e.clientY;
        this.$nextTick(() => {
            this.showMenu = true;
        });
    },

    doubleClick(hash) {
        this.$router.push("/knowledge/folder/" + hash);
    },
    /**
     * Lấy danh sách Directory và merge userName to Directory
     */
    listToTable(directory, users) {
        for (let i = 0; i < directory.length; i++) {
        var uid = directory[i]["user_id"];
        var uidEdit = directory[i]["user_edit"];
        let obj = users.find(data => data.id === uid);
        let objEdit = users.find(data => data.id === uidEdit);
        if (obj) {
          var index = users.indexOf(obj);
          directory[i]["displayName"] = users[index].displayName;
          directory[i]["created_at"] = this.convertDate(
            directory[i]["created_at"]
          );
          directory[i]["updated_at"] = this.convertDate(
            directory[i]["updated_at"]
          );
        }
        if (objEdit) {
          var index = users.indexOf(objEdit);
          directory[i]["displayNameEdit"] = users[index].displayName;
        }
      }
      return directory;
    },
    getDocQuickAccess() {
      knowledgeApi
        .getDocuQuickAccess()
        .then(res => {
          if (res.status == 200) {
            this.listQuickAccess = res.data.listObject;
          }
        })
        .catch(err => {
          console.log("error from Add folder to treee!!!", err);
        })
        .always(() => {});
    },
    rename(path, name) {
      let self = this;
      var renameInput = $("<input id=" + "tb" + path + " value=" + name + " >");
      $("#tb" + path).replaceWith(renameInput);
      $("#tb" + path).val(name);
      renameInput.on("blur", function(evt) {
        $(this).replaceWith(
          "<p id=" +
            "tb" +
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
            data.parentPath = "";
            knowledgeApi
              .renameDirectory(data)
              .then(res => {
                if (res.status == 200) {
                  $("#tb" + path).replaceWith(
                    "<p id=" +
                      "tb" +
                      path +
                      " style='padding-left: 5px; margin: 0px; color:#757575;'>" +
                      res.data +
                      " </p>"
                  );
                  self.$store.dispatch("kh/updateNodeToTreeViewStore", data);
                } else {
                  // alert("aaa");
                }
              })
              .catch(err => {
                console.log("error from update folder api!!!", err);
              })
              .always(() => {});
          } else {
            $(this).replaceWith(
              "<p id=" +
                "tb" +
                path +
                " style='padding-left: 5px; margin: 0px; color:#757575'>" +
                name +
                " </p>"
            );
          }
        }
      });
    },
    removeNode() {
      let thisCpn = this;
      var path = this.path;
      knowledgeApi
        .deleteDirectory(path)
        .then(res => {
          if (res.status == 200) {
            thisCpn.dialog_remove = false;
            this.$store.dispatch("kh/removeNodeToTreeViewStore", path);
            this.$store.dispatch("kh/removeDirToTableRootStore", path);
          }
        })
        .catch(err => {
          console.log("error from delete folder user api!!!", err);
        })
        .always(() => {});
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
        this.setWidthQuickView();
        this.$evtBus.$on('kh-resize-sidebar', (sizeBar) =>{
            this.setWidthQuickView(sizeBar);
        });
        this.$store.dispatch("app/getAllUsers");
        this.$store.dispatch("kh/getListTableRoot");
        this.getDocQuickAccess();
    
    },
    mounted(){
        this.setWidthQuickView();
    }
};
</script>

<style scoped>
.v-item--active {
  color: white;
}
.kh-sub-table ::v-deep th{
    padding:2px 4px!important;
}
.kh-sub-table ::v-deep td{
    padding:2px 4px!important;

}
</style>