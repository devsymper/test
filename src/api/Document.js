import Api from "./api";
import { appConfigs } from "./../configs.js";

var coreApi = new Api(appConfigs.apiDomain.sdocumentManagement);
var formulasApi = new Api(appConfigs.apiDomain.formulasService);
var trashApi = new Api(appConfigs.apiDomain.trashService);
export const documentApi = {
    getListDocument() {
        return coreApi.get("documents?pageSize=3000");
    },
    getListDocumentObject(docId) {
        return coreApi.get("documents/"+docId+"/objects");
    },
    getListObjectByMultipleDocument(ids) {
        return coreApi.post("documents/objects-by-multiple-document",ids);
    },
    getBatchDocument(data) {
        return coreApi.post("documents/batch", data);
    },
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
    updateInfoDocumentObj(id, data) {
        return coreApi.put("documents/objects-info/" + id, data);
    },
    updateDocument(objId, data) {
        return coreApi.put("documents/objects/" + objId, data);
    },
    setEdittingDocument(data) {
        return coreApi.put("documents/editting", data);
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
    getFieldByDocId(name) {
        return coreApi.get("documents/" + name + "/fields");
    },
    updateFields(data) {
        return coreApi.put("fields/batch", data);
    },
    getDetailDocumentByName(data) {
        return coreApi.get("documents/by-name", data);
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
    restoreDocument(data) {
        return coreApi.post('documents/trash', data);
    },
    restoreDocumentObject(data) {
        return coreApi.post('documents/objects/restore', data);
    },
    savePrintConfig(data) {
        return coreApi.post('documents/prints', data);
    },
    updatePrintConfig(data) {
        return coreApi.put('documents/prints', data);
    },
    deletePrintConfig(data) {
        return coreApi.delete('documents/prints', data);
    },
    getListPrintConfig(docId) {
        return coreApi.get('documents/' + docId + '/prints')
    },
    getPrintConfigActive(docId) {
        return coreApi.get('documents/' + docId + '/prints-active')
    },
    getDetailPrintConfig(docId, printConfigId) {
        return coreApi.get('documents/' + docId + '/prints/' + printConfigId);
    },
    updateActivePrintConfig(data) {
        return coreApi.patch('documents/prints', data);
    },
    saveControlTemplate(data) {
        return coreApi.post('control-templates', data);
    },
    editControlTemplate(id, data) {
        return coreApi.put('control-templates/' + id, data);
    },
    deleteControlTemplate(id) {
        return coreApi.delete('control-templates/' + id);
    },
    getControlTemplate() {
        return coreApi.get('control-templates');
    },
    getDetailControlTemplate(id) {
        return coreApi.get('control-templates/' + id);
    },
    deleteObjectInTrash(data) {
        return trashApi.post('items/delete-multi', data)
    }
};