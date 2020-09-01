<template>
  <div class="h-100 kh-sidebar-right" :class="{'d-none' : skh.statusRightBar==-1}">
    <div class="kh-sbr-all ml-4" v-if="skh.statusRightBar==1">
      <div class="row sb-top" style="height:33px;">
        <div class="symper-title col pt-1 pl-1">Tệp đính kèm</div>
        <div class="r-right col">
          <v-icon class="fs-16" @click="invertStatusRightBar(-1)">mdi-close</v-icon>
          <UploadFile @uploaded-file="uploaded" />
          <!-- <v-icon class="fs-16">mdi-plus</v-icon> -->
        </div>
      </div>
      <div class="row sb-top">
        <div class="symper-title col pt-1 pl-1">Tên file</div>
        <div class="r-right col-md-5" style="padding-top:4px;">
          <div class="symper-title">Ngày đăng</div>
        </div>
      </div>
      <div class="list-item">
        <!-- <v-sheet id="scrolling-techniques" class="overflow-y-auto" max-height="498"> -->
        <v-container
          class="scroll-bar-right"
          max-height="498"
          style="height: calc(100vh - 65px);overflow: auto;"
        >
          <v-list dense>
            <v-list-item-group class>
              <v-list-item
                v-for="(item, i) in listFileAttachment"
                :key="i"
                @contextmenu="show($event,item.serverPath,item.name,item.type,item.id)"
              >
                <v-icon
                  class="fs-14"
                  v-if="item.type=='jpg' || item.type=='png' ||item.type=='jpeg'"
                >mdi-image</v-icon>
                <v-icon class="fs-14" v-else>mdi-file-document-outline</v-icon>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-list-item-title v-on="on" class="fs-13" v-text="item.name+'.'+item.type"></v-list-item-title>
                  </template>
                  <span>{{ item.name+'.'+item.type }}</span>
                </v-tooltip>
                <v-list-item-title class="fs-13 sb-date-file" v-text="item.createAt"></v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-container>
        <!-- </v-sheet> -->
      </div>
    </div>
    <div class="kh-table-content kh-sbr-all ml-4" v-if="skh.statusRightBar==2">
      <div class="row sb-top" style="height:33px;">
        <div class="symper-title col pt-1 pl-1">Mục lục</div>
        <div class="r-right col">
          <v-icon class="fs-16" @click="invertStatusRightBar(-1)">mdi-close</v-icon>
        </div>
      </div>
      <div class="kh-toc">
        <ul id="toc"></ul>
      </div>
    </div>
    <div class="kh-comment kh-sbr-all ml-4" v-if="skh.statusRightBar==3">
      <div class="row sb-top" style="height:33px;">
        <div class="symper-title col pt-1 pl-1">Bình luận</div>
        <div class="r-right col">
          <v-icon class="fs-16" @click="invertStatusRightBar(-1)">mdi-close</v-icon>
        </div>
      </div>
    </div>
    <div class="kh-history kh-sbr-all ml-4" v-if="skh.statusRightBar==4">
      <div class="row sb-top" style="height:33px;">
        <div class="symper-title col pt-1 pl-1">Lịch sử</div>
        <div class="r-right col">
          <v-icon class="fs-16" @click="invertStatusRightBar(-1)">mdi-close</v-icon>
        </div>
      </div>
      <div class="row sb-top">
        <table>
          <tr>
            <td
              class="symper-title"
              @click="showHistory(0)"
              :class="{'td-active' :history_active==0}"
            >Tất cả</td>
            <td
              class="symper-title"
              @click="showHistory(1)"
              :class="{'td-active' :history_active==1}"
            >Văn bản hiện tại</td>
          </tr>
        </table>
      </div>
      <div v-if="history_active==0">
        <!-- <v-sheet id="scrolling-techniques" class="overflow-y-auto" max-height="498"> -->
        <v-container
          class="scroll-bar-right"
          max-height="498"
          style="height: calc(100vh - 65px);overflow: auto;"
        >
          <v-list dense class="list-log">
            <v-list-item-group>
              <v-list-item v-for="(item, i) in listLogAll" :key="i">
                <v-avatar>
                  <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
                </v-avatar>
                <!-- <v-list-item-title class="fs-13"><b>{{item.userName}}</b> Đã {{item.action}} văn bản <b>{{item.name}}</b></v-list-item-title> -->
                <p class="fs-13">
                  <b>{{item.userName}}</b>
                  Đã {{convertAction(item.action)}}
                  <span
                    v-if="item.docId!=undefined"
                  >{{$t("kh.document")}}</span>
                  <span v-if="item.docId==undefined">{{$t("kh.folder")}}</span>
                  <b>{{item.name}}</b>
                  <br />
                  {{item.createdAt}}
                </p>
                <!-- <p class="fs-13">{{item.createdAt}}</p> -->
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-container>
        <!-- </v-sheet> -->
      </div>
      <div v-if="history_active==1">
        <!-- <v-sheet id="scrolling-techniques" class="overflow-y-auto" max-height="498"> -->
        <v-container
          class="scroll-bar-right"
          max-height="498"
          style="height: calc(100vh - 65px);overflow: auto;"
        >
          <v-list dense class="list-log">
            <v-list-item-group>
              <v-list-item v-for="(item, i) in listLogDoc" :key="i">
                <v-avatar>
                  <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
                </v-avatar>
                <p class="fs-13">
                  <b>{{item.userName}}</b>
                  Đã {{convertAction(item.action)}}
                  <span>{{$t("kh.document")}}</span>
                  <b>{{item.name}}</b>
                  <br />
                  <span v-text="convertDate(item.createdAt)"></span>
                </p>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-container>
        <!-- </v-sheet> -->
      </div>
    </div>

    <div class="kh-history kh-sbr-all ml-4" v-if="skh.statusRightBar==5">
      <div class="row sb-top" style="height:33px;">
        <div class="symper-title col pt-1 pl-1">Backup</div>
        <div class="r-right col">
          <v-icon class="fs-16" @click="invertStatusRightBar(-1)">mdi-close</v-icon>
        </div>
      </div>
      <div class="row sb-top">
        <div class="symper-title col pt-1 pl-1">Phiên bản</div>
        <div class="r-right col-md-6" style="padding-top:4px;">
          <div class="symper-title">Ngày tạo</div>
        </div>
      </div>
      <div class="list-item">
        <v-list dense>
          <v-list-item-group class>
            <v-list-item 
              v-for="(item, i) in listBackupDocument" 
              :key="i"
              @contextmenu="showMenuBackup($event,item.id,item.docName,item.docContent)"
              >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-list-item-title v-on="on" class="fs-13 text-ellipsis" v-text="item.backupName"></v-list-item-title>
                </template>
                <span>{{ item.backupName }}</span>
              </v-tooltip>
              <v-list-item-title class="fs-13 his-date" v-text="convertDate(item.createdAt)"></v-list-item-title>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    class="fs-14"
                    @click="backupDocument(item.id,item.docContent)"
                  >mdi-backup-restore</v-icon>
                </template>
                <span>{{ $t("kh.sidebar.restore") }}</span>
              </v-tooltip>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
    </div>
    <!-- Dialog Remove Node -->
    <v-dialog v-model="dialogAlert" max-width="450">
      <v-card>
        <v-card-title class="headline">{{header}}</v-card-title>
        <v-card-text>{{title}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="handleClick">{{$t("kh.dialog.yes")}}</v-btn>
          <v-btn color="red darken-1" text @click="dialogAlert = false">{{$t("kh.dialog.cancel")}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-menu v-model="context_menu_backup" :position-x="x" :position-y="y" absolute offset-y>
      <v-list class="context-menu">
        <v-list-item
          v-for="(item, index) in contextMenuBackup"
          :key="index"
          @click="item.menuAction(item.title)"
          dense
        >
          <v-icon class="fs-15">{{item.icon}}</v-icon>
          <v-list-item-title class="fs-13">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu v-model="context_menu" :position-x="x" :position-y="y" absolute offset-y>
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

    <KHShowImage v-bind:name="name" v-bind:serverPath="serverPath" v-bind:type="type" v-bind:docContent="docContent" />
  </div>
</template>

<script>
import { knowledgeApi } from "./../../api/kh.js";
import UploadFile from "./../../components/kh/uploadfile";
import KHShowImage from "./../../components/kh/KHShowImage";

import { SYMPER_APP } from "./../../main.js";
export default {
  components: {
    UploadFile,
    KHShowImage
  },
  data() {
    return {
      fileId: 0,
      serverPath: "",
      name: "",
      type: "",
      docContent: "",
      header: "",
      title: "",
      x: 0,
      y: 0,
      context_menu: false,
      dialogAlert: false,
      context_menu_backup:false,
      history_active: 1,
      id: -1,
      docVersionID: 0,
      hash: "",
      items_attach: [
        {
          text: "tailieu",
          icon: "mdi-file-document-outline",
          created_at: "08/07/2020"
        },
        {
          text: "thietke",
          icon: "mdi-file-document-outline",
          created_at: "09/07/2020"
        },
        { text: "image-logo", icon: "mdi-file-image", created_at: "09/07/2020" }
      ],
      contextMenu: [
        {
          title: this.$t("kh.contextmenu.open"),
          menuAction: action => {
            this.$store.commit("kh/changeStatusShowImage", true);
          },
          icon: "mdi-book-open-variant"
        },
        {
          title: this.$t("kh.contextmenu.download"),
          menuAction: action => {},
          icon: "mdi-inbox-arrow-down"
        },
        {
          title: this.$t("kh.contextmenu.rename"),
          menuAction: action => {},
          icon: "mdi-pencil"
        },
        {
          title: this.$t("kh.contextmenu.delete"),
          menuAction: action => {
            this.header = this.$t("common.remove_confirm_title");
            this.title = this.$t("kh.dialog.remove");
            this.dialogAlert = true;
          },
          icon: "mdi-delete-forever"
        }
      ],
      contextMenuBackup:[
         {
          title: this.$t("kh.contextmenu.viewcontent"),
          menuAction: action => {
            this.$store.commit("kh/changeStatusShowImage", true);
          },
          icon: "mdi-view-carousel"
        },
        {
          title: this.$t("kh.sidebar.restore"),
          menuAction: action => {
            let id=this.id;
            this.backupDocument(id);
          },
          icon: "mdi-backup-restore"
        },
      ]
    };
  },
  methods: {
    convertAction(action) {
      if (action == 1) {
        return this.$t("kh.sidebar.add");
      } else if (action == 2) {
        return this.$t("kh.sidebar.edit");
      } else if (action == 3) {
        return this.$t("kh.sidebar.delete");
      } else if (action == 4) {
        return this.$t("kh.sidebar.add_favorite");
      } else if (action == 5) {
        return this.$t("kh.sidebar.delete_favorite");
      } else if (action == 6) {
        return this.$t("kh.sidebar.attach");
      } else if (action == 7) {
        return this.$t("kh.sidebar.restore");
      } else if (action == 8) {
        return this.$t("kh.sidebar.rename");
      }
    },
    /**
     * bắt sự kiện upload file
     */
    uploaded(dataObj) {
      if (dataObj.status == 200) {
        let hash = this.skh.currentDocument;
        if (hash == "" || hash.length == 0) {
          hash = this.$route.params.hash;
        }
        let file = dataObj.data;
        let data = {};
        data.hash = hash;
        data.fileId = file.id;
        knowledgeApi
          .uploadFileDocument(data)
          .then(res => {
            if (res.status == 200) {
              this.$store.dispatch("kh/addToListAttachStore", dataObj.data);
            }
          })
          .catch(err => {
            console.log("error from Add doc to treee!!!", err);
          })
          .always(() => {});
      } else {
        SYMPER_APP.$snotifyError(error, dataObj.message);
      }
    },
    /**
     * Ẩn hiện side bar right
     */
    invertStatusRightBar(status) {
      this.$store.commit(
        "kh/changeStatusRightBar",
        (this.skh.statusRightBar = status)
      );
    },
    showHistory(is_active) {
      if (is_active == 0) {
        this.$store.dispatch("kh/getLogAll");
      }
      this.history_active = is_active;
    },
    backupDocument(id) {
      this.docVersionID = id;
      this.header = this.$t("kh.dialog.restore");
      this.title = this.$t("kh.dialog.titleRestore");
      this.dialogAlert = true;
    },
    /**
     * restore lại bản backup
     */
    restoreDocument() {
      if (this.docVersionID != 0) {
        setTimeout(() => {
          this.$store.commit("kh/changeStatusBackup", true);
        }, 200);
        let id = this.docVersionID;
        knowledgeApi
          .restoreDocumentBackup(id)
          .then(res => {
            if (res.status == 200) {
              this.$store.commit("kh/changeStatusRestore", true);
            }
          })
          .catch(err => {
            console.log("error from restore backup document!!!", err);
          })
          .always(() => {});
      }
      this.dialogAlert = false;
    },
    listToConvertLog(log, users) {
      for (let i = 0; i < log.length; i++) {
        var uid = log[i]["userId"];
        let obj = users.find(data => data.id === uid);
        if (obj) {
          var index = users.indexOf(obj);
          log[i]["userName"] = users[index].displayName;
        }
      }
      return log;
    },
    detectHeading() {
      $("#toc").empty();
      $("#toc").toc({
        content: "#myeditablediv",
        headings: "h1,h2,h3,h4,h5,h6"
      });
    },
    getData(hash = false) {
      if (hash == false) {
        hash = this.$route.params.hash;
      }
      this.$store.dispatch("app/getAllUsers");
      this.$store.dispatch("kh/getLogDocument", hash);
      //this.$store.dispatch("kh/getLogAll");
      this.$store.dispatch("kh/getBackupDocument", hash);
      this.$store.dispatch("kh/getBackupDocument", hash);
      this.detectHeading();
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
    },
    /**
     * Hiển thị dialog
     */
    show(e, serverPath, name, type, id) {
      e.preventDefault();
      this.context_menu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.serverPath = serverPath;
      this.name = name;
      this.type = type;
      this.fileId = id;
      this.$nextTick(() => {
        this.context_menu = true;
      });
    },
    showMenuBackup(e,id,docName,docContent){
      e.preventDefault();
      this.context_menu_backup = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.id = id;
      this.name=docName;
      this.type = 'document_backup';
      this.docContent=docContent;
      this.$nextTick(() => {
        this.context_menu_backup = true;
      });
    },
    handleClick() {
      if (this.skh.statusRightBar == 1) {
        this.removeFileAttach();
      } else if (this.skh.statusRightBar == 5) {
        this.restoreDocument();
      }
    },
    removeFileAttach() {
      let fileId = this.fileId;
      knowledgeApi
        .removeFileAttach(fileId)
        .then(res => {
          if (res.status == 200) {
            this.$store.dispatch("kh/removeFileAttachToStore", fileId);
            this.$store.dispatch("kh/removeListArrFileAttach", fileId);
          } else if (res.status == 403) {
            SYMPER_APP.$snotifyError("Error", res.message);
          } else {
            SYMPER_APP.$snotifyError(
              "Error",
              "Error from delete attachment file!!!"
            );
          }
        })
        .catch(err => {
          console.log("error from delete attachment file!!!", err);
        })
        .always(() => {});
      this.dialogAlert = false;
    }
  },
  watch: {
    "skh.statusRightBar": function(newVl) {
      if (newVl == 1) {
        let hash = this.skh.currentDocument;
        if (hash == false) {
          hash = this.$route.params.hash;
        }
        this.$store.dispatch("kh/getFileAttachment", hash);
        let data = this.skh.arrIdFileAttach;
        this.$store.dispatch("kh/getArrFileAttachment", data);
      } else if (newVl == 2) {
        setTimeout(() => {
          this.detectHeading();
        }, 200);
      } else if (newVl == 4) {
        setTimeout(() => {
          let hash = this.skh.currentDocument;
          if (hash == false) {
            hash = this.$route.params.hash;
          }
          this.$store.dispatch("kh/getLogDocument", hash);
          //this.$store.dispatch("kh/getLogAll");
        }, 200);
      } else if (newVl == 5) {
        setTimeout(() => {
          let hash = this.skh.currentDocument;
          if (hash == false) {
            hash = this.$route.params.hash;
          }
          this.$store.dispatch("kh/getBackupDocument", hash);
        }, 200);
      }
    },
    "skh.currentDocument": function(newVl) {
      this.getData(newVl);
    }
  },
  computed: {
    sapp() {
      return this.$store.state.app;
    },
    skh() {
      return this.$store.state.kh;
    },
    listLogDoc() {
      let root = this.skh.listLogDocument;
      root = this.listToConvertLog(
        this.skh.listLogDocument,
        this.sapp.allUsers
      );
      return root;
    },
    listLogAll() {
      let root = this.skh.listLogAll;
      root = this.listToConvertLog(this.skh.listLogAll, this.sapp.allUsers);
      return root;
    },
    listBackupDocument() {
      let root = this.skh.listBackupDocument;
      return root;
    },
    listFileAttachment() {
      let root = this.skh.arrFileAttach;
      console.log(root);
      return root;
    }
  },
  created() {
    this.getData();
  },
  mounted() {
    $(".kh-toc").on("click", "a", function(event) {
      // var p = $(this);
      // var pos = p.offset();
      // //console.log(p[0].offsetLeft);
      // console.log(pos);
      //alert($(this).attr("href"));
      //  var oldHref=$(this).attr("href");
      //  var url=window.location.href;
      //  var newUrl=url+oldHref;
      //  alert(newUrl);
      //$(this).attr("href",newUrl);
    });
  }
};
</script>

<style scoped>
.kh-sidebar-right {
  width: 370px;
  position: absolute;
  right: 0px;
  top: 74px;
  border-left: 1px solid #bebebe;
  background-color: white;
}
.scroll-bar-right {
  padding-left: 0px;
  padding-top: 0px;
}
</style>