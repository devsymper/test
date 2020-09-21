import Vue from "vue";
import Vuex from "vuex";
import appModule from "./app";
import documentModule from "./document";
import processModule from "./process";
import orgchartModule from "./orgchart";
import permissionModule from "./permission";
import actionPackModule from "./actionPack";
import importExcelModule from './importExcel';
import searchModule from './search';

/**
 * Khi thêm một module mới vào store thì chỉ cần tạo folder mới với tên trùng với tên module cần tạo 
 * là hệ thống sẽ tự động import vào trong store,
 * Không cần phải khai báo thủ công vào trong file này nữa
 */
function autoImportStoreModules() {
    var context = require.context('./', true, /\.(js)$/);
    var files = {};
    context.keys().forEach((filePath) => {
        if (filePath != './index.js' && filePath.includes('index.js')) {
            let moduleName = filePath.match(/\.\/[a-zA-Z_0-9]+\//)[0];
            moduleName = moduleName.substring(2, moduleName.length - 1);
            files[moduleName] = context(filePath)['default'];
        }
    });
    return files;
}

let storeModules = autoImportStoreModules();
Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        app: appModule,
        document: documentModule,
        process: processModule,
        orgchart: orgchartModule,
        permission: permissionModule,
        actionPack: actionPackModule,
        importExcel: importExcelModule,
        search: searchModule,
    }
});