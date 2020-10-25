<template>
  <div style="display: flex;
    width: 100%;">
    <side-bar />
    <home-page />
  </div>
</template>

<script>
import SideBar from "./../../components/kh/KHSideBar.vue";
import HomePage from "./../../components/kh/HomePage.vue";

export default {
  components: {
    SideBar,
    HomePage,
  },
  watch: {
  },
  methods: {
    /**
     * Ẩn hiện slug header KH
     */
    invertSubSidebarShow() {
      this.$store.commit("kh/changeHeaderSlugKH", 0);
    }
  },
  computed: {
    sapp() {
      return this.$store.state.app;
    }
  },

  created: function() {
    this.invertSubSidebarShow();
    //this.getAllFolder();
  }
};
</script>

<style>
</style>