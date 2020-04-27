import Vue from "vue";
import Vuex from "vuex";
import appModule from "./app";
import documentModule from "./document";
import processModule from "./process";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        app: appModule,
        document: documentModule,
        process: processModule
    }
});