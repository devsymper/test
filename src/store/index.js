import Vue from "vue";
import Vuex from "vuex";
import appModule from "./app";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app: appModule
  }
});
