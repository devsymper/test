<template>
<div class="w-100 h-100">
   <v-skeleton-loader
        v-if="loading"
        class="mx-auto"
        width="100%"
        height="100%"
        type="table"
        >
      </v-skeleton-loader>
  <div class="document h-100" style="display: flex;
    width: 100%;">
    <side-bar />
    <k-h-editor>
    </k-h-editor>
    <k-h-side-bar-right />
  </div>
</div>
  
</template>

<script>
import SideBar from "./../../components/kh/KHSideBar.vue";
import KHEditor from "./../../components/kh/KHEditor.vue";
import KHSideBarRight from "./../../components/kh/KHSideBarRight.vue";

export default {
  data(){
    return{
      loading:true,
    }
  },
  components: {
    SideBar,
    KHEditor,
    KHSideBarRight
  },
  watch: {
  },
  methods: {
    /**
     * Ẩn hiện slug header KH
     */
    invertSubSidebarShow() {
      this.$store.commit("kh/changeHeaderSlugKH", 2);
    },
    /**
     * thay đổi trạng thái edit document
     */ invertStatusRightBar() {
      this.$store.commit("kh/changeStatusEdit", !this.skh.statusEdit);
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
  activated(){
    this.invertSubSidebarShow();
  },
  created: function() {
    setTimeout(() => {
      this.loading=false;
    }, 200);
    
  },
 
};
</script>

<style>
</style>