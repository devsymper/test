import Api from "./api";
import { appConfigs } from "./../configs.js";

var coreApi = new Api(appConfigs.apiDomain.sdocumentManagement);
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
    getDocumentObject(id) {
        return coreApi.get("document/objects/" + id);
    },
    submitDocument(data) {
        return coreApi.post("document/objects/submit", data);
    },
    updateDocument(objId, data) {
        return coreApi.put("document/update/objects/" + objId, data);
    },
    saveMultiFormulas(data) {
        return formulasApi.post('/formulas/batch', data);
    },
    getListDocuments(data = {}) {
        return coreApi.get("documents", data);
    }
};