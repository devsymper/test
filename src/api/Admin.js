import Api from "./api";
import { appConfigs } from "./../configs.js";

let api = new Api(appConfigs.apiDomain.bpmne.definitions);

export default {
    getListBA() {
        return api.get("supporters?search=" + page + "&pageSize=" + pageSize);
    },
}