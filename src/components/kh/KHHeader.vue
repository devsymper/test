<template>
  <div class="kh-header">
    <div class="kh-header-slug">
      <v-icon
        class="fs-16"
        style="float:left; margin-left:10px; margin-right:0px;padding-top: 8px;"
        v-if="skh.subCollapseSideBar==true"
        @click.stop="invertSubSidebarShow()"
      >mdi-chevron-double-right</v-icon>
      <v-icon
        class="fs-16"
        style="float:left; margin-left:10px; margin-right:0px;padding-top: 8px;"
        v-if="skh.subCollapseSideBar==false"
        @click.stop="invertSubSidebarShow()"
      >mdi-chevron-double-left</v-icon>
      <div class="kh-slug" v-if="skh.header_slug!=0">
        <span id="slug" v-for="(item, index) in slugs" :key="index">
          <span class="kh-slug-item" @click.stop="goRoute(item.id,item.hash)">{{item.name}}</span>
          <span v-if="index < count-1 ">/</span>
        </span>
        <span class="status-view" v-if="skh.header_slug==2 && skh.statusEdit==true ">View</span>
        <span class="status-editing" v-if="skh.header_slug==2 && skh.statusEdit==false ">Editing</span>
      </div>
    </div>
    <div style="margin-left: auto; margin-right: 9px;">
      <div class="kh-toolbox" v-if="skh.header_slug==1">
        <v-text-field
          class="d-inline-block sym-small-size"
          single-line
          append-icon="mdi-magnify"
          outlined
          dense
          v-model="skh.search"
          label="Search"
          :placeholder="$t('common.search')"
        ></v-text-field>
      </div>
      <div class="kh-toolbox2" v-if="skh.header_slug==2">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              v-on="on"
              v-if="skh.statusEdit"
              @click.stop="invertStatusEdit()"
            >mdi-pencil-box-outline</v-icon>
            <v-icon
              v-on="on"
              v-else-if="!skh.statusEdit"
              @click.stop="invertStatusEdit()"
            >mdi-content-save</v-icon>
          </template>
          <span>{{skh.statusEdit? $t("kh.sidebar.edit") : $t("kh.toolbox.save")}}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" @click.stop="invertStatusRightBar(1)">mdi-attachment</v-icon>
          </template>
          <span>{{$t("kh.toolbox.attach")}}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" @click.stop="invertStatusRightBar(2)">mdi-menu</v-icon>
          </template>
          <span>{{$t("kh.toolbox.toc")}}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" @click.stop="invertStatusRightBar(3)">mdi-message-reply-text</v-icon>
          </template>
          <span>{{$t("kh.toolbox.comment")}}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" @click.stop="invertStatusRightBar(4)">mdi-history</v-icon>
          </template>
          <span>{{$t("kh.toolbox.history")}}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" @click.stop="invertStatusRightBar(5)">mdi-cloud-upload</v-icon>
          </template>
          <span>{{$t("kh.toolbox.backup")}}</span>
        </v-tooltip>
      </div>
    </div>
    <!-- cpn2 -->

    <!-- Dialog Next router document -->
    <v-dialog v-model="dialogSave" max-width="350">
      <v-card>
        <v-card-title class="headline">{{$t("kh.dialog.save")}}</v-card-title>
        <v-card-text>{{$t("kh.dialog.note")}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialogSave = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { knowledgeApi } from "./../../api/kh.js";
export default {
  data() {
    return {
      x: 0,
      y: 0,
      hash: "",
      count: 0,
      slugs: [],
      dialogSave: false
   
    };
  },
  watch: {
    "skh.currentDocument": function(newVl) {
      this.hash = newVl;
      var url = window.location.href;
      if(/folder/g.test(url)){
        this.invertHeaderSlugKH(1);
      }
      else if(/document/g.test(url)){
        this.invertHeaderSlugKH(2);
      }
      else{
        this.invertHeaderSlugKH(0);
      }
      this.getSlug();
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
  methods: {
    /**
     * Ẩn hiện slug header KH
     */
    invertHeaderSlugKH(status) {
      this.$store.commit("kh/changeHeaderSlugKH", status);
    },
    showDialog(e) {
      this.x = e.clientX;
      this.y = e.clientY;
      this.context_create = true;
    },
  
    invertStatusEdit() {
      this.$store.commit("kh/changeStatusEdit", !this.skh.statusEdit);
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
     * Ẩn hiện side bar right
     */
    invertStatusRightBar(status) {
      this.$store.commit(
        "kh/changeStatusRightBar",
        (this.skh.statusRightBar = status)
      );
    },
    /**
     * gọi router
     */
    goRoute(id, hash) {
      if (!this.skh.statusEdit) {
        this.dialogSave = true;
      } else {
        if (id == undefined) {
          this.$store.commit("kh/setCurrentDocument", hash);
          this.$router.push("/knowledge/folder/" + hash);
        } else {
          this.$router.push("/knowledge/document/" + hash);
        }
      }
    },
    getSlug() {
      let self = this;
      if (this.skh.header_slug != 0 && this.hash != "") {
        knowledgeApi
          .getSlug(this.hash)
          .then(res => {
            if (res.status == 200 && res.data.listObject != null) {
              self.slugs = res.data.listObject;
              self.count = res.data.listObject.length;
            }
            
          })
          .catch(err => {
            console.warn(err, "error when get slug");
            this.$snotify({
              type: "error",
              title: this.$t("slug.error")
            });
          });
      }
      else{
               self.slugs = [];
              self.count = 0;
            }
    }
  },
  created() {
    this.hash = this.$route.params.hash;
    this.getSlug();
  }
};
</script>
<style scoped>
.kh-header {
  display: flex;
  height: 33px;
  border-bottom: 1px solid #cccccc;
}
.kh-header-slug {
  width: 700px;
}
.kh-slug {
  padding-top: 3px;
}
.kh-slug #slug {
  margin-left: 8px;
}
</style>
