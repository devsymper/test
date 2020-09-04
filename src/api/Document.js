import Api from "./api";
import { appConfigs } from "./../configs.js";

var coreApi = new Api(appConfigs.apiDomain.sdocumentManagement);
var formulasApi = new Api(appConfigs.apiDomain.formulasService)
export const documentApi = {
    saveDocument(data) {
        return coreApi.post("documents", data);
    },
    editDocument(data) {
        return coreApi.put("documents", data);
    },
    deleteDocument(ids) {
        return coreApi.delete("documents", ids);
    },
    moveToTrash(ids) {
        return coreApi.delete("documents/trash", ids);
    },

    detailDocument(id, data) {
        return coreApi.get("documents/" + id, data);
    },
    deleteDocumentObject(objectIds) {
        return coreApi.delete("documents/objects", objectIds);
    },
    deleteDocumentDraftObject(objectIds) {
        return coreApi.delete("documents/draft-objects", objectIds);
    },
    detailDocumentObject(objectId) {
        return coreApi.get("documents/objects/" + objectId);
    },
    submitDocument(data) {
        return coreApi.post("documents/objects", data);
    },
    updateDocument(objId, data) {
        return coreApi.put("documents/objects/" + objId, data);
    },
    saveMultiFormulas(data) {
        return formulasApi.post('/formulas/batch', data);
    },
    getListDocuments(data = {}) {
        return coreApi.get("documents", data);
    },
    uploadFile(data) {
        return coreApi.post("uploadFile", data);
    },

    getListApprovalHistory(objectId) {
        return coreApi.get("approval-histories/" + objectId);
    },
    checkExistDocument(name) {
        return coreApi.post("documents/check/" + name);
    },
    getBatchFieldInfoInDoc(data) {
        return coreApi.post("documents/fields/batch", data);
    },

    saveApprovalHistory(data) {
        return coreApi.post("approval-histores", data);
    },

    //draft
    submitDraftDocument(data) {
        return coreApi.post("documents/draft-objects", data);
    },
    updatePreDataForDoc(data) {
        return coreApi.post("documents/relations", data);
    },
    updatePreDataForField(data) {
        return coreApi.post("documents/fields/relations", data);
    },

    saveForm(data) {
        return coreApi.post("documents/forms", data);
    },
    searchListDocuments(filter) {
        return coreApi.get('documents', filter);
    },

};