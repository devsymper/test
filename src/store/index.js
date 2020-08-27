import Vue from "vue";
import Vuex from "vuex";
import appModule from "./app";
import documentModule from "./document";
import processModule from "./process";
import orgchartModule from "./orgchart";
import permissionModule from "./permission";
import actionPackModule from "./actionPack";
import searchModule from './search';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        app: appModule,
        document: documentModule,
        process: processModule,
        orgchart: orgchartModule,
        permission: permissionModule,
        actionPack: actionPackModule,
        search: searchModule,
    }
});