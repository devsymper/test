import Api from "./api";
import { appConfigs } from "./../configs.js";

var coreApi = new Api(appConfigs.apiDomain.core);
var formulasApi = new Api(appConfigs.apiDomain.formulasService)
export const documentApi = {
    saveDocument(data) {
        return coreApi.post("document", data);
    },
    editDocument(data) {
        return coreApi.put("document", data);
    },
    deleteDocument(name) {
        return coreApi.delete("/document/drop/" + name);
    },
    detailDocument(id) {
        return coreApi.get("document/detail/" + id);
    },
    detailDocumentByName(name) {
        return coreApi.get("document/struct/" + name);
    },
    getDocumentObject(name, id) {
        return coreApi.get("document/" + name + "/objects/" + id);
    },
    submitDocument(data) {
        return coreApi.post("document/objects/submit", data);
    },
    saveMultiFormulas(data) {
        return formulasApi.post('/formulas/batch', data);
    }
};