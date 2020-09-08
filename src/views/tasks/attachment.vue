<template>
  <div class="pt-0">
    <div class="text-right pb-3 mr-5">
      <UploadFile
        @uploaded-file="uploaded"
        :objectIdentifier="taskInfo.action.parameter.taskId"
        :objectType="`task`"
        style="margin-right:10px!important"
      />
      <span>Upload File</span> 
    </div>
    <v-data-table
      :headers="headers"
      :items="listFileAttachment"
      dense
      flat
      :disable-pagination="true"
      class="table-attachment tbl-no-border"
    >
      <template v-slot:[`item.name`]="{ item }">
        <v-list-item-group>
          <v-list-item
            active-class="v-item--active"
            dense
            @contextmenu="show($event,item.serverPath,item.name,item.type,item.id)"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <p
                  v-on="on"
                  :id="'tb'+item.id"
                  v-text="item.name"
                ></p>
              </template>
              <span>{{ item.name }}</span>
            </v-tooltip>
          </v-list-item>
        </v-list-item-group>
      </template>
      <template v-slot:item.userId="{ item }">
        <user v-if="item.userId && item.userId!= ''" :user="getUset(item.userId)"></user>
      </template>
      <template v-slot:item.remove="{ item }">
        <v-icon small color="red" :id="item.size">mdi-close</v-icon>
      </template>
    </v-data-table>

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
    <v-dialog v-model="dialogAlert" max-width="450">
      <v-card>
        <v-card-title class="headline">{{header}}</v-card-title>
        <v-card-text>{{title}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click=" removeFileAttach">{{$t("kh.dialog.yes")}}</v-btn>
          <v-btn color="red darken-1" text @click="dialogAlert = false">{{$t("kh.dialog.cancel")}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <KHShowFile
      @downloadOrBackupFile="downloadOrBackupFile"
      v-bind:fileId="fileId"
      v-bind:name="name"
      v-bind:serverPath="serverPath"
      v-bind:type="type"
    />
  </div>
</template>

<script>
import user from "./user";
import UploadFile from "@/components/common/UploadFile.vue";
import KHShowFile from "@/components/kh/KHShowImage";
import { taskApi } from "@/api/task.js";
import { knowledgeApi } from "@/api/kh.js";
import { SYMPER_APP } from "@/main.js";
export default {
  name: "attachment",
  components: {
    user,
    UploadFile,
    KHShowFile
  },
  props: {
    tabData: {
      type: Object,
      default: () => {}
    },
    taskInfo: {
      type: Object,
      default: () => {}
    }
  },
  
  data: function() {
    const srcs = {
      1: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
      2: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
      3: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
      4: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
      5: "https://cdn.vuetifyjs.com/images/lists/5.jpg"
    };
    return {
      x: 0,
      y: 0,
      context_menu: false,
      fileId: "",
      serverPath: "",
      name: "",
      type: "",
      dialogAlert: false,
      header:'',
      title:'',
      desserts: [
        {
          name: "Frozen Yogurt",
          size: 159,
          owner: { id: 1, name: "Sandra Adams", role: "BA", avatar: srcs[1] },
          type: "xlsx",
          date: "02-03-2020",
          remove: ""
        },
        {
          name: "Ice cream sandwich",
          size: 237,
          owner: { id: 2, name: "Ali Connors", role: "BA", avatar: srcs[2] },
          type: "pdf",
          date: "02-03-2020",
          remove: ""
        },
        {
          name: "Eclair",
          size: 262,
          owner: { id: 3, name: "Trevor Hansen", role: "BA", avatar: srcs[3] },
          type: "dpcs",
          date: "02-03-2020",
          remove: ""
        },
        {
          name: "Jelly bean",
          size: 375,
          owner: { id: 4, name: "Tucker Smith", role: "BA", avatar: srcs[2] },
          type: "xlsx",
          date: "02-03-2020",
          remove: ""
        },
        {
          name: "Lollipop",
          size: 392,
          owner: { id: 5, name: "Britta Holt", role: "BA", avatar: srcs[4] },
          type: "txt",
          date: "02-03-2020",
          remove: ""
        },
        {
          name: "KitKat",
          size: 518,
          owner: { id: 6, name: "Jane Smith ", role: "BA", avatar: srcs[5] },
          type: "ppt",
          date: "02-03-2020",
          remove: ""
        }
      ],
      headers: [
        {
          text: "File",
          align: "start",
          value: "name"
        },
        { text: "Kiểu", value: "type" },
        { text: "Người upload", value: "userId" },
        { text: "Size", value: "size" },
        { text: "Ngày", value: "createAt" },
        { text: "", value: "remove" }
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
          menuAction: action => {
            let fileId = this.fileId;
            this.downLoadFile(fileId);
          },
          icon: "mdi-download"
        },
        {
          title: this.$t("kh.contextmenu.rename"),
          menuAction: action => {
              alert("Đang hoàn thiện");
          },
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
    };
  },
  methods: {
    uploaded(dataObj) {
      this.$store.commit("task/addToListAttachStore", dataObj);
    },
    getUset(userId) {
      let allUser = this.sapp.allUsers;
      let obj = allUser.find(data => data.id === userId);
      return obj;
    },
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
    downloadOrBackupFile(data) {
      this.downLoadFile(data.fileId);
    },
    downLoadFile(id) {
        knowledgeApi
        .downloadFile(id)
        .then(res => {})
        .catch(err => {
          console.log("error download file!!!", err);
        })
        .always(() => {});
    },
    removeFileAttach() {
        alert("Chức năng đang được hoàn thiện");
    }
  },
  computed: {
    sapp() {
      return this.$store.state.app;
    },
    stask() {
      return this.$store.state.task;
    },
    listFileAttachment() {
      let arr = this.stask.arrFileAttach;
      console.log(arr);
      return arr;
    }
  },
  created() {
    let data = {};
    data.objectIdentifier = this.taskInfo.action.parameter.taskId;
    data.objectType = "task";
    this.$store.dispatch("task/getArrFileAttachment", data);
  }
};
</script>

<style scoped>
.theme--light.v-data-table >>> tbody >>> tr >>> td,
.table-attachment >>> .v-data-table__wrapper >>>table >>> tbody >>> tr >>> td {
    border: 0 !important;
    color:#757575!important;
    font-size: 13px!important;
}

</style>
