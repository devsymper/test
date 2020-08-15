import Api from "./api";
import { appConfigs } from "./../configs.js";

var api = new Api(appConfigs.apiDomain.documentService)
export const documentServiceApi = {
    query(data) {
        return api.post('documents/query', data);
    }
};