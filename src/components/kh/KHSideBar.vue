<template>
  <vue-resizable :maxWidth="500" :width="skh.widthSideBar">
    <v-navigation-drawer class="khSidebar resizable-content" v-show="!skh.subCollapseSideBar">
      <div>
        <v-text-field
          v-model="search"
          background-color="#F7F7F7"
          class="d-inline-block mr-2 sym-small-size pa-1 w-100"
          single-line
          append-icon="mdi-magnify"
          dense
          @keyup="changeValueOpenAll"
          solo
          label="Search"
          :placeholder="$t('common.search')"
        ></v-text-field>
        <div class="kh-side-bar">
          <v-container style="height: calc(100vh - 65px);overflow: auto;">
            <div class="workspace">
              <div class="symper-title">WORKSPACE</div>
              <div class="icon-add">
                <v-icon v-on:click="addNode()" class="fs-16 add-folder">mdi-plus</v-icon>
              </div>
            </div>
            <div class="kh-add-node-parent" v-bind:class="{'d-none' : !showAddNode}">
              <v-list-item-group class="favorite">
                <v-list-item>
                  <v-icon class="fs-14">mdi-folder</v-icon>
                  <v-text-field
                    v-model="txtNode"
                    v-on:keyup="validateAddNode"
                    ref="newFolderInput"
                    @blur="handleBlur"
                    class="fs-13"
                  ></v-text-field>
                </v-list-item>
              </v-list-item-group>
            </div>
            <template>
              <v-treeview
                v-model="tree"
                :open="open"
                :items="treeFolderData"
                :search="search"
                :filter="filter"
                item-key="name"
                open-on-click
                :open-all="openAll"
                dense
                class="kh-treeview"
              >
                <!-- <template v-slot:prepend="{ item, open }" > -->
                <template v-slot:label="{ item, open }">
                  <v-btn
                    class="fz-13 side-bar-item"
                    text
                    @contextmenu="show($event,item.path,item.name,item.id,item.parentPath,item.content,item.hash,item.isFavorite)"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon
                          v-on="on"
                          class="fs-14"
                          @click="dbclickDoc(item.path,item.id,item.hash)"
                          v-if="item.id == undefined"
                        >{{ open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>
                        <v-icon v-on="on" class="fs-14" v-else>mdi-file-document-outline</v-icon>
                        <p
                          v-on="on"
                          :id="item.id ? item.id: item.path"
                          @click="dbclickDoc(item.path,item.id,item.hash)"
                          class="objTitle"
                        >{{item.name}}</p>
                      </template>
                      <span>{{ item.name }}</span>
                    </v-tooltip>
                    <v-icon
                      v-if="item.id !=undefined && item.isFavorite==0"
                      class="fs-15 star-favorite"
                      @click="updateFavorite(item.id,item.isFavorite,item.name,item.parentPath,item.hash)"
                      style="padding-bottom:3px;"
                    >mdi-star-outline</v-icon>
                    <v-icon
                      v-if="item.id !=undefined && item.isFavorite==1"
                      class="fs-15 is-star-favorite"
                      @click="updateFavorite(item.id,item.isFavorite,item.name,item.parentPath,item.hash)"
                      style="padding-bottom:3px;"
                    >mdi-star</v-icon>
                  </v-btn>
                </template>
              </v-treeview>
              <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
                <v-list class="context-menu contextSideBar" id="item-context">
                  <v-list-item
                    v-for="(item, index) in contextMenu"
                    :key="index"
                    @click="item.menuAction(item.title)"
                    dense
                    v-bind:class="index==statusMove?'d-none': '' || 
                      index==0 && id !=undefined ?'d-none': '' || 
                      (index==4 ||index==5) && id ==undefined ?'d-none': '' || 
                      index==4 && isFavorite ==1 && id !=undefined ?'d-none': '' || 
                      index==5 && isFavorite ==0 && id !=undefined ?'d-none': '' "
                    @mouseover="handleContext(index)"
                  >
                    <v-icon class="fs-15">{{item.icon}}</v-icon>
                    <v-list-item-title class="fs-13">{{ item.title }}</v-list-item-title>
                    <v-icon v-if="index==0" style="margin-left:10px" class="fs-16">mdi-menu-right</v-icon>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-menu
                v-model="context_create"
                :position-x="x+115"
                :position-y="y"
                absolute
                offset-y
              >
                <v-list class="context-menu">
                  <v-list-item
                    v-for="(item, index) in contextCreate"
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
            <div class="workspace">
              <div class="symper-title">FAVORITE</div>
              <v-list dense :flat="true">
                <v-list-item-group class="favorite">
                  <v-list-item
                    v-for="(item, i) in favorites"
                    :key="i"
                    @mouseover="showByIndex = i"
                    @mouseout="showByIndex = null"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon
                          @click="dbclickDoc(item.path,item.id,item.hash)"
                          v-on="on"
                          class="fs-14"
                        >mdi-file-document-outline</v-icon>
                        <v-list-item-title
                          v-on="on"
                          class="fs-13"
                          v-text="item.name"
                          @click="dbclickDoc(item.path,item.id,item.hash)"
                        ></v-list-item-title>
                      </template>
                      <span>{{ item.name }}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon
                          v-on="on"
                          class="fs-15 star-favorite"
                          v-show="showByIndex === i"
                          @click="updateFavorite(item.id,item.isFavorite,item.name,item.parentPath,item.hash)"
                          style="padding-bottom:3px;"
                        >mdi-star</v-icon>
                      </template>
                      <span>{{$t("kh.contextmenu.removefavorite") }}</span>
                    </v-tooltip>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </div>
          </v-container>
        </div>
      </div>

      <v-dialog v-model="dialog_remove" max-width="350">
        <v-card>
          <v-card-title class="headline">{{$t("common.remove_confirm_title")}}</v-card-title>
          <v-card-text>{{$t("kh.dialog.remove")}}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog_remove = false">Hủy</v-btn>
            <v-btn color="red darken-1" text @click="removeNode">Xóa</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog Next router document -->
      <v-dialog v-model="dialogSave" max-width="350">
        <v-card>
          <v-card-title class="headline">{{$t("kh.dialog.save")}}</v-card-title>
          <v-card-text>{{$t("kh.dialog.note")}}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="saveDocument">Lưu</v-btn>
            <v-btn color="red darken-1" text @click="dialogSave = false">Hủy</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-navigation-drawer>
  </vue-resizable>
</template>

<script>
import { knowledgeApi } from "./../../api/kh.js";
import { util } from "./../../plugins/util";
import { SYMPER_APP } from "./../../main.js";
import VueResizable from "vue-resizable";
export default {
  components: { VueResizable },
  data() {
    let self = this;
    return {
      openAll: false,
      isFavorite: -1,
      showByIndex: null,
      oldHashPath: "",
      statusMove: 3,
      isShowSidebar: true,
      id: -1,
      path: "",
      parentPath: "",
      hash: "",
      content: "",
      x: 0,
      y: 0,
      search: null,
      txtNode: "",
      showMenu: false,
      context_create: false,
      dialog_remove: false,
      showAddNode: false,
      dialogSave: false,
      open: [],
      tree: [],
      contextMenu: [
        {
          title: this.$t("kh.contextmenu.add"),
          menuAction: action => {
            this.context_create = true;
          },
          icon: "mdi-plus"
        },
        {
          title: this.$t("kh.contextmenu.rename"),
          menuAction: action => {
            this.rename(
              this.path,
              this.id,
              this.txtNode,
              this.parentPath,
              this.content,
              this.hash
            );
          },
          icon: "mdi-border-color"
        },
        {
          title: this.$t("kh.contextmenu.move"),
          menuAction: action => {
            this.oldHashPath = this.hash;
            this.statusMove = 2;
          },
          icon: "mdi-folder-move"
        },
        {
          title: this.$t("kh.contextmenu.paste"),
          menuAction: action => {
            let self = this;
            if (this.oldHashPath != "") {
              let data = {};
              data.hash = self.oldHashPath;
              data.parentPath = self.path;
              knowledgeApi
                .moveItemToDirectory(data)
                .then(res => {
                  if (res.status == 200) {
                    if (res.data.isObj == 1) {
                      //dichuyen doc
                      data.name = res.data.name;
                      data.id = res.data.id;
                      data.parentPath = res.data.parentPath;
                      data.hash = res.data.hash;
                      self.$store.dispatch("kh/MoveDocToTreeViewStore", data);
                    } else {
                      //dichuyen thư mục
                      data.name = res.data.name;
                      data.path = res.data.path;
                      data.parentPath = res.data.parentPath;
                      data.hash = res.data.hash;
                      self.$store.dispatch(
                        "kh/MoveFolderToTreeViewStore",
                        data
                      );
                    }
                    // self.$store.dispatch("kh/addToTreeViewStore", data);
                  } else if (res.status == 403) {
                    SYMPER_APP.$snotifyError("Error", res.message);
                  } else if (res.status == 400) {
                    SYMPER_APP.$snotifyError("Error", res.message);
                  }
                })
                .catch(err => {
                  console.log("error from Move item to tree!!!", err);
                })
                .always(() => {});
            }
            this.statusMove = 3;
            this.oldHashPath = "";
          },
          icon: "mdi-content-paste"
        },
        {
          title: this.$t("kh.contextmenu.addfavorite"),
          menuAction: action => {
            let id = this.id;
            let isFavorite = this.isFavorite;
            let name = this.txtNode;
            let parentPath = this.parentPath;
            let hash = this.hash;
            this.updateFavorite(id, isFavorite, name, parentPath, hash);
          },
          icon: "mdi-star"
        },
        {
          title: this.$t("kh.contextmenu.removefavorite"),
          menuAction: action => {
            let id = this.id;
            let isFavorite = this.isFavorite;
            let name = this.txtNode;
            let parentPath = this.parentPath;
            let hash = this.hash;
            this.updateFavorite(id, isFavorite, name, parentPath, hash);
          },
          icon: "mdi-star-off"
        },
        {
          title: this.$t("kh.contextmenu.delete"),
          menuAction: action => {
            this.dialog_remove = true;
          },
          icon: "mdi-delete-forever"
        }
      ],
      contextCreate: [
        {
          title: this.$t("kh.contextmenu.folder"),
          menuAction: action => {
            var path = this.path;
            $("#" + path)
              .closest(".v-treeview-node")
              .attr("aria-expanded", "true");
            let nameInput = $(
              // "<div class='v-list-item new-add-obj'><i class='newFolder v-icon fs-14 mdi mdi-folder'></i><input id='newFolder'  class='new-obj' ></div>"
              "<div class='v-list-item new-add-obj'><i class='newFolder v-icon fs-14 mdi mdi-folder'></i><input id='symper-kh-add-node'  class='new-obj' ></div>"
            );
            nameInput.insertAfter(
              $("#" + path).closest(".v-treeview-node__root")
            );
            nameInput.find("#symper-kh-add-node").on("blur", function(evt) {
              $(this)
                .parent()
                .remove();
            });

            // $(
            //   "<div class='v-list-item new-add-obj'><i class='newFolder v-icon fs-14 mdi mdi-folder'></i><input id='newFolder'  class='new-obj' ></div>"
            // ).insertAfter($("#" + path).closest(".v-treeview-node").find(".v-treeview-node__children").find(".v-treeview-node"));

            setTimeout(() => {
              $("#symper-kh-add-node").focus();
            }, 200);
            $("#symper-kh-add-node").keyup(function(e) {
              if (e.keyCode === 13) {
                let data = {};
                var name = $("#symper-kh-add-node")
                  .val()
                  .trim();
                if (name != "") {
                  data.name = name;
                  data.parentPath = path;
                  knowledgeApi
                    .addDirectory(data)
                    .then(res => {
                      if (res.status == 200) {
                        data.name = res.data.name;
                        data.path = res.data.path;
                        data.position = res.data.position;
                        data.userId = res.data.userId;
                        data.isDelete = res.data.isDelete;
                        data.isFavorite = res.data.isFavorite;
                        data.createdAt = res.data.createdAt;
                        data.updatedAt = res.data.updatedAt;
                        data.hash = res.data.hash;
                        self.$store.dispatch("kh/addToTreeViewStore", data);
                        // add directory to list table
                        var url = window.location.href;
                        var pos = url.search("folder");
                        if (pos > 0) {
                          var hashUrl = self.$route.params.hash;
                          if (self.hash == hashUrl) {
                            self.$store.dispatch(
                              "kh/addToTableChildStore",
                              data
                            );
                          }
                        }
                      }
                    })
                    .catch(err => {
                      console.log("error from Add folder to treee!!!", err);
                    })
                    .always(() => {});
                }

                $("div").remove(".new-add-obj");
                // $(".new-add-obj").addClass("d-none");
              }
            });
          },
          icon: "mdi-folder"
        },
        {
          title: this.$t("kh.contextmenu.document"),
          menuAction: action => {
            var path = this.path;
            $("#" + path)
              .closest(".v-treeview-node")
              .attr("aria-expanded", "true");

            let nameInput = $(
              "<div class='v-list-item new-add-obj'><i class='newFolder v-icon fs-14 mdi mdi-file-document-outline'></i><input id='symper-kh-add-node' class='new-obj' ></div>"
            );
            nameInput.insertAfter(
              $("#" + path).closest(".v-treeview-node__root")
            );
            nameInput.find("#symper-kh-add-node").on("blur", function(evt) {
              $(this)
                .parent()
                .remove();
            });

            $("#symper-kh-add-node").focus();
            $("#symper-kh-add-node").keyup(function(e) {
              if (e.keyCode === 13) {
                let data = {};
                var name = $("#symper-kh-add-node")
                  .val()
                  .trim();
                if (name != "") {
                  data.name = name;
                  data.parentPath = path;
                  data.action = self.$t("snippet.contextMenu.add");
                  knowledgeApi
                    .addDocument(data)
                    .then(res => {
                      if (res.status == 200) {
                        data.name = res.data.name;
                        data.id = res.data.id;
                        data.slug = res.data.slug;
                        data.content = res.data.content;
                        data.userId = res.data.userId;
                        data.isDelete = res.data.isDelete;
                        data.isFavorite = res.data.isFavorite;
                        data.createdAt = res.data.createdAt;
                        data.updatedAt = res.data.updatedAt;
                        data.hash = res.data.hash;

                        self.$store.dispatch("kh/addDocToTreeViewStore", data);
                        var url = window.location.href;
                        var pos = url.search("folder");
                        if (pos > 0) {
                          var hashUrl = self.$route.params.hash;
                          if (self.hash == hashUrl) {
                            self.$store.dispatch(
                              "kh/addToTableChildStore",
                              data
                            );
                          }
                        }
                      }
                    })
                    .catch(err => {
                      console.log("error from Add doc to treee!!!", err);
                    })
                    .always(() => {});
                }
                $("div").remove(".new-add-obj");
              }
            });
          },
          icon: "mdi-file-document-outline"
        }
      ],
      favorite: [
        { text: "Real-Time", icon: "mdi-file-document-outline" },
        { text: "Audience", icon: "mdi-file-document-outline" },
        { text: "Conversions", icon: "mdi-file-document-outline" }
      ]
    };
  },
  watch: {
    "skh.listDocumentFavorite": function(newVl) {},
    search: function(newVl) {
      if (newVl != null) {
        this.openAll = true;
      } else {
        this.openAll = false;
      }
    },
    "skh.currentDocument": function(newVl) {
      if (newVl == "") {
        this.$store.commit("kh/resetData", true);
      }
    }
  },
  methods: {
    dbclickDoc(path, id, hash) {
      $(".favorite .v-list-item").removeClass("v-item--active");
      if (!this.skh.statusEdit) {
        this.hash = hash;
        this.dialogSave = true;
      } else {
        if (id != undefined) {
          var url = window.location.href;
          var pos = url.search("document");
          this.$store.commit("kh/setCurrentDocument", hash);
          if (pos > 0) {
            const state = {};
            const title = "SYMPER APP";
            const url = "/#/knowledge/document/" + hash;
            history.pushState(state, title, url);
          } else {
            this.$router.push("/knowledge/document/" + hash);
          }
        }
      }
    },
    /**
     * Thay đổi trạng thái doc để lưu doc
     */
    saveDocument() {
      this.$store.commit("kh/changeStatusEdit", !this.skh.statusEdit);
      this.dialogSave = false;
      let hash = this.hash;
      this.$store.commit("kh/setCurrentDocument", hash);
      const state = {};
      const title = "SYMPER APP";
      const url = "/#/knowledge/document/" + hash;
      history.pushState(state, title, url);
    },
    /**
     * Show div input thêm node và focus vào input
     */
    addNode() {
      this.showAddNode = true;
      setTimeout(
        self => {
          self.$refs.newFolderInput.focus();
        },
        100,
        this
      );
    },
    /**
     * Bắt sự kiện Blur khỏi input add node
     */
    handleBlur(e) {
      this.showAddNode = false;
      this.txtNode = "";
    },
    /**
     *  Add node khi nhấn Enter
     */
    validateAddNode: function(e) {
      if (e.keyCode === 13) {
        let data = {};
        data.name = this.txtNode.trim();
        data.parentPath = "";
        if (data.name != "") {
          knowledgeApi
            .addDirectory(data)
            .then(res => {
              if (res.status == 200) {
                this.showAddNode = false;
                this.txtNode = "";

                data.name = res.data.name;
                data.path = res.data.path;
                data.position = res.data.position;
                data.userId = res.data.userId;
                data.isDelete = res.data.isDelete;
                data.isFavorite = res.data.isFavorite;
                data.createdAt = res.data.createdAt;
                data.updatedAt = res.data.updatedAt;
                data.hash = res.data.hash;

                this.$store.dispatch("kh/addToTreeViewStore", data);
                this.$store.dispatch("kh/addToTableRootStore", data);
              }
            })
            .catch(err => {
              console.log("error from add directory api!!!", err);
            })
            .always(() => {});
        }
      }
    },
    /**
     * Ẩn hiện side bar KH
     */
    invertSubSidebarShow() {
      this.$store.commit(
        "kh/changeSubCollapseSidebar",
        !this.skh.subCollapseSideBar
      );
    },
    /**
     * Hiển thị dialog thêm sửa xóa
     */
    show(e, path, name, id, parentPath, content, hash, isFavorite) {
      e.preventDefault();
      this.id = id;
      this.path = path;
      this.hash = hash;
      this.content = content;
      this.txtNode = name;
      this.parentPath = parentPath;
      this.isFavorite = isFavorite;
      this.showMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      console.log("id-" + id + " path: " + path + " hash: " + hash);
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
    changeValueOpenAll() {
      setTimeout(
        self => {
          self.openAll = true;
        },
        100,
        this
      );
    },
    /**
     * Xóa node
     */
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
              var url = window.location.href;
              if (/document/g.test(url)) {
                this.$router.push("/knowledge");
                this.$store.commit("kh/resetData", true);
              }
            } else if (res.status == 403) {
              thisCpn.dialog_remove = false;
              SYMPER_APP.$snotifyError("Error", res.message);
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
              this.$store.dispatch("kh/removeDirToTableRootStore", path);
            } else if (res.status == 403) {
              thisCpn.dialog_remove = false;
              SYMPER_APP.$snotifyError("Error", res.message);
            }
          })
          .catch(err => {
            console.log("error from delete folder user api!!!", err);
          })
          .always(() => {});
      }
      //reset lại id và txtnode
      this.id = -1;
      this.path = "";
      this.txtNode = "";
      this.parentPath = "";
    },
    rename(path, id, name, parentPath, content, hash) {
      let self = this;
      if (id > 0) {
        // rename document
        var renameInput = $("<input id=" + id + " value=" + name + " >");
        $("#" + id).replaceWith(renameInput);
        $("#" + id).val(name);
        renameInput.on("blur", function(evt) {
          $(this).replaceWith(
            "<p id=" +
              id +
              " style='padding-bottom: 3px; margin: 0px;'>" +
              name +
              " </p>"
          );
        });
        setTimeout(function() {
          $("#" + id)
            .focus()
            .val(name)
            .select();
        }, 200);

        $("#" + id).keyup(function(e) {
          if (e.keyCode === 13) {
            var text = $("#" + id)
              .val()
              .trim();
            if (text != "" && text != name) {
              let data = {};
              data.id = id;
              data.name = text;
              data.parentPath = parentPath;
              knowledgeApi
                .renameDocument(data)
                .then(res => {
                  if (res.status == 200) {
                    // update cả item cho table list
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
                  } else if (res.status == 403) {
                    SYMPER_APP.$snotifyError("Error", res.message);
                  }
                })
                .catch(err => {
                  console.log("error from rename document api!!!", err);
                })
                .always(() => {});
            } else {
              $(this).replaceWith(
                "<p id=" +
                  id +
                  " style='padding-bottom: 3px; margin: 0px;'>" +
                  name +
                  " </p>"
              );
            }
          }
        });
      } else {
        // rename thư mục
        var renameInput = $("<input id=" + path + " value=" + name + " >");

        $("#" + path).replaceWith(renameInput);
        $("#" + path).val(name);
        renameInput.on("blur", function(evt) {
          $(this).replaceWith(
            "<p id=" +
              path +
              " style='padding-bottom: 3px; margin: 0px;'>" +
              name +
              " </p>"
          );
        });
        setTimeout(function() {
          $("#" + path)
            .focus()
            .val(name)
            .select();
        }, 200);

        $("#" + path).keyup(function(e) {
          if (e.keyCode === 13) {
            var text = $("#" + path)
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
                      "<p id=" +
                        "tb" +
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
            } else {
              $(this).replaceWith(
                "<p id=" +
                  path +
                  " style='padding-bottom: 3px; margin: 0px;'>" +
                  name +
                  " </p>"
              );
            }
          }
        });
      }
      //reset lại id và txtnode
      this.id = -1;
      this.path = "";
      this.txtNode = "";
      this.parentPath = "";
    },
    listToTree(data, options) {
      options = options || {};
      var ID_KEY = options.idKey || "path";
      var PARENT_KEY = options.parentKey || "parentPath";
      var CHILDREN_KEY = options.childrenKey || "children";

      var tree = [],
        childrenOf = {};
      var item, path, parentPath;
      for (var i = 0, length = data.length; i < length; i++) {
        item = data[i];
        path = item[ID_KEY];

        parentPath = item[PARENT_KEY] || 0; // every item may have children

        childrenOf[path] = childrenOf[path] || []; // init its children
        item[CHILDREN_KEY] = childrenOf[path];

        if (parentPath != "") {
          // init its parent's children object
          childrenOf[parentPath] = childrenOf[parentPath] || []; // push it into its parent's children object
          childrenOf[parentPath].push(item);
        } else {
          tree.push(item);
        }
      }

      return tree;
    },
    updateFavorite(id, isFavorite, name, parentPath, hash) {
      knowledgeApi
        .updateDocFavorite(id)
        .then(res => {
          if (res.status == 200) {
            if (isFavorite == 1) {
              //remove item to list favorite
              this.$store.dispatch("kh/removeDocumentToListFavoriteStore", id);
              this.$store.dispatch("kh/updateStatusDocumentFavoriteStore", id);
            } else {
              //add item to list favorite
              let item = {};
              item.id = id;
              item.parentPath = parentPath;
              item.name = name;
              item.hash = hash;
              item.isFavorite = 1;
              this.$store.dispatch("kh/addDocumentToListFavoriteStore", item);
              this.$store.dispatch("kh/updateStatusDocumentFavoriteStore", id);
            }
          } else if (res.status == 403) {
            SYMPER_APP.$snotifyError("Error", res.message);
          }
        })
        .catch(err => {
          console.log("error from delete folder user api!!!", err);
        })
        .always(() => {});

      this.id = -1;
      this.path = "";
      this.txtNode = "";
      this.parentPath = "";
    },
    handleContext(index) {
      if (index == 0) {
        this.context_create = true;
      } else {
        this.context_create = false;
      }
    }
  },
  computed: {
    sapp() {
      return this.$store.state.app;
    },
    skh() {
      return this.$store.state.kh;
    },
    filter() {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined;
    },
    treeFolderData() {
      let dataDirectory = util.cloneDeep(this.skh.allDirectory);
      let allDocument = util.cloneDeep(this.skh.allDocument);
      dataDirectory = dataDirectory.concat(allDocument);
      let root = this.listToTree(dataDirectory);
      return root;
    },
    favorites() {
      return this.skh.listDocumentFavorite;
    }
  },
  created() {
    this.hash = this.$route.params.hash;
    if (this.skh.allDirectory.length <= 0) {
      this.$store.dispatch("kh/getAllDirectory");
      this.$store.dispatch("kh/getAllDocument");
      this.$store.dispatch("kh/getDocumentFavorite");
    }
  }
};
</script>

<style scoped>
.resizable-component{
  height: 100%!important;
}
.resizable-content {
  height: 100%;
  width: 100%;
}
.collapse-sidebar-btn {
  position: absolute;
  bottom: 20px;
  right: 10px;
  height: 30px;
  width: 30px;
}
.khSidebar {
  width: auto !important;
}
.khSidebar hr {
  display: none;
}
</style>