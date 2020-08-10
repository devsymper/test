import Api from "./api";
import { appConfigs } from "./../configs.js";

let api = new Api(appConfigs.apiDomain.importExcel);
export default {
    pushDataExcel(data) {
        return api.post('mapping-file', data)
    },
    getProcessing(key) {
        return api.get('getProcessStatus' + '/' + key)
    },
}