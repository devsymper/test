import Api from "./api";
import { appConfigs } from "./../configs.js";

let api = new Api(appConfigs.apiDomain.nofitication);

export default {
    showAllModuleConfig() {
        return api.get('sources')
    },
    showListsSubcribed() {
        return api.get('channels')
    },
    addChanel(data) {
        return api.post('channels', data)
    },
    subscribeChanel(id) {
        return api.post('channels/' + id, id)
    }
}