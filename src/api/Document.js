import Api from "./api";
import { appConfigs } from "./../configs.js";

var coreApi = new Api(appConfigs.apiDomain.core);
export const documentApi = {
    saveDocument(data) {
        return coreApi.post("document", data);
    },
    editDocument(data) {
        return coreApi.put("document", data);
    },
    detailDocument(id) {
        return coreApi.get("document/detail/" + id);
    },
};