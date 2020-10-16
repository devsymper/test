import Api from "./api";
import { appConfigs } from "./../configs.js";

var api = new Api(appConfigs.apiDomain.sdocumentManagement);
export const systemDataMappingApi = {
    save(data) {
        return api.post('system-mapping', data);
    },
    edit(id, data) {
        return api.put('system-mapping/' + id, data);
    },
    getByDoc(documentId) {
        return api.get('system-mapping/' + documentId);
    }

};