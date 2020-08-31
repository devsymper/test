<template>
  <div style="display: flex;
    width: 100%;">
    <side-bar />
    <compDetailFolder />
  </div>
</template>

<script>
import SideBar from "./../../components/kh/KHSideBar.vue";
import compDetailFolder from "./../../components/kh/KHDetailFolder.vue";

export default {

  components: {
    SideBar,
    compDetailFolder
  },
  watch: {
  },
  methods: {
    /**
     * Ẩn hiện slug header KH
     */
    invertSubSidebarShow() {
      this.$store.commit("kh/changeHeaderSlugKH", 1);
    }
  },
  computed: {
    sapp() {
      return this.$store.state.app;
    }
  },
  created: function() {
    this.invertSubSidebarShow();
  }
};
</script>

<style>
</style>