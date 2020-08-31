import Vue from "vue";
import Vuex from "vuex";
import appModule from "./app";
import documentModule from "./document";
import processModule from "./process";
import orgchartModule from "./orgchart";
import permissionModule from "./permission";
import actionPackModule from "./actionPack";
import comment from "./comment";
import AppConfig from "./AppConfig";
import searchModule from './search';
import khModule from "./kh";
import timeSheetModule from './timesheet';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        app: appModule,
        document: documentModule,
        process: processModule,
        orgchart: orgchartModule,
        permission: permissionModule,
        actionPack: actionPackModule,
        comment: comment,
        appConfig: AppConfig,
        search: searchModule,
        kh: khModule,
        timesheet: timeSheetModule,
    }
});